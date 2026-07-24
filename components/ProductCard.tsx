'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

export default function ProductCard({
  product,
  storeSlug,
}: {
  product: Product;
  storeSlug: string;
}) {
  const cover = product.images?.[0] || '';
  return (
    <Link
      href={`/store/${storeSlug}/${product.id}`}
      className="card group block overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width:768px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.5-3.5" />
            </svg>
          </div>
        )}
        {product.stock > 0 && (
          <span className="badge absolute left-2 top-2 bg-white/90 text-gray-700 backdrop-blur">
            Stok {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="badge absolute left-2 top-2 bg-gray-800/90 text-white">
            Habis
          </span>
        )}
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-800">
          {product.name}
        </h3>
        <p className="text-base font-bold text-brand-600">
          {formatRupiah(product.price)}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{product.category}</span>
          <span className="flex items-center gap-0.5">
            <StarIcon /> 4.9
          </span>
        </div>
      </div>
    </Link>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B">
      <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
    </svg>
  );
}
