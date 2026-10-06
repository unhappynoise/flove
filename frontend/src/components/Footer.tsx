import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream-light mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-display text-2xl mb-3">Flové</h3>
          <p className="font-body text-sm text-cream-light/70 leading-relaxed">
            Where quality meets luxury. Premium clothing, watches, shoes, and
            accessories curated for those who value the finer things.
          </p>
        </div>

        <div>
          <h4 className="font-body text-sm uppercase tracking-wider mb-4 text-gold-light">
            Shop
          </h4>
          <ul className="space-y-2 font-body text-sm text-cream-light/70">
            <li>
              <Link href="/category/footwear" className="hover:text-gold-light transition-colors">
                Footwear
              </Link>
            </li>
            <li>
              <Link href="/category/apparel" className="hover:text-gold-light transition-colors">
                Apparel
              </Link>
            </li>
            <li>
              <Link href="/category/accessories" className="hover:text-gold-light transition-colors">
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-body text-sm uppercase tracking-wider mb-4 text-gold-light">
            Connect
          </h4>
          <ul className="space-y-2 font-body text-sm text-cream-light/70">
            <li>
              <a
                href="https://wa.me/233595999314"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light transition-colors"
              >
                WhatsApp: +233 59 599 9314
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/flove.gh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light transition-colors"
              >
                Instagram @Flove.GH
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com/@flove.gh"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light transition-colors"
              >
                TikTok @Flove.GH
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-light/10 py-6 text-center font-body text-xs text-cream-light/50">
        © {new Date().getFullYear()} Flové. All rights reserved.
      </div>
    </footer>
  );
}
