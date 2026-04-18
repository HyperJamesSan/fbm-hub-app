import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type Milestone = {
  tag: "DONE" | "LIVE" | "NEXT";
  date: string;
  category: string;
  headline: string;
  detail: string;
};

const MILESTONES: Milestone[] = [
  {
    tag: "DONE",
    date: "16 APR 2026",
    category: "UAT",
    headline: "M1 passes UAT with 100% INVOICE accuracy across 222 PDFs",
    detail: "All 6 acceptance criteria met · 0 P0 bugs · Apr 16 2026",
  },
  {
    tag: "LIVE",
    date: "NOW",
    category: "PIPELINE",
    headline: "384 invoices classified · 100% auto-routed across 8 entities",
    detail: "Claude API · PROMPT v1.4 · max confidence 0.98",
  },
  {
    tag: "DONE",
    date: "APR 2026",
    category: "OPERATIONS",
    headline: "Processing time cut from 12–17 min to seconds per invoice",
    detail: "Manual classification eliminated · audit trail logged in Notion",
  },
  {
    tag: "NEXT",
    date: "Q3 2026",
    category: "ROADMAP",
    headline: "M2 Revenue Invoicing MX + Online enters build phase",
    detail: "P5.20 / P5.40 · Collections (M3) queued in parallel",
  },
  {
    tag: "NEXT",
    date: "Q4 2026",
    category: "ROADMAP",
    headline: "M4 VAT Return Automation & M5 Daily Cash Reconciliation",
    detail: "P7.30 + P6.20 · closes the Finance hyperautomation loop",
  },
];

const TICKER = [
  "M1 ACTIVE",
  "UAT PASS · 16 APR 2026",
  "100% INVOICE ACCURACY",
  "384 PDFs CLASSIFIED",
  "0 P0 BUGS",
  "100% AUTO-ROUTE",
  "8 ENTITIES COVERED",
  "CONFIDENCE 0.98",
  "NEXT · Q3 2026 M2 REVENUE",
];

function useLiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Europe/Malta",
  });
}

function formatDate(d: Date) {
  return d
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Europe/Malta",
    })
    .toUpperCase();
}

export default function LiveNewsroom() {
  const now = useLiveClock();
  const [active, setActive] = useState(0);
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>(0.2);

  // Rotate headlines every 4.5s
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % MILESTONES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const current = MILESTONES[active];

  return (
    <section
      ref={ref}
      className={`relative bg-[#0F172A] text-white overflow-hidden section-reveal ${
        isVisible ? "visible" : ""
      }`}
    >
      {/* subtle red dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(228,21,19,0.9) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* top scanline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E41513] to-transparent" />

      {/* ====== COMPACT HERO (matches old red banner height) ====== */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Top meta row: LIVE + Newsroom label + clock */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#E41513] px-2.5 py-1 rounded-sm shadow-[0_0_20px_rgba(228,21,19,0.5)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="font-barlow font-900 text-[10px] tracking-[0.2em] uppercase">
                Live
              </span>
            </div>
            <div className="font-barlow font-700 text-[10px] tracking-[0.25em] uppercase text-white/50">
              FBM Newsroom · P1.30 FMT
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-white/40 tracking-wider">{formatDate(now)}</span>
            <span className="text-white/15">|</span>
            <span className="text-[#E41513] font-bold tracking-[0.15em] tabular-nums">
              {formatTime(now)} CET
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: headline rotating */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`font-barlow font-900 text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 rounded-sm ${
                  current.tag === "LIVE"
                    ? "bg-[#E41513] text-white shadow-[0_0_15px_rgba(228,21,19,0.4)]"
                    : current.tag === "DONE"
                    ? "bg-white text-[#0F172A]"
                    : "bg-transparent border border-white/40 text-white/80"
                }`}
              >
                {current.tag}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
                {current.category}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">
                · {current.date}
              </span>
            </div>

            {/* Rotating headline */}
            <div className="relative min-h-[110px] md:min-h-[130px]">
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-all duration-700 ease-out"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform:
                      i === active ? "translateY(0)" : "translateY(10px)",
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                >
                  <h2
                    className="font-barlow font-900 leading-[0.95] text-white"
                    style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.4rem)" }}
                  >
                    {m.headline}
                  </h2>
                  <p className="font-barlow font-400 text-white/55 mt-2 text-sm md:text-base max-w-2xl">
                    {m.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4 flex items-center gap-2">
              {MILESTONES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show milestone ${i + 1}`}
                  className="h-0.5 flex-1 bg-white/10 overflow-hidden relative"
                >
                  <span
                    className="absolute inset-y-0 left-0 bg-[#E41513]"
                    style={{
                      width:
                        i === active ? "100%" : i < active ? "100%" : "0%",
                      transition:
                        i === active
                          ? "width 4500ms linear"
                          : "width 200ms ease",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: live stats */}
          <aside className="lg:col-span-4 lg:border-l lg:border-white/10 lg:pl-8">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">
              · Live Stats
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2">
              {[
                { k: "Invoices", v: "384" },
                { k: "Auto-Route", v: "100%" },
                { k: "Confidence", v: "0.98" },
                { k: "Entities", v: "8 / 8" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="flex items-baseline justify-between border-b border-white/5 pb-1.5"
                >
                  <span className="font-barlow font-400 text-xs text-white/60">
                    {s.k}
                  </span>
                  <span className="font-barlow font-900 italic text-lg text-white tabular-nums">
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
