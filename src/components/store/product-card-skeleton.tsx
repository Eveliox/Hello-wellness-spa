function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#e8e8e8] bg-white">
      <div className="m-4 aspect-square animate-pulse rounded-[12px] bg-[#f1efed]" />
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-[#f1efed]" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#f1efed]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#f1efed]" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-[#f1efed]" />
        <div className="mt-2 h-5 w-28 animate-pulse rounded bg-[#f1efed]" />
        <div className="mt-auto h-11 w-full animate-pulse rounded-lg bg-[#f1efed]" />
      </div>
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
