import { useState } from "react";
import { assetUrl } from "../../api/client.js";

const SIZES = { xs: "h-7 w-7 text-[10px]", sm: "h-9 w-9 text-xs", md: "h-12 w-12 text-sm", lg: "h-20 w-20 text-xl", xl: "h-28 w-24 text-2xl" };

/** Passport photo with initials fallback. Used everywhere a student appears so the photo is consistent. */
export default function StudentAvatar({ student, size = "sm", square = false, className = "" }) {
  const [broken, setBroken] = useState(false);
  const initials = `${student?.firstName?.[0] || ""}${student?.lastName?.[0] || ""}`.toUpperCase() || "?";
  const shape = square ? "rounded-md" : "rounded-full";
  const dims = SIZES[size] || SIZES.sm;

  if (student?.photo && !broken) {
    return (
      <img
        src={assetUrl(student.photo)}
        alt={`${student.firstName || ""} ${student.lastName || ""} passport photograph`.trim()}
        onError={() => setBroken(true)}
        className={`${dims} ${shape} shrink-0 object-cover ring-1 ring-line ${className}`}
      />
    );
  }
  return (
    <span aria-hidden="true" className={`${dims} ${shape} inline-flex shrink-0 items-center justify-center bg-primary/10 font-bold text-primary ring-1 ring-line ${className}`}>
      {initials}
    </span>
  );
}
