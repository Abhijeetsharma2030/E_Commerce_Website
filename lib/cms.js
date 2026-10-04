const heroBanners = [
  {
    sys: { id: "hero-1", contentType: "heroBanner" },
    fields: {
      eyebrow: "New Season",
      title: "Everyday Essentials, Elevated",
      subtitle: "Curated tech, fragrance, and home pieces — up to 40% off this week.",
      ctaLabel: "Shop the Collection",
      ctaHref: "/products",
      theme: "dark",
      image: {
        url: "https://picsum.photos/seed/hero-fashion/1600/900",
        alt: "Model showcasing seasonal essentials",
      },
    },
  },
  {
    sys: { id: "hero-2", contentType: "heroBanner" },
    fields: {
      eyebrow: "Just Dropped",
      title: "Next-Gen Gadgets Are Here",
      subtitle: "Hands-on with the latest smartphones, audio, and accessories.",
      ctaLabel: "Explore Tech",
      ctaHref: "/products?category=smartphones",
      theme: "light",
      image: {
        url: "https://picsum.photos/seed/hero-tech/1600/900",
        alt: "Flat lay of new technology products",
      },
    },
  },
  {
    sys: { id: "hero-3", contentType: "heroBanner" },
    fields: {
      eyebrow: "Home & Living",
      title: "Design a Space You Love",
      subtitle: "Furniture and decor edits handpicked by our design team.",
      ctaLabel: "Browse Home",
      ctaHref: "/products?category=furniture",
      theme: "dark",
      image: {
        url: "https://picsum.photos/seed/hero-home/1600/900",
        alt: "Minimalist living room interior",
      },
    },
  },
];

const promoBanners = [
  {
    sys: { id: "promo-1", contentType: "promoBanner" },
    fields: {
      title: "Free Shipping Over $50",
      subtitle: "No code needed. Applied automatically at checkout.",
      ctaLabel: "Start Shopping",
      ctaHref: "/products",
      accent: "emerald",
    },
  },
  {
    sys: { id: "promo-2", contentType: "promoBanner" },
    fields: {
      title: "Member Rewards",
      subtitle: "Earn points on every order and unlock exclusive drops.",
      ctaLabel: "Join Free",
      ctaHref: "/products",
      accent: "violet",
    },
  },
];

const categoryTiles = [
  { slug: "smartphones", name: "Smartphones", image: "https://picsum.photos/seed/cat-phones/480/480" },
  { slug: "laptops", name: "Laptops", image: "https://picsum.photos/seed/cat-laptops/480/480" },
  { slug: "fragrances", name: "Fragrances", image: "https://picsum.photos/seed/cat-fragrance/480/480" },
  { slug: "furniture", name: "Furniture", image: "https://picsum.photos/seed/cat-furniture/480/480" },
  { slug: "womens-bags", name: "Women's Bags", image: "https://picsum.photos/seed/cat-bags/480/480" },
  { slug: "sunglasses", name: "Sunglasses", image: "https://picsum.photos/seed/cat-sunglasses/480/480" },
];

function simulateLatency(payload, ms = 120) {
  return new Promise((resolve) => setTimeout(() => resolve(payload), ms));
}

export async function fetchHeroBanners() {
  return simulateLatency(heroBanners.map((entry) => entry.fields));
}

export async function fetchPromoBanners() {
  return simulateLatency(promoBanners.map((entry) => entry.fields));
}

export async function fetchCategoryTiles() {
  return simulateLatency(categoryTiles);
}
