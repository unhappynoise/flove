import { getProducts, getImageUrl } from "@/lib/strapi";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const mainImage = product.images?.[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[3/4] bg-cream relative overflow-hidden rounded-sm">
          {mainImage ? (
            <Image
              src={getImageUrl(mainImage, "large")}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-taupe font-body">
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <p className="font-body text-xs uppercase tracking-wider text-taupe mb-3">
            {product.category?.name}
          </p>
          <h1 className="font-display text-4xl text-brown mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            {hasDiscount ? (
              <>
                <span className="font-body text-2xl text-gold font-medium">
                  GHS {product.discountPrice}
                </span>
                <span className="font-body text-lg text-taupe line-through">
                  GHS {product.price}
                </span>
              </>
            ) : (
              <span className="font-body text-2xl text-brown">
                GHS {product.price}
              </span>
            )}
          </div>

          <p className="font-body text-brown-light leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-3 mb-8 font-body text-sm">
            {product.sizes && (
              <p className="text-brown-light">
                <span className="text-brown font-medium">Sizes:</span>{" "}
                {product.sizes}
              </p>
            )}
            {product.color && (
              <p className="text-brown-light">
                <span className="text-brown font-medium">Color:</span>{" "}
                {product.color}
              </p>
            )}
            <p className="text-brown-light">
              <span className="text-brown font-medium">Availability:</span>{" "}
              {product.stock > 0
                ? `In stock (${product.stock} available)`
                : "Out of stock"}
            </p>
          </div>

          <a
            href={`https://wa.me/233595999314?text=${encodeURIComponent(
              `Hi Flové, I'm interested in the ${product.name} (GHS ${
                hasDiscount ? product.discountPrice : product.price
              }).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-brown text-cream-light font-body text-sm uppercase tracking-wider px-8 py-4 hover:bg-gold transition-colors rounded-sm"
          >
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
