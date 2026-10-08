const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export type StrapiImage = {
  id: number;
  url: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
};

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
};

export type SubType = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  category?: Category;
};

export type Product = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  sizes: string | null;
  color: string | null;
  stock: number;
  featured: boolean;
  sku: string | null;
  sub_type: SubType | null;
  bundleNote: string | null;
  images: StrapiImage[];
  category: Category;
};

export function getImageUrl(image: StrapiImage, size: "thumbnail" | "small" | "medium" | "large" = "medium") {
  const path = image.formats?.[size]?.url || image.url;
  return `${STRAPI_URL}${path}`;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${STRAPI_URL}/api/products?populate=images,category,sub_type`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return json.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/products?populate=images,category,sub_type&filters[featured][$eq]=true`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch featured products");
  const json = await res.json();
  return json.data;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${STRAPI_URL}/api/categories`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json = await res.json();
  return json.data;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/products?populate=images,category,sub_type&filters[category][slug][$eq]=${categorySlug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch category products");
  const json = await res.json();
  return json.data;
}

export async function getSubTypes(): Promise<SubType[]> {
  const res = await fetch(`${STRAPI_URL}/api/sub-types?populate=*`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch sub-types");
  const json = await res.json();
  return json.data;
}
