"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { site } from "@/content/site";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function ProductImage({ src, alt, className, sizes }: Props) {
  const [failed, setFailed] = useState(false);

  const isRemote = useMemo(() => /^https?:\/\//.test(src), [src]);

  if (failed || !src) {
    return (
      <div className={`relative h-full w-full bg-[#f5f4f2] ${className ?? ""}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/branding/logo.jpeg"
            alt={`${site.shortBrand} logo`}
            width={160}
            height={160}
            className="opacity-[0.15]"
          />
        </div>
      </div>
    );
  }

  // Note: Next/Image will error for missing local files; onError lets us swap to placeholder.
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"}
      className={className}
      unoptimized={isRemote ? true : undefined}
      onError={() => setFailed(true)}
    />
  );
}

