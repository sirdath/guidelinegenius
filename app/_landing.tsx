import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { allCategories, allArticles, getArticle, getCategory } from "@/lib/articles";
import { PageTopBand } from "@/components/PageTopBand";
import { SplitTitle } from "@/components/SplitTitle";
import { CategoryCard } from "@/components/CategoryCard";
import { RecentlyUpdatedGrid } from "@/components/RecentlyUpdatedGrid";

// Curated to match the live site exactly — title + sources hardcoded so the
// homepage stays accurate even when the WXR data drifts.
const RECENTLY_UPDATED: {
  slug: string;
  title: string;
  sources: string[];
}[] = [
  {
    slug: "pneumothorax",
    title: "Pneumothorax",
    sources: [
      "NICE Guideline [NG39] Major trauma: assessment and initial management.",
      "British Thoracic Society (BTS) Guideline for Pleural Disease 2023",
      "ATLS® Advanced Trauma Life Support® Student Course Manual 10th Edition. 2018 American College of Surgeons.",
    ],
  },
  {
    slug: "infertility-subfertility",
    title: "Infertility and Subfertility",
    sources: [
      "NICE guideline [NG257] Fertility problems: assessment and treatment. Published: Mar 2026.",
      "NICE CKS Infertility. Last revised: Jul 2023.",
    ],
  },
  {
    slug: "asthma-chronic",
    title: "Asthma (Chronic)",
    sources: [
      "NICE guideline [NG245] Asthma: diagnosis, monitoring and chronic asthma management (BTS, NICE, SIGN). Published: 27 Nov 2024",
    ],
  },
  {
    slug: "pneumonia",
    title: "Pneumonia",
    sources: [
      "NICE guideline [NG250] Pneumonia: diagnosis and management. Published: Sep 2025.",
    ],
  },
  {
    slug: "chronic-heart-failure",
    title: "Chronic Heart Failure",
    sources: [
      "NICE guidelines [NG106] Chronic heart failure: diagnosis and management. Last updated: Sep 2025.",
    ],
  },
  {
    slug: "peri-arrest-tachycardia",
    title: "Peri-Arrest Tachycardia",
    sources: [
      "Resuscitation Council UK Adult Advanced Life Support Guidelines. Published: Oct 2025.",
    ],
  },
  {
    slug: "renal-cancer",
    title: "Kidney Cancer",
    sources: [
      "NICE guideline [NG256] Kidney cancer: diagnosis and management. Published: Mar 2026.",
      "EAU (European Association of Urology) Guidelines on Renal Cell Carcinoma. Last updated: Mar 2025.",
      "NICE guideline [NG12] Suspected cancer: recognition and referral. Last updated: May 2025.",
    ],
  },
  {
    slug: "type-2-diabetes-t2dm",
    title: "Type 2 Diabetes Mellitus (T2DM)",
    sources: [
      "NICE guideline [NG28] Type 2 diabetes in adults: management. Last updated: Feb 2026.",
      "NICE CKS Diabetes - type 2. Last revised: Jul 2025.",
    ],
  },
];

// Latest articles — title + slug + category image hardcoded so the section
// matches the live site exactly even when an article is missing from the WXR.
const LATEST: { title: string; slug: string; categorySlug: string }[] = [
  {
    title: "Quinsy (Peritonsillar Abscess)",
    slug: "quinsy-peritonsillar-abscess",
    categorySlug: "ear-nose-throat",
  },
  {
    title: "Cervical Ectropion",
    slug: "cervical-ectropion",
    categorySlug: "obstetric-gynaecology",
  },
  {
    title: "Premature Ovarian Insufficiency",
    slug: "premature-ovarian-insufficiency",
    categorySlug: "obstetric-gynaecology",
  },
  {
    title: "Infertility and Subfertility",
    slug: "infertility-subfertility",
    categorySlug: "obstetric-gynaecology",
  },
];

// Strip leftover HTML tags from imported source text
function cleanSource(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Landing() {
  // Latest cards: use the hardcoded title regardless of whether the article
  // exists in our data, but link directly to the article when it does so the
  // browse experience still works.
  const latest = LATEST.map((entry) => {
    const article = getArticle(entry.slug);
    const cat = getCategory(entry.categorySlug);
    return {
      title: entry.title,
      slug: entry.slug,
      href: article ? `/articles/${entry.slug}` : `/categories/${entry.categorySlug}`,
      image: article?.featuredImage || cat?.image || null,
    };
  });

  return (
    <>
      <PageTopBand />

      {/* Recently Updated Guidelines — spans full screen width */}
      <section style={{ backgroundColor: "#E3F2FD" }}>
        <div className="w-full px-6 lg:px-10 pt-2 pb-14">
          <SplitTitle
            primary="Recently Updated"
            accent="Guidelines"
            as="h2"
            reverse
            className="text-[28px] sm:text-[34px] lg:text-[38px]"
          />
          <RecentlyUpdatedGrid cards={RECENTLY_UPDATED} />
        </div>
      </section>

      {/* Latest Articles — color divider between Recently Updated and Specialities */}
      <section style={{ backgroundColor: "#F0F4F8" }}>
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-16">
          <SplitTitle
            primary="Latest"
            accent="Articles"
            as="h2"
            reverse
            className="text-[28px] sm:text-[34px]"
          />
          <div className="mt-10 mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((a) => (
              <Link
                key={a.slug}
                href={a.href}
                className="group relative aspect-square rounded-2xl overflow-hidden transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: "#FAF1EA" }}
              >
                {a.image && (
                  <Image
                    src={a.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {/* Uniform dark overlay so the white title pops on top of the illustration */}
                <div
                  className="absolute inset-0 transition-colors duration-300 group-hover:bg-black/50"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.38)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center px-5">
                  <h3
                    className="text-[18px] font-bold leading-snug text-center text-white"
                    style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)" }}
                  >
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Specialities */}
      <section style={{ backgroundColor: "#E3F2FD" }}>
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-14">
          <h2
            className="text-center font-extrabold tracking-tight leading-tight text-[24px] sm:text-[30px] lg:text-[34px]"
            style={{ color: "#003366" }}
          >
            Medical Specialities <span style={{ color: "#3BADFF" }}>as per UKMLA Content Map</span>
          </h2>
          <div className="mt-10 mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCategories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-14">
          <h2
            className="text-center font-extrabold tracking-tight text-[28px] sm:text-[34px]"
            style={{ color: "#003366" }}
          >
            Disclaimer
          </h2>
          <div
            className="mx-auto mt-8 max-w-3xl space-y-5 text-[14.5px] leading-[1.7] text-center"
            style={{ color: "#1a1a1a" }}
          >
            <p>
              We're actively expanding Guideline Genius to cover the full UKMLA content map.
              Therefore, you may notice some conditions not uploaded yet, or articles that currently
              focus on diagnosis and management for now.
            </p>
            <p>
              We are also continuously reviewing and updating existing content to ensure accuracy
              and alignment with current guidelines. Some earlier articles are undergoing revision
              as part of this process. Once all content has been fully reviewed, this will be clearly
              communicated on the platform.
            </p>
            <p className="flex items-center justify-center gap-2">
              For updates, follow us on Instagram{" "}
              <a
                href="https://www.instagram.com/guidelinegenius/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold underline"
                style={{ color: "#3BADFF" }}
              >
                <Instagram className="h-4 w-4" />
                @guidelinegenius
              </a>
              .
            </p>
            <p>
              We welcome any feedback or suggestions via the anonymous feedback box at the bottom of
              each article and will do our best to respond promptly.
            </p>
            <p>Thank you for your support.</p>
            <p className="font-bold" style={{ color: "#003366" }}>
              The Guideline Genius Team
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter (QBank) */}
      <section className="bg-white border-t" style={{ borderColor: "#ebebeb" }}>
        <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-14 text-center">
          <h2
            className="text-[28px] sm:text-[36px] font-extrabold leading-tight"
            style={{ color: "#003366" }}
          >
            Be first to access <span style={{ color: "#3BADFF" }}>our QBank</span>
          </h2>
          <p
            className="mx-auto mt-3 max-w-xl text-[14.5px]"
            style={{ color: "#333" }}
          >
            Sign up to receive major guideline updates and early access when we launch.
          </p>
          <form className="mx-auto mt-7 flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 h-11 px-5 rounded-md border bg-white text-[15px] focus:outline-none focus:ring-2"
              style={{ borderColor: "#ebebeb" }}
            />
            <button
              type="button"
              className="h-11 px-7 rounded-md text-white font-bold text-[14px]"
              style={{ backgroundColor: "#5E35B1" }}
            >
              Get Access
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

