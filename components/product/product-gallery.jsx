"use client";

import Image from "next/image";
import { useState } from "react";

import { cn, SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

export function ProductGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
        <Image
          src={images[activeIndex]}
          alt={`${title} — image ${activeIndex + 1}`}
          fill
          priority
          placeholder="blur"
          blurDataURL={SHIMMER_BLUR_DATA_URL}
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-neutral-100 transition-all hover:opacity-80",
                activeIndex === index ? "border-neutral-900" : "border-transparent"
              )}
              aria-label={`Show image ${index + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={SHIMMER_BLUR_DATA_URL}
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
