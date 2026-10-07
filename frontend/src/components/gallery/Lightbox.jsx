import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Placeholder } from "../common/Img.jsx";

const ratios = { landscape: 4 / 3, portrait: 3 / 4, square: 1 };
const tones = ["primary", "dark", "gold"];

/**
 * Full-screen image preview built on the native <dialog> element.
 * The browser handles the focus trap, Escape to close and focus return.
 */
export default function Lightbox({ items, index, onClose, onChange }) {
  const dialogRef = useRef(null);
  const item = items[index];
  const count = items.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      // Unmounting removes the dialog from the top layer. Return focus to the thumbnail that opened it.
      document.body.style.overflow = "";
      trigger?.focus?.({ preventScroll: true });
    };
  }, []);

  const go = (step) => onChange((index + step + count) % count);
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };
  const closeOnBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const ratio = ratios[item.aspect] || ratios.landscape;

  return (
    <dialog
      ref={dialogRef}
      aria-label={item.title}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="on-dark m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-dark/95 p-0 text-on-dark backdrop:bg-black"
    >
      <div className="flex h-full flex-col" onClick={closeOnBackdrop}>
        <div className="flex items-center justify-between px-4 py-3 sm:px-6" onClick={closeOnBackdrop}>
          <p className="text-sm text-on-dark/80" aria-live="polite">
            {index + 1} of {count}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-on-dark/10"
          >
            <X size={26} aria-hidden="true" />
          </button>
        </div>

        <div
          className="relative flex flex-1 items-center justify-center gap-2 px-2 sm:px-6"
          onClick={closeOnBackdrop}
        >
          {count > 1 && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-on-dark/30 hover:bg-on-dark/10 sm:flex"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
          )}

          <div className="flex min-w-0 flex-col items-center">
            {item.image ? (
              <img
                src={item.image}
                alt={item.alt || item.title}
                className="max-h-[68dvh] max-w-full rounded-sm object-contain"
              />
            ) : (
              <div
                className="overflow-hidden rounded-sm"
                style={{ aspectRatio: ratio, width: `min(92vw, calc(68dvh * ${ratio}))` }}
              >
                <Placeholder alt={item.alt || item.title} tone={tones[index % tones.length]} />
              </div>
            )}
          </div>

          {count > 1 && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-on-dark/30 hover:bg-on-dark/10 sm:flex"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold">{item.title}</p>
            {item.category && <p className="text-sm text-on-dark/75">{item.category}</p>}
          </div>
          {count > 1 && (
            <div className="flex gap-2 sm:hidden">
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="flex h-12 w-12 items-center justify-center rounded-full border border-on-dark/30">
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="flex h-12 w-12 items-center justify-center rounded-full border border-on-dark/30">
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
