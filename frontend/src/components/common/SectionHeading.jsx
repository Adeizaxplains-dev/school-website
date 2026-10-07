/** Consistent section title and optional intro. Set tone="dark" when used on a dark background. */
export default function SectionHeading({ title, intro, tone = "light", align = "left", as: Tag = "h2", className = "" }) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      <Tag className={`title ${tone === "dark" ? "text-on-dark" : "text-ink"}`}>{title}</Tag>
      {intro && (
        <p className={`lead mt-4 ${tone === "dark" ? "text-on-dark/80" : "text-muted"}`}>{intro}</p>
      )}
    </div>
  );
}
