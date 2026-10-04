import { Suspense } from "react";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign In — Trove",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
