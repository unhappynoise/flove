"use client";

import { useState, useMemo } from "react";
import { Product, Category } from "@/lib/strapi";
import ProductCard from "@/components/ProductCard";

export default function CategoryView({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const subTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach((p) => {
      if (p.sub_type?.name) types.add(p.sub_type.name);
    });
    return Array.from(types);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    return products.filter((p) => p.sub_type?.name === activeFilter);
  }, [products, activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-brown mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="font-body text-brown-light max-w-xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {subTypes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveFilter("All")}
            className={`font-body text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
              activeFilter === "All"
                ? "bg-brown text-cream-light border-brown"
                : "border-gold/30 text-brown-light hover:border-gold"
            }`}
          >
            All
          </button>
          {subTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`font-body text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
                activeFilter === type
                  ? "bg-brown text-cream-light border-brown"
                  : "border-gold/30 text-brown-light hover:border-gold"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p className="text-center font-body text-brown-light py-20">
          No products{activeFilter !== "All" ? ` in "${activeFilter}"` : ""}{" "}
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
