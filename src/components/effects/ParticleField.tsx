import { useEffect, useRef } from 'react';

interface Props {
  variant?: 'hero' | 'dark-arc';
  className?: string;
  // legacy props (ignored, kept for backwards compatibility)
  interactive?: boolean;
  isActive?: boolean;
  tone?: string;
}

/**
 * Antigravity-style flow field:
 *  - Particles are short oriented dashes
 *  - Velocity is driven by a smooth pseudo-noise vector field (curl-like)
 *  - Mouse adds a soft, gentle attraction (no hard repel)
 *  - Multi-color confetti palette
 */
export default function ParticleField({ variant = 'hero', className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
    window.addEventListener('resize', resize);

    type P = {
      x: number; y: number;
      vx: number; vy: number;
      len: number;       // dash length
      width: number;     // stroke width
      color: string;
      life: number;      // current life
      maxLife: number;   // when to respawn
      seed: number;      // unique offset for noise
    };

    // Antigravity-style confetti palette (warm + cool accents) for hero
    const heroPalette = [
      'rgba(228, 21, 19, 0.55)',   // FBM red
      'rgba(255, 138, 76, 0.55)',  // orange
      'rgba(255, 196, 61, 0.55)',  // amber
      'rgba(120, 86, 255, 0.50)',  // violet
      'rgba(56, 132, 255, 0.50)',  // blue
      'rgba(40, 40, 50, 0.45)',    // ink
    ];
    const darkPalette = [
      'rgba(228,21,19,0.55)', 'rgba(228,21,19,0.35)',
      'rgba(255,255,255,0.45)', 'rgba(255,255,255,0.25)',
    ];
    const palette = variant === 'hero' ? heroPalette : darkPalette;

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const spawn = (p?: P): P => {
      const x = Math.random() * W();
      const y = variant === 'dark-arc'
        ? H() * 0.5 + Math.random() * H() * 0.5
        : Math.random() * H();
      const base: P = {
        x, y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        len: variant === 'hero' ? 4 + Math.random() * 8 : 0,
        width: variant === 'hero' ? 1 + Math.random() * 1.6 : 1,
        color: palette[Math.floor(Math.random() * palette.length)],
        life: 0,
        maxLife: 220 + Math.random() * 260,
        seed: Math.random() * 1000,
      };
      if (p) Object.assign(p, base);
      return base;
    };

    const count = variant === 'hero' ? 260 : 200;
    const dots: P[] = Array.from({ length: count }, () => spawn());

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999, active: false }; };
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    // Smooth pseudo-noise based on summed sines — cheap, organic, deterministic per particle seed
    const flow = (x: number, y: number, t: number, seed: number) => {
      const s = seed * 0.013;
      const a =
        Math.sin(x * 0.0035 + t * 0.35 + s) +
        Math.sin(y * 0.0029 - t * 0.27 + s * 1.7) * 0.8 +
        Math.sin((x + y) * 0.0022 + t * 0.18) * 0.6;
      const angle = a * Math.PI; // direction
      return { ax: Math.cos(angle), ay: Math.sin(angle) };
    };

    let t = 0;
    const tick = () => {
      t += 0.01;
      ctx.clearRect(0, 0, W(), H());
      const { x: mx, y: my, active } = mouseRef.current;

      ctx.lineCap = 'round';

      for (const p of dots) {
        if (variant === 'hero') {
          // Flow field force
          const f = flow(p.x, p.y, t, p.seed);
          const force = 0.06;
          p.vx += f.ax * force;
          p.vy += f.ay * force;

          // Soft mouse attraction (subtle)
          if (active) {
            const dx = mx - p.x;
            const dy = my - p.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            const reach = 320;
            if (d < reach && d > 0.1) {
              const k = (1 - d / reach) * 0.05; // gentle pull
              p.vx += (dx / d) * k;
              p.vy += (dy / d) * k;
            }
          }

          // Damping → terminal smooth drift
          p.vx *= 0.94;
          p.vy *= 0.94;

          // Clamp speed for elegance
          const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const max = 0.9;
          if (sp > max) { p.vx = (p.vx / sp) * max; p.vy = (p.vy / sp) * max; }

          p.x += p.vx;
          p.y += p.vy;
          p.life += 1;

          // Respawn off-screen or after maxLife
          if (
            p.x < -20 || p.x > W() + 20 ||
            p.y < -20 || p.y > H() + 20 ||
            p.life > p.maxLife
          ) {
            spawn(p);
            // reposition near edges occasionally for continuous flow
            if (Math.random() < 0.5) {
              const side = Math.floor(Math.random() * 4);
              if (side === 0) { p.x = -10; p.y = Math.random() * H(); }
              else if (side === 1) { p.x = W() + 10; p.y = Math.random() * H(); }
              else if (side === 2) { p.x = Math.random() * W(); p.y = -10; }
              else { p.x = Math.random() * W(); p.y = H() + 10; }
            }
          }

          // Draw as oriented dash along velocity
          const lifeFade = Math.min(1, p.life / 30) * Math.min(1, (p.maxLife - p.life) / 60);
          const angle = Math.atan2(p.vy, p.vx);
          const len = p.len * (0.6 + sp * 0.8);
          const hx = Math.cos(angle) * len * 0.5;
          const hy = Math.sin(angle) * len * 0.5;

          ctx.globalAlpha = lifeFade;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.width;
          ctx.beginPath();
          ctx.moveTo(p.x - hx, p.y - hy);
          ctx.lineTo(p.x + hx, p.y + hy);
          ctx.stroke();
        } else {
          // dark-arc: original behavior
          const dx = p.x - mx;
          const dy = p.y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100 && d > 0) {
            const f2 = (100 - d) / 100;
            p.vx += (dx / d) * f2 * 0.35;
            p.vy += (dy / d) * f2 * 0.35;
          }
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.vy -= 0.01;
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -5) {
            p.y = H() + 5;
            p.x = W() * 0.3 + Math.random() * W() * 0.4;
            p.vy = -(Math.random() * 0.6 + 0.1);
          }
          if (p.x < 0) p.x = W();
          if (p.x > W()) p.x = 0;

          ctx.globalAlpha = 1;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
