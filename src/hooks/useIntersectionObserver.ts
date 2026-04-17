import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.2,
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setIsVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
