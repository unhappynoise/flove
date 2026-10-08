import { getProducts, getCategories } from "@/lib/strapi";
import ShopView from "./ShopView";

export default async function ShopPage() {
  const products = await getProducts();
  const categories = await getCategories();
  return <ShopView products={products} categories={categories} />;
}
