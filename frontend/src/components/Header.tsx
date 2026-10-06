import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream-light/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-3xl text-brown tracking-wide"
        >
          Flové
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm uppercase tracking-wider text-brown-light">
          <Link href="/category/footwear" className="hover:text-gold transition-colors">
            Footwear
          </Link>
          <Link href="/category/apparel" className="hover:text-gold transition-colors">
            Apparel
          </Link>
          <Link href="/category/accessories" className="hover:text-gold transition-colors">
            Accessories
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/233595999314"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-brown-light hover:text-gold transition-colors hidden sm:block"
          >
            +233 59 599 9314
          </a>
        </div>
      </div>
    </header>
  );
}
