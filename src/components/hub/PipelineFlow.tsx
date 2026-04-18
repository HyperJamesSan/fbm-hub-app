import { useEffect, useRef, useState } from "react";
import { Mail, FileText, Brain, GitBranch, FolderOpen, Bell, BookOpen, FileCheck2 } from "lucide-react";

type Node = {
  Icon: typeof Mail;
  label: string;
  tool: string;
  step: string;
  desc: string;
  accent: string; // pastel halo
  isAi?: boolean;
  // Back-of-card details
  backTitle: string;
  backDesc: string;
  backMeta: { k: string; v: string }[];
};

const NODES: Node[] = [
  {
    Icon: Mail, label: "Email Received", tool: "M365", step: "Trigger",
    desc: "M365 inbox · PDF attached", accent: "#A7F3D0",
    backTitle: "Inbox listener",
    backDesc: "Polls accounts.payable@fbm.mt every 5 min and pulls any email with a PDF attachment.",
    backMeta: [
      { k: "Mailbox", v: "accounts.payable@fbm.mt" },
      { k: "Frequency", v: "5 min" },
      { k: "Owner", v: "M365 / n8n" },
    ],
  },
  {
    Icon: FileText, label: "PDF Validated", tool: "n8n", step: "Validate",
    desc: "Format · size · text extracted", accent: "#BAE6FD",
    backTitle: "Document gate",
    backDesc: "Extracts the PDF as base64, checks it's text-extractable. Image-only PDFs go to manual review.",
    backMeta: [
      { k: "Engine", v: "n8n" },
      { k: "Reject code", v: "ERR_IMAGE_ONLY_PDF" },
      { k: "Output", v: "base64 + metadata" },
    ],
  },
  {
    Icon: Brain, label: "AI Brain", tool: "Claude API", step: "Classify",
    desc: "PROMPT v1.4 · confidence", accent: "#E41513", isAi: true,
    backTitle: "Entity classification",
    backDesc: "Claude returns a JSON object with the entity_code, supplier and confidence score (0–1).",
    backMeta: [
      { k: "Model", v: "claude-sonnet-4" },
      { k: "Prompt", v: "PROMPT_AP v1.4" },
      { k: "Max conf.", v: "0.98" },
    ],
  },
  {
    Icon: GitBranch, label: "Confidence Router", tool: "≥90% / <90%", step: "Route",
    desc: "Auto-file or manual queue", accent: "#FDE68A",
    backTitle: "Decision gate",
    backDesc: "Score ≥ 0.90 routes the invoice automatically. Below threshold goes to AP for manual review.",
    backMeta: [
      { k: "Threshold", v: "0.90" },
      { k: "Auto-route", v: "98%" },
      { k: "Manual rate", v: "0%" },
    ],
  },
  {
    Icon: FolderOpen, label: "Filed in Dropbox", tool: "DRB Business", step: "Store",
    desc: "/AP/{ENTITY_CODE}/", accent: "#DDD6FE",
    backTitle: "Document storage",
    backDesc: "Uploads the invoice to the entity-specific folder following the naming convention.",
    backMeta: [
      { k: "Path", v: "/AP/{ENV}/{Entity}/{YYYY}/{MM}/" },
      { k: "Naming", v: "100% compliant" },
      { k: "Retention", v: "Permanent" },
    ],
  },
  {
    Icon: Bell, label: "AP Notified", tool: "M365", step: "Notify",
    desc: "Executive email summary", accent: "#A7F3D0",
    backTitle: "AP Executive ping",
    backDesc: "Sends a confirmation email with the entity, supplier, amount and a link to the filed PDF.",
    backMeta: [
      { k: "Channel", v: "M365 mail" },
      { k: "Latency", v: "< 5 sec" },
      { k: "SLA", v: "Every invoice" },
    ],
  },
  {
    Icon: BookOpen, label: "Audit Logged", tool: "Notion", step: "Log",
    desc: "ISO timestamp · outcome", accent: "#FBCFE8",
    backTitle: "Audit trail",
    backDesc: "Every run is logged with ISO timestamp, outcome, confidence and any error path taken.",
    backMeta: [
      { k: "Store", v: "Notion DB" },
      { k: "Branches", v: "All paths" },
      { k: "Coverage", v: "100%" },
    ],
  },
];

const STEP_MS = 1600; // time per node (travel + dwell)

export default function PipelineFlow() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(0); // current node being processed
  const [isVisible, setIsVisible] = useState(false);
  const [flipped, setFlipped] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current;
      if (!c) return;
      const cr = c.getBoundingClientRect();
      const next: { x: number; y: number }[] = [];
      const els = c.querySelectorAll<HTMLElement>("[data-node]");
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        next.push({ x: r.left - cr.left + r.width / 2, y: r.top - cr.top + r.height / 2 });
      });
      setPts(next);
      setSize({ w: cr.width, h: cr.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Visibility — pause animation when offscreen
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setIsVisible(e.isIntersecting)),
      { threshold: 0.2 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Auto-advance the active node — pauses while a card is flipped
  useEffect(() => {
    if (!isVisible || flipped !== null) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % NODES.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [isVisible, flipped]);

  // Build smooth bezier path through nodes
  const pathD = pts.length
    ? pts.reduce((acc, p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = pts[i - 1];
        const cx = (prev.x + p.x) / 2;
        return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
      }, "")
    : "";

  // Token position = current active node coords
  const token = pts[active];
  const activeNode = NODES[active];

  return (
    <section
      ref={sectionRef}
      id="pipeline"
      className="relative overflow-hidden py-28 md:py-36 px-6"
      style={{ background: "linear-gradient(180deg, #FBF7F2 0%, #F4EDE6 100%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E41513]/8 border border-[#E41513]/20 mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#E41513] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E41513]" />
            </span>
            <span className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.3em] text-[11px] md:text-xs">
              M1 · Finance · AP Automation
            </span>
          </div>
          <div className="text-[#9CA3AF] font-barlow font-700 uppercase tracking-[0.22em] text-[10px] md:text-xs mb-4">
            The Pipeline
          </div>
          <h2
            className="font-barlow italic font-900 text-[#0A0A0A] leading-[0.92]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            Seven steps. <span className="text-[#E41513]">One flow.</span>
          </h2>
          <p className="font-barlow font-400 text-base md:text-lg text-[#374151] mt-6 max-w-2xl mx-auto">
            Every invoice travels the same path — from inbox to audit log — in seconds.
          </p>
        </div>

        {/* Live status header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
            </span>
            <span className="font-barlow font-700 uppercase tracking-[0.2em] text-[10px] text-[#15803D]">
              Live
            </span>
            <span className="font-barlow font-500 text-[11px] text-[#6B7280]">
              · Processing invoice
            </span>
          </div>
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] shadow-sm">
            <FileCheck2 className="w-3 h-3 text-[#E41513]" />
            <span className="font-barlow font-700 text-[11px] text-[#0A0A0A]">
              Step {active + 1}/{NODES.length}
            </span>
            <span className="font-barlow font-500 text-[11px] text-[#6B7280]">
              · {activeNode.step}
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative"
          style={{ minHeight: 360 }}
        >
          {/* SVG flowing line */}
          {size.w > 0 && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={size.w}
              height={size.h}
              viewBox={`0 0 ${size.w} ${size.h}`}
              fill="none"
            >
              <defs>
                <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#A7F3D0" />
                  <stop offset="35%" stopColor="#E41513" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FBCFE8" />
                </linearGradient>
                <radialGradient id="token-grad">
                  <stop offset="0%" stopColor="#E41513" stopOpacity="1" />
                  <stop offset="60%" stopColor="#E41513" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E41513" stopOpacity="0" />
                </radialGradient>
                <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>

              {/* Soft glow underlay */}
              <path
                d={pathD}
                stroke="url(#flow-grad)"
                strokeWidth={14}
                strokeLinecap="round"
                opacity={0.25}
                filter="url(#glow-soft)"
              />
              {/* Solid base line */}
              <path
                d={pathD}
                stroke="rgba(17,17,17,0.10)"
                strokeWidth={2}
                strokeLinecap="round"
              />
              {/* Marching dashes (the "flow") */}
              <path
                d={pathD}
                stroke="url(#flow-grad)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="6 18"
                className="path-march"
              />

              {/* Animated token following the path */}
              {token && (
                <g
                  style={{
                    transform: `translate(${token.x}px, ${token.y}px)`,
                    transition: "transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)",
                  }}
                >
                  <circle r={26} fill="url(#token-grad)" />
                  <circle r={9} fill="#E41513" />
                  <circle r={4} fill="#fff" />
                </g>
              )}
            </svg>
          )}

          {/* Nodes row */}
          <div className="relative z-10 grid grid-cols-7 gap-4 md:gap-6 overflow-x-auto md:overflow-visible">
            {NODES.map(({ Icon, label, tool, step, desc, accent, isAi }, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <div
                  key={label}
                  data-node
                  className="flex flex-col items-center text-center min-w-[140px]"
                >
                  {/* Step number */}
                  <div
                    className="font-barlow font-900 italic text-xs tracking-widest mb-2 transition-colors"
                    style={{ color: isActive ? "#E41513" : isPast ? "#374151" : "#9CA3AF" }}
                  >
                    0{i + 1} · {step}
                  </div>

                  {/* Halo + Node circle */}
                  <div className="relative">
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-full transition-all duration-500"
                      style={{
                        background: accent,
                        filter: "blur(22px)",
                        opacity: isActive ? 0.95 : isAi ? 0.55 : 0.6,
                        transform: isActive ? "scale(1.8)" : "scale(1.4)",
                      }}
                    />
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{
                          background: isAi ? "rgba(228,21,19,0.35)" : "rgba(228,21,19,0.18)",
                          animationDuration: "1.4s",
                        }}
                      />
                    )}
                    <div
                      className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center bg-white transition-all duration-500"
                      style={{
                        border: isActive
                          ? "2px solid #E41513"
                          : isAi
                          ? "2px solid #E41513"
                          : isPast
                          ? "1px solid rgba(228,21,19,0.35)"
                          : "1px solid rgba(17,17,17,0.06)",
                        boxShadow: isActive
                          ? "0 22px 48px rgba(228,21,19,0.40), 0 0 0 8px rgba(228,21,19,0.10)"
                          : isAi
                          ? "0 18px 40px rgba(228,21,19,0.30), 0 0 0 6px rgba(228,21,19,0.08)"
                          : "0 12px 30px rgba(17,17,17,0.08)",
                        transform: isActive ? "scale(1.08)" : "scale(1)",
                      }}
                    >
                      <Icon
                        className="w-8 h-8 md:w-9 md:h-9 transition-colors"
                        style={{ color: isActive || isAi || isPast ? "#E41513" : "#0A0A0A" }}
                      />
                    </div>
                    {isAi && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-barlow font-900 uppercase tracking-widest bg-[#E41513] text-white whitespace-nowrap">
                        AI Brain
                      </div>
                    )}
                    {isActive && !isAi && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-barlow font-900 uppercase tracking-widest bg-[#E41513] text-white whitespace-nowrap shadow-md">
                        Processing
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className="font-barlow font-700 text-sm md:text-base mt-5 leading-tight transition-colors"
                    style={{ color: isActive ? "#E41513" : "#0A0A0A" }}
                  >
                    {label}
                  </div>
                  <div
                    className="mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-barlow font-700 transition-colors"
                    style={{
                      background: isActive
                        ? "rgba(228,21,19,0.14)"
                        : isAi
                        ? "rgba(228,21,19,0.10)"
                        : "rgba(17,17,17,0.05)",
                      color: isActive || isAi ? "#E41513" : "#374151",
                    }}
                  >
                    {tool}
                  </div>
                  <p className="font-barlow font-400 text-[11px] md:text-xs text-[#6B7280] mt-3 max-w-[140px] leading-snug">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live ticker — what's happening */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div
            key={active}
            className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm px-5 py-4 flex items-center gap-4 animate-fade-in"
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(228,21,19,0.08)" }}
            >
              <activeNode.Icon className="w-5 h-5 text-[#E41513]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-barlow font-700 text-sm text-[#0A0A0A]">
                {activeNode.label}{" "}
                <span className="text-[#9CA3AF] font-500">· {activeNode.tool}</span>
              </div>
              <div className="font-barlow font-400 text-xs text-[#6B7280] truncate">
                {activeNode.desc}
              </div>
            </div>
            <div className="flex-shrink-0 font-barlow font-900 italic text-[10px] tracking-widest text-[#E41513]">
              0{active + 1}/{NODES.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
