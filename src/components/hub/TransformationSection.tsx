import { useState, useEffect } from "react";
import {
  FileText, BarChart2, Shield, ArrowRight, Sparkles,
  Zap, Clock, TrendingUp, X, Check,
} from "lucide-react";
import ParticleField from "@/components/effects/ParticleField";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    Icon: FileText,
    label: "M1 · LIVE",
    title: "Every AP invoice auto-processed",
    body:
      "100% accuracy on 222 invoices. DBC integration in final gate. The pattern is validated.",
    accent: "#22C55E",
    state: "Live",
    moduleCode: "M1 · P1.30",
    timeline: "Live since Apr 2026",
    metrics: [
      { label: "Accuracy", value: "100%" },
      { label: "Invoices processed", value: "222" },
      { label: "Auto-route rate", value: "98%" },
      { label: "P0 bugs", value: "0" },
    ],
    highlights: [
      "Claude API classifies entity + confidence score per invoice",
      "Auto-route ≥0.90 → Dropbox /AP/{ENTITY_CODE}/",
      "AP Executive notified by M365 on every execution",
      "Full audit trail logged to Notion",
    ],
  },
  {
    Icon: BarChart2,
    label: "M3 · Q3 2026",
    title: "AR collections driven by AI",
    body:
      "Automated chase sequences. Tone calibrated per debtor. Zero manual follow-up loops.",
    accent: "#FCD34D",
    state: "Next",
    moduleCode: "M3 · P6.30",
    timeline: "Q3 2026 — kickoff after M1 hand-off",
    metrics: [
      { label: "Target DSO reduction", value: "-15%" },
      { label: "Manual follow-ups", value: "0" },
      { label: "Debtors covered", value: "All" },
      { label: "Channels", value: "Email · M365" },
    ],
    highlights: [
      "Claude-drafted chase emails per debtor profile",
      "Tone & cadence calibrated by aging bucket",
      "Auto-escalation to AR lead on threshold breach",
      "Power BI live dashboard for collections velocity",
    ],
  },
  {
    Icon: Shield,
    label: "M4 · Q4 2026",
    title: "VAT returns without manual lookup",
    body:
      "Rules engine + Claude API for Malta MGA compliance. Filings prepared in minutes, not days.",
    accent: "#A78BFA",
    state: "Next",
    moduleCode: "M4 · P7.30",
    timeline: "Q4 2026 — Malta MGA compliance scope",
    metrics: [
      { label: "Prep time", value: "Minutes" },
      { label: "Entities covered", value: "8" },
      { label: "Manual lookups", value: "0" },
      { label: "Compliance", value: "MGA" },
    ],
    highlights: [
      "Rules engine pulls invoices straight from DBC",
      "Claude API validates VAT codes against MGA matrix",
      "Pre-filled return with full audit reference",
      "Notion sign-off workflow before filing",
    ],
  },
];

const TIMELINE = [
  { label: "Apr 2026", value: "M1", caption: "AP Live", glow: true },
  { label: "Q3 2026", value: "M2 · M3", caption: "Revenue + AR" },
  { label: "Q4 2026", value: "M4 · M5", caption: "VAT + Cash Recon" },
];

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function TransformationSection() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>(0.15);
  const [phase, setPhase] = useState(0); // for the rotating aura
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 3), 2400);
    return () => clearInterval(id);
  }, []);

  const active = selected !== null ? PILLARS[selected] : null;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32 md:py-40 px-6"
      style={{
        background:
          "radial-gradient(ellipse at top, #1A1F2E 0%, #0F172A 45%, #060912 100%)",
      }}
      aria-labelledby="transformation-heading"
    >
      {/* Particle backdrop */}
      <ParticleField variant="dark-arc" />

      {/* Aurora sweeps */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(228,21,19,0.22), transparent 70%)",
          filter: "blur(60px)",
          animation: "transformation-aurora-a 14s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.20), transparent 70%)",
          filter: "blur(60px)",
          animation: "transformation-aurora-b 18s ease-in-out infinite",
        }}
      />

      {/* Grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="flex justify-center mb-8">
          <div
            className="relative inline-flex items-center gap-2.5 px-5 py-2 rounded-full backdrop-blur-md"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow:
                "0 8px 28px -10px rgba(228,21,19,0.45), 0 0 0 1px rgba(228,21,19,0.18) inset",
            }}
          >
            <span
              aria-hidden
              className="absolute -inset-px rounded-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(228,21,19,0.0), rgba(228,21,19,0.55), rgba(228,21,19,0.0))",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                padding: "1px",
                opacity: 0.7,
              }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#FF4543",
                boxShadow: "0 0 10px #FF4543, 0 0 18px rgba(228,21,19,0.7)",
              }}
            />
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-barlow font-700 uppercase tracking-[0.32em] text-[11px]">
              The Transformation
            </span>
          </div>
        </div>

        {/* Headline — cinematic stack */}
        <div className="text-center">
          <div
            className="font-barlow italic font-900 text-white leading-[0.92] transition-all duration-1000"
            style={{
              fontSize: "clamp(2.75rem, 7.5vw, 7.5rem)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(24px)",
              textShadow: "0 6px 40px rgba(0,0,0,0.5)",
            }}
          >
            M1 is the pattern.
          </div>

          <div
            className="font-barlow italic font-900 leading-[0.92] mt-2 transition-all duration-1000 delay-150 relative inline-block"
            style={{
              fontSize: "clamp(2.75rem, 7.5vw, 7.5rem)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(90deg, #FF6B6B 0%, #E41513 35%, #FF3D3B 70%, #FFB3B2 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "transformation-shine 6s linear infinite",
                filter: "drop-shadow(0 4px 30px rgba(228,21,19,0.45))",
              }}
            >
              Five modules.
            </span>
          </div>

          <div
            className="font-barlow italic font-900 text-white/35 leading-[0.92] mt-2 transition-all duration-1000 delay-300"
            style={{
              fontSize: "clamp(2.75rem, 7.5vw, 7.5rem)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(24px)",
            }}
            id="transformation-heading"
          >
            Full transformation.
          </div>

          <p className="font-barlow font-400 text-white/55 text-base md:text-lg max-w-2xl mx-auto mt-8">
            One proven blueprint. Replicated across Finance. Compounding from the moment it ships.
          </p>
        </div>

        {/* Premium timeline */}
        <div className="mt-16 mb-20">
          <div className="relative">
            {/* baseline */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(228,21,19,0.6) 20%, rgba(228,21,19,0.4) 80%, transparent 100%)",
              }}
            />
            <div className="relative grid grid-cols-3 gap-4">
              {TIMELINE.map((t, i) => {
                const isCurrent = phase === i;
                return (
                  <div key={t.label} className="flex flex-col items-center">
                    {/* node */}
                    <div className="relative mb-4">
                      {(t.glow || isCurrent) && (
                        <span
                          aria-hidden
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            background: "rgba(228,21,19,0.4)",
                            animationDuration: "2.4s",
                          }}
                        />
                      )}
                      <div
                        className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
                        style={{
                          background: t.glow
                            ? "linear-gradient(135deg, #E41513, #8B0F0E)"
                            : isCurrent
                              ? "rgba(228,21,19,0.18)"
                              : "rgba(255,255,255,0.05)",
                          border: t.glow
                            ? "2px solid #E41513"
                            : "1px solid rgba(255,255,255,0.15)",
                          boxShadow: t.glow
                            ? "0 0 30px rgba(228,21,19,0.6)"
                            : "none",
                        }}
                      >
                        {t.glow ? (
                          <Zap className="w-5 h-5 text-white" />
                        ) : i === 1 ? (
                          <TrendingUp className="w-5 h-5 text-white/70" />
                        ) : (
                          <Shield className="w-5 h-5 text-white/70" />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-barlow font-700 uppercase tracking-[0.25em] text-[10px] text-white/45">
                        {t.label}
                      </div>
                      <div className="font-barlow italic font-900 text-white text-2xl md:text-3xl mt-1 leading-none">
                        {t.value}
                      </div>
                      <div className="font-barlow font-400 text-xs text-white/55 mt-1">
                        {t.caption}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pillar cards — connected, premium */}
        <div className="relative">
          {/* Connecting rail behind cards */}
          <div
            aria-hidden
            className="hidden md:block absolute left-[8%] right-[8%] top-[68px] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.45) 18%, rgba(252,211,77,0.45) 50%, rgba(167,139,250,0.45) 82%, transparent 100%)",
              filter: "blur(0.5px)",
            }}
          />
          <div className="grid md:grid-cols-3 gap-5 text-left relative">
            {PILLARS.map((p, i) => (
              <button
                type="button"
                key={p.title}
                onClick={() => setSelected(i)}
                aria-label={`Open details for ${p.title}`}
                className="group relative rounded-2xl p-7 md:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                style={{
                  background:
                    "linear-gradient(155deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 45%, rgba(10,16,28,0.55) 100%)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  boxShadow:
                    "0 24px 60px -24px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.10) inset, 0 0 0 1px rgba(255,255,255,0.02) inset",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {/* Inner glow that follows accent */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(120% 80% at 0% 0%, ${p.accent}14, transparent 55%)`,
                  }}
                />
                {/* Hover halo bottom-right */}
                <div
                  aria-hidden
                  className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(closest-side, ${p.accent}55, transparent 70%)`,
                    filter: "blur(24px)",
                  }}
                />

                {/* Top accent — brighter, glowing */}
                <div
                  aria-hidden
                  className="absolute top-0 inset-x-6 h-[2px] rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${p.accent} 50%, transparent 100%)`,
                    boxShadow: `0 0 18px ${p.accent}aa`,
                    opacity: 0.9,
                  }}
                />

                {/* Gradient border ring */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    padding: "1px",
                    background: `linear-gradient(160deg, ${p.accent}66, transparent 40%, transparent 70%, ${p.accent}33)`,
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${p.accent}33 0%, ${p.accent}0D 100%)`,
                        border: `1px solid ${p.accent}66`,
                        boxShadow: `0 10px 30px -8px ${p.accent}80, 0 0 0 1px ${p.accent}22 inset`,
                      }}
                    >
                      <p.Icon className="w-6 h-6" style={{ color: p.accent, filter: `drop-shadow(0 0 8px ${p.accent}aa)` }} />
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.22em] text-[9px]"
                      style={{
                        color: p.accent,
                        background: `${p.accent}1A`,
                        border: `1px solid ${p.accent}55`,
                        boxShadow: `0 0 14px -4px ${p.accent}80`,
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{
                          background: p.accent,
                          boxShadow: `0 0 6px ${p.accent}`,
                        }}
                      />
                      {p.state}
                    </span>
                  </div>

                  <div
                    className="font-barlow font-700 uppercase tracking-[0.24em] text-[10px]"
                    style={{ color: `${p.accent}`, opacity: 0.85 }}
                  >
                    {p.label}
                  </div>
                  <h3 className="font-barlow font-700 text-white text-xl mt-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="font-barlow font-400 text-sm text-white/60 mt-3 leading-relaxed">
                    {p.body}
                  </p>

                  {/* Hairline divider + footer accent */}
                  <div
                    aria-hidden
                    className="mt-6 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                    }}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-barlow font-700 uppercase tracking-[0.22em] text-[9px] text-white/40">
                      Module {i === 0 ? "01" : i === 1 ? "03" : "04"} · Click for details
                    </span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-all duration-500 group-hover:translate-x-1"
                      style={{ color: p.accent, opacity: 0.85 }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Closing manifesto */}
        <div className="mt-20 text-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: "rgba(228,21,19,0.10)",
              border: "1px solid rgba(228,21,19,0.35)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Clock className="w-4 h-4 text-[#E41513]" />
            <span className="font-barlow font-700 uppercase tracking-[0.25em] text-[11px] text-white/80">
              By Q4 2026
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/40" />
            <span className="font-barlow font-700 uppercase tracking-[0.25em] text-[11px] text-[#E41513]">
              FBM Finance runs on hyperautomation
            </span>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent
          className="max-w-2xl border-0 p-0 overflow-hidden bg-transparent shadow-none"
          showCloseButton={false}
        >
          {active && (
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(160deg, #1A1F2E 0%, #0F172A 50%, #060912 100%)",
                border: `1px solid ${active.accent}55`,
                boxShadow: `0 40px 100px -30px ${active.accent}60, 0 0 0 1px rgba(255,255,255,0.05) inset`,
              }}
            >
              {/* Accent glow */}
              <div
                aria-hidden
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(closest-side, ${active.accent}55, transparent 70%)`,
                  filter: "blur(40px)",
                }}
              />
              {/* Top accent bar */}
              <div
                aria-hidden
                className="absolute top-0 inset-x-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${active.accent}, transparent)`,
                  boxShadow: `0 0 20px ${active.accent}`,
                }}
              />

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 p-8 md:p-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${active.accent}33, ${active.accent}0D)`,
                      border: `1px solid ${active.accent}66`,
                      boxShadow: `0 10px 30px -8px ${active.accent}80`,
                    }}
                  >
                    <active.Icon
                      className="w-6 h-6"
                      style={{ color: active.accent, filter: `drop-shadow(0 0 8px ${active.accent}aa)` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-barlow font-700 uppercase tracking-[0.22em] text-[10px]"
                        style={{ color: active.accent }}
                      >
                        {active.moduleCode}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[9px]"
                        style={{
                          color: active.accent,
                          background: `${active.accent}1A`,
                          border: `1px solid ${active.accent}55`,
                        }}
                      >
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ background: active.accent, boxShadow: `0 0 6px ${active.accent}` }}
                        />
                        {active.state}
                      </span>
                    </div>
                    <h3 className="font-barlow font-700 text-white text-2xl md:text-3xl mt-2 leading-tight">
                      {active.title}
                    </h3>
                    <div className="font-barlow font-400 text-xs text-white/55 mt-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {active.timeline}
                    </div>
                  </div>
                </div>

                <p className="font-barlow font-400 text-white/70 text-sm md:text-base leading-relaxed mb-6">
                  {active.body}
                </p>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
                  {active.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl p-3 text-center"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        className="font-barlow italic font-900 text-xl md:text-2xl leading-none"
                        style={{ color: active.accent }}
                      >
                        {m.value}
                      </div>
                      <div className="font-barlow font-700 uppercase tracking-[0.18em] text-[9px] text-white/50 mt-1.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="font-barlow font-700 uppercase tracking-[0.24em] text-[10px] text-white/55 mb-3">
                    What it does
                  </div>
                  <ul className="space-y-2.5">
                    {active.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{
                            background: `${active.accent}22`,
                            border: `1px solid ${active.accent}66`,
                          }}
                        >
                          <Check className="w-2.5 h-2.5" style={{ color: active.accent }} />
                        </span>
                        <span className="font-barlow font-400 text-sm text-white/75 leading-relaxed">
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
