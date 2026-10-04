"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

const SLIDE_DURATION = 6000;

const contentStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const contentItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroBanner({ slides }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setActive((current) => (current + 1) % slides.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length]);

  const goTo = (index) => setActive((index + slides.length) % slides.length);
  const slide = slides[active];

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl sm:h-[480px] lg:h-[560px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image.url}
              alt={slide.image.alt}
              fill
              priority={active === 0}
              placeholder="blur"
              blurDataURL={SHIMMER_BLUR_DATA_URL}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <div
            className={cn(
              "absolute inset-0",
              slide.theme === "dark"
                ? "bg-gradient-to-r from-blue-950/80 via-blue-950/35 to-transparent"
                : "bg-gradient-to-r from-white/85 via-white/40 to-transparent"
            )}
          />
          <motion.div
            variants={contentStagger}
            initial="hidden"
            animate="visible"
            className="relative flex h-full max-w-xl flex-col justify-center gap-4 px-6 sm:px-10 lg:px-16"
          >
            <motion.span
              variants={contentItem}
              className={cn(
                "text-xs font-medium uppercase tracking-widest",
                slide.theme === "dark" ? "text-white/80" : "text-neutral-500"
              )}
            >
              {slide.eyebrow}
            </motion.span>
            <motion.h1
              variants={contentItem}
              className={cn(
                "text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl",
                slide.theme === "dark" ? "text-white" : "text-neutral-900"
              )}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              variants={contentItem}
              className={cn(
                "max-w-md text-sm sm:text-base",
                slide.theme === "dark" ? "text-white/85" : "text-neutral-600"
              )}
            >
              {slide.subtitle}
            </motion.p>
            <motion.div variants={contentItem}>
              <Button size="lg" className="mt-2 w-fit" asChild>
                <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/80 text-neutral-900 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/80 text-neutral-900 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, index) => (
              <button
                key={s.title}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === active ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
