import Link from "next/link";
import { Product, formatPrice } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const waMessage = encodeURIComponent(
    `Halo Redline Production, saya ingin memesan *${product.name}* (${formatPrice(product.price)}). Mohon info ketersediaan dan cara pemesanannya. Terima kasih! 🎁`
  );

  return (
    <div
      className="card group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Header */}
      <div className="relative bg-gradient-to-br from-primary-50 to-accent-light/30 px-6 pt-6 pb-4">
        {product.popular && (
          <span className="absolute top-3 right-3 badge bg-accent text-white">
            ⭐ Populer
          </span>
        )}
        {product.category === "premium" && (
          <span className="absolute top-3 left-3 badge bg-neutral-900 text-white">
            Premium
          </span>
        )}
        <div className="text-4xl mb-3">{product.emoji}</div>
        <h3 className="font-display text-xl font-semibold text-neutral-900">{product.name}</h3>
        <p className="text-accent font-semibold text-lg mt-1">{formatPrice(product.price)}</p>
      </div>

      {/* Items List */}
      <div className="px-6 py-4 flex-1">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Isi Paket</p>
        <ul className="space-y-1">
          {product.items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 flex gap-2">
        <a
          href={`https://wa.me/6208551234202?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Pesan via WA
        </a>
        <Link
          href="/order"
          className="flex-1 inline-flex items-center justify-center gap-1 border border-accent text-accent text-sm font-medium py-2.5 rounded-xl hover:bg-accent hover:text-white transition-colors"
        >
          Form Order
        </Link>
      </div>
    </div>
  );
}
