import { getProductsByCategory, getCategories } from "@/lib/strapi";
import { notFound } from "next/navigation";
import CategoryView from "./CategoryView";

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

  return <CategoryView category={category} products={products} />;
}
