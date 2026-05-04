"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Search as SearchIcon,
  LogOut,
  Globe,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/seo", label: "SEO bulk", icon: SearchIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { authed, ready, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !authed) router.replace("/login");
  }, [ready, authed, router]);

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink-muted">
        Loading…
      </div>
    );
  }
  if (!authed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink-muted">
        Redirecting to login…
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F5F8FB" }} className="min-h-[80vh]">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-[180px] lg:self-start">
          <div
            className="rounded-md bg-white p-4"
            style={{ border: "1px solid #cfd8e3" }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-[14px]"
                style={{ backgroundColor: "#003366" }}
              >
                {(user || "A")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold truncate" style={{ color: "#003366" }}>
                  Admin
                </div>
                <div className="text-[12px] truncate" style={{ color: "#6B6A6A" }}>
                  {user || "admin@guidelinegenius.com"}
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] transition-colors"
                    style={{
                      backgroundColor: active ? "#E3F2FD" : "transparent",
                      color: active ? "#003366" : "#1a1a1a",
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t" style={{ borderColor: "#eef0f4" }}>
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] hover:bg-[#f4f6fa]"
                style={{ color: "#1a1a1a" }}
              >
                <Globe className="h-4 w-4" />
                View site
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/");
                }}
                className="w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-[14px] text-left hover:bg-[#f4f6fa]"
                style={{ color: "#1a1a1a" }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
