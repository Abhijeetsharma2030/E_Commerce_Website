import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "New",
  },
};

export default meta;

export const Default = {};

export const Secondary = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Sale = {
  args: { variant: "sale", children: "-20%" },
};

export const Success = {
  args: { variant: "success", children: "In Stock" },
};

export const Warning = {
  args: { variant: "warning", children: "Low Stock" },
};

export const Outline = {
  args: { variant: "outline", children: "Free Shipping" },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="sale">-20%</Badge>
      <Badge variant="success">In Stock</Badge>
      <Badge variant="warning">Low Stock</Badge>
      <Badge variant="outline">Free Shipping</Badge>
    </div>
  ),
};
