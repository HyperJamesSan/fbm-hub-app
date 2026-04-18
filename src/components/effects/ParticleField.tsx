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
  const mouseRef = useRef({ x: -9999, y: -9999 });

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

    type P = { x: number; y: number; vx: number; vy: number; r: number; color: string };

    const colors = variant === 'hero'
      ? ['rgba(228,21,19,0.10)', 'rgba(228,21,19,0.06)', 'rgba(30,20,20,0.09)', 'rgba(30,20,20,0.05)']
      : ['rgba(228,21,19,0.55)', 'rgba(228,21,19,0.35)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0.25)'];

    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: variant === 'dark-arc'
        ? canvas.height * 0.5 + Math.random() * canvas.height * 0.5
        : Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: variant === 'dark-arc' ? -(Math.random() * 0.6 + 0.1) : (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const dots: P[] = Array.from({ length: 200 }, make);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;
      for (const p of dots) {
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

        if (variant === 'dark-arc') {
          if (p.y < -5) {
            p.y = canvas.height + 5;
            p.x = canvas.width * 0.3 + Math.random() * canvas.width * 0.4;
            p.vy = -(Math.random() * 0.6 + 0.1);
          }
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
        } else {
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
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
