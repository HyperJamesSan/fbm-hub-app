import { useEffect, useRef } from "react";

interface Props {
  /** Centro del nodo en coordenadas del contenedor padre. */
  centerRef: React.MutableRefObject<{ x: number; y: number } | null>;
  /** Posición global del atractor (token rojo) en coordenadas del contenedor. */
  attractorRef: React.MutableRefObject<{ x: number; y: number } | null>;
  /** Si el nodo está activo (intensifica el efecto). */
  active: boolean;
  /** Diámetro aproximado del anillo en px. */
  size?: number;
  /** Cantidad de partículas. */
  count?: number;
  className?: string;
}

/**
 * Anillo de partículas alrededor de un nodo del pipeline.
 * Mismo estilo del hero (rojas/grises con breathing) pero atraídas
 * por el token rojo que viaja por la pipeline.
 */
export default function NodeParticleRing({
  centerRef,
  attractorRef,
  active,
  size = 160,
  count = 36,
  className = "",
}: Props) {
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
      ox: number; oy: number; // home position (around ring) in canvas coords
      x: number; y: number;
      vx: number; vy: number;
      baseR: number;
      phase: number;
      color: string;
    };

    const colors = [
      "rgba(228,21,19,0.50)",
      "rgba(228,21,19,0.32)",
      "rgba(228,21,19,0.22)",
      "rgba(30,20,20,0.40)",
      "rgba(30,20,20,0.22)",
      "rgba(120,120,120,0.30)",
    ];

    // Distribuye partículas en un anillo centrado en el canvas
    const makeDots = (): P[] => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      const radius = size / 2;
      return Array.from({ length: count }).map((_, i) => {
        const baseAngle = (i / count) * Math.PI * 2;
        const jitter = ((i * 53) % 100) / 100 - 0.5;
        const angle = baseAngle + jitter * 0.25;
        const rJitter = ((i * 31) % 100) / 100 * 6 - 3; // ±3 px
        const r = radius + rJitter;
        const ox = cx + Math.cos(angle) * r;
        const oy = cy + Math.sin(angle) * r;
        return {
          ox, oy, x: ox, y: oy,
          vx: 0, vy: 0,
          baseR: 1 + ((i * 17) % 100) / 100 * 1.4, // 1 - 2.4 px
          phase: Math.random() * Math.PI * 2,
          color: colors[i % colors.length],
        };
      });
    };

    let dots = makeDots();
    const onResize = () => { dots = makeDots(); };
    ro.disconnect();
    const ro2 = new ResizeObserver(() => { resize(); onResize(); });
    ro2.observe(canvas);

    let t = 0;
    const tick = () => {
      t += 0.016;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Convertir coords globales del atractor a coords locales del canvas
      const center = centerRef.current;
      const attractor = attractorRef.current;
      let mx = -9999, my = -9999;
      let hasAttractor = false;
      if (center && attractor) {
        const cx = w / 2;
        const cy = h / 2;
        mx = cx + (attractor.x - center.x);
        my = cy + (attractor.y - center.y);
        hasAttractor = true;
      }

      const breath = Math.sin(t * 1.1) * 0.5 + 0.5;
      const intensity = active ? 1 : 0.55;

      for (const p of dots) {
        const indivBreath = Math.sin(t * 1.1 + p.phase * 0.4) * 2;
        let targetX = p.ox + indivBreath;
        let targetY = p.oy + indivBreath;

        if (hasAttractor) {
          const dx = mx - p.ox;
          const dy = my - p.oy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          // Solo se sienten atraídas si el token está razonablemente cerca
          const pull = Math.min(1, 220 / (dist + 60)) * (0.5 + breath * 0.3) * intensity;
          targetX = p.ox + dx * pull * 0.6 + indivBreath;
          targetY = p.oy + dy * pull * 0.6 + indivBreath;

          // Repulsión cercana
          const dxm = p.x - mx;
          const dym = p.y - my;
          const dm = Math.sqrt(dxm * dxm + dym * dym);
          if (dm < 30 && dm > 0) {
            const push = (30 - dm) / 30 * 0.5;
            p.vx += (dxm / dm) * push;
            p.vy += (dym / dm) * push;
          }
        }

        p.vx += (targetX - p.x) * 0.025;
        p.vy += (targetY - p.y) * 0.025;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        let r = p.baseR;
        if (hasAttractor) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          const influence = 200;
          if (d < influence) {
            const k = 1 - d / influence;
            r = p.baseR * (1 - k * 0.6);
          } else {
            r = p.baseR * 1.15;
          }
        }
        r *= 0.85 + breath * 0.3;
        if (active) r *= 1.15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.3, r), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro2.disconnect();
    };
  }, [centerRef, attractorRef, active, size, count]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: `-${size * 0.25}px`,
        width: `calc(100% + ${size * 0.5}px)`,
        height: `calc(100% + ${size * 0.5}px)`,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
