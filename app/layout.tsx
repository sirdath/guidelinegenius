import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TermsModal } from "@/components/TermsModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/lib/auth";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Guideline Genius — High-yield resource on UK medical guidelines",
    template: "%s · Guideline Genius",
  },
  description:
    "High-yield resource on UK medical guidelines — built for UKMLA learners and clinicians.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased font-sans bg-white text-ink-body" suppressHydrationWarning>
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <TermsModal />
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
