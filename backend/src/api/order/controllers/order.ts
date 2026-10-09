import { factories } from '@strapi/strapi';
import crypto from 'crypto';

async function sendOrderEmails(strapi: any, order: any) {
  const emailService = strapi.plugin('email').service('email');

  try {
    await emailService.send({
      to: order.customerEmail,
      subject: `Your Flové order ${order.paystackReference} is confirmed`,
      text: `Hi ${order.customerName},

Your payment was successful!

Order reference: ${order.paystackReference}
Total: GH₵${order.totalAmount}
Delivery to: ${order.deliveryAddress}

You can track this order anytime using your reference number and phone number.

Thank you for shopping with Flové!

(Tip: if this email landed in your spam/junk folder, mark it as "not spam" so future updates reach your inbox.)`,
    });
  } catch (err) {
    strapi.log.error('Failed to send customer confirmation email', err);
  }

  try {
    await emailService.send({
      to: process.env.CLIENT_NOTIFICATION_EMAIL,
      subject: `New order — ${order.customerName} paid GH₵${order.totalAmount}`,
      text: `New paid order!

Reference: ${order.paystackReference}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Email: ${order.customerEmail}
Deliver to: ${order.deliveryAddress}
Notes: ${order.notes || '—'}

Items:
${(order.items || []).map((i: any) => `- ${i.name} x${i.quantity} (GH₵${i.unitPrice} each)`).join('\n')}

Total: GH₵${order.totalAmount}`,
    });
  } catch (err) {
    strapi.log.error('Failed to send client notification email', err);
  }
}

async function markOrderPaid(strapi: any, order: any) {
  const fresh = await strapi.documents('api::order.order').findOne({
    documentId: order.documentId,
  });
  if (!fresh || fresh.paymentStatus === 'paid') return false;

  await strapi.documents('api::order.order').update({
    documentId: order.documentId,
    data: { paymentStatus: 'paid' },
    status: 'published',
  });

  await sendOrderEmails(strapi, fresh);
  return true;
}

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async checkout(ctx) {
    const { customerName, customerEmail, customerPhone, deliveryAddress, notes, items } =
      ctx.request.body as {
        customerName?: string;
        customerEmail?: string;
        customerPhone?: string;
        deliveryAddress?: string;
        notes?: string;
        items?: { productId: string; quantity: number }[];
      };

    if (
      !customerName?.trim() ||
      !customerEmail?.trim() ||
      !customerPhone?.trim() ||
      !deliveryAddress?.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return ctx.badRequest('Missing required checkout fields');
    }

    if (items.length > 50) {
      return ctx.badRequest('Too many items in order');
    }

    const orderItems: any[] = [];
    let total = 0;

    for (const item of items) {
      if (!item.productId) {
        return ctx.badRequest('Invalid item in cart');
      }

      const quantity = Math.min(99, Math.max(1, parseInt(String(item.quantity), 10) || 1));

      const product = await strapi.documents('api::product.product').findOne({
        documentId: item.productId,
      });

      if (!product) {
        return ctx.badRequest(`Product no longer available: ${item.productId}`);
      }

      if (typeof product.stock === 'number' && product.stock < quantity) {
        return ctx.badRequest(`Not enough stock for ${product.name}`);
      }

      const unitPrice = Number(product.discountPrice ?? product.price);

      if (!unitPrice || unitPrice <= 0) {
        return ctx.badRequest(`Invalid price for ${product.name}`);
      }

      total += unitPrice * quantity;

      orderItems.push({
        productId: product.documentId,
        name: product.name,
        unitPrice,
        quantity,
      });
    }

    if (total <= 0) {
      return ctx.badRequest('Order total must be greater than zero');
    }

    const reference = `FLV-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    await strapi.documents('api::order.order').create({
      data: {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        notes: notes?.trim() || '',
        items: orderItems,
        totalAmount: total,
        paystackReference: reference,
        paymentStatus: 'pending',
      },
      status: 'published',
    });

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail.trim().toLowerCase(),
        amount: Math.round(total * 100),
        reference,
        callback_url: `${process.env.FRONTEND_URL}/order/confirmation?reference=${reference}`,
      }),
    });

    const paystackData: any = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      strapi.log.error('Paystack init failed', paystackData);
      return ctx.internalServerError('Could not start payment. Please try again.');
    }

    ctx.body = {
      authorizationUrl: paystackData.data.authorization_url,
      reference,
    };
  },

  async webhook(ctx) {
    const signature = ctx.request.headers['x-paystack-signature'];
    const rawBody = ctx.request.body?.[Symbol.for('unparsedBody')];

    if (!signature || !rawBody) {
      return ctx.badRequest('Missing signature');
    }

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY as string)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      strapi.log.warn('Paystack webhook signature mismatch — possible spoofed request');
      return ctx.forbidden('Invalid signature');
    }

    const event = JSON.parse(rawBody.toString());

    if (event.event === 'charge.success') {
      const reference = event.data.reference;

      const existing = await strapi.documents('api::order.order').findFirst({
        filters: { paystackReference: reference },
      });

      if (!existing) {
        strapi.log.warn(`Webhook for unknown order reference: ${reference}`);
        return ctx.send({ received: true });
      }

      await markOrderPaid(strapi, existing);
    }

    ctx.send({ received: true });
  },

  async track(ctx) {
    const { reference, phone } = ctx.request.body as { reference?: string; phone?: string };

    if (!reference?.trim() || !phone?.trim()) {
      return ctx.badRequest('Reference and phone number are required');
    }

    const order = await strapi.documents('api::order.order').findFirst({
      filters: {
        paystackReference: reference.trim(),
        customerPhone: phone.trim(),
      },
    });

    if (!order) {
      return ctx.notFound('Order not found. Check your reference and phone number.');
    }

    let paymentStatus = order.paymentStatus;

    if (paymentStatus === 'pending') {
      try {
        const verifyRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(String(order.paystackReference))}`,
          { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
        );
        const verifyData: any = await verifyRes.json();
        if (
          verifyRes.ok &&
          verifyData.data?.status === 'success' &&
          verifyData.data?.amount === Math.round(Number(order.totalAmount) * 100)
        ) {
          await markOrderPaid(strapi, order);
          paymentStatus = 'paid';
        }
      } catch (err) {
        strapi.log.error('Paystack verify failed', err);
      }
    }

    ctx.body = {
      reference: order.paystackReference,
      status: paymentStatus,
      customerName: order.customerName,
      deliveryAddress: order.deliveryAddress,
      items: order.items,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    };
  },
}));
