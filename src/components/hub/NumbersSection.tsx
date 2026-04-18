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
  Icon: typeof TrendingUp;
  /** numeric target for count-up */
  target: number;
  /** how to render the final value */
  format: (n: number) => string;
  label: string;
  context: string;
  /** richer details revealed on click */
  detail: {
    headline: string;
    body: string;
    bullets: string[];
  };
  /** optional accent for soft glow */
  accent?: string;
};

const HERO_METRIC: Metric = {
  Icon: FileCheck2,
  target: 222,
  format: (n) => `${n}/222`,
  label: "Invoice Accuracy",
  context: "INVOICE class · UAT PASS · 16 Apr 2026",
  detail: {
    headline: "100% accuracy across the full UAT corpus",
    body:
      "Every single INVOICE PDF in the validation corpus was classified to the correct entity by Claude API + PROMPT v1.4. Zero misroutes, zero false positives.",
    bullets: [
      "222 / 222 INVOICE PDFs · entity match perfect",
      "0 P0 bugs · 0 manual reclassifications",
      "Confidence ≥ 0.90 on 98% of items",
    ],
  },
  accent: "#E41513",
};

const METRICS: Metric[] = [
  {
    Icon: Zap,
    target: 384,
    format: (n) => `${n}`,
    label: "Invoices Classified",
    context: "PDFs processed in TEST corpus",
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
    Icon: TrendingUp,
    target: 98,
    format: (n) => `${n}%`,
    label: "Auto-Route Rate",
    context: "invoices routed without a human touch",
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
    Icon: Target,
    target: 6,
    format: (n) => `${n}/6`,
    label: "Acceptance Criteria",
    context: "AC met · UAT PASS Apr 2026",
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
    Icon: ShieldCheck,
    target: 98,
    format: (n) => `0.${n}`,
    label: "Max Confidence",
    context: "peak Claude API confidence score",
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
    Icon: Bug,
    target: 0,
    format: () => "0",
    label: "P0 Bugs",
    context: "blocker defects in UAT · clean run",
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
    Icon: Building2,
    target: 8,
    format: (n) => `${n}`,
    label: "Malta Entities",
    context: "BUHAY Group · classified end-to-end",
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
  // deterministic upward trend based on seed
  const points = Array.from({ length: 12 }).map((_, i) => {
    const noise = ((i * 7 + seed * 13) % 11) / 11;
    const y = 28 - i * 1.6 - noise * 4;
    return `${i * 10},${Math.max(2, y)}`;
  });
  const path = `M${points.join(" L")}`;
  return (
    <svg
      viewBox="0 0 110 30"
      className="w-full h-7 overflow-visible"
      aria-hidden
    >
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
/*  Hero Metric Card                                                   */
/* ------------------------------------------------------------------ */

function HeroMetricCard({
  metric,
  expanded,
  onToggle,
}: {
  metric: Metric;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>(0.25);
  const value = useCountUp(metric.target, isVisible, 2200);
  const { Icon } = metric;

  return (
    <div
      ref={ref}
      className="relative md:col-span-2 lg:col-span-3 rounded-3xl overflow-hidden group cursor-pointer"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        background:
          "linear-gradient(135deg, #0A0A0A 0%, #1A0606 55%, #0A0A0A 100%)",
        boxShadow:
          "0 30px 80px -30px rgba(228,21,19,0.45), 0 0 0 1px rgba(228,21,19,0.25) inset",
      }}
    >
      {/* Particle backdrop */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <ParticleField variant="dark-arc" />
      </div>

      {/* Soft red glow */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(228,21,19,0.35), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div className="relative z-10 p-8 md:p-12 lg:p-14">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E41513] text-white font-barlow font-900 uppercase tracking-[0.25em] text-[10px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            M1 Live
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 font-barlow font-700 uppercase tracking-[0.2em] text-[10px] border border-white/10">
            <Sparkles className="w-3 h-3" />
            Featured Metric
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-end">
          <div>
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(228,21,19,0.18)",
                  border: "1px solid rgba(228,21,19,0.4)",
                }}
              >
                <Icon className="w-7 h-7 text-[#E41513]" />
              </div>
              <div>
                <div className="font-barlow font-700 uppercase tracking-[0.25em] text-[11px] text-[#E41513]">
                  {metric.label}
                </div>
                <div className="font-barlow font-400 text-sm text-white/60 mt-1">
                  {metric.context}
                </div>
              </div>
            </div>

            <div
              className="font-barlow italic font-900 text-white leading-[0.9] mt-6"
              style={{ fontSize: "clamp(4.5rem, 10vw, 9rem)" }}
            >
              {metric.format(value)}
            </div>

            <div className="flex items-center gap-2 mt-2 text-[#22C55E] font-barlow font-700 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              vs. 12–17 min/invoice manual baseline
            </div>
          </div>

          <div className="space-y-5">
            <Sparkline color="#E41513" visible={isVisible} seed={1} />
            <p className="font-barlow font-400 text-white/70 text-base md:text-lg leading-relaxed">
              {metric.detail.headline}.
            </p>

            {/* Expandable detail */}
            <div
              className="grid transition-all duration-500 ease-out"
              style={{
                gridTemplateRows: expanded ? "1fr" : "0fr",
                opacity: expanded ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <p className="font-barlow font-400 text-white/60 text-sm leading-relaxed">
                  {metric.detail.body}
                </p>
                <ul className="mt-4 space-y-2">
                  {metric.detail.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-white/80 font-barlow font-500 text-sm"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#E41513] flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-barlow font-700 uppercase tracking-[0.2em] text-[11px] transition-colors"
            >
              {expanded ? "Hide details" : "How we measured it"}
              <ArrowRightSm rotated={expanded} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRightSm({ rotated }: { rotated: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{
        transform: rotated ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
      }}
    >
      <path
        d="M3 7h8M8 4l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact Metric Card                                                */
/* ------------------------------------------------------------------ */

function MetricCard({
  metric,
  expanded,
  onToggle,
  index,
}: {
  metric: Metric;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>(0.25);
  const value = useCountUp(metric.target, isVisible, 1800);
  const { Icon } = metric;

  return (
    <div
      ref={ref}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="relative rounded-2xl bg-white border border-gray-100 p-7 md:p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#E41513]/40 group"
      style={{
        boxShadow: expanded
          ? "0 20px 50px -12px rgba(228,21,19,0.18), 0 0 0 1px rgba(228,21,19,0.25)"
          : "0 1px 2px rgba(0,0,0,0.03)",
        transitionDelay: `${index * 60}ms`,
      }}
    >
      {/* Soft accent corner glow on hover */}
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(closest-side, ${metric.accent ?? "#E41513"}55, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors"
            style={{
              background: `${metric.accent ?? "#E41513"}1F`,
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: metric.accent ?? "#E41513" }}
            />
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#E41513] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </div>

        <div
          className="font-barlow italic font-900 text-[#0A0A0A] leading-none tabular-nums"
          style={{ fontSize: "clamp(2.75rem, 4.5vw, 4.5rem)" }}
        >
          {metric.format(value)}
        </div>

        <div className="font-barlow font-700 uppercase tracking-[0.2em] text-[11px] text-[#0A0A0A] mt-4">
          {metric.label}
        </div>
        <div className="font-barlow font-400 text-xs text-gray-500 mt-1">
          {metric.context}
        </div>

        <div className="mt-4">
          <Sparkline
            color={metric.accent ?? "#E41513"}
            visible={isVisible}
            seed={index + 2}
          />
        </div>

        {/* Expandable detail */}
        <div
          className="grid transition-all duration-500 ease-out mt-1"
          style={{
            gridTemplateRows: expanded ? "1fr" : "0fr",
            opacity: expanded ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <div className="pt-4 mt-2 border-t border-gray-100">
              <div className="font-barlow font-700 text-sm text-[#0A0A0A]">
                {metric.detail.headline}
              </div>
              <p className="font-barlow font-400 text-xs text-gray-600 mt-2 leading-relaxed">
                {metric.detail.body}
              </p>
              <ul className="mt-3 space-y-1.5">
                {metric.detail.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-[11px] text-gray-700 font-barlow font-500"
                  >
                    <span
                      className="mt-1 w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: metric.accent ?? "#E41513" }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-barlow font-700 uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#E41513] transition-colors">
          {expanded ? "Hide" : "Tap to expand"}
          <ArrowRightSm rotated={expanded} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function NumbersSection() {
  const [expanded, setExpanded] = useState<string | null>("hero");

  const toggle = (key: string) =>
    setExpanded((curr) => (curr === key ? null : key));

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
          backgroundImage:
            "radial-gradient(#E41513 1px, transparent 1px)",
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
            Every number below comes from the live M1 pipeline. Tap any card to see how it was measured.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <HeroMetricCard
            metric={HERO_METRIC}
            expanded={expanded === "hero"}
            onToggle={() => toggle("hero")}
          />
          {METRICS.map((m, i) => (
            <MetricCard
              key={m.label}
              metric={m}
              index={i}
              expanded={expanded === m.label}
              onToggle={() => toggle(m.label)}
            />
          ))}
        </div>

        {/* Ticker bar */}
        <div
          className="mt-14 rounded-2xl overflow-hidden border border-gray-100 bg-[#0A0A0A] relative"
          style={{
            boxShadow: "0 20px 50px -20px rgba(228,21,19,0.25)",
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 px-5 py-3 bg-[#E41513] text-white font-barlow font-900 uppercase tracking-[0.25em] text-[11px] flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              Live
            </div>
            <div className="flex-1 overflow-hidden numbers-ticker-mask">
              <div className="flex gap-10 whitespace-nowrap py-3 px-6 numbers-ticker-track">
                {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
                  <span
                    key={i}
                    className="font-barlow font-700 uppercase tracking-[0.25em] text-[11px] text-white/80 flex items-center gap-3"
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
