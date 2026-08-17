import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref and toggles the
 * `pf-in` class (defined in tokens.css) once the element enters the
 * viewport. Reveal is one-shot: it does not re-hide on scroll-out.
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      node.classList.add("pf-in");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("pf-in");
          observer.unobserve(node);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
