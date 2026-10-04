import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function roundCurrency(amount) {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function toBase64(str) {
  if (typeof window === "undefined") {
    return Buffer.from(str).toString("base64");
  }
  return window.btoa(str);
}

const SHIMMER = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop stop-color="#f1f1ef" offset="20%" />
      <stop stop-color="#e5e5e2" offset="50%" />
      <stop stop-color="#f1f1ef" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="#f1f1ef" />
  <rect width="400" height="400" fill="url(#g)" />
</svg>`;

export const SHIMMER_BLUR_DATA_URL = `data:image/svg+xml;base64,${toBase64(SHIMMER)}`;
