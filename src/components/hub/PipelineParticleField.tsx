import { useEffect, useRef } from "react";

interface Props {
  /** Ref que entrega la posición actual del atractor (token rojo del pipeline). */
  attractorRef: React.MutableRefObject<{ x: number; y: number } | null>;
  className?: string;
}

/**
 * Campo de partículas inspirado en el hero del HUB, pero en lugar de seguir
 * al cursor, son atraídas por el punto rojo que viaja por el pipeline.
 */
export default function PipelineParticleField({ attractorRef, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type P = {
      x: number; y: number;
      ox: number; oy: number;
      vx: number; vy: number;
      baseR: number;
      phase: number;
      color: string;
    };

    const colors = [
      "rgba(228,21,19,0.45)",
      "rgba(228,21,19,0.30)",
      "rgba(228,21,19,0.20)",
      "rgba(30,20,20,0.35)",
      "rgba(30,20,20,0.22)",
      "rgba(120,120,120,0.28)",
    ];

    const make = (): P => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const x = Math.random() * w;
      const y = Math.random() * h;
      return {
        x, y, ox: x, oy: y,
        vx: 0, vy: 0,
        baseR: Math.random() * 1.4 + 0.8,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const count = 220;
    const dots: P[] = Array.from({ length: count }, make);

    // Punto suavizado (lerp) hacia el atractor
    const smooth = { x: -9999, y: -9999 };

    let t = 0;
    const tick = () => {
      t += 0.016;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const target = attractorRef.current;
      const hasTarget = !!target;
      if (target) {
        if (smooth.x < -1000) { smooth.x = target.x; smooth.y = target.y; }
        smooth.x += (target.x - smooth.x) * 0.15;
        smooth.y += (target.y - smooth.y) * 0.15;
      }
      const mx = smooth.x;
      const my = smooth.y;

      const breath = Math.sin(t * 1.1) * 0.5 + 0.5;

      for (const p of dots) {
        const indivBreath = Math.sin(t * 1.1 + p.phase * 0.4) * 3;

        let targetX = p.ox + indivBreath;
        let targetY = p.oy + indivBreath;

        if (hasTarget) {
          const dx = mx - p.ox;
          const dy = my - p.oy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          // Attraction strength falls off softly with distance
          const pull = Math.min(1, 280 / (dist + 80)) * (0.55 + breath * 0.25);
          targetX = p.ox + dx * pull * 0.55 + indivBreath;
          targetY = p.oy + dy * pull * 0.55 + indivBreath;
        }

        p.vx += (targetX - p.x) * 0.022;
        p.vy += (targetY - p.y) * 0.022;

        // Pequeña repulsión al estar muy cerca del atractor
        if (hasTarget) {
          const dxm = p.x - mx;
          const dym = p.y - my;
          const dm = Math.sqrt(dxm * dxm + dym * dym);
          if (dm < 38 && dm > 0) {
            const push = (38 - dm) / 38 * 0.5;
            p.vx += (dxm / dm) * push;
            p.vy += (dym / dm) * push;
          }
        }

        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        let r = p.baseR;
        if (hasTarget) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          const influence = 260;
          if (d < influence) {
            const k = 1 - d / influence;
            r = p.baseR * (1 - k * 0.7);
          } else {
            r = p.baseR * 1.2;
          }
        }
        r *= 0.85 + breath * 0.3;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.2, r), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [attractorRef]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
