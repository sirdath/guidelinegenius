import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TermsModal } from "@/components/TermsModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/lib/auth";
import { SubscriptionProvider } from "@/lib/subscription";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

// Mirrors the live site exactly: home tab title and meta description
// scraped from guidelinegenius.com, page-specific titles set via
// `title: { absolute: ... }` per page.
export const metadata: Metadata = {
  title: {
    default: "Guideline Genius | UKMLA Revision & UK Medical Guidelines",
    template: "%s | UKMLA Guide",
  },
  description:
    "High-yield UKMLA revision resource based on up-to-date UK medical guidelines. Learn key clinical topics, diagnosis, and management from student-friendly guides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased font-sans bg-white text-ink-body" suppressHydrationWarning>
        <AuthProvider>
          <SubscriptionProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <TermsModal />
            <ScrollToTop />
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
