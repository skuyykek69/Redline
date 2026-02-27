"use client";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/data";

interface ProductThumbProps {
  product: Product;
  size?: number;       // px, default 48
  rounded?: string;    // tailwind class, default "rounded-xl"
  className?: string;
}

/**
 * Foto mini produk yang dipakai di keranjang, order summary, admin panel, dll.
 * Prioritas: imageUrl (Cloudinary/base64) → /images/paket-{id}.jpg → emoji fallback
 */
export default function ProductThumb({
  product,
  size = 48,
  rounded = "rounded-xl",
  className = "",
}: ProductThumbProps) {
  const [imgError, setImgError] = useState(false);

  const imageSrc = product.imageUrl || `/images/paket-${product.id}.jpg`;
  const isUnoptimized = !!product.imageUrl && (
    product.imageUrl.startsWith("data:") || product.imageUrl.startsWith("http")
  );

  const sizeClass = `w-[${size}px] h-[${size}px]`;

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary-50 to-accent-light/30 flex items-center justify-center ${rounded} ${className}`}
      style={{ width: size, height: size, minWidth: size }}
    >
      {!imgError ? (
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          sizes={`${size}px`}
          onError={() => setImgError(true)}
          unoptimized={isUnoptimized}
        />
      ) : (
        <span
          className="select-none leading-none"
          style={{ fontSize: size * 0.45 }}
        >
          {product.emoji}
        </span>
      )}
    </div>
  );
}
