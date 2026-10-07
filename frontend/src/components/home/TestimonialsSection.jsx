import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Container from "../common/Container.jsx";
import Img from "../common/Img.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { initialsOf } from "../../utils/format.js";

const { testimonials } = schoolConfig;

function Avatar({ item }) {
  if (item.image) {
    return (
      <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
        <Img src={item.image} alt="" width="96" height="96" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg text-on-primary"
    >
      {initialsOf(item.name) || "P"}
    </span>
  );
}

/** Testimonial slider. Slides share one grid cell so the height never jumps between them. */
export default function TestimonialsSection() {
  const items = testimonials.items;
  const [index, setIndex] = useState(0);
  if (!items.length) return null;

  const go = (n) => setIndex((n + items.length) % items.length);
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  return (
    <section className="section bg-surface" aria-roledescription="carousel" aria-label={testimonials.heading}>
      <Container className="max-w-4xl">
        <h2 className="title text-center">{testimonials.heading}</h2>

        <div className="mt-12 text-center" onKeyDown={onKeyDown}>
          <Quote size={40} className="mx-auto text-accent" aria-hidden="true" />

          <div className="mt-6 grid" aria-live="polite">
            {items.map((item, i) => (
              <figure
                key={i}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${items.length}`}
                aria-hidden={i !== index}
                className={`col-start-1 row-start-1 transition-opacity duration-500 ${
                  i === index ? "opacity-100" : "pointer-events-none invisible opacity-0"
                }`}
              >
                <blockquote className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                  {item.message}
                </blockquote>
                <figcaption className="mt-8 flex flex-col items-center gap-3">
                  <Avatar item={item} />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-muted">{item.role}</p>
                  </div>
                  {item.demo && (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-on-secondary">
                      Sample testimonial
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>

          {items.length > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous testimonial"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-link transition-colors hover:bg-primary hover:text-on-primary"
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <div className="flex items-center" role="group" aria-label="Choose testimonial">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === index}
                    className="flex h-11 w-8 items-center justify-center"
                  >
                    <span
                      className={`block h-2.5 rounded-full transition-all ${
                        i === index ? "w-6 bg-primary" : "w-2.5 bg-primary/25"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next testimonial"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-link transition-colors hover:bg-primary hover:text-on-primary"
              >
                <ChevronRight size={22} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
