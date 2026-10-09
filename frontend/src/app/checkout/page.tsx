"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-brown mb-4">Your cart is empty</h1>
        <Link
          href="/"
          className="inline-block bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !form.customerName.trim() ||
      !form.customerEmail.trim() ||
      !form.customerPhone.trim() ||
      !form.deliveryAddress.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${STRAPI_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            productId: item.product.documentId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      localStorage.setItem(
        "flove-last-order",
        JSON.stringify({ reference: data.reference, phone: form.customerPhone.trim() })
      );

      window.location.href = data.authorizationUrl;
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-brown mb-2 text-center">Checkout</h1>
      <p className="font-body text-brown-light text-center mb-10">
        Enter your details below, then you&apos;ll be taken to Paystack to pay securely.
      </p>

      <div className="bg-cream/50 border border-gold/20 rounded-sm p-6 mb-8">
        <div className="space-y-2 mb-4">
          {items.map((item) => {
            const price = item.product.discountPrice ?? item.product.price;
            return (
              <div
                key={item.product.id}
                className="flex justify-between font-body text-sm text-brown-light"
              >
                <span>
                  {item.product.name} x{item.quantity}
                </span>
                <span>GHS {price * item.quantity}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between font-display text-xl text-brown pt-3 border-t border-gold/20">
          <span>Total</span>
          <span>GHS {totalPrice}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-body text-sm text-brown mb-1">Full Name *</label>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            required
            className="w-full border border-gold/30 rounded-sm px-4 py-3 font-body text-brown focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-brown mb-1">Email *</label>
          <input
            type="email"
            name="customerEmail"
            value={form.customerEmail}
            onChange={handleChange}
            required
            className="w-full border border-gold/30 rounded-sm px-4 py-3 font-body text-brown focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-brown mb-1">Phone Number *</label>
          <input
            type="tel"
            name="customerPhone"
            value={form.customerPhone}
            onChange={handleChange}
            required
            placeholder="e.g. 0595999314"
            className="w-full border border-gold/30 rounded-sm px-4 py-3 font-body text-brown focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-brown mb-1">Delivery Address *</label>
          <textarea
            name="deliveryAddress"
            value={form.deliveryAddress}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-gold/30 rounded-sm px-4 py-3 font-body text-brown focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-brown mb-1">Delivery Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            placeholder="e.g. call before delivery, landmark, etc."
            className="w-full border border-gold/30 rounded-sm px-4 py-3 font-body text-brown focus:outline-none focus:border-gold"
          />
        </div>

        {error && (
          <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm disabled:opacity-50"
        >
          {submitting ? "Starting payment..." : `Pay GHS ${totalPrice} with Paystack`}
        </button>
      </form>
    </div>
  );
}
