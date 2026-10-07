import Container from "./Container.jsx";
import Img from "./Img.jsx";

/** Header band for inner pages. Pass `image` for a framed picture on the right (md and up). */
export default function PageHero({ title, intro, image, imageAlt = "" }) {
  return (
    <section className="on-dark relative overflow-hidden bg-dark text-on-dark">
      {image ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] md:block" aria-hidden={!imageAlt}>
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-dark via-dark/40 to-transparent" />
          <Img src={image} alt={imageAlt} eager />
        </div>
      ) : (
        <svg
          className="pointer-events-none absolute -bottom-1 right-0 hidden h-full max-h-80 text-secondary opacity-40 md:block"
          viewBox="0 0 320 240" fill="none" aria-hidden="true"
        >
          {[130, 100, 70].map((r) => (
            <path key={r} d={`M${200 - r} 240V${130}A${r} ${r} 0 0 1 ${200 + r} ${130}V240`} stroke="currentColor" strokeWidth="1.25" />
          ))}
        </svg>
      )}
      <Container className="relative z-20 py-14 sm:py-20 lg:py-24">
        <h1 className={`display hero-rise ${image ? "max-w-2xl" : "max-w-3xl"}`}>{title}</h1>
        {intro && (
          <p className={`lead hero-rise mt-5 text-on-dark/85 ${image ? "max-w-xl" : "max-w-2xl"}`} style={{ "--d": "120ms" }}>
            {intro}
          </p>
        )}
      </Container>
    </section>
  );
}
