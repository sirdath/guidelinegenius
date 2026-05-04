// Long-form disclaimer used at the foot of articles + on the homepage.
// Mirrors the text from the live site.
import Link from "next/link";

export function DisclaimerBlock() {
  return (
    <section style={{ backgroundColor: "#E3F2FD" }}>
      <div className="mx-auto max-w-[1320px] px-6 lg:px-10 py-12">
        <h2
          className="text-center font-bold tracking-tight text-[26px] sm:text-[30px]"
          style={{ color: "#1a1a1a" }}
        >
          Disclaimer
        </h2>
        <div
          className="mx-auto mt-6 max-w-3xl space-y-4 text-[14.5px] leading-[1.7]"
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
            as part of this process. Once all content has been fully reviewed, this will be
            clearly communicated on the platform.
          </p>
          <p>
            For updates, follow us on Instagram{" "}
            <a
              href="https://www.instagram.com/guidelinegenius/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
              style={{ color: "#003366" }}
            >
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
  );
}
