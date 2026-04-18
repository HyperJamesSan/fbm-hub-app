import { useEffect, useRef } from 'react';

interface Props {
  variant?: 'hero' | 'dark-arc';
  className?: string;
  interactive?: boolean;
  isActive?: boolean;
  tone?: string;
}

export default function ParticleField({ variant = 'hero', className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999, active: false });

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
      ox: number; oy: number;
      vx: number; vy: number;
      baseR: number;
      phase: number;
      color: string;
    };

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
        vx: 0, vy: 0,
        baseR: variant === 'hero' ? Math.random() * 1.8 + 1.2 : Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const count = variant === 'hero' ? 300 : 200;
    const dots: P[] = Array.from({ length: count }, make);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.tx = e.clientX - rect.left;
      mouseRef.current.ty = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => { mouseRef.current.active = false; };
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse follow (lerp) for fluid jellyfish trail
      const m = mouseRef.current;
      if (m.x < -1000) { m.x = m.tx; m.y = m.ty; }
      m.x += (m.tx - m.x) * 0.08;
      m.y += (m.ty - m.y) * 0.08;
      const { x: mx, y: my, active } = m;

      for (const p of dots) {
        if (variant === 'hero') {
          // Synchronized breathing — all particles pulse together (jellyfish)
          const breath = Math.sin(t * 1.1) * 0.5 + 0.5; // 0..1 unison pulse
          const indivBreath = Math.sin(t * 1.1 + p.phase * 0.4) * 4;

          // Magnetic attraction toward cursor — all particles drawn in
          let targetX = p.ox + indivBreath;
          let targetY = p.oy + indivBreath;

          if (active) {
            const dx = mx - p.ox;
            const dy = my - p.oy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            // Attraction strength falls off softly with distance
            const pull = Math.min(1, 320 / (dist + 80)) * (0.55 + breath * 0.25);
            targetX = p.ox + dx * pull * 0.5 + indivBreath;
            targetY = p.oy + dy * pull * 0.5 + indivBreath;
          }

          // Spring toward target — synchronized flow
          p.vx += (targetX - p.x) * 0.022;
          p.vy += (targetY - p.y) * 0.022;

          // Repulsion from neighbors — keeps spacing so particles don't collapse
          if (active) {
            const dxm = p.x - mx;
            const dym = p.y - my;
            const dm = Math.sqrt(dxm * dxm + dym * dym);
            if (dm < 60 && dm > 0) {
              const push = (60 - dm) / 60 * 0.4;
              p.vx += (dxm / dm) * push;
              p.vy += (dym / dm) * push;
            }
          }

          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx;
          p.y += p.vy;

          // Size: small near cursor, growing outward (jellyfish from above)
          let r = p.baseR;
          if (active) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const d = Math.sqrt(dx * dx + dy * dy);
            const influence = 320;
            if (d < influence) {
              const k = 1 - d / influence; // 1 near, 0 far
              r = p.baseR * (1 - k * 0.8); // shrink up to 80% near cursor
            } else {
              r = p.baseR * 1.25; // larger when far
            }
          }
          // Unison pulse breathing
          r *= 0.85 + breath * 0.3;

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.2, r), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // dark-arc unchanged
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
