import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Create Account — Trove",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}
