/** Skeleton loading block. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden p-0">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="card p-4">
      <Skeleton className="h-16 w-16 rounded-2xl" />
      <Skeleton className="mt-3 h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}
