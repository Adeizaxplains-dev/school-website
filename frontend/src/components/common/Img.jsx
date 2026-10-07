import { useState } from "react";
import { School } from "lucide-react";
import { featuresConfig as features } from "../../config/features.config.js";

const tones = {
  primary: { bg: "var(--c-primary)", line: "var(--c-secondary)", icon: "var(--c-accent-on-dark)", text: "var(--c-on-primary)" },
  dark: { bg: "var(--c-dark)", line: "var(--c-secondary)", icon: "var(--c-accent-on-dark)", text: "var(--c-on-dark)" },
  gold: {
    bg: "color-mix(in oklab, var(--c-secondary) 30%, var(--c-cream))",
    line: "var(--c-primary)",
    icon: "var(--c-primary)",
    text: "var(--c-ink)",
  },
};

/**
 * Neutral stand-in used whenever an image is not configured (or fails to load).
 * Themed with the school colours so the layout still looks finished.
 */
export function Placeholder({ alt = "", icon: Icon = School, tone = "primary", className = "" }) {
  const t = tones[tones[tone] ? tone : "primary"];
  return (
    <div
      role="img"
      aria-label={alt || "Image placeholder"}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: t.bg }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        aria-hidden="true"
        style={{ color: t.line, opacity: 0.55 }}
      >
        {[84, 64, 44].map((r) => (
          <path key={r} d={`M${100 - r} 210V112A${r} ${r} 0 0 1 ${100 + r} 112V210`} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center" style={{ color: t.icon }}>
        <Icon size={44} strokeWidth={1.25} aria-hidden="true" />
      </div>
      {features.demoNotice && (
        <span className="absolute inset-x-0 top-[62%] text-center text-xs font-medium" style={{ color: t.text, opacity: 0.75 }}>
          Photo placeholder
        </span>
      )}
    </div>
  );
}

/**
 * Image with lazy loading, async decoding and a graceful fallback.
 * The parent decides the size / aspect ratio. The image always fills it.
 */
export default function Img({
  src,
  alt = "",
  icon,
  tone,
  eager = false,
  width,
  height,
  className = "",
  fallbackSrc = "",
  ...rest
}) {
  const [failed, setFailed] = useState(false);
  const [usingFallback, setUsingFallback] = useState(!src && !!fallbackSrc);

  if ((!src && !fallbackSrc) || (failed && !fallbackSrc)) return <Placeholder alt={alt} icon={icon} tone={tone} className={className} />;

  return (
    <img
      src={usingFallback ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
      onError={() => {
        if (fallbackSrc && !usingFallback) setUsingFallback(true);
        else setFailed(true);
      }}
      className={`h-full w-full object-cover ${className}`}
      {...rest}
    />
  );
}
