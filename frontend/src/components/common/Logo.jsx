import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolConfig } from "../../config/school.config.js";

const { school } = schoolConfig;

export function Monogram({ size = "md" }) {
  const dims = size === "lg" ? "h-14 w-11 text-2xl" : "h-11 w-9 text-xl";
  return (
    <span
      aria-hidden="true"
      className={`arch flex shrink-0 items-end justify-center bg-primary pb-1 font-display font-semibold text-accent-dark ring-1 ring-secondary/60 ${dims}`}
    >
      {(school.shortName || school.name).trim().charAt(0).toUpperCase()}
    </span>
  );
}

/** Logo plus school name. Uses the configured logo image, or a monogram if none is set. */
export default function Logo({ variant = "dark", showName = true, className = "" }) {
  const [broken, setBroken] = useState(false);
  const textColor = variant === "light" ? "text-on-dark" : "text-ink";

  return (
    <Link to="/" className={`inline-flex items-center gap-3 ${className}`} aria-label={`${school.name} home`}>
      {school.logo && !broken ? (
        <img
          src={school.logo}
          alt=""
          width="44"
          height="44"
          className="h-11 w-auto max-w-[3.5rem] object-contain"
          onError={() => setBroken(true)}
        />
      ) : (
        <Monogram />
      )}
      {showName && (
        <span className={`font-display text-[1.05rem] font-semibold leading-tight sm:text-lg ${textColor}`}>
          {school.name}
        </span>
      )}
    </Link>
  );
}
