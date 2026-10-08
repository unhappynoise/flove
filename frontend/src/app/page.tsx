import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/strapi";
import ProductCard from "@/components/ProductCard";
import PriceAccordion from "@/components/PriceAccordion";
import { priceGuide } from "@/data/priceGuide";

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-cream py-28 md:py-40 px-6 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-4">
            Est. 2025
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-brown mb-6 leading-tight">
            Flové
          </h1>
          <p className="font-body text-lg text-brown-light mb-10 max-w-xl mx-auto">
            Where quality meets luxury. Discover premium clothing, watches,
            shoes, and accessories curated for those who value the finer
            things.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Price Guide */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl text-brown text-center mb-4">
          Price Guide
        </h2>
        <p className="text-center font-body text-sm text-taupe mb-12">
          Click a category to expand
        </p>
        <PriceAccordion categories={priceGuide} />
      </section>

      {/* Category showcase */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl text-brown text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative aspect-[4/3] bg-brown rounded-sm overflow-hidden flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-brown/40 group-hover:bg-brown/20 transition-colors" />
              <h3 className="relative font-display text-3xl text-cream-light z-10">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl text-brown text-center mb-12">
            Featured
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
