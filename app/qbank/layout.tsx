import { QbankHeader } from "@/components/QbankHeader";

export const metadata = {
  title: { absolute: "Question Bank | Guideline Genius UKMLA Practice" },
  description:
    "UKMLA-style practice questions with explanations linked to the source guideline. Topic packs, timed mocks and side-by-side article review.",
};

export default function QbankLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <QbankHeader />
      {children}
    </div>
  );
}
