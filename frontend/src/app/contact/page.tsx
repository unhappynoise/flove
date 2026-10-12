import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { BUSINESS } from "@/data/business";

export const metadata: Metadata = { title: "Contact | Flové" };

export default function ContactPage() {
  return (
    <InfoPage title="Contact Us" intro="We are happy to help with products, orders and deliveries.">
      <ul className="!list-none !pl-0 space-y-3">
        <li>
          <strong className="text-brown">WhatsApp:</strong>{" "}
          <a
            href={`https://wa.me/${BUSINESS.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {BUSINESS.whatsappDisplay}
          </a>
        </li>
        <li>
          <strong className="text-brown">Email:</strong>{" "}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
        </li>
        <li>
          <strong className="text-brown">Instagram:</strong>{" "}
          <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer">
            Flové.gh
          </a>
        </li>
        <li>
          <strong className="text-brown">TikTok:</strong>{" "}
          <a href={BUSINESS.tiktok} target="_blank" rel="noopener noreferrer">
            Flové.gh
          </a>
        </li>
        <li>
          <strong className="text-brown">Location:</strong> {BUSINESS.address}
        </li>
      </ul>
      <p>
        When asking about an order, please include your order reference from your
        confirmation email. You can also check your order status on the{" "}
        <Link href="/track">Track Order</Link> page.
      </p>
    </InfoPage>
  );
}
