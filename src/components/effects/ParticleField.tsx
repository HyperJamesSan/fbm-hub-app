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
      // On resize, recenter mouse so the jellyfish silhouette is visible at rest
      if (!mouseRef.current.active) {
        mouseRef.current.tx = canvas.width / 2;
        mouseRef.current.ty = canvas.height / 2;
        mouseRef.current.x = canvas.width / 2;
        mouseRef.current.y = canvas.height / 2;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    type P = {
      // Polar identity around the jellyfish center
      angle: number;       // base angular position
      radius: number;      // base radial distance from center (defines density curve)
      jitter: number;      // small per-particle radial jitter
      angJitter: number;   // angular jitter for organic asymmetry
      phase: number;       // breathing phase offset
      // Render position (interpolated)
      x: number; y: number;
      vx: number; vy: number;
      baseR: number;       // base dot size
      color: string;
    };

    const colors = variant === 'hero'
      ? ['rgba(228,21,19,0.41)', 'rgba(228,21,19,0.30)', 'rgba(228,21,19,0.22)', 'rgba(30,20,20,0.34)', 'rgba(30,20,20,0.22)']
      : ['rgba(228,21,19,0.55)', 'rgba(228,21,19,0.35)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0.25)'];

    const count = variant === 'hero' ? 320 : 200;

    // Jellyfish geometry — radial distribution with HOLLOW CORE and density falling off outward
    const coreEmpty = 70;     // empty radius near cursor (the "void/core")
    const bellInner = 90;     // start of dense ring
    const bellOuter = 320;    // outer reach of the silhouette

    const makeHero = (): P => {
      // Bias distribution: more particles in the mid-ring, fewer at the very edge
      // sqrt() for area-uniform; pow >1 pushes density outward from the empty core
      const u = Math.pow(Math.random(), 0.65); // outward bias
      const radius = bellInner + (bellOuter - bellInner) * u;
      const angle = Math.random() * Math.PI * 2;
      return {
        angle,
        radius,
        jitter: (Math.random() - 0.5) * 18,
        angJitter: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        x: 0, y: 0,
        vx: 0, vy: 0,
        baseR: Math.random() * 1.2 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const makeArc = (): P => {
      const x = Math.random() * canvas.width;
      const y = canvas.height * 0.5 + Math.random() * canvas.height * 0.5;
      return {
        angle: 0, radius: 0, jitter: 0, angJitter: 0,
        phase: Math.random() * Math.PI * 2,
        x, y, vx: 0, vy: 0,
        baseR: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const dots: P[] = Array.from({ length: count }, variant === 'hero' ? makeHero : makeArc);

    // Initialize hero particles at their target positions (so they don't fly in from 0,0)
    if (variant === 'hero') {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      for (const p of dots) {
        p.x = cx + Math.cos(p.angle) * p.radius;
        p.y = cy + Math.sin(p.angle) * p.radius;
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.tx = e.clientX - rect.left;
      mouseRef.current.ty = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      // Drift back to center so the silhouette stays visible
      mouseRef.current.tx = canvas.width / 2;
      mouseRef.current.ty = canvas.height / 2;
    };
    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    let t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse follow
      const m = mouseRef.current;
      if (m.x < -1000) {
        m.x = canvas.width / 2;
        m.y = canvas.height / 2;
        m.tx = m.x; m.ty = m.y;
      }
      m.x += (m.tx - m.x) * 0.07;
      m.y += (m.ty - m.y) * 0.07;
      const cx = m.x;
      const cy = m.y;

      if (variant === 'hero') {
        // Global breathing — slow, unison expand/contract
        const breath = Math.sin(t * 0.7) * 0.5 + 0.5; // 0..1
        const breathScale = 0.92 + breath * 0.16;     // 0.92..1.08 radial expansion
        const microPulse = Math.sin(t * 1.8) * 0.04;  // tiny secondary heartbeat

        for (const p of dots) {
          // Per-particle breathing offset — keeps unison but with subtle organic variance
          const personal = Math.sin(t * 0.7 + p.phase * 0.3) * 4;

          // Target polar position around current cursor center
          const targetRadius = (p.radius + p.jitter + personal) * (breathScale + microPulse);
          const targetAngle = p.angle + p.angJitter * Math.sin(t * 0.4 + p.phase);

          const tx = cx + Math.cos(targetAngle) * targetRadius;
          const ty = cy + Math.sin(targetAngle) * targetRadius;

          // Spring toward target — synchronized fluid motion
          p.vx += (tx - p.x) * 0.035;
          p.vy += (ty - p.y) * 0.035;
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx;
          p.y += p.vy;

          // Enforce empty core — push out any particle that drifts inside
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < coreEmpty) {
            const push = (coreEmpty - dist) / coreEmpty;
            p.x += (dx / dist) * push * 6;
            p.y += (dy / dist) * push * 6;
          }

          // Size: smaller near cursor (sparse void), grows outward (denser rim)
          const sizeRatio = Math.min(1, Math.max(0, (dist - coreEmpty) / (bellOuter - coreEmpty)));
          const r = p.baseR * (0.4 + sizeRatio * 1.4) * (0.9 + breath * 0.2);

          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.2, r), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      } else {
        // dark-arc unchanged
        for (const p of dots) {
          const dx = p.x - cx;
          const dy = p.y - cy;
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
