import { ProductCard, ProductCardSkeleton } from "./product-card";

const baseProduct = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  category: "beauty",
  price: 9.99,
  discountPercentage: 10.48,
  discountedPrice: 8.94,
  isOnSale: false,
  rating: 3.5,
  stock: 12,
  inStock: true,
  thumbnail: "https://picsum.photos/seed/product-card/600/600",
};

const meta = {
  title: "Product/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};

export default meta;

export const Default = {
  args: { product: baseProduct },
};

export const OnSale = {
  args: {
    product: { ...baseProduct, isOnSale: true, price: 59.99, discountedPrice: 41.99, discountPercentage: 30 },
  },
};

export const OutOfStock = {
  args: { product: { ...baseProduct, inStock: false, stock: 0 } },
};

export const Skeleton = {
  render: () => <ProductCardSkeleton />,
};

export const Grid = {
  render: () => (
    <div className="grid w-[640px] grid-cols-2 gap-4">
      <ProductCard product={baseProduct} />
      <ProductCard
        product={{ ...baseProduct, isOnSale: true, price: 59.99, discountedPrice: 41.99 }}
      />
      <ProductCard product={{ ...baseProduct, inStock: false }} />
      <ProductCardSkeleton />
    </div>
  ),
};
