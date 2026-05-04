import { PageTopBand } from "@/components/PageTopBand";
import { SplitTitle } from "@/components/SplitTitle";

export const metadata = {
  title: { absolute: "About | UKMLA Guide" },
  description:
    "About Us — Who Are We? Guideline Genius was created in 2024 with a clear purpose: to make UK medical guidelines easier to learn, understand, and apply.",
};

export default function AboutPage() {
  return (
    <article>
      <PageTopBand />

      <div className="w-full px-6 lg:px-10 py-14">
        <SplitTitle
          primary="About"
          accent="Us"
          as="h1"
          className="text-[36px] sm:text-[44px]"
        />

        <div className="mt-16 max-w-5xl mx-auto space-y-14">
          <Section title="Who Are We?">
            <p>
              Guideline Genius was created in 2024 with a clear purpose: to make UK medical
              guidelines easier to learn, understand, and apply. We develop structured,
              easy-to-follow learning resources based on UK clinical guidance and streamlined to
              the UKMLA content map – the core syllabus for UK medical school examinations. Our aim
              is to help learners feel more confident in both exams and clinical practice.
            </p>
            <p>
              Right now, Guideline Genius is mainly designed for clinical-year medical students,
              with growing relevance for junior doctors who need quick, reliable, guideline-based
              information.
            </p>
            <p>
              Our platform is written by medical students who understand the challenges of learning
              medicine and reviewed by specialist physicians who ensure accuracy and clinical
              relevance. By bringing guidance from organisations such as <strong>NICE</strong>,{" "}
              <strong>BTS</strong>, <strong>RCOG</strong>, <strong>RCUK</strong>,{" "}
              <strong>BOA</strong>, and <strong>BASHH</strong> into one place, we save users time
              and make navigating complex guidelines far more manageable.
            </p>
          </Section>

          <Section title="What Do We Do?" reverse>
            <p>
              We take complex clinical guidelines and reshape them into structured, high-yield
              summaries. Each topic is aligned with the UKMLA content map and organised to support
              both exam revision and real-world clinical understanding.
            </p>
            <p>
              To support clearer and efficient learning, our articles use structured formats –
              bullet-point breakdowns, high-yield tables, flowcharts, collapsible sections, hover
              boxes, and pop-up explanations – helping users identify key information quickly or
              explore further detail when needed.
            </p>
            <p>
              Where UK guidance is unavailable, we use reputable European and American sources,
              always clearly referenced and integrated into the same structured format. Everything
              we produce follows one guiding principle: create the kind of resource we wish we had
              during medical school.
            </p>
          </Section>

          <Section title="How We Maintain Quality">
            <p>
              Quality is central to our work. Every article follows a consistent, standardised
              structure and is manually updated whenever guidelines change. We use website and
              social media notices to ensure users are quickly informed of any relevant updates.
            </p>
            <p>
              Our content policy involves review of articles by specialist physicians to ensure
              accuracy, alignment with current guidance, and to add practical clinical insight.
            </p>
            <p>
              We reference all sources transparently and timestamp each article, helping users see
              how current the content is and giving them the option to verify the evidence or read
              more widely.
            </p>
          </Section>

          <Section title="Future Plans" reverse>
            <p>
              In the near future, we plan to develop a comprehensive question bank to complement
              our articles. We also intend to integrate AI-powered learning tools to deliver
              adaptive and personalised revision. In addition, a mobile app is in development to
              improve accessibility.
            </p>
          </Section>
        </div>
      </div>
    </article>
  );
}

// Two-column layout: title on one side, body text on the other.
// Calm uniform typography — black text, consistent sizes throughout.
function Section({
  title,
  reverse,
  children,
}: {
  title: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
      <h2
        className={`text-[26px] font-bold leading-tight ${
          reverse ? "md:order-2 md:text-left" : "md:text-right"
        }`}
        style={{ color: "#1a1a1a" }}
      >
        {title}
      </h2>
      <div
        className={`md:col-span-2 space-y-4 text-[15.5px] leading-[1.7] ${
          reverse ? "md:order-1" : ""
        }`}
        style={{ color: "#1a1a1a" }}
      >
        {children}
      </div>
    </div>
  );
}
