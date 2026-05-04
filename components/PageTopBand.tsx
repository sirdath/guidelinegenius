import { allArticles } from "@/lib/articles";

// The light-blue band that sits below the header on every page,
// containing the bordered "Total Live Articles" announcement.
export function PageTopBand() {
  return (
    <div style={{ backgroundColor: "#E3F2FD" }}>
      <div className="w-full px-6 lg:px-10 py-8">
        <div
          className="rounded-md border px-6 py-4"
          style={{ borderColor: "#cfe4f4", backgroundColor: "rgba(255,255,255,0.35)" }}
        >
          <p className="text-[14.5px] text-ink-headline">
            <strong>Total Live Articles:</strong>{" "}
            <span style={{ color: "#333" }}>{allArticles.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
