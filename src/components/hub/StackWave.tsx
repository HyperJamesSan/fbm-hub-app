import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
  slug: string;
  name: string;
  role: string;
  status: "live" | "pending";
};

const ITEMS: Item[] = [
  { slug: "n8n", name: "n8n", role: "Workflow Orchestration", status: "live" },
  { slug: "claude", name: "Claude API", role: "AI Classification", status: "live" },
  { slug: "dynamics-bc", name: "Business Central", role: "ERP Integration", status: "pending" },
  { slug: "dropbox", name: "Dropbox Business", role: "Document Storage", status: "live" },
  { slug: "microsoft", name: "Microsoft 365", role: "AP Inbox · accounts.payable@fbm.mt", status: "live" },
  { slug: "doppler", name: "Doppler", role: "Secrets Vault", status: "live" },
  { slug: "power-bi", name: "Power BI", role: "Finance Reporting", status: "live" },
  { slug: "notion", name: "Notion", role: "Audit & Operations", status: "live" },
];

const BUBBLE = 92; // px diameter desktop
const BUBBLE_SM = 72;

export default function StackWave() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const offsets = useRef(ITEMS.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 })));
  const mouse = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMq = () => setIsMobile(mq.matches);
    const updateRm = () => setReduced(rm.matches);
    updateMq();
    updateRm();
    mq.addEventListener("change", updateMq);
    rm.addEventListener("change", updateRm);
    return () => {
      mq.removeEventListener("change", updateMq);
      rm.removeEventListener("change", updateRm);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    const REPEL_RADIUS = 150;
    const REPEL_STRENGTH = 28;
    const LERP = 0.12;

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const cRect = container.getBoundingClientRect();
      ITEMS.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        // idle bobbing
        const phase = i * 0.7;
        const baseY = Math.sin(t * 1.1 + phase) * 6;
        const baseX = Math.cos(t * 0.6 + phase) * 3;

        let tx = baseX;
        let ty = baseY;

        if (mouse.current.active) {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2 - cRect.left;
          const cy = r.top + r.height / 2 - cRect.top;
          const dx = cx - mouse.current.x;
          const dy = cy - mouse.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.0001) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            const nx = dx / dist;
            const ny = dy / dist;
            tx += nx * force;
            ty += ny * force;
          }
        }

        const o = offsets.current[i];
        o.tx = tx;
        o.ty = ty;
        o.x += (o.tx - o.x) * LERP;
        o.y += (o.ty - o.y) * LERP;
        el.style.transform = `translate3d(${o.x.toFixed(2)}px, ${o.y.toFixed(2)}px, 0)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  const handleMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const c = containerRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
  };
  const handleLeave = () => {
    mouse.current.active = false;
  };

  // Layout: positions on a sine wave
  const rows = isMobile ? 2 : 1;
  const perRow = ITEMS.length / rows;
  const containerHeight = isMobile ? 320 : 220;
  const bubble = isMobile ? BUBBLE_SM : BUBBLE;
  const amplitude = isMobile ? 18 : 32;

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="relative w-full select-none"
        style={{ height: containerHeight }}
      >
        {ITEMS.map((item, i) => {
          const row = Math.floor(i / perRow);
          const colIndex = i % perRow;
          // x percentage: distribute evenly with margin
          const xPct = ((colIndex + 0.5) / perRow) * 100;
          // y baseline per row + sine offset
          const rowCenter = rows === 1
            ? containerHeight / 2
            : (containerHeight / (rows + 1)) * (row + 1);
          const waveY = Math.sin((colIndex / perRow) * Math.PI * 2) * amplitude;
          const top = rowCenter + waveY - bubble / 2;

          return (
            <div
              key={item.slug}
              className="absolute"
              style={{
                left: `calc(${xPct}% - ${bubble / 2}px)`,
                top,
                width: bubble,
                height: bubble,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            >
              <div
                ref={(el) => (itemRefs.current[i] = el)}
                className="relative w-full h-full will-change-transform"
                style={{ transition: reduced ? undefined : "none" }}
              >
                <div
                  className="w-full h-full rounded-full bg-white border flex items-center justify-center transition-shadow duration-300"
                  style={{
                    borderColor: "rgba(15,23,42,0.08)",
                    boxShadow:
                      hovered === i
                        ? "0 18px 40px -12px rgba(15,23,42,0.22), 0 4px 10px -2px rgba(15,23,42,0.08)"
                        : "0 8px 22px -10px rgba(15,23,42,0.18), 0 2px 6px -2px rgba(15,23,42,0.06)",
                  }}
                >
                  <img
                    src={`/logos/${item.slug}.svg`}
                    alt={item.name}
                    className="object-contain"
                    style={{ width: bubble * 0.55, height: bubble * 0.55 }}
                    draggable={false}
                  />
                </div>
                {/* status dot */}
                <span
                  className="absolute top-1 right-1 w-3 h-3 rounded-full ring-2 ring-white"
                  style={{
                    background: item.status === "live" ? "#22C55E" : "#F59E0B",
                    boxShadow:
                      item.status === "live"
                        ? "0 0 0 4px rgba(34,197,94,0.15)"
                        : "0 0 0 4px rgba(245,158,11,0.15)",
                  }}
                />

                {/* tooltip */}
                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                      style={{ bottom: bubble + 12, whiteSpace: "nowrap" }}
                    >
                      <div
                        className="rounded-xl bg-[#0F172A] text-white px-3.5 py-2 shadow-lg"
                        style={{ boxShadow: "0 12px 30px -10px rgba(15,23,42,0.45)" }}
                      >
                        <div className="font-barlow font-700 text-[13px] leading-tight">{item.name}</div>
                        <div className="font-barlow font-400 text-[11px] text-white/65 mt-0.5">{item.role}</div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: item.status === "live" ? "#22C55E" : "#F59E0B" }}
                          />
                          <span
                            className="font-barlow font-700 text-[9px] uppercase tracking-[0.18em]"
                            style={{ color: item.status === "live" ? "#22C55E" : "#F59E0B" }}
                          >
                            {item.status === "live" ? "Live" : "Pending"}
                          </span>
                        </div>
                      </div>
                      <div
                        className="w-2 h-2 bg-[#0F172A] rotate-45 mx-auto -mt-1"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center font-barlow font-400 text-xs md:text-sm text-[#0F172A]/45 tracking-wide">
        n8n · Claude · BC · Dropbox · M365 · Doppler · Power BI · Notion
      </div>
    </div>
  );
}
