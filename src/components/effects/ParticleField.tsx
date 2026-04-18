import { useEffect, useRef } from 'react';

interface Props {
  variant?: 'hero' | 'dark-arc';
  className?: string;
  // legacy props (ignored, kept for backwards compatibility)
  interactive?: boolean;
  isActive?: boolean;
  tone?: string;
}

export default function ParticleField({ variant = 'hero', className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type P = {
      x: number; y: number;
      ox: number; oy: number; // origin (rest position)
      vx: number; vy: number;
      baseR: number;
      phase: number; // jellyfish pulse phase
      color: string;
    };

    // 25% lower opacity than previous hero values
    const colors = variant === 'hero'
      ? ['rgba(228,21,19,0.41)', 'rgba(228,21,19,0.30)', 'rgba(228,21,19,0.22)', 'rgba(30,20,20,0.34)', 'rgba(30,20,20,0.22)']
      : ['rgba(228,21,19,0.55)', 'rgba(228,21,19,0.35)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0.25)'];

    const make = (): P => {
      const x = Math.random() * canvas.width;
      const y = variant === 'dark-arc'
        ? canvas.height * 0.5 + Math.random() * canvas.height * 0.5
        : Math.random() * canvas.height;
      return {
        x, y, ox: x, oy: y,
        vx: (Math.random() - 0.5) * 0.2,
        vy: variant === 'dark-arc' ? -(Math.random() * 0.6 + 0.1) : (Math.random() - 0.5) * 0.2,
        baseR: variant === 'hero' ? Math.random() * 1.8 + 1.2 : Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const count = variant === 'hero' ? 300 : 200;
    const dots: P[] = Array.from({ length: count }, make);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999, active: false }; };
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my, active } = mouseRef.current;

      for (const p of dots) {
        if (variant === 'hero') {
          // Jellyfish breathing — gentle global sway driven by mouse
          const swayX = active ? (mx - canvas.width / 2) * 0.04 : 0;
          const swayY = active ? (my - canvas.height / 2) * 0.04 : 0;
          const breathe = Math.sin(t * 1.2 + p.phase) * 6;

          const targetX = p.ox + swayX + Math.cos(p.phase + t * 0.8) * breathe;
          const targetY = p.oy + swayY + Math.sin(p.phase + t * 0.8) * breathe;

          // Spring toward target
          p.vx += (targetX - p.x) * 0.012;
          p.vy += (targetY - p.y) * 0.012;
          p.vx *= 0.88;
          p.vy *= 0.88;
          p.x += p.vx;
          p.y += p.vy;

          // Size: closer to cursor → smaller, farther → larger
          let r = p.baseR;
          if (active) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const d = Math.sqrt(dx * dx + dy * dy);
            const influence = 260;
            if (d < influence) {
              const k = 1 - d / influence; // 1 near, 0 far
              r = p.baseR * (1 - k * 0.75); // shrink up to 75% near cursor
            } else {
              r = p.baseR * 1.15; // slightly larger when far
            }
          }
          // pulse
          r *= 0.9 + Math.sin(t * 1.6 + p.phase) * 0.15;

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.2, r), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // dark-arc: original behavior
          const dx = p.x - mx;
          const dy = p.y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100 && d > 0) {
            const f = (100 - d) / 100;
            p.vx += (dx / d) * f * 0.35;
            p.vy += (dy / d) * f * 0.35;
          }
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < -5) {
            p.y = canvas.height + 5;
            p.x = canvas.width * 0.3 + Math.random() * canvas.width * 0.4;
            p.vy = -(Math.random() * 0.6 + 0.1);
          }
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseR, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      }
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
