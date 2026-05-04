// Mixed-color section title used across the live site:
// "About <Us>" — first part navy, second part light blue.
export function SplitTitle({
  primary,
  accent,
  className = "",
  as = "h2",
  reverse = false,
}: {
  primary: string;
  accent: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  reverse?: boolean; // when true, primary text is blue and accent is navy (homepage pattern)
}) {
  const Tag = as as any;
  const primaryColor = reverse ? "#3BADFF" : "#003366";
  const accentColor = reverse ? "#003366" : "#3BADFF";
  return (
    <Tag
      className={`text-center font-extrabold tracking-tight leading-tight ${className}`}
      style={{ color: primaryColor }}
    >
      {primary} <span style={{ color: accentColor }}>{accent}</span>
    </Tag>
  );
}
