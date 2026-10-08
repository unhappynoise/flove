"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/lib/strapi";
import ProductCard from "@/components/ProductCard";

function effectivePrice(p: Product) {
  return p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
}

function PriceRange({ products }: { products: Product[] }) {
  if (products.length < 2) return null;
  const prices = products.map(effectivePrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return null;
  return (
    <p className="font-body text-xs uppercase tracking-wider text-gold mb-8 text-center">
      Prices range from GH₵{min} to GH₵{max}
    </p>
  );
}

export default function ShopView({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubType, setActiveSubType] = useState<string>("All");

  const productsInCategory = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category?.name === activeCategory);
  }, [products, activeCategory]);

  const subTypes = useMemo(() => {
    const types = new Set<string>();
    productsInCategory.forEach((p) => {
      if (p.sub_type?.name) types.add(p.sub_type.name);
    });
    return Array.from(types);
  }, [productsInCategory]);

  const filteredProducts = useMemo(() => {
    if (activeSubType === "All") return productsInCategory;
    return productsInCategory.filter((p) => p.sub_type?.name === activeSubType);
  }, [productsInCategory, activeSubType]);

  function handleCategoryClick(category: string) {
    setActiveCategory(category);
    setActiveSubType("All");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-brown mb-4">
          Shop All
        </h1>
        <p className="font-body text-brown-light max-w-xl mx-auto">
          Browse the full Flové collection — clothing, footwear, accessories,
          and fragrances.
        </p>
      </div>

      {/* Category filter — always shows all real categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => handleCategoryClick("All")}
          className={`font-body text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
            activeCategory === "All"
              ? "bg-brown text-cream-light border-brown"
              : "border-gold/30 text-brown-light hover:border-gold"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className={`font-body text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
              activeCategory === category.name
                ? "bg-brown text-cream-light border-brown"
                : "border-gold/30 text-brown-light hover:border-gold"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Sub-type filter — only shows when the active category has sub-types with products */}
      {subTypes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveSubType("All")}
            className={`font-body text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeSubType === "All"
                ? "bg-gold text-cream-light border-gold"
                : "border-gold/20 text-taupe hover:border-gold/50"
            }`}
          >
            All {activeCategory}
          </button>
          {subTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveSubType(type)}
              className={`font-body text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeSubType === type
                  ? "bg-gold text-cream-light border-gold"
                  : "border-gold/20 text-taupe hover:border-gold/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      <PriceRange products={filteredProducts} />

      {filteredProducts.length === 0 ? (
        <p className="text-center font-body text-brown-light py-20">
          No products{activeCategory !== "All" ? ` in "${activeCategory}"` : ""}{" "}
          yet. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
