"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getImageUrl } from "@/lib/strapi";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  function buildWhatsAppMessage() {
    const lines = items.map((item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return `• ${item.product.name} x${item.quantity} — GHS ${
        price * item.quantity
      }`;
    });
    const message = `Hi Flové, I'd like to order:\n\n${lines.join(
      "\n"
    )}\n\nTotal: GHS ${totalPrice}`;
    return `https://wa.me/233595999314?text=${encodeURIComponent(message)}`;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-brown mb-4">
          Your cart is empty
        </h1>
        <p className="font-body text-brown-light mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/"
          className="inline-block bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-brown mb-10 text-center">
        Your Cart
      </h1>

      <div className="space-y-6 mb-10">
        {items.map((item) => {
          const image = item.product.images?.[0];
          const price = item.product.discountPrice ?? item.product.price;

          return (
            <div
              key={item.product.id}
              className="flex gap-4 items-center border-b border-gold/20 pb-6"
            >
              <div className="w-24 h-24 bg-cream relative overflow-hidden rounded-sm flex-shrink-0">
                {image ? (
                  <Image
                    src={getImageUrl(image, "thumbnail")}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-taupe text-xs">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-display text-lg text-brown hover:text-gold transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="font-body text-sm text-brown-light">
                  GHS {price} each
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gold/30 rounded-sm">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="px-2 py-1 text-brown hover:text-gold transition-colors"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-body text-sm text-brown min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-2 py-1 text-brown hover:text-gold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="font-body text-xs text-taupe hover:text-red-600 transition-colors uppercase tracking-wider"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="font-body text-brown font-medium">
                GHS {price * item.quantity}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-8 pt-4">
        <span className="font-display text-2xl text-brown">Total</span>
        <span className="font-display text-2xl text-brown">
          GHS {totalPrice}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={buildWhatsAppMessage()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm"
        >
          Checkout via WhatsApp
        </a>
        <button
          onClick={clearCart}
          className="flex-1 text-center border border-brown text-brown font-body text-sm uppercase tracking-wider px-8 py-4 hover:border-gold hover:text-gold transition-colors rounded-sm"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
