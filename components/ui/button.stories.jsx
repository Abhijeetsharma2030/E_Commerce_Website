import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "destructive"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
  },
  args: {
    children: "Add to Cart",
    variant: "primary",
    size: "md",
  },
};

export default meta;

export const Primary = {
  args: { variant: "primary" },
};

export const Secondary = {
  args: { variant: "secondary" },
};

export const Outline = {
  args: { variant: "outline" },
};

export const Ghost = {
  args: { variant: "ghost" },
};

export const Destructive = {
  args: { variant: "destructive", children: "Remove Item" },
};

export const Loading = {
  args: { loading: true, children: "Adding..." },
};

export const Disabled = {
  args: { disabled: true },
};

export const AllSizes = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};
