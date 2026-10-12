import type { Metadata } from "next";
import { getProducts } from "@/lib/strapi";
import ProductCard from "@/components/ProductCard";
import RequestForm from "@/components/RequestForm";

export const metadata: Metadata = { title: "On Request | Flové" };

const STEPS = [
  ["1. Send a request", "Choose a piece and a size, or describe what you want. No payment yet."],
  ["2. We confirm", "We check with our supplier and confirm availability and the final price, usually within 24 hours."],
  ["3. You pay once confirmed", "We send a secure payment link. If the item is unavailable, nothing is charged."],
];

export default async function OnRequestPage() {
  const all = await getProducts();
  const products = all.filter((p) => p.availability === "on_request");

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-brown mb-4">On Request</h1>
        <p className="font-body text-brown-light">
          These pieces are not part of our ready-to-order line-up. Send a request
          and we will confirm everything with our supplier before you pay.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {STEPS.map(([title, text]) => (
          <div key={title} className="border border-gold/20 bg-cream/50 rounded-sm p-5">
            <p className="font-display text-lg text-brown mb-1">{title}</p>
            <p className="font-body text-sm text-brown-light">{text}</p>
          </div>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-center font-body text-brown-light py-10">
          Nothing is listed here right now. Use the form below to ask for something specific.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="max-w-xl mx-auto">
        <RequestForm />
      </div>
    </div>
  );
}
