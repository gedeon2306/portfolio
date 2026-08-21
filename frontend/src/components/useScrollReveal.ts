import { useCallback, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref and toggles the
 * `pf-in` class (defined in tokens.css) once the element enters the
 * viewport. Reveal is one-shot: it does not re-hide on scroll-out.
 *
 * Uses a callback ref instead of useRef + useEffect so that the observer
 * is (re)attached whenever the underlying DOM node actually mounts —
 * including when it appears later due to conditional rendering
 * (e.g. loading -> skeleton -> real content).
 */
export function useScrollReveal<T extends HTMLElement>(threshold = 0.15) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: T | null) => {
      // Clean up previous observer before (re)attaching
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

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
      observerRef.current = observer;
    },
    [threshold]
  );

  return ref;
}