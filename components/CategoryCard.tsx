import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/articles";

// Specialty card matching the live-site design: big square illustration
// with a soft cream tint, title left-aligned below in navy.
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white transition-transform hover:-translate-y-0.5"
      style={{
        boxShadow: "0 4px 20px -8px rgba(0, 51, 102, 0.10), 0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div
        className="relative aspect-[4/3] w-full"
        style={{ backgroundColor: "#FAF1EA" }}
      >
        {category.image && (
          <Image
            src={category.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="px-5 py-4 bg-white">
        <h3
          className="text-[16px] font-semibold leading-tight text-left"
          style={{ color: "#003366" }}
        >
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
