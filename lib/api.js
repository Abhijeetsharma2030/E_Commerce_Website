const BASE_URL = "https://dummyjson.com";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    next: { revalidate: 60, ...(options.next || {}) },
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${path} (${res.status})`);
  }

  return res.json();
}

const SIZES = ["S", "M", "L", "XL"];
const COLORS = [
  { name: "Midnight Black", hex: "#111827" },
  { name: "Cloud White", hex: "#F9FAFB" },
  { name: "Ocean Blue", hex: "#2563EB" },
  { name: "Ember Red", hex: "#DC2626" },
];

function buildVariants(product) {
  const seed = product.id % 4;
  return {
    sizes: SIZES.slice(0, 2 + (product.id % 3)),
    colors: [COLORS[seed], COLORS[(seed + 1) % COLORS.length]],
  };
}

export function normalizeProduct(product) {
  const discountedPrice =
    product.price - (product.price * (product.discountPercentage || 0)) / 100;

  return {
    id: product.id,
    slug: product.id,
    title: product.title,
    description: product.description,
    category: product.category,
    brand: product.brand || "Generic",
    price: product.price,
    discountPercentage: product.discountPercentage || 0,
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    isOnSale: (product.discountPercentage || 0) >= 5,
    rating: product.rating || 0,
    stock: product.stock ?? 0,
    inStock: (product.stock ?? 0) > 0,
    availabilityStatus: product.availabilityStatus || "In Stock",
    tags: product.tags || [],
    images: product.images?.length ? product.images : [product.thumbnail],
    thumbnail: product.thumbnail,
    reviews: product.reviews || [],
    sku: product.sku,
    warrantyInformation: product.warrantyInformation,
    shippingInformation: product.shippingInformation,
    returnPolicy: product.returnPolicy,
    minimumOrderQuantity: product.minimumOrderQuantity || 1,
    variants: buildVariants(product),
  };
}

export async function fetchProducts({
  limit = 20,
  skip = 0,
  category,
  search,
  sortBy,
  order = "asc",
} = {}) {
  let path;
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });

  if (search) {
    path = "/products/search";
    params.set("q", search);
  } else if (category && category !== "all") {
    path = `/products/category/${category}`;
  } else {
    path = "/products";
  }

  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  const data = await request(`${path}?${params.toString()}`);

  return {
    products: data.products.map(normalizeProduct),
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  };
}

export async function fetchProductById(id) {
  const data = await request(`/products/${id}`);
  return normalizeProduct(data);
}

export async function fetchRelatedProducts(category, excludeId, limit = 4) {
  const data = await request(`/products/category/${category}?limit=${limit + 1}`);
  return data.products
    .filter((product) => product.id !== Number(excludeId))
    .slice(0, limit)
    .map(normalizeProduct);
}

export async function fetchCategories() {
  const data = await request("/products/categories");
  return data.map((category) => ({
    slug: category.slug,
    name: category.name,
  }));
}

export async function fetchTrendingProducts(limit = 8) {
  const data = await request(`/products?limit=${limit}&sortBy=rating&order=desc`);
  return data.products.map(normalizeProduct);
}
