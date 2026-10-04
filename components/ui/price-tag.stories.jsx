import { PriceTag } from "./price-tag";

const meta = {
  title: "UI/PriceTag",
  component: PriceTag,
  tags: ["autodocs"],
  args: {
    price: 129.99,
    size: "md",
  },
};

export default meta;

export const Regular = {};

export const OnSale = {
  args: { price: 129.99, discountedPrice: 89.99 },
};

export const Large = {
  args: { price: 129.99, discountedPrice: 89.99, size: "lg" },
};

export const Small = {
  args: { price: 24.99, size: "sm" },
};
