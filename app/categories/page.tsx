import { allCategories, allArticles } from "@/lib/articles";
import { CategoryGrid } from "@/components/CategoryGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageTopBand } from "@/components/PageTopBand";

export const metadata = {
  title: { absolute: "Medical Specialities as per UKMLA Content Map | Guideline Genius" },
  description: "Medical Specialities as per UKMLA Content Map. Browse Guideline Genius by clinical specialty.",
};

export default function CategoriesPage() {
  return (
    <div>
      <PageTopBand />

      <div className="bg-accent-light/40 border-b border-line">
        <div className="mx-auto max-w-[1320px] w-full px-6 lg:px-10 py-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Categories" },
            ]}
          />
        </div>
      </div>

      <section style={{ backgroundColor: "#E3F2FD" }}>
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-14">
          <h1
            className="text-center font-extrabold tracking-tight leading-tight text-[28px] sm:text-[34px] lg:text-[38px]"
            style={{ color: "#003366" }}
          >
            Medical Specialities{" "}
            <span style={{ color: "#3BADFF" }}>as per UKMLA Content Map</span>
          </h1>
          <p
            className="mt-4 text-center text-[15px]"
            style={{ color: "#1a1a1a" }}
          >
            {allCategories.length} clinical specialties · {allArticles.length} guidelines
          </p>

          <CategoryGrid categories={allCategories} />
        </div>
      </section>
    </div>
  );
}
