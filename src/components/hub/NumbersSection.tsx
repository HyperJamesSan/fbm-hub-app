import { useState } from "react";
import {
  TrendingUp, FileCheck2, Zap, Target, ShieldCheck, Bug,
  Building2, Clock, ArrowUpRight, Sparkles,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import ParticleField from "@/components/effects/ParticleField";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Metric = {
  id: string;
  Icon: typeof TrendingUp;
  target: number;
  format: (n: number) => string;
  label: string;
  context: string;
  detail: {
    headline: string;
    body: string;
    bullets: string[];
  };
  accent: string;
  /** stage classification */
  stage: "Outcome" | "Throughput" | "Quality" | "Coverage";
};

const METRICS: Metric[] = [
  {
    id: "accuracy",
    Icon: FileCheck2,
    target: 222,
    format: (n) => `${n}/222`,
    label: "Invoice Accuracy",
    context: "INVOICE class · UAT PASS · 16 Apr 2026",
    stage: "Outcome",
    detail: {
      headline: "100% accuracy across the full UAT corpus",
      body:
        "Every INVOICE PDF in the validation corpus was classified to the correct entity by Claude API + PROMPT v1.4. Zero misroutes, zero false positives.",
      bullets: [
        "222 / 222 INVOICE PDFs · entity match perfect",
        "0 P0 bugs · 0 manual reclassifications",
        "Confidence ≥ 0.90 on 98% of items",
      ],
    },
    accent: "#E41513",
  },
  {
    id: "classified",
    Icon: Zap,
    target: 384,
    format: (n) => `${n}`,
    label: "Invoices Classified",
    context: "PDFs processed in TEST corpus",
    stage: "Throughput",
    detail: {
      headline: "384 invoices · zero human triage",
      body:
        "Production-grade test corpus run end-to-end through n8n + Claude. Each invoice extracted, classified and routed without operator intervention.",
      bullets: [
        "PDF text extraction via n8n",
        "Entity inferred from header + tax IDs",
        "Routed to Dropbox /AP/{ENTITY_CODE}/",
      ],
    },
    accent: "#93C5FD",
  },
  {
    id: "auto-route",
    Icon: TrendingUp,
    target: 98,
    format: (n) => `${n}%`,
    label: "Auto-Route Rate",
    context: "invoices routed without human touch",
    stage: "Throughput",
    detail: {
      headline: "98% of invoices clear the confidence gate",
      body:
        "Anything ≥ 0.90 confidence is auto-filed and the AP Executive is notified. Only low-confidence edge cases reach the manual queue.",
      bullets: [
        "Threshold: 0.90 confidence",
        "Avg confidence on PASS: 0.96",
        "Manual queue: <2% · reviewed in minutes",
      ],
    },
    accent: "#86EFAC",
  },
  {
    id: "ac",
    Icon: Target,
    target: 6,
    format: (n) => `${n}/6`,
    label: "Acceptance Criteria",
    context: "AC met · UAT PASS Apr 2026",
    stage: "Outcome",
    detail: {
      headline: "All six acceptance criteria green",
      body:
        "Entity detection, confidence scoring, auto-routing, document storage, audit trail and AP notification — every gate validated and signed off.",
      bullets: [
        "Entity detection · routing · storage",
        "Audit trail logged to Notion",
        "AP Executive notification on 100% of runs",
      ],
    },
    accent: "#FCD34D",
  },
  {
    id: "confidence",
    Icon: ShieldCheck,
    target: 98,
    format: (n) => `0.${n}`,
    label: "Max Confidence",
    context: "peak Claude API confidence score",
    stage: "Quality",
    detail: {
      headline: "Claude API · PROMPT v1.4",
      body:
        "Top-end confidence reaches 0.98 on clean invoice headers. The prompt is versioned and lives in Doppler, with replays logged for every classification.",
      bullets: [
        "PROMPT v1.4 · versioned in Doppler",
        "Replays + outcomes logged in Notion",
        "Per-entity calibration baked in",
      ],
    },
    accent: "#A78BFA",
  },
  {
    id: "bugs",
    Icon: Bug,
    target: 0,
    format: () => "0",
    label: "P0 Bugs",
    context: "blocker defects in UAT · clean run",
    stage: "Quality",
    detail: {
      headline: "Zero blocker defects in UAT",
      body:
        "No P0s logged across the full UAT cycle. The pipeline runs unattended end-to-end with full observability on every step.",
      bullets: [
        "Self-healing retries on transient failures",
        "Full audit trail · ISO timestamps",
        "Alerts on confidence drops or queue spikes",
      ],
    },
    accent: "#6EE7B7",
  },
  {
    id: "entities",
    Icon: Building2,
    target: 8,
    format: (n) => `${n}`,
    label: "Malta Entities",
    context: "BUHAY Group · classified end-to-end",
    stage: "Coverage",
    detail: {
      headline: "8 entities · one pipeline",
      body:
        "BHL · FBM · NMT · DMT · FDS · DRA · LUC · EPS — every Malta entity in the BUHAY Group is recognised, routed and filed by the same automation.",
      bullets: [
        "Per-entity Dropbox folder structure",
        "Entity-aware naming convention",
        "Power BI dashboards segmented by entity",
      ],
    },
    accent: "#F9A8D4",
  },
];

const STAGES: Metric["stage"][] = ["Outcome", "Throughput", "Quality", "Coverage"];

const TICKER = [
  "M1 LIVE",
  "UAT PASS · 16 Apr 2026",
  "100% accuracy · 222/222",
  "98% auto-route",
  "0 P0 bugs",
  "8 entities · 1 pipeline",
  "n8n · Claude · Dropbox · M365 · Notion",
];

/* ------------------------------------------------------------------ */
/*  Sparkline                                                          */
/* ------------------------------------------------------------------ */

function Sparkline({
  color = "#E41513",
  visible,
  seed = 1,
}: {
  color?: string;
  visible: boolean;
  seed?: number;
}) {
  const points = Array.from({ length: 12 }).map((_, i) => {
    const noise = ((i * 7 + seed * 13) % 11) / 11;
    const y = 28 - i * 1.6 - noise * 4;
    return `${i * 10},${Math.max(2, y)}`;
  });
  const path = `M${points.join(" L")}`;
  return (
    <svg viewBox="0 0 110 30" className="w-full h-7 overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`spark-${seed}`} x1="0" x2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`url(#spark-${seed})`}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 220,
          strokeDashoffset: visible ? 0 : 220,
          transition: "stroke-dashoffset 1.4s ease-out",
        }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric tile (compact list item, dark)                              */
/* ------------------------------------------------------------------ */

function MetricTile({
  metric,
  isActive,
  isDimmed,
  onClick,
  index,
}: {
  metric: Metric;
  isActive: boolean;
  isDimmed: boolean;
  onClick: () => void;
  index: number;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLButtonElement>(0.2);
  const value = useCountUp(metric.target, isVisible, 1800);
  const { Icon } = metric;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className="group relative text-left rounded-2xl p-4 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E41513]"
      style={{
        background: isActive
          ? "linear-gradient(135deg, #ffffff 0%, #FFF5F5 100%)"
          : "rgba(255,255,255,0.7)",
        border: isActive
          ? "1px solid rgba(228,21,19,0.5)"
          : "1px solid rgba(17,17,17,0.06)",
        opacity: isDimmed ? 0.4 : 1,
        boxShadow: isActive
          ? "0 14px 36px -16px rgba(228,21,19,0.45), 0 1px 0 rgba(255,255,255,0.9) inset"
          : "0 1px 2px rgba(17,17,17,0.04)",
        transitionDelay: `${index * 40}ms`,
      }}
    >
      {/* Active accent bar */}
      <span
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all"
        style={{
          background: isActive ? "#E41513" : "transparent",
        }}
      />

      <div className="flex items-start justify-between mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: isActive
              ? "rgba(228,21,19,0.12)"
              : `${metric.accent}24`,
          }}
        >
          <Icon
            className="w-4 h-4"
            style={{ color: isActive ? "#E41513" : metric.accent }}
          />
        </div>
        <ArrowUpRight
          className="w-3.5 h-3.5 transition-all"
          style={{
            color: isActive ? "#E41513" : "rgba(17,17,17,0.25)",
            transform: isActive ? "translate(2px,-2px)" : "none",
          }}
        />
      </div>
      <div
        className="font-barlow italic font-900 leading-none tabular-nums"
        style={{
          fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)",
          color: isActive ? "#0A0A0A" : "#111111",
        }}
      >
        {metric.format(value)}
      </div>
      <div
        className="font-barlow font-700 uppercase tracking-[0.18em] text-[10px] mt-2"
        style={{ color: isActive ? "#E41513" : "rgba(17,17,17,0.55)" }}
      >
        {metric.label}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail panel (right side)                                          */
/* ------------------------------------------------------------------ */

function DetailPanel({ metric }: { metric: Metric }) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>(0.1);
  const value = useCountUp(metric.target, isVisible, 2200);
  const { Icon } = metric;

  return (
    <div
      ref={ref}
      key={metric.id}
      className="relative h-full rounded-2xl overflow-hidden p-8 md:p-10"
      style={{
        background:
          "linear-gradient(150deg, #0F0F12 0%, #18090A 55%, #0B0B0E 100%)",
        border: "1px solid rgba(228,21,19,0.22)",
        boxShadow:
          "0 30px 70px -30px rgba(228,21,19,0.35), 0 0 0 1px rgba(255,255,255,0.04) inset",
        animation: "numbers-fade-in 0.5s ease-out",
      }}
    >
      {/* Glow */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(closest-side, ${metric.accent}40, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at top right, #000 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white font-barlow font-900 uppercase tracking-[0.25em] text-[10px]"
            style={{ background: "#E41513" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            M1 Live
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] border"
            style={{
              color: metric.accent,
              borderColor: `${metric.accent}55`,
              background: `${metric.accent}12`,
            }}
          >
            <Sparkles className="w-3 h-3" />
            {metric.stage}
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: `${metric.accent}1F`,
              border: `1px solid ${metric.accent}44`,
            }}
          >
            <Icon className="w-7 h-7" style={{ color: metric.accent }} />
          </div>
          <div>
            <div
              className="font-barlow font-700 uppercase tracking-[0.22em] text-[11px]"
              style={{ color: metric.accent }}
            >
              {metric.label}
            </div>
            <div className="font-barlow font-400 text-sm text-white/55 mt-1">
              {metric.context}
            </div>
          </div>
        </div>

        <div
          className="font-barlow italic font-900 text-white leading-[0.9] mt-6 tabular-nums"
          style={{
            fontSize: "clamp(4rem, 9vw, 8rem)",
            textShadow: "0 4px 30px rgba(228,21,19,0.25)",
          }}
        >
          {metric.format(value)}
        </div>

        <div className="flex items-center gap-2 mt-2 text-[#22C55E] font-barlow font-700 text-sm">
          <ArrowUpRight className="w-4 h-4" />
          vs. 12–17 min/invoice manual baseline
        </div>

        <div className="mt-6">
          <Sparkline color={metric.accent} visible={isVisible} seed={1} />
        </div>

        <p className="font-barlow font-400 text-white/75 text-base md:text-lg leading-relaxed mt-6">
          {metric.detail.headline}.
        </p>
        <p className="font-barlow font-400 text-white/50 text-sm leading-relaxed mt-3">
          {metric.detail.body}
        </p>
        <ul className="mt-5 space-y-2">
          {metric.detail.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-white/85 font-barlow font-500 text-sm"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: metric.accent }}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function NumbersSection() {
  const [activeId, setActiveId] = useState<string>(METRICS[0].id);
  const [stageFilter, setStageFilter] = useState<Metric["stage"] | null>(null);

  const active = METRICS.find((m) => m.id === activeId) ?? METRICS[0];

  return (
    <section
      className="relative bg-white py-24 md:py-32 overflow-hidden"
      aria-labelledby="numbers-heading"
    >
      {/* Subtle red dot pattern backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#E41513 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E41513]/8 border border-[#E41513]/20 mb-6">
            <Clock className="w-3 h-3 text-[#E41513]" />
            <span className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.3em] text-[11px]">
              The Numbers · Updated Apr 2026
            </span>
          </div>
          <h2
            id="numbers-heading"
            className="font-barlow font-900 text-[#111111] leading-[0.95]"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)" }}
          >
            Real data. <span className="italic text-[#E41513]">Real results.</span>
          </h2>
          <p className="font-barlow font-400 text-gray-500 text-base md:text-lg max-w-2xl mx-auto mt-5">
            Click any metric on the left — the panel on the right unpacks how it was measured.
          </p>
        </div>

        {/* Unified light interactive board */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #FFFFFF 0%, #FCF7F7 45%, #F9FAFB 100%)",
            border: "1px solid rgba(17,17,17,0.06)",
            boxShadow:
              "0 30px 80px -30px rgba(228,21,19,0.18), 0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          {/* Soft red wash */}
          <div
            aria-hidden
            className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(closest-side, rgba(228,21,19,0.14), transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(closest-side, rgba(228,21,19,0.08), transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          {/* Top hairline accent */}
          <div
            aria-hidden
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(228,21,19,0.45) 50%, transparent 100%)",
            }}
          />

          {/* Stage filter chips */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 px-6 md:px-10 pt-8">
            <span className="font-barlow font-700 uppercase tracking-[0.25em] text-[10px] text-gray-400 mr-2">
              Filter
            </span>
            <button
              type="button"
              onClick={() => setStageFilter(null)}
              className="px-3 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] transition-all"
              style={{
                background: stageFilter === null ? "#E41513" : "#FFFFFF",
                color: stageFilter === null ? "#fff" : "#374151",
                border:
                  stageFilter === null
                    ? "1px solid #E41513"
                    : "1px solid rgba(17,17,17,0.08)",
                boxShadow:
                  stageFilter === null
                    ? "0 6px 16px -8px rgba(228,21,19,0.45)"
                    : "0 1px 2px rgba(17,17,17,0.04)",
              }}
            >
              All
            </button>
            {STAGES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStageFilter(stageFilter === s ? null : s)}
                className="px-3 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] transition-all"
                style={{
                  background: stageFilter === s ? "#E41513" : "#FFFFFF",
                  color: stageFilter === s ? "#fff" : "#374151",
                  border:
                    stageFilter === s
                      ? "1px solid #E41513"
                      : "1px solid rgba(17,17,17,0.08)",
                  boxShadow:
                    stageFilter === s
                      ? "0 6px 16px -8px rgba(228,21,19,0.45)"
                      : "0 1px 2px rgba(17,17,17,0.04)",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Body grid: tiles | detail */}
          <div className="relative z-10 grid lg:grid-cols-[1.05fr_1fr] gap-6 p-6 md:p-10">
            {/* LEFT — tiles grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {METRICS.map((m, i) => {
                const isActive = m.id === activeId;
                const isDimmed = stageFilter !== null && m.stage !== stageFilter;
                return (
                  <MetricTile
                    key={m.id}
                    metric={m}
                    index={i}
                    isActive={isActive}
                    isDimmed={isDimmed}
                    onClick={() => {
                      if (isDimmed) return;
                      setActiveId(m.id);
                    }}
                  />
                );
              })}
            </div>

            {/* RIGHT — detail */}
            <DetailPanel metric={active} />
          </div>

          {/* Ticker bar inside light panel */}
          <div
            className="relative z-10 flex items-center"
            style={{ borderTop: "1px solid rgba(17,17,17,0.06)" }}
          >
            <div className="flex-shrink-0 px-5 py-3 bg-[#E41513] text-white font-barlow font-900 uppercase tracking-[0.25em] text-[11px] flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              Live
            </div>
            <div className="flex-1 overflow-hidden numbers-ticker-mask bg-[#FAFAFB]">
              <div className="flex gap-10 whitespace-nowrap py-3 px-6 numbers-ticker-track">
                {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
                  <span
                    key={i}
                    className="font-barlow font-700 uppercase tracking-[0.25em] text-[11px] text-gray-600 flex items-center gap-3"
                  >
                    {t}
                    <span className="text-[#E41513]">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
