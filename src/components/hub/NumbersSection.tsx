import { useState } from "react";
import {
  TrendingUp, FileCheck2, Zap, Target, ShieldCheck, Bug,
  Building2, Clock, ArrowUpRight, Sparkles, Activity,
} from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

/* ------------------------------------------------------------------ */
/*  Data — real CFO numbers                                            */
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
  /** stage classification */
  stage: "Outcome" | "Throughput" | "Quality" | "Coverage";
  /** narrative weight — drives card prominence */
  weight: "primary" | "secondary";
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
    weight: "primary",
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
  },
  {
    id: "auto-route",
    Icon: TrendingUp,
    target: 98,
    format: (n) => `${n}%`,
    label: "Auto-Route Rate",
    context: "invoices routed without human touch",
    stage: "Throughput",
    weight: "primary",
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
  },
  {
    id: "classified",
    Icon: Zap,
    target: 384,
    format: (n) => `${n}`,
    label: "Invoices Classified",
    context: "PDFs processed in TEST corpus",
    stage: "Throughput",
    weight: "secondary",
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
  },
  {
    id: "ac",
    Icon: Target,
    target: 6,
    format: (n) => `${n}/6`,
    label: "Acceptance Criteria",
    context: "AC met · UAT PASS Apr 2026",
    stage: "Outcome",
    weight: "secondary",
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
  },
  {
    id: "confidence",
    Icon: ShieldCheck,
    target: 98,
    format: (n) => `0.${n}`,
    label: "Max Confidence",
    context: "peak Claude API confidence score",
    stage: "Quality",
    weight: "secondary",
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
  },
  {
    id: "bugs",
    Icon: Bug,
    target: 0,
    format: () => "0",
    label: "P0 Bugs",
    context: "blocker defects in UAT · clean run",
    stage: "Quality",
    weight: "secondary",
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
  },
  {
    id: "entities",
    Icon: Building2,
    target: 8,
    format: (n) => `${n}`,
    label: "Malta Entities",
    context: "BUHAY Group · classified end-to-end",
    stage: "Coverage",
    weight: "secondary",
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
  },
];

const STAGES: Metric["stage"][] = ["Outcome", "Throughput", "Quality", "Coverage"];

/* ------------------------------------------------------------------ */
/*  Sparkline — translucent, AI-feel                                   */
/* ------------------------------------------------------------------ */

function Sparkline({ visible, seed = 1 }: { visible: boolean; seed?: number }) {
  const points = Array.from({ length: 14 }).map((_, i) => {
    const noise = ((i * 7 + seed * 13) % 11) / 11;
    const y = 26 - i * 1.4 - noise * 3.5;
    return `${i * 8},${Math.max(2, y)}`;
  });
  const path = `M${points.join(" L")}`;
  return (
    <svg viewBox="0 0 110 30" className="w-full h-7 overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`spark-${seed}`} x1="0" x2="1">
          <stop offset="0%" stopColor="rgba(228,21,19,0.05)" />
          <stop offset="100%" stopColor="rgba(228,21,19,0.85)" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`url(#spark-${seed})`}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 220,
          strokeDashoffset: visible ? 0 : 220,
          transition: "stroke-dashoffset 1.6s ease-out",
        }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric tile — glass card, subtle red accent                        */
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
  const isPrimary = metric.weight === "primary";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className="group relative text-left rounded-2xl p-5 transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E41513]/40 overflow-hidden backdrop-blur-xl"
      style={{
        background: isActive
          ? "linear-gradient(155deg, rgba(255,255,255,0.95) 0%, rgba(248,249,251,0.88) 100%)"
          : "linear-gradient(155deg, rgba(255,255,255,0.55) 0%, rgba(248,249,251,0.45) 100%)",
        border: isActive
          ? "1px solid rgba(17,24,39,0.14)"
          : "1px solid rgba(17,24,39,0.05)",
        opacity: isDimmed ? 0.35 : 1,
        boxShadow: isActive
          ? "0 20px 48px -24px rgba(15,23,42,0.22), 0 0 0 1px rgba(255,255,255,0.95) inset, 0 1px 0 rgba(255,255,255,0.95) inset"
          : "0 8px 22px -16px rgba(15,23,42,0.14), 0 1px 0 rgba(255,255,255,0.85) inset",
        transitionDelay: `${index * 30}ms`,
        transform: isActive ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Cool platinum wash — only on active */}
      <span
        aria-hidden
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(closest-side, rgba(15,23,42,0.06), transparent 70%)",
          filter: "blur(14px)",
          opacity: isActive ? 1 : 0,
        }}
      />

      {/* Top hairline — graphite with red micro-accent */}
      <span
        aria-hidden
        className="absolute top-0 inset-x-6 h-px transition-opacity"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(15,23,42,0.25) 45%, rgba(228,21,19,0.55) 50%, rgba(15,23,42,0.25) 55%, transparent 100%)",
          opacity: isActive ? 1 : 0,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: isActive
                ? "linear-gradient(135deg, rgba(15,23,42,0.08), rgba(15,23,42,0.02))"
                : "rgba(15,23,42,0.04)",
              border: isActive
                ? "1px solid rgba(15,23,42,0.14)"
                : "1px solid rgba(15,23,42,0.06)",
            }}
          >
            <Icon
              className="w-4 h-4 transition-colors"
              style={{ color: isActive ? "#0F172A" : "#94A3B8" }}
            />
          </div>
          <ArrowUpRight
            className="w-3.5 h-3.5 transition-all"
            style={{
              color: isActive ? "#0F172A" : "rgba(15,23,42,0.22)",
              transform: isActive ? "translate(2px,-2px)" : "none",
            }}
          />
        </div>

        <div
          className="font-barlow italic font-900 leading-none tabular-nums transition-colors"
          style={{
            fontSize: isPrimary
              ? "clamp(2.1rem, 3vw, 2.9rem)"
              : "clamp(1.75rem, 2.4vw, 2.4rem)",
            color: "#0F172A",
            letterSpacing: "-0.025em",
          }}
        >
          {metric.format(value)}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span
            className="h-[5px] w-[5px] rounded-full transition-all"
            style={{
              background: isActive ? "#E41513" : "rgba(15,23,42,0.22)",
              boxShadow: isActive ? "0 0 6px rgba(228,21,19,0.45)" : "none",
            }}
          />
          <div
            className="font-barlow font-700 uppercase tracking-[0.18em] text-[9.5px] transition-colors"
            style={{ color: isActive ? "#0F172A" : "rgba(15,23,42,0.50)" }}
          >
            {metric.label}
          </div>
        </div>

        {/* Mini sparkline */}
        <div
          className="mt-3 -mx-1 transition-opacity"
          style={{ opacity: isActive ? 0.95 : 0.45 }}
        >
          <Sparkline visible={isVisible} seed={index + 5} />
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail panel — translucent glass, AI feel                          */
/* ------------------------------------------------------------------ */

function DetailPanel({ metric }: { metric: Metric }) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>(0.1);
  const value = useCountUp(metric.target, isVisible, 2200);
  const { Icon } = metric;

  return (
    <div
      ref={ref}
      key={metric.id}
      className="relative h-full rounded-2xl overflow-hidden p-6 md:p-7 backdrop-blur-2xl"
      style={{
        background:
          "linear-gradient(155deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.78) 60%, rgba(241,245,249,0.72) 100%)",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow:
          "0 30px 70px -30px rgba(15,23,42,0.22), 0 0 0 1px rgba(255,255,255,0.7) inset, 0 1px 0 rgba(255,255,255,0.95) inset",
        animation: "numbers-fade-in 0.5s ease-out",
      }}
    >
      {/* Cool platinum ambient — top right */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(15,23,42,0.07), transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      {/* Subtle warm graphite wash — bottom left */}
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.05), transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      {/* Subtle dot grid — graphite */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15,23,42,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse at top right, #000 0%, transparent 75%)",
        }}
      />
      {/* Top hairline — graphite with red micro-accent */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(15,23,42,0.20) 45%, rgba(228,21,19,0.55) 50%, rgba(15,23,42,0.20) 55%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Stage chip + LIVE pill */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] backdrop-blur"
            style={{
              color: "#0F172A",
              background: "rgba(15,23,42,0.05)",
              border: "1px solid rgba(15,23,42,0.12)",
            }}
          >
            <Sparkles className="w-3 h-3" style={{ color: "#E41513" }} />
            {metric.stage}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] backdrop-blur"
            style={{
              color: "#16A34A",
              background: "rgba(34,197,94,0.06)",
              border: "1px solid rgba(34,197,94,0.20)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Live
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.06), rgba(15,23,42,0.02))",
              border: "1px solid rgba(15,23,42,0.10)",
              boxShadow: "0 10px 24px -12px rgba(15,23,42,0.20)",
            }}
          >
            <Icon className="w-7 h-7" style={{ color: "#0F172A" }} />
          </div>
          <div>
            <div
              className="font-barlow font-700 uppercase tracking-[0.22em] text-[11px]"
              style={{ color: "#0F172A" }}
            >
              {metric.label}
            </div>
            <div className="font-barlow font-400 text-sm text-[#64748B] mt-1">
              {metric.context}
            </div>
          </div>
        </div>

        <div
          className="font-barlow italic font-900 leading-[0.9] mt-5 tabular-nums"
          style={{
            fontSize: "clamp(2.75rem, 6vw, 5rem)",
            color: "#0A0A0A",
            letterSpacing: "-0.03em",
            background:
              "linear-gradient(180deg, #0A0A0A 0%, #2A2A2A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 30px rgba(15,23,42,0.10)",
          }}
        >
          {metric.format(value)}
        </div>

        <div className="flex items-center gap-2 mt-2 text-[#22C55E] font-barlow font-700 text-sm">
          <ArrowUpRight className="w-4 h-4" />
          vs. 12–17 min/invoice manual baseline
        </div>

        <div className="mt-3">
          <Sparkline visible={isVisible} seed={1} />
        </div>

        <p className="font-barlow font-700 text-[#0A0A0A] text-base md:text-lg leading-snug mt-4">
          {metric.detail.headline}.
        </p>
        <p className="font-barlow font-400 text-[#4B5563] text-xs md:text-sm leading-relaxed mt-2">
          {metric.detail.body}
        </p>
        <ul className="mt-4 space-y-2">
          {metric.detail.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2.5 text-[#374151] font-barlow font-500 text-xs md:text-sm"
            >
              <span
                className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                style={{
                  background: "#0F172A",
                }}
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
      className="relative py-12 md:py-16 overflow-hidden"
      aria-labelledby="numbers-heading"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FBFBFC 50%, #F7F8FA 100%)",
      }}
    >
      {/* Ambient red glow — top right */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(228,21,19,0.10), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Ambient cool wash — bottom left */}
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.06), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Subtle red dot pattern backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(#E41513 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 backdrop-blur"
            style={{
              background: "rgba(228,21,19,0.06)",
              border: "1px solid rgba(228,21,19,0.20)",
            }}
          >
            <Activity className="w-3 h-3 text-[#E41513]" />
            <span className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.3em] text-[10px]">
              Live KPIs · Updated Apr 2026
            </span>
          </div>
          <h2
            id="numbers-heading"
            className="font-barlow font-900 text-[#0A0A0A] leading-[0.95]"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            Real data.{" "}
            <span
              className="italic"
              style={{
                background:
                  "linear-gradient(135deg, #E41513 0%, #FF4D4B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Real results.
            </span>
          </h2>
          <p className="font-barlow font-400 text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto mt-3">
            Production metrics from the AP automation pipeline — click any tile to expand.
          </p>
        </div>

        {/* Unified glass interactive board */}
        <div
          className="relative rounded-3xl overflow-hidden backdrop-blur-2xl"
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.65) 0%, rgba(252,253,254,0.55) 100%)",
            border: "1px solid rgba(17,17,17,0.05)",
            boxShadow:
              "0 40px 100px -40px rgba(17,24,39,0.20), 0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          {/* Top hairline accent */}
          <div
            aria-hidden
            className="absolute top-0 inset-x-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(228,21,19,0.40) 50%, transparent 100%)",
            }}
          />

          {/* Stage filter chips */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 px-5 md:px-6 pt-5">
            <span className="font-barlow font-700 uppercase tracking-[0.25em] text-[10px] text-[#9CA3AF] mr-2">
              Filter
            </span>
            <button
              type="button"
              onClick={() => setStageFilter(null)}
              className="px-3 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] transition-all backdrop-blur"
              style={{
                background:
                  stageFilter === null ? "#E41513" : "rgba(255,255,255,0.7)",
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
                className="px-3 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] transition-all backdrop-blur"
                style={{
                  background:
                    stageFilter === s ? "#E41513" : "rgba(255,255,255,0.7)",
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
          <div className="relative z-10 grid lg:grid-cols-[1.05fr_1fr] gap-4 p-4 md:p-5">
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
        </div>
      </div>
    </section>
  );
}
