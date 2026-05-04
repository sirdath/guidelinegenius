import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  allCategories,
  getCategory,
  articlesInCategory,
} from "@/lib/articles";
import { PageTopBand } from "@/components/PageTopBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SplitTitle } from "@/components/SplitTitle";

export async function generateStaticParams() {
  return allCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: { absolute: `${cat.name} - Guideline Genius` },
    description: `${cat.articleCount} guideline articles in ${cat.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const articles = articlesInCategory(slug);

  return (
    <article>
      <PageTopBand />

      <div style={{ backgroundColor: "#F5F8FB" }}>
        <div className="w-full px-6 lg:px-10 pt-6 pb-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: cat.name },
            ]}
          />
          <SplitTitle
            primary="Articles"
            accent="Listing"
            as="h1"
            reverse
            className="mt-8 text-[36px] sm:text-[44px]"
          />
        </div>
      </div>

      <section style={{ backgroundColor: "#E3F2FD" }}>
        <div className="mx-auto max-w-[1680px] px-6 lg:px-10 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.slug}`}
                className="group relative aspect-square rounded-md overflow-hidden transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: "#9C9C9C" }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div
                  className="absolute inset-0 transition-colors duration-300 group-hover:bg-black/50"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.38)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <h3
                    className="text-center text-[16.5px] font-extrabold leading-snug text-white"
                    style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.85)" }}
                  >
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
