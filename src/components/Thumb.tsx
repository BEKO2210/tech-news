"use client";

import Image from "next/image";
import { useState } from "react";
import type { Article } from "@/lib/types";

/**
 * Robust article image:
 *  - no source image  → topical category placeholder (local, reliable)
 *  - broken/hotlink-blocked source image (403) → onError swaps to placeholder
 */
export function Thumb({
  article,
  sizes,
  priority = false,
}: {
  article: Article;
  sizes: string;
  priority?: boolean;
}) {
  const fallback = `/placeholders/${article.category}.jpg`;
  const [src, setSrc] = useState(article.image || fallback);

  return (
    <Image
      src={src}
      alt={article.title}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      unoptimized
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
