"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PriceCategory } from "@/data/priceGuide";

export default function PriceAccordion({
  categories,
}: {
  categories: PriceCategory[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {categories.map((cat, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={cat.category}
            className="border border-gold/30 rounded-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-5 py-4 bg-cream hover:bg-cream-light transition-colors"
            >
              <span className="font-display text-lg text-brown">
                {cat.category}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gold text-2xl leading-none"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 space-y-2 bg-cream-light">
                    {cat.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between font-body text-sm"
                      >
                        <span className="text-brown-light">{item.name}</span>
                        <span className="text-brown font-medium">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
