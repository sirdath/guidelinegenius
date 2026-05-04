import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <div>
      <div className="bg-accent-light/40 border-b border-line">
        <div className="mx-auto w-full px-5 lg:px-8 py-4">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Log In" }]} />
        </div>
      </div>

      <div className="mx-auto max-w-md px-5 py-14 lg:py-20">
        <h1 className="text-[36px] font-extrabold tracking-tight text-primary text-center">
          Welcome back
        </h1>
        <p className="mt-2 text-[15px] text-ink-body text-center">
          Log in to access your guidelines library and progress.
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
              placeholder="••••••••"
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full h-12 rounded-ui-sm bg-primary text-white font-bold opacity-60"
            title="Auth wired in next session"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-[14px]">
          <Link
            href="/login/reset"
            className="text-secondary-600 hover:text-secondary-700 font-semibold"
          >
            Forgot password?
          </Link>
          <Link
            href="/signup"
            className="text-secondary-600 hover:text-secondary-700 font-semibold"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
