"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email || "admin@guidelinegenius.com");
    router.push("/admin");
  }

  return (
    <div>
      <div
        className="border-b"
        style={{ backgroundColor: "#F5F8FB", borderColor: "#ebebeb" }}
      >
        <div className="mx-auto max-w-[1320px] w-full px-6 lg:px-10 py-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Log In" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-md px-5 py-14 lg:py-20">
        <h1
          className="text-[36px] font-extrabold tracking-tight text-center"
          style={{ color: "#003366" }}
        >
          Welcome back
        </h1>
        <p
          className="mt-2 text-[15px] text-center"
          style={{ color: "#1a1a1a" }}
        >
          Log in to access your dashboard, progress, and the admin tools.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label
              className="block text-[13px] font-bold uppercase tracking-wider"
              style={{ color: "#003366" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-12 rounded-md border bg-white px-4 text-[15px] focus:outline-none focus:ring-2"
              style={{ borderColor: "#cfd8e3" }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              className="block text-[13px] font-bold uppercase tracking-wider"
              style={{ color: "#003366" }}
            >
              Password
            </label>
            <input
              type="password"
              className="mt-2 w-full h-12 rounded-md border bg-white px-4 text-[15px] focus:outline-none focus:ring-2"
              style={{ borderColor: "#cfd8e3" }}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 rounded-md font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#5E35B1" }}
          >
            Log In
          </button>
        </form>

        <p
          className="mt-6 text-center text-[12.5px]"
          style={{ color: "#6B6A6A" }}
        >
          Demo mode — any credentials grant admin access (frontend only).
        </p>

        <div className="mt-6 flex items-center justify-between text-[14px]">
          <Link
            href="/login/reset"
            className="font-semibold hover:underline"
            style={{ color: "#003366" }}
          >
            Forgot password?
          </Link>
          <Link
            href="/signup"
            className="font-semibold hover:underline"
            style={{ color: "#003366" }}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
