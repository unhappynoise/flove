import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = { title: "Terms & Privacy | Flové" };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Service & Privacy">
      <h2>1. About these terms</h2>
      <p>
        These terms apply to your use of this website and to orders placed with
        Flové. By placing an order you agree to them.
      </p>

      <h2>2. Orders and availability</h2>
      <p>
        Flové works on an order basis. After you place and pay for an order, we
        confirm the item and size with our supplier. If an item cannot be
        supplied, we will contact you to offer an alternative or a refund of the
        amount you paid for it. We may decline or cancel an order if we cannot
        fulfil it.
      </p>

      <p>
        Items marked On Request are not paid for at checkout. We confirm
        availability and the final price with our supplier first, and payment is
        only requested once the item is confirmed.
      </p>

      <h2>3. Prices and payment</h2>
      <p>
        Prices are shown in Ghana cedis (GHS) and may change without notice. The
        price you pay is the price shown at checkout. Delivery fees are not
        included in the checkout total and are confirmed separately. Payments are
        processed securely by Paystack. We do not see or store your card or mobile
        money details.
      </p>

      <h2>4. Delivery, returns and refunds</h2>
      <p>
        Delivery, exchanges, returns and refunds are covered in our{" "}
        <Link href="/shipping-returns">Shipping, Returns &amp; Refunds</Link>{" "}
        policy, which forms part of these terms.
      </p>

      <h2>5. Product information</h2>
      <p>
        We try to describe and photograph products accurately. Colours may look
        slightly different on different screens, and sizes may vary between
        brands. If you are unsure about a size, ask us before ordering.
      </p>

      <h2>6. Privacy</h2>
      <p>
        When you order, we collect your name, email address, phone number,
        delivery address, any delivery notes and your order details. We use them
        to process and deliver your order, send you confirmations and contact you
        about your order. We share information only as needed with our payment
        provider (Paystack), our email service provider and delivery providers to
        complete your order. We do not sell your personal information.
      </p>
      <p>
        To ask about, correct or delete your information, contact us at{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
      </p>

      <h2>7. Changes and governing law</h2>
      <p>
        We may update these terms from time to time. The version on this page is
        the one that applies. These terms are governed by the laws of Ghana.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or visit our{" "}
        <Link href="/contact">Contact</Link> page.
      </p>
    </InfoPage>
  );
}
