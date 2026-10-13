"use client";

import { useState } from "react";
import type { Product } from "@/lib/strapi";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const inputClass =
  "w-full border border-gold/30 rounded-sm px-4 py-3 font-body text-brown focus:outline-none focus:border-gold";

export default function RequestForm({
  product,
  sizeOptions = [],
  selectedSize = null,
  colorOptions = [],
  selectedColors = [],
}: {
  product?: Product;
  sizeOptions?: string[];
  selectedSize?: string | null;
  colorOptions?: string[];
  selectedColors?: string[];
}) {
  const isItem = !!product;
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    details: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isItem && sizeOptions.length > 0 && !selectedSize) {
      setError("Please select a size above first.");
      return;
    }

    if (isItem && colorOptions.length > 0 && selectedColors.length === 0) {
      setError("Please select a color above first.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${STRAPI_URL}/api/customer-requests/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          kind: isItem ? "item" : "general",
          productId: product?.documentId,
          size: selectedSize,
          colors: selectedColors,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setReference(data.reference);
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="bg-cream/50 border border-gold/20 rounded-sm p-6 mb-6">
        <p className="font-display text-xl text-brown mb-2">Request received</p>
        <p className="font-body text-sm text-brown-light mb-2">
          Reference: {reference}
        </p>
        <p className="font-body text-sm text-brown-light">
          We will contact you on the number you gave, usually within 24 hours, to
          confirm availability and the final price. You have not been charged.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-cream/50 border border-gold/20 rounded-sm p-6 mb-6 space-y-4">
      <div>
        <p className="font-display text-xl text-brown">
          {isItem ? "Request this item" : "Cannot find it? Ask us"}
        </p>
        <p className="font-body text-sm text-brown-light mt-1">
          {isItem
            ? "No payment now. We confirm availability and the final price with our supplier first."
            : "Tell us what you are looking for and we will check with our supplier."}
        </p>
      </div>

      {!isItem && (
        <div>
          <label className="block font-body text-sm text-brown mb-1">What are you looking for? *</label>
          <textarea name="details" value={form.details} onChange={handleChange} required rows={3} className={inputClass} placeholder="Item, brand, size, colour, or a link to a photo" />
        </div>
      )}

      <div>
        <label className="block font-body text-sm text-brown mb-1">Full Name *</label>
        <input name="customerName" value={form.customerName} onChange={handleChange} required className={inputClass} />
      </div>
      <div>
        <label className="block font-body text-sm text-brown mb-1">Phone Number (WhatsApp if possible) *</label>
        <input name="customerPhone" type="tel" value={form.customerPhone} onChange={handleChange} required className={inputClass} />
      </div>
      <div>
        <label className="block font-body text-sm text-brown mb-1">Email (optional)</label>
        <input name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} className={inputClass} />
      </div>
      {isItem && (
        <div>
          <label className="block font-body text-sm text-brown mb-1">Notes (optional)</label>
          <textarea name="details" value={form.details} onChange={handleChange} rows={2} className={inputClass} placeholder="Colour, delivery area, anything we should know" />
        </div>
      )}

      <div aria-hidden="true" className="absolute left-[-9999px]">
        <input name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send request"}
      </button>
    </form>
  );
}
