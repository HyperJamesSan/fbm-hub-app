import { useEffect, useState } from "react";

export function useCountUp(target: number, isVisible: boolean, duration = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, isVisible, duration]);

  return value;
}
