import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = { title: "FAQ | Flové" };

const FAQS: { q: string; a: string }[] = [
  {
    q: "What does On Request mean?",
    a: "On Request items are pieces we have not yet confirmed with our supplier. You send a request with your size and details, we confirm availability and the final price, usually within 24 hours, and only then do we ask for payment through a secure payment link. If the item is unavailable, nothing is charged.",
  },
  {
    q: "How do I place an order?",
    a: "Browse the shop, add items to your cart and go to checkout. Enter your details and pay securely through Paystack. You will receive a confirmation email with your order reference.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Payments are processed by Paystack, which supports mobile money and cards. We do not see or store your card or mobile money details.",
  },
  {
    q: "Is everything in stock?",
    a: "Flové works on an order basis. After you order, we confirm the item and your size with our supplier. If an item cannot be supplied, we will contact you to offer an alternative or a refund of the amount you paid for it.",
  },
  {
    q: "How long does delivery take?",
    a: "Within Accra, delivery is usually about 45 minutes to 2 hours after your order is confirmed and ready for dispatch, depending on your location. Deliveries outside Accra take longer depending on the destination and courier. Estimates are not guaranteed.",
  },
  {
    q: "How much does delivery cost?",
    a: "Delivery fees are paid by the customer unless a promotion says delivery is free. The delivery fee is not included in the checkout total. We will contact you after your order to confirm the fee and delivery arrangements.",
  },
  {
    q: "Can I exchange an item?",
    a: "Yes, for a size or colour change. Contact us within 24 hours of receiving your package. The item must be unused and unworn, in its original condition and packaging, with proof of purchase. Exchanges must be confirmed by us before you send anything back, and the customer pays the return delivery fee.",
  },
  {
    q: "What if I receive the wrong, defective or damaged item?",
    a: "Tell us within 24 hours of receiving it and send clear photos. Once we confirm the issue, we will arrange a replacement or refund and cover the reasonable delivery costs.",
  },
  {
    q: "Can I get a refund if I change my mind?",
    a: "Refunds are limited to items with a significant defect or damage, or items we are unable to supply. For a size or colour change, we offer an exchange.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Contact us as soon as possible. Because items are sourced from our supplier after you order, we assess requests based on the stage your order has reached.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Track Order page with the reference from your confirmation email and the phone number you used at checkout.",
  },
];

export default function FaqPage() {
  return (
    <InfoPage title="Frequently Asked Questions" intro="Quick answers about ordering, delivery and returns.">
      <div>
        {FAQS.map((item) => (
          <details key={item.q} className="border-b border-gold/20 py-4">
            <summary className="cursor-pointer font-display text-lg text-brown">
              {item.q}
            </summary>
            <p className="mt-2">{item.a}</p>
          </details>
        ))}
      </div>
      <p>
        Still need help? Message us on{" "}
        <a
          href={`https://wa.me/${BUSINESS.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>{" "}
        or email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. You can
        also read our <Link href="/shipping-returns">Shipping &amp; Returns</Link>{" "}
        policy.
      </p>
    </InfoPage>
  );
}
