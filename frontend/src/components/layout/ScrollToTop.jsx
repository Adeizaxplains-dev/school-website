import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * On navigation: jump to the top of the new page (or to its #anchor),
 * and move keyboard focus to the main content so screen-reader users land in the right place.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        // wait one frame so the page has rendered
        requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
      }
    }
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return null;
}
