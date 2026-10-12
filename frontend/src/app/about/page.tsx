import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "About Us | Flové" };

export default function AboutPage() {
  return (
    <InfoPage title="About Flové" intro="Inspired by love, made for confidence.">
      <p>
        Flové is an online fashion store based in Accra, Ghana. We offer footwear,
        apparel, accessories and fragrances, chosen for quality, style and
        confidence.
      </p>
      <p>
        We started by sharing our flyers on WhatsApp and social media and taking
        orders directly from our customers. This website is our new home for
        orders, so you can browse, pay securely and track your order in one place.
      </p>
      <h2>How we work</h2>
      <p>
        Flové works on an order basis. We do not keep a warehouse of stock. When you
        place an order, we confirm the item and your size with our supplier and
        arrange delivery to you. If something cannot be supplied, we will tell you
        and offer an alternative or a refund. Full details are on our{" "}
        <Link href="/shipping-returns">Shipping &amp; Returns</Link> page.
      </p>
      <h2>Get in touch</h2>
      <p>
        Questions about a product or an order? Visit our{" "}
        <Link href="/contact">Contact</Link> page or read our{" "}
        <Link href="/faq">FAQ</Link>.
      </p>
    </InfoPage>
  );
}
