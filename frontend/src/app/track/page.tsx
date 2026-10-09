"use client";

import { useState } from "react";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

type OrderResult = {
  reference: string;
  status: "pending" | "paid" | "failed";
  customerName: string;
  deliveryAddress: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
};

export default function TrackOrderPage() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch(`${STRAPI_URL}/api/orders/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: reference.trim(), phone: phone.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Order not found.");
        return;
      }

      setOrder(data);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-brown mb-2 text-center">Track Your Order</h1>
      <p className="font-body text-brown-light text-center mb-10">
        Enter your order reference and the phone number you used at checkout.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 mb-10">
        <div>
          <label className="block font-body text-sm text-brown mb-1">Order Reference</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
            placeholder="e.g. FLV-..."
            className="w-full border border-gold/30 rounded-sm px-4 py-3 font-body text-brown focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block font-body text-sm text-brown mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
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
          disabled={loading}
          className="w-full bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm disabled:opacity-50"
        >
          {loading ? "Checking..." : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="bg-cream/50 border border-gold/20 rounded-sm p-6">
          <div className="flex justify-between font-body text-sm text-brown-light mb-3">
            <span>Reference</span>
            <span>{order.reference}</span>
          </div>
          <div className="flex justify-between font-body text-sm text-brown-light mb-3">
            <span>Status</span>
            <span className="uppercase font-medium">{order.status}</span>
          </div>
          <div className="space-y-2 mb-4 border-t border-gold/20 pt-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between font-body text-sm text-brown-light">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>GHS {item.unitPrice * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-display text-xl text-brown pt-3 border-t border-gold/20 mb-1">
            <span>Total</span>
            <span>GHS {order.totalAmount}</span>
          </div>
          <p className="font-body text-xs text-brown-light mt-4">
            Delivering to: {order.deliveryAddress}
          </p>
        </div>
      )}
    </div>
  );
}
