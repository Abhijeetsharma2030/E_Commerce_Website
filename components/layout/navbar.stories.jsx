import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

import { useCartStore } from "@/hooks/use-cart-store";

import { Navbar } from "./navbar";

const DEMO_SESSION = {
  user: {
    id: "demo",
    firstName: "Emily",
    lastName: "Johnson",
    username: "emilys",
    image: "https://dummyjson.com/icon/emilys/128",
  },
  expires: "2099-01-01T00:00:00.000Z",
};

function SeedState({ cartCount = 0, session = null, children }) {
  useEffect(() => {
    useCartStore.setState({
      items: cartCount
        ? [
            {
              key: "seed",
              id: 1,
              title: "Seed product",
              price: 19.99,
              quantity: cartCount,
            },
          ]
        : [],
    });
    return () => useCartStore.setState({ items: [] });
  }, [cartCount]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}

const meta = {
  title: "Layout/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Desktop = {
  render: () => <SeedState>{<Navbar />}</SeedState>,
};

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <SeedState>{<Navbar defaultMobileMenuOpen />}</SeedState>,
};

export const LoggedIn = {
  render: () => <SeedState session={DEMO_SESSION}>{<Navbar />}</SeedState>,
};

export const LoggedOut = {
  render: () => <SeedState session={null}>{<Navbar />}</SeedState>,
};

export const WithCartBadge = {
  render: () => <SeedState cartCount={3}>{<Navbar />}</SeedState>,
};
