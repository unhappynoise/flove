import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = {
  title: "Shipping, Returns & Refunds | Flové",
};

export default function ShippingReturnsPage() {
  return (
    <InfoPage
      title="Shipping, Returns & Refunds"
    >
      <h2>1. How our orders work</h2>
      <p>
        Flové operates on an order-based retail model. Customers can browse
        products on our website and social media pages. Items shown are available
        through our supplier. When you place and pay for an order, we confirm the
        item and size with our supplier and then arrange delivery. If an item
        turns out to be unavailable, we will contact you to offer an alternative
        or a refund of the amount you paid for it.
      </p>

      <p>
        <strong className="text-brown">On Request items.</strong> Some items are
        marked On Request. These are items we have not yet confirmed with our
        supplier. You do not pay for them at checkout. Send a request instead, and
        we will confirm availability, the final price and delivery details,
        usually within 24 hours. We only ask for payment after the item is
        confirmed, and we send you a secure payment link. If the item is not
        available, nothing is charged.
      </p>

      <h2>2. Delivery and shipping</h2>
      <p>
        Delivery fees are paid by the customer unless a promotion specifically
        states that delivery is free. The delivery fee is not included in the
        checkout total. We will contact you after your order to confirm the fee
        and delivery arrangements.
      </p>
      <p>
        For deliveries within Accra, the estimated delivery time is approximately
        45 minutes to 2 hours after the order is confirmed and ready for
        dispatch, depending on the exact location and delivery arrangements.
        Deliveries outside Accra may take longer depending on the destination and
        courier arrangements. Timelines and fees for orders outside Accra will be
        communicated by the delivery service.
      </p>
      <p>
        Delivery estimates are not guaranteed and may change because of traffic,
        weather, courier availability, supplier delays or other circumstances
        beyond our control. If there is a significant delay, we will make
        reasonable efforts to update you.
      </p>

      <h2>3. Returns and exchanges</h2>
      <ul>
        <li>
          Contact Flové within 24 hours of receiving your package for an exchange
          relating to a size or colour change.
        </li>
        <li>
          Returns or refunds are not available once an order is placed unless
          there is a significant defect or damage to the product received.
        </li>
        <li>
          Items submitted for an exchange must be unused and unworn, in their
          original condition and packaging where applicable, and accompanied by
          proof of purchase.
        </li>
        <li>
          Exchanges are subject to confirmation by Flové before an item is sent
          back. We may not accept items that have been worn, used, washed or
          damaged after delivery, or returned without prior approval.
        </li>
      </ul>

      <h2>4. Incorrect, defective or damaged items</h2>
      <p>
        If you notice an error with your package, notify Flové within 24 hours of
        receiving it and provide clear photographs or other reasonable details so
        we can verify the issue. Once the issue is confirmed, we will arrange an
        appropriate replacement or refund. Flové will cover reasonable return or
        replacement delivery costs for a confirmed error, defect or damage
        attributable to us or our fulfilment process.
      </p>

      <h2>5. Delivery fees and refunds</h2>
      <p>
        For customer-requested exchanges that are unrelated to an error, defect or
        damage attributable to Flové, the customer is responsible for the return
        delivery fee.
      </p>
      <p>
        Refunds are limited to cases involving a significant defect or damage to
        the product received, or an item that we are unable to supply. Where a
        refund is approved, we will confirm the refund method and processing
        timeline with you. The time it takes for funds to appear may depend on the
        payment provider or financial institution.
      </p>

      <h2>6. Order changes and cancellations</h2>
      <p>
        Please contact Flové as soon as possible if you need to change or cancel an
        order. Because products are sourced from our supplier after you order,
        cancellation requests will be assessed based on the stage of fulfilment.
        If an order cannot be fulfilled because the supplier no longer has the
        item available, we will contact you to discuss an alternative or a refund.
      </p>

      <h2>7. Contact</h2>
      <p>
        For questions about an order, delivery, return, exchange or refund, email{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>, message us on{" "}
        <a
          href={`https://wa.me/${BUSINESS.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        , or visit our <Link href="/contact">Contact</Link> page.
      </p>
      <p>Nothing in this policy limits any customer rights that cannot be legally excluded.</p>
    </InfoPage>
  );
}
