import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll to in-page anchors after client navigations (e.g. /#for-reviewers).
 */
export function HashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      return true;
    };

    if (scrollToTarget()) return;

    const t = window.setTimeout(() => {
      scrollToTarget();
    }, 80);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  return null;
}
