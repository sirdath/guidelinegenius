import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        backgroundColor: "#E3F2FD",
        borderTop: "1px solid rgba(0, 51, 102, 0.10)",
      }}
    >
      <div className="mx-auto max-w-[1320px] w-full pl-3 pr-6 lg:pl-6 lg:pr-10 pt-12 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo + tagline */}
        <div>
          <Image
            src="/brand/logo-trimmed.png"
            alt="Guideline Genius"
            width={278}
            height={148}
            className="h-12 w-auto"
          />
          <p
            className="mt-5 max-w-xs text-[13.5px] leading-[1.55]"
            style={{ color: "#1a1a1a" }}
          >
            UK medical guidelines made easy. From guidelines to genius{" "}
            <em style={{ color: "#9C6644" }}>in minutes!</em>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[17px] font-bold" style={{ color: "#1a1a1a" }}>
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-[14px]">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/categories">Categories</FooterLink>
            <FooterLink href="/signup">Subscribe</FooterLink>
            <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[17px] font-bold" style={{ color: "#1a1a1a" }}>
            Contact
          </h3>
          <div className="mt-4 space-y-2 text-[14px]" style={{ color: "#1a1a1a" }}>
            <p>Address: 128 City Road, London, United Kingdom, EC1V 2NX</p>
            <p>
              Email:{" "}
              <a
                href="mailto:hello@guidelinegenius.com"
                className="hover:underline"
                style={{ color: "#1a1a1a" }}
              >
                hello@guidelinegenius.com
              </a>
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-[17px] font-bold" style={{ color: "#1a1a1a" }}>
            Social Media
          </h3>
          <div className="mt-4">
            <a
              href="https://www.instagram.com/guidelinegenius/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-transform hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)",
                color: "#ffffff",
              }}
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-[1320px] w-full pl-3 pr-6 lg:pl-6 lg:pr-10 pb-6">
        <p className="text-[13px]" style={{ color: "#1a1a1a" }}>
          © {year} GUIDELINE GENIUS LTD
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="hover:underline transition-colors"
        style={{ color: "#1a1a1a" }}
      >
        {children}
      </Link>
    </li>
  );
}
