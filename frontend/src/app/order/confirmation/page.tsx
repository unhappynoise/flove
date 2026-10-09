"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

type OrderResult = {
  reference: string;
  status: "pending" | "paid" | "failed";
  customerName: string;
  deliveryAddress: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { clearCart } = useCart();

  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!reference) return;
    try {
      const stored = localStorage.getItem("flove-last-order");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.reference === reference && parsed.phone) {
          setPhone(parsed.phone);
        }
      }
    } catch {
      // ignore
    }
  }, [reference]);

  useEffect(() => {
    if (!reference || !phone) return;

    let cancelled = false;

    async function checkOnce() {
      const res = await fetch(`${STRAPI_URL}/api/orders/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone }),
      });
      const data = await res.json();
      if (cancelled) return "stop";

      if (!res.ok) {
        setError(data.error?.message || "Order not found.");
        return "stop";
      }

      setOrder(data);
      setError(null);

      if (data.status === "paid") {
        if (!clearedRef.current) {
          clearedRef.current = true;
          clearCart();
          localStorage.removeItem("flove-last-order");
        }
        return "stop";
      }
      return "continue";
    }

    async function loop() {
      setChecking(true);
      for (let tries = 0; tries < 8 && !cancelled; tries++) {
        let outcome: string;
        try {
          outcome = await checkOnce();
        } catch {
          if (!cancelled) setError("Could not check order status.");
          outcome = "continue";
        }
        if (outcome === "stop") {
          setChecking(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 2500));
      }
      if (!cancelled) {
        setChecking(false);
        setGaveUp(true);
      }
    }

    loop();
    return () => {
      cancelled = true;
    };
  }, [reference, phone, clearCart]);

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOrder(null);
    setGaveUp(false);
  }

  if (!reference) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-brown mb-4">No order reference found</h1>
        <Link
          href="/"
          className="inline-block bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="max-w-md mx-auto px-6 py-24">
        <h1 className="font-display text-2xl text-brown mb-6 text-center">Check your order</h1>
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-sm text-brown mb-1">
              Phone number used at checkout
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border border-gold/30 rounded-sm px-4 py-3 font-body text-brown focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm"
          >
            View Order
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {order?.status === "paid" ? (
        <>
          <h1 className="font-display text-4xl text-brown mb-2 text-center">
            Payment Confirmed!
          </h1>
          <p className="font-body text-brown-light text-center mb-2">
            Thank you, {order.customerName}. We&apos;ve emailed your receipt to you.
          </p>
          <p className="font-body text-xs text-taupe text-center mb-10">
            Can&apos;t find it? Check your spam/junk folder.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-3xl text-brown mb-2 text-center">
            {checking ? "Confirming your payment..." : "Still processing"}
          </h1>
          <p className="font-body text-brown-light text-center mb-10">
            {checking
              ? "This usually takes a few seconds."
              : "Your payment is still being confirmed. You'll get an email as soon as it's done — no need to pay again."}
          </p>
        </>
      )}

      {error && (
        <p className="font-body text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-6 text-center">
          {error}
        </p>
      )}

      {order && (
        <div className="bg-cream/50 border border-gold/20 rounded-sm p-6 mb-8">
          <div className="flex justify-between font-body text-sm text-brown-light mb-3">
            <span>Reference</span>
            <span>{order.reference}</span>
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

      <div className="text-center">
        {order?.status === "paid" && (
          <button
            onClick={() => window.print()}
            className="inline-block border border-brown text-brown font-body text-sm uppercase tracking-wider px-8 py-4 hover:border-gold hover:text-gold transition-colors rounded-sm mr-3"
          >
            Download Receipt
          </button>
        )}
        <Link
          href="/"
          className="inline-block bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}
