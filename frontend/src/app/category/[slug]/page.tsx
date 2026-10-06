import { getProductsByCategory, getCategories } from "@/lib/strapi";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl text-brown mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="font-body text-brown-light max-w-xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-center font-body text-brown-light py-20">
          No products in this category yet. Check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
