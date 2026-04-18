import { useState, useEffect } from "react";
import {
  FileText, BarChart2, Shield, ArrowRight, Sparkles,
  Zap, Clock, TrendingUp,
} from "lucide-react";
import ParticleField from "@/components/effects/ParticleField";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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
  },
  {
    Icon: BarChart2,
    label: "M3 · Q3 2026",
    title: "AR collections driven by AI",
    body:
      "Automated chase sequences. Tone calibrated per debtor. Zero manual follow-up loops.",
    accent: "#FCD34D",
    state: "Next",
  },
  {
    Icon: Shield,
    label: "M4 · Q4 2026",
    title: "VAT returns without manual lookup",
    body:
      "Rules engine + Claude API for Malta MGA compliance. Filings prepared in minutes, not days.",
    accent: "#A78BFA",
    state: "Next",
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

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 3), 2400);
    return () => clearInterval(id);
  }, []);

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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md"
            style={{
              background: "rgba(228,21,19,0.12)",
              border: "1px solid rgba(228,21,19,0.35)",
            }}
          >
            <Sparkles className="w-3 h-3 text-[#E41513]" />
            <span className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.3em] text-[11px]">
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

        {/* Pillar cards */}
        <div className="grid md:grid-cols-3 gap-5 text-left">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className="group relative rounded-2xl p-7 md:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(8px)",
                boxShadow:
                  "0 18px 40px -20px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Hover glow */}
              <div
                aria-hidden
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(closest-side, ${p.accent}55, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />

              {/* Top accent line */}
              <div
                aria-hidden
                className="absolute top-0 inset-x-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${p.accent} 50%, transparent 100%)`,
                  opacity: 0.6,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${p.accent}1F`,
                      border: `1px solid ${p.accent}55`,
                      boxShadow: `0 8px 20px -8px ${p.accent}66`,
                    }}
                  >
                    <p.Icon className="w-5 h-5" style={{ color: p.accent }} />
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[9px]"
                    style={{
                      color: p.accent,
                      background: `${p.accent}14`,
                      border: `1px solid ${p.accent}44`,
                    }}
                  >
                    {p.state}
                  </span>
                </div>

                <div className="font-barlow font-700 uppercase tracking-[0.22em] text-[10px] text-white/50">
                  {p.label}
                </div>
                <h3 className="font-barlow font-700 text-white text-xl mt-2 leading-snug">
                  {p.title}
                </h3>
                <p className="font-barlow font-400 text-sm text-white/55 mt-3 leading-relaxed">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
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
    </section>
  );
}
