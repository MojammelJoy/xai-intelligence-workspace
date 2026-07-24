"use client";

import { useEffect, useState } from "react";

// Detection band sits just below the fixed header and stops 60% down the
// viewport, so exactly one stacked section is "intersecting" at a time.
const ROOT_MARGIN = "-100px 0px -60% 0px";

export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = sectionIds.join(",");

  useEffect(() => {
    const ids = key.split(",").filter(Boolean);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
