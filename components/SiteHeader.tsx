"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search as SearchIcon,
  User as UserIcon,
  Menu as MenuIcon,
  X as CloseIcon,
  Shield as ShieldIcon,
  LogOut as LogOutIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SearchModal } from "./SearchModal";
import { useAuth } from "@/lib/auth";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Contact Us", href: "/contact" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const { authed, ready, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="bg-white sticky top-0 z-30 shadow-sm">
        {/* Top row: logo · search · login (calm, compact) */}
        <div className="w-full pl-3 pr-6 lg:pl-5 lg:pr-10 h-[80px] flex items-center justify-between gap-6">
          <Link
            href="/"
            className="shrink-0 flex items-center"
            aria-label="Guideline Genius — Home"
          >
            <Image
              src="/brand/logo-trimmed.png"
              alt="Guideline Genius"
              width={278}
              height={148}
              priority
              className="h-14 w-auto"
            />
          </Link>

          {/* Search trigger — slimmer pill */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2.5 flex-1 max-w-md h-9 px-4 rounded-full bg-[#f4f6fa] text-left text-[14px] text-ink-muted hover:bg-[#eaeef5] transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/30"
          >
            <SearchIcon className="h-4 w-4 text-ink-muted" />
            <span>Search…</span>
          </button>

          {/* QBank CTA + Login/Admin/Logout (right) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/qbank"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-[13.5px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#5E35B1" }}
            >
              Question Bank
            </Link>
            {ready && authed ? (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-[14px] font-medium hover:text-secondary transition-colors"
                  style={{ color: "#003366" }}
                >
                  <ShieldIcon className="h-4 w-4" />
                  Admin
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 text-[14px] font-medium hover:text-secondary transition-colors"
                  style={{ color: "#003366" }}
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-[14px] font-medium hover:text-secondary transition-colors"
                style={{ color: "#003366" }}
              >
                <UserIcon className="h-4 w-4" />
                Login or signup
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="h-10 w-10 inline-flex items-center justify-center rounded-full text-primary hover:bg-accent-light"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              className="h-10 w-10 inline-flex items-center justify-center rounded-full text-primary hover:bg-accent-light"
            >
              {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Bottom row: nav (desktop only) — separated by a single thin line */}
        <div className="hidden md:block border-y" style={{ borderColor: "#eef0f4" }}>
          <div className="w-full pl-3 pr-6 lg:pl-5 lg:pr-10 h-11 flex items-center gap-10">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[14px] font-medium transition-colors"
                  style={{
                    color: active ? "#003366" : "#1a1a1a",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-line bg-white">
            <nav className="mx-auto w-full px-5 py-2 flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-[15px] font-semibold border-b border-line last:border-0 ${
                    isActive(item.href) ? "text-secondary" : "text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/qbank"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[15px] font-semibold border-b border-line inline-flex items-center gap-2"
                style={{ color: "#5E35B1" }}
              >
                Question Bank
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[15px] font-semibold text-primary inline-flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                Login or signup
              </Link>
            </nav>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

