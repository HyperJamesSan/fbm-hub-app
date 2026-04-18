import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow,
  Brain,
  Database,
  Cloud,
  Mail,
  Lock,
  BarChart3,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

type Item = {
  name: string;
  role: string;
  status: "live" | "pending";
  Icon: LucideIcon;
};

const ITEMS: Item[] = [
  { name: "n8n",              role: "Workflow Orchestration", status: "live",    Icon: Workflow },
  { name: "Claude API",       role: "AI Classification",      status: "live",    Icon: Brain },
  { name: "Business Central", role: "ERP Integration",        status: "pending", Icon: Database },
  { name: "Dropbox Business", role: "Document Storage",       status: "live",    Icon: Cloud },
  { name: "Microsoft 365",    role: "AP Inbox",               status: "live",    Icon: Mail },
  { name: "Doppler",          role: "Secrets Vault",          status: "live",    Icon: Lock },
  { name: "Power BI",         role: "Finance Reporting",      status: "live",    Icon: BarChart3 },
  { name: "Notion",           role: "Audit & Operations",     status: "live",    Icon: BookOpen },
];

const ICON_COLOR = "#0F172A";
const BUBBLE_BG = "#FFFFFF";

export default function StackWave() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const a = () => setIsMobile(mq.matches);
    const b = () => setReduced(rm.matches);
    a(); b();
    mq.addEventListener("change", a);
    rm.addEventListener("change", b);
    return () => { mq.removeEventListener("change", a); rm.removeEventListener("change", b); };
  }, []);

  const bubble = isMobile ? 64 : 86;
  const containerHeight = isMobile ? 200 : 240;
  const amplitude = isMobile ? 28 : 44;

  // Traveling wave animation (right -> left)
  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    // Slow, delicate wave traveling right -> left
    const SPEED = 0.18; // cycles per second (very gentle)
    const PHASE_STEP = 0.55; // radians between items

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      ITEMS.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        // Negative direction so wave appears to travel from right to left
        const phase = -t * Math.PI * 2 * SPEED + i * PHASE_STEP;
        const y = Math.sin(phase) * amplitude;
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [reduced, amplitude]);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full select-none"
        style={{ height: containerHeight }}
      >
        {ITEMS.map((item, i) => {
          const xPct = ((i + 0.5) / ITEMS.length) * 100;
          const Icon = item.Icon;
          return (
            <div
              key={item.name}
              className="absolute top-1/2"
              style={{
                left: `calc(${xPct}% - ${bubble / 2}px)`,
                marginTop: -bubble / 2,
                width: bubble,
                height: bubble,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
            >
              <div
                ref={(el) => (itemRefs.current[i] = el)}
                className="relative w-full h-full will-change-transform"
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center transition-shadow duration-300"
                  style={{
                    background: BUBBLE_BG,
                    border: "1px solid rgba(15,23,42,0.08)",
                    boxShadow:
                      hovered === i
                        ? "0 22px 44px -14px rgba(15,23,42,0.25), 0 6px 14px -4px rgba(15,23,42,0.10)"
                        : "0 10px 26px -12px rgba(15,23,42,0.20), 0 3px 8px -3px rgba(15,23,42,0.06)",
                  }}
                >
                  <Icon
                    strokeWidth={1.6}
                    style={{
                      color: ICON_COLOR,
                      width: bubble * 0.42,
                      height: bubble * 0.42,
                    }}
                  />
                </div>
                {/* status dot */}
                <span
                  className="absolute top-1 right-1 rounded-full ring-2 ring-white"
                  style={{
                    width: 10,
                    height: 10,
                    background: item.status === "live" ? "#22C55E" : "#F59E0B",
                  }}
                />

                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                      style={{ bottom: bubble + 14, whiteSpace: "nowrap" }}
                    >
                      <div
                        className="rounded-xl bg-[#0F172A] text-white px-3.5 py-2"
                        style={{ boxShadow: "0 14px 32px -10px rgba(15,23,42,0.45)" }}
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
                      <div className="w-2 h-2 bg-[#0F172A] rotate-45 mx-auto -mt-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center font-barlow font-400 text-xs md:text-sm text-[#0F172A]/45 tracking-wide">
        n8n · Claude · BC · Dropbox · M365 · Doppler · Power BI · Notion
      </div>
    </div>
  );
}
