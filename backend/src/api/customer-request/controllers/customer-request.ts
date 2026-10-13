import { factories } from '@strapi/strapi';
import crypto from 'crypto';

function parseSizes(sizes: string | null | undefined): string[] {
  if (!sizes) return [];
  const out: string[] = [];
  for (const raw of sizes.split(',')) {
    const token = raw.trim();
    if (!token) continue;
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = parseInt(range[1], 10);
      const end = parseInt(range[2], 10);
      if (end >= start && end - start <= 30) {
        for (let n = start; n <= end; n++) out.push(String(n));
        continue;
      }
    }
    out.push(token);
  }
  return Array.from(new Set(out));
}

export default factories.createCoreController(
  'api::customer-request.customer-request' as any,
  ({ strapi }: { strapi: any }) => ({
    async submit(ctx: any) {
      const body = (ctx.request.body || {}) as any;

      // Honeypot: real people leave this hidden field empty
      if (body.website) return ctx.send({ received: true });

      const kind = body.kind === 'general' ? 'general' : 'item';
      const customerName = String(body.customerName || '').trim().slice(0, 120);
      const customerPhone = String(body.customerPhone || '').trim().slice(0, 40);
      const customerEmail = String(body.customerEmail || '').trim().toLowerCase().slice(0, 160);
      const details = String(body.details || '').trim().slice(0, 1500);

      if (!customerName || !customerPhone) {
        return ctx.badRequest('Please enter your name and phone number');
      }
      if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
        return ctx.badRequest('Please enter a valid email address');
      }
      if (kind === 'general' && !details) {
        return ctx.badRequest('Please tell us what you are looking for');
      }

      let productId: string | null = null;
      let productName: string | null = null;
      let size: string | null = null;
      let colors: string | null = null;

      if (kind === 'item') {
        const product = await strapi.documents('api::product.product').findOne({
          documentId: String(body.productId || ''),
          populate: ['colors'],
        });
        if (!product) {
          return ctx.badRequest('That item is no longer available to request');
        }
        productId = product.documentId;
        productName = product.name;

        const options = parseSizes(product.sizes);
        if (options.length > 0) {
          const chosen = String(body.size || '').trim();
          if (!chosen || !options.includes(chosen)) {
            return ctx.badRequest(`Please choose a valid size for ${product.name}`);
          }
          size = chosen;
        }

        const colorOptions = ((product as any).colors || []).map((c: any) => c.name);
        if (colorOptions.length > 0) {
          const chosenColors = Array.isArray(body.colors)
            ? body.colors.map((c: any) => String(c).trim()).filter(Boolean)
            : [];
          const uniqueChosen = Array.from(new Set(chosenColors));
          if (uniqueChosen.length === 0 || !uniqueChosen.every((c) => colorOptions.includes(c))) {
            return ctx.badRequest(`Please choose a valid color for ${product.name}`);
          }
          colors = uniqueChosen.join(', ');
        }
      }

      const reference = `REQ-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

      await strapi.documents('api::customer-request.customer-request').create({
        data: {
          reference,
          kind,
          status: 'new',
          customerName,
          customerPhone,
          customerEmail: customerEmail || undefined,
          productId: productId || undefined,
          productName: productName || undefined,
          size: size || undefined,
          colors: colors || undefined,
          details: details || undefined,
        },
      });

      const emailService = strapi.plugin('email').service('email');
      const what =
        kind === 'item'
          ? `${productName}${size ? ` (size ${size})` : ''}${colors ? ` (${colors})` : ''}`
          : 'General request';

      try {
        await emailService.send({
          to: process.env.CLIENT_NOTIFICATION_EMAIL,
          subject: `New request: ${what} from ${customerName}`,
          text: `New request!

Reference: ${reference}
Item: ${what}
Customer: ${customerName}
Phone: ${customerPhone}
Email: ${customerEmail || '-'}
Notes: ${details || '-'}

Next: check with your supplier, then reply to the customer with availability and the final price.`,
        });
      } catch (err) {
        strapi.log.error('Failed to send request alert email', err);
      }

      if (customerEmail) {
        try {
          await emailService.send({
            to: customerEmail,
            subject: `We received your request (${reference})`,
            text: `Hi ${customerName},

Thank you for your request: ${what}.

We will check with our supplier and contact you on the number you gave us, usually within 24 hours, to confirm availability and the final price. No payment has been taken. We only ask for payment once your item is confirmed.

Reference: ${reference}

Questions? Reply to this email or message us on WhatsApp: +233 59 599 9314.

Flové`,
          });
        } catch (err) {
          strapi.log.error('Failed to send request confirmation email', err);
        }
      }

      ctx.body = { reference };
    },
  })
);
