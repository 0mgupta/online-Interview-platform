/* Graphite text, PolySans weight 400 — the headline voice */
export const DisplayTitle = ({ children }) => (
  <span
    style={{
      fontFamily: "var(--font-polysans)",
      fontWeight: 400,
      letterSpacing: "-0.02em",
      color: "#202020",
    }}
  >
    {children}
  </span>
);

/* Ember Orange accent text — used sparingly */
export const EmberTitle = ({ children }) => (
  <span
    style={{
      fontFamily: "var(--font-polysans)",
      fontWeight: 400,
      letterSpacing: "-0.02em",
      color: "#ff682c",
    }}
  >
    {children}
  </span>
);

/* Steel secondary text */
export const SteelText = ({ children }) => (
  <span className="text-steel">{children}</span>
);

/* Section label — Brass, small caps, Inter — with animated growing dash */
export const SectionLabel = ({ children }) => (
  <p
    className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase mb-4"
    style={{ color: "#816729" }}
  >
    <span
      className="h-px"
      style={{
        background: "#816729",
        display: "inline-block",
        width: "1rem",
        animation: "scaleIn 0.6s cubic-bezier(0.25,0.1,0.25,1) both",
        transformOrigin: "left center",
      }}
    />
    {children}
  </p>
);


/* Section heading — PolySans 400 */
export const SectionHeading = ({ main, accent }) => (
  <h2
    style={{
      fontFamily: "var(--font-polysans)",
      fontWeight: 400,
      fontSize: "clamp(2rem, 4vw, 2.5rem)",
      lineHeight: 1.19,
      letterSpacing: "-0.64px",
      color: "#202020",
    }}
  >
    {main}
    {accent && (
      <>
        {" "}
        <EmberTitle>{accent}</EmberTitle>
      </>
    )}
  </h2>
);

/* Legacy aliases — kept for backward compat */
export const GoldTitle = ({ children }) => (
  <EmberTitle>{children}</EmberTitle>
);

export const GrayTitle = ({ children }) => (
  <DisplayTitle>{children}</DisplayTitle>
);

/* Page section header used inside app pages */
export default function PageHeader({ label, main, accent, description, right }) {
  return (
    <div className="border-b border-mist px-6 md:px-8 py-10">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div>
          {label && <SectionLabel>{label}</SectionLabel>}
          <h1
            className="mt-1"
            style={{
              fontFamily: "var(--font-polysans)",
              fontWeight: 400,
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              lineHeight: 1.19,
              letterSpacing: "-0.64px",
              color: "#202020",
            }}
          >
            {main && <span>{main} </span>}
            {accent && <EmberTitle>{accent}</EmberTitle>}
          </h1>
          {description && (
            <p className="text-sm mt-2" style={{ color: "#4d4d4d" }}>
              {description}
            </p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  );
}
