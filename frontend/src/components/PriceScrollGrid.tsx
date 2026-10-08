"use client";

import { motion } from "framer-motion";
import { PriceCategory } from "@/data/priceGuide";

export default function PriceScrollGrid({
  categories,
}: {
  categories: PriceCategory[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {categories.map((cat, index) => (
        <motion.div
          key={cat.category}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.08 }}
          className="border border-gold/30 rounded-sm p-5 bg-cream hover:border-gold hover:shadow-md transition-all"
        >
          <h3 className="font-display text-lg text-brown mb-3 pb-2 border-b border-gold/20">
            {cat.category}
          </h3>
          <div className="space-y-2">
            {cat.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between font-body text-sm"
              >
                <span className="text-brown-light">{item.name}</span>
                <span className="text-brown font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
