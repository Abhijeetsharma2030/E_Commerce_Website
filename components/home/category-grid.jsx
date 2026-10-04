import Image from "next/image";
import Link from "next/link";

import { SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

export function CategoryGrid({ categories }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group flex flex-col items-center gap-2.5 text-center"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-sm transition-shadow group-hover:shadow-md sm:h-24 sm:w-24">
            <Image
              src={category.image}
              alt={category.name}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR_DATA_URL}
              sizes="96px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-sm font-medium text-neutral-700 transition-colors group-hover:text-neutral-900">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
