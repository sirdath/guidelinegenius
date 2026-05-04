import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <div>
      <div className="bg-accent-light/40 border-b border-line">
        <div className="mx-auto w-full px-5 lg:px-8 py-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sign Up" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-md px-5 py-14 lg:py-20">
        <h1 className="text-[36px] font-extrabold tracking-tight text-primary text-center">
          Create your account
        </h1>
        <p className="mt-2 text-[15px] text-ink-body text-center">
          Free to read — paid features unlock the question bank when it launches.
        </p>

        <form className="mt-8 space-y-4">
          <div>
            <label className="block text-[13px] font-bold uppercase tracking-wider text-ink-headline">
              Email
            </label>
            <input
              type="email"
              className="mt-2 w-full h-12 rounded-ui-sm border border-line bg-white px-4 text-[15px] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold uppercase tracking-wider text-ink-headline">
              Password
            </label>
            <input
              type="password"
              className="mt-2 w-full h-12 rounded-ui-sm border border-line bg-white px-4 text-[15px] focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              placeholder="At least 12 characters"
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full h-12 rounded-ui-sm bg-primary text-white font-bold opacity-60"
            title="Auth wired in next session"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-[14px] text-ink-body">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-secondary-600 hover:text-secondary-700">
            Log in
          </Link>
        </p>
        <p className="mt-3 text-center text-[12px] text-ink-muted">
          By creating an account you agree to our{" "}
          <Link href="/terms-and-conditions" className="underline hover:text-primary">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
