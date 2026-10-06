import Link from "next/link";
import Image from "next/image";
import { Product, getImageUrl } from "@/lib/strapi";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0];
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="aspect-[3/4] bg-cream relative overflow-hidden rounded-sm">
        {image ? (
          <Image
            src={getImageUrl(image, "medium")}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-taupe font-body text-sm">
            No image
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-gold text-cream-light text-xs font-body px-2 py-1 rounded-sm">
            Sale
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="font-body text-xs uppercase tracking-wider text-taupe">
          {product.category?.name}
        </p>
        <h3 className="font-display text-lg text-brown group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="font-body text-sm text-gold font-medium">
                GHS {product.discountPrice}
              </span>
              <span className="font-body text-sm text-taupe line-through">
                GHS {product.price}
              </span>
            </>
          ) : (
            <span className="font-body text-sm text-brown-light">
              GHS {product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
