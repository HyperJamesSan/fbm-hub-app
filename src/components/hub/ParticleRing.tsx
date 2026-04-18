import { useMemo } from "react";

/**
 * Anillo de partículas (rojas + grises) que se expande desde el centro
 * para indicar el nodo activo del pipeline. Inspirado en el campo de
 * partículas del hero del HUB pero a escala de nodo.
 */
export default function ParticleRing({
  count = 28,
  active,
}: {
  count?: number;
  active: boolean;
}) {
  // Generamos posiciones deterministas (no se re-randomizan en cada render)
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // distribuir alrededor del círculo con jitter
      const baseAngle = (i / count) * Math.PI * 2;
      const jitter = ((i * 53) % 100) / 100 - 0.5; // determinista
      const angle = baseAngle + jitter * 0.25;
      const size = 1.5 + ((i * 31) % 10) / 10 * 1.8; // 1.5 - 3.3 px
      const isRed = i % 3 !== 0; // ~2/3 rojas, 1/3 grises
      const delay = ((i * 17) % 100) / 100 * 0.8; // 0 - 0.8s
      return { angle, size, isRed, delay, key: i };
    });
  }, [count]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {particles.map((p) => {
        const tx = Math.cos(p.angle);
        const ty = Math.sin(p.angle);
        return (
          <span
            key={p.key}
            className="absolute top-1/2 left-1/2 rounded-full particle-burst"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.isRed ? "#E41513" : "#9CA3AF",
              // CSS vars consumidas por la animación (ver index.css)
              ["--tx" as string]: `${tx}`,
              ["--ty" as string]: `${ty}`,
              animationDelay: `${p.delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
