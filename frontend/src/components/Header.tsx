"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/shop", label: "Shop All" },
  { href: "/category/footwear", label: "Footwear" },
  { href: "/category/apparel", label: "Apparel" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/category/fragrances", label: "Fragrances" },
];

export default function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream-light/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Flové"
            width={48}
            height={48}
            className="rounded-full"
          />
          <span className="font-display text-2xl text-brown tracking-wide hidden sm:block">
            Flové
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-body text-sm uppercase tracking-wider text-brown-light">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="https://wa.me/233595999314"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-brown-light hover:text-gold transition-colors hidden lg:block"
          >
            +233 59 599 9314
          </a>

          <Link href="/cart" className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-brown hover:text-gold transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.938-4.74 2.406-7.277a1.125 1.125 0 00-1.107-1.323H5.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-cream-light text-xs font-body rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden text-brown hover:text-gold transition-colors"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gold/20 bg-cream-light px-6 py-4 flex flex-col gap-4 font-body text-sm uppercase tracking-wider text-brown-light">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/233595999314"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors normal-case tracking-normal"
          >
            +233 59 599 9314
          </a>
        </nav>
      )}
    </header>
  );
}
