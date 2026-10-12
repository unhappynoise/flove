"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, getImageUrl, parseSizes, parseColors } from "@/lib/strapi";
import { useCart } from "@/context/CartContext";
import RequestForm from "@/components/RequestForm";

export default function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const sizeOptions = parseSizes(product.sizes);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const needsSize = sizeOptions.length > 0 && !selectedSize;
  const colorOptions = parseColors(product.color);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const needsColor = colorOptions.length > 0 && !selectedColor;
  const isOnRequest = product.availability === "on_request";

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const mainImage = product.images?.[0];

  function handleAddToCart() {
    if (needsSize || needsColor) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[3/4] bg-cream relative overflow-hidden rounded-sm">
          {mainImage ? (
            <Image
              src={getImageUrl(mainImage, "large")}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-taupe font-body">
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="font-body text-xs uppercase tracking-wider text-taupe mb-3">
            {product.sub_type?.name || product.category?.name}
          </p>
          <h1 className="font-display text-4xl text-brown mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-2">
            {hasDiscount ? (
              <>
                <span className="font-body text-2xl text-gold font-medium">
                  GHS {product.discountPrice}
                </span>
                <span className="font-body text-lg text-taupe line-through">
                  GHS {product.price}
                </span>
              </>
            ) : (
              <span className="font-body text-2xl text-brown">
                GHS {product.price}
              </span>
            )}
          </div>

          {product.bundleNote && (
            <p className="font-body text-sm text-gold bg-gold/10 border border-gold/30 rounded-sm px-3 py-2 mb-6 inline-block w-fit">
              {product.bundleNote}
            </p>
          )}

          <p className="font-body text-brown-light leading-relaxed mb-8 mt-4">
            {product.description}
          </p>

          <div className="space-y-3 mb-8 font-body text-sm">
            {product.sizes && (
              <p className="text-brown-light">
                <span className="text-brown font-medium">Sizes:</span>{" "}
                {product.sizes}
              </p>
            )}
            {product.color && (
              <p className="text-brown-light">
                <span className="text-brown font-medium">Color:</span>{" "}
                {product.color}
              </p>
            )}
            <p className="text-brown-light">
              <span className="text-brown font-medium">Availability:</span>{" "}
              {isOnRequest ? "On request - we confirm availability with our supplier" : product.stock == null ? "Available" : product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
            </p>
          </div>

          {sizeOptions.length > 0 && (
            <div className="mb-6">
              <p className="font-body text-sm text-brown mb-2">
                Size:{" "}
                <span className="text-brown-light">
                  {selectedSize ?? "Select a size"}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-3 py-2 border rounded-sm font-body text-sm transition-colors ${
                      selectedSize === size
                        ? "bg-brown text-cream-light border-brown"
                        : "border-gold/30 text-brown hover:border-gold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colorOptions.length > 0 && (
            <div className="mb-6">
              <p className="font-body text-sm text-brown mb-2">
                Color:{" "}
                <span className="text-brown-light">
                  {selectedColor ?? "Select a color"}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 border rounded-sm font-body text-sm transition-colors ${
                      selectedColor === color
                        ? "bg-brown text-cream-light border-brown"
                        : "border-gold/30 text-brown hover:border-gold"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isOnRequest && (product.stock == null || product.stock > 0) && (
            <div className="flex items-center gap-4 mb-6">
              <span className="font-body text-sm text-brown">Quantity:</span>
              <div className="flex items-center border border-gold/30 rounded-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-brown hover:text-gold transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-body text-brown min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock ?? 99, q + 1))
                  }
                  className="px-3 py-2 text-brown hover:text-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {isOnRequest && (
            <RequestForm product={product} sizeOptions={sizeOptions} selectedSize={selectedSize} />
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={(product.stock != null && product.stock <= 0) || needsSize || needsColor}
              className={`${isOnRequest ? "hidden " : ""}flex-1 text-center bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {added
                ? "Added!"
                : product.stock != null && product.stock <= 0
                ? "Out of Stock"
                : needsSize
                ? "Select a Size"
                : needsColor
                ? "Select a Color"
                : "Add to Cart"}
            </button>

            <a
              href={`https://wa.me/233595999314?text=${encodeURIComponent(
                `Hi Flové, I'm interested in the ${product.name}${selectedSize ? ` (size ${selectedSize})` : ""}${selectedColor ? ` (${selectedColor})` : ""} (From GHS ${
                  hasDiscount ? product.discountPrice : product.price
                }).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border border-brown text-brown font-body text-sm uppercase tracking-wider px-8 py-4 hover:border-gold hover:text-gold transition-colors rounded-sm"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
