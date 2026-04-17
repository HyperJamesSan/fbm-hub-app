import { useEffect, useRef } from "react";

type Variant = "hero" | "dark-arc" | "card-burst";

interface Props {
  variant: Variant;
  interactive?: boolean;
  isActive?: boolean;
  className?: string;
  /** Hero dot color override: "red" (default) or "white" for dark hero */
  tone?: "red" | "white";
}

const RED = "228, 21, 19";
const WHITE = "255, 255, 255";

export default function ParticleField({ variant, interactive = false, isActive = false, className, tone = "red" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const burstRef = useRef<number>(0);

  useEffect(() => {
    if (variant === "card-burst" && isActive) {
      burstRef.current = performance.now();
    }
  }, [isActive, variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    type P = {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; color: string; life?: number; born?: number;
    };
    let particles: P[] = [];

    const seed = () => {
      particles = [];
      if (variant === "hero") {
        const count = Math.min(120, Math.floor((w * h) / 9000));
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: 1.2 + Math.random() * 1.6,
            alpha: 0.2 + Math.random() * 0.2,
            color: variant === "hero" ? WHITE : (tone === "white" ? WHITE : RED),
          });
        }
      } else if (variant === "dark-arc") {
        // start empty, spawn in loop
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = null; };

    if (interactive) {
      canvas.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", onLeave);
    }

    const spawnArc = () => {
      // spawn a few particles per frame at base center
      const base = { x: w / 2, y: h - 10 };
      for (let i = 0; i < 2; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.55; // narrow upward cone
        const speed = 0.4 + Math.random() * 1.6;
        particles.push({
          x: base.x + (Math.random() - 0.5) * 30,
          y: base.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1 + Math.random() * 2,
          alpha: 0.1 + Math.random() * 0.5,
          color: Math.random() < 0.55 ? RED : "255, 255, 255",
          life: 2200 + Math.random() * 1500,
          born: performance.now(),
        });
      }
      if (particles.length > 280) particles.splice(0, particles.length - 280);
    };

    const drawHero = () => {
      ctx.clearRect(0, 0, w, h);
      const m = mouseRef.current;
      for (const p of particles) {
        if (m) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 80 * 80 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (80 - d) / 80;
            p.vx += (dx / d) * force * 0.4;
            p.vy += (dy / d) * force * 0.4;
          }
        }
        // damping
        p.vx *= 0.96;
        p.vy *= 0.96;
        // restore drift
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        p.x += p.vx;
        p.y += p.vy;
        // wrap
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawArc = () => {
      ctx.clearRect(0, 0, w, h);
      spawnArc();
      const now = performance.now();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - (p.born ?? now);
        const t = age / (p.life ?? 1);
        if (t >= 1) { particles.splice(i, 1); continue; }
        // accelerate upward (faster at top)
        p.vy -= 0.012;
        p.x += p.vx;
        p.y += p.vy;
        const fade = (1 - t) * p.alpha;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color}, ${fade})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawBurst = () => {
      ctx.clearRect(0, 0, w, h);
      const now = performance.now();
      const elapsed = now - burstRef.current;
      if (burstRef.current === 0 || elapsed > 800) return;
      const cx = w / 2, cy = h / 2;
      const t = elapsed / 800;
      const N = 25;
      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2 + (burstRef.current % 6.28);
        const dist = t * 90;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${RED}, ${1 - t})`;
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (variant === "hero") drawHero();
      else if (variant === "dark-arc") drawArc();
      else drawBurst();
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) {
        canvas.removeEventListener("mousemove", onMove);
        canvas.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [variant, interactive, tone]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: variant === "hero" && interactive ? "auto" : "none",
        overflow: "visible",
      }}
    />
  );
}
