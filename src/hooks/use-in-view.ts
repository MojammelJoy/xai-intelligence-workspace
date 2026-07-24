"use client";

import { useEffect, useState, type RefObject } from "react";

interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number;
}

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px", threshold = 0 }: UseInViewOptions = {},
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(!!entry?.isIntersecting);
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return isInView;
}
