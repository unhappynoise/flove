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
  stock: number | null;
  featured: boolean;
  sku: string | null;
  sub_type: SubType | null;
  bundleNote: string | null;
  availability?: "ready" | "on_request" | null;
  images: StrapiImage[];
  category: Category;
};

export function getImageUrl(image: StrapiImage, size: "thumbnail" | "small" | "medium" | "large" = "medium") {
  const path = image.formats?.[size]?.url || image.url;
  // Cloudinary (and other providers) return full absolute URLs; local Strapi
  // storage returns relative paths like "/uploads/xxx.jpg" that need STRAPI_URL prepended.
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${STRAPI_URL}${path}`;
}

// Fetches every page of a Strapi collection, so we never hit the default 25-item limit.
async function fetchAll<T>(path: string): Promise<T[]> {
  const pageSize = 100;
  const all: T[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const sep = path.includes("?") ? "&" : "?";
    const url = `${STRAPI_URL}${path}${sep}pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    const json = await res.json();
    all.push(...json.data);
    pageCount = json.meta?.pagination?.pageCount ?? 1;
    page++;
  } while (page <= pageCount);

  return all;
}

const PRODUCT_POPULATE = "populate=images,category,sub_type";

export async function getProducts(): Promise<Product[]> {
  return fetchAll<Product>(`/api/products?${PRODUCT_POPULATE}`);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/products?${PRODUCT_POPULATE}&filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data[0] ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return fetchAll<Product>(`/api/products?${PRODUCT_POPULATE}&filters[featured][$eq]=true`);
}

export async function getCategories(): Promise<Category[]> {
  return fetchAll<Category>(`/api/categories`);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return fetchAll<Product>(
    `/api/products?${PRODUCT_POPULATE}&filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}`
  );
}

export async function getSubTypes(): Promise<SubType[]> {
  return fetchAll<SubType>(`/api/sub-types?populate=*`);
}

export function parseSizes(sizes: string | null | undefined): string[] {
  if (!sizes) return [];
  const out: string[] = [];
  for (const raw of sizes.split(",")) {
    const token = raw.trim();
    if (!token) continue;
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = parseInt(range[1], 10);
      const end = parseInt(range[2], 10);
      if (end >= start && end - start <= 30) {
        for (let n = start; n <= end; n++) out.push(String(n));
        continue;
      }
    }
    out.push(token);
  }
  return Array.from(new Set(out));
}

export function parseColors(colors: string | null | undefined): string[] {
  if (!colors) return [];
  const out: string[] = [];
  for (const raw of colors.split(",")) {
    const token = raw.trim();
    if (token) out.push(token);
  }
  return Array.from(new Set(out));
}
