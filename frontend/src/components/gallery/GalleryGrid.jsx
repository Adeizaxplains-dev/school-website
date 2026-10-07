import { useMemo, useState } from "react";
import { ZoomIn } from "lucide-react";
import Container from "../common/Container.jsx";
import Img from "../common/Img.jsx";
import Lightbox from "./Lightbox.jsx";
import { schoolConfig } from "../../config/school.config.js";

const { gallery } = schoolConfig;
const aspects = { landscape: "aspect-[4/3]", portrait: "aspect-[3/4]", square: "aspect-square" };
const tones = ["primary", "dark", "gold"];
const ALL = "All";

/** Masonry-style gallery with category filters and a lightbox. Fully driven by school.config.js > gallery. */
export default function GalleryGrid() {
  const [active, setActive] = useState(ALL);
  const [open, setOpen] = useState(null);

  const categories = useMemo(
    () => (gallery.categories.length ? gallery.categories : [...new Set(gallery.items.map((i) => i.category).filter(Boolean))]),
    []
  );
  const visible = useMemo(
    () => (active === ALL ? gallery.items : gallery.items.filter((i) => i.category === active)),
    [active]
  );

  if (!gallery.items.length) return null;

  return (
    <section className="section bg-cream">
      <Container>
        {categories.length > 0 && (
          <div role="group" aria-label="Filter photos by category" className="flex flex-wrap gap-2">
            {[ALL, ...categories].map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={active === category}
                onClick={() => setActive(category)}
                className={`inline-flex min-h-11 items-center rounded-full border px-5 text-[0.95rem] font-medium transition-colors ${
                  active === category
                    ? "border-primary bg-primary text-on-primary"
                    : "border-line bg-surface text-ink hover:border-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <ul className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {visible.map((item, i) => (
            <li key={`${item.title}-${i}`} className="fade-in mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`View ${item.title}`}
                className="group relative block w-full overflow-hidden rounded-md text-left"
              >
                <div className={`${aspects[item.aspect] || aspects.landscape} w-full`}>
                  <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                    <Img src={item.image} alt={item.alt || item.title} tone={tones[i % tones.length]} />
                  </div>
                </div>
                <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between gap-3 bg-dark/90 px-4 py-3 text-on-dark transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0 pointer-coarse:translate-y-0">
                  <span className="min-w-0">
                    <span className="block truncate font-display text-base font-semibold">{item.title}</span>
                    {item.category && <span className="block text-sm text-on-dark/75">{item.category}</span>}
                  </span>
                  <ZoomIn size={20} className="shrink-0" aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Container>

      {open !== null && (
        <Lightbox items={visible} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
