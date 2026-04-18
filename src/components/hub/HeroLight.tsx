import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import ParticleField from "@/components/effects/ParticleField";

/* Splits text into spans with staggered char-rise animation */
function AnimatedHeadline({
  text,
  startDelay = 0,
  className = "",
  style,
}: {
  text: string;
  startDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={className} style={style} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          className="char-rise"
          style={{ animationDelay: `${startDelay + i * 35}ms` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

function GlassKpi({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <div
      className="kpi-fade rounded-[20px] px-6 py-6 md:px-8 md:py-7 text-center backdrop-blur-xl border bg-white/60"
      style={{
        borderColor: "rgba(17,17,17,0.06)",
        boxShadow: "0 8px 32px rgba(228,21,19,0.06), 0 1px 0 rgba(255,255,255,0.7) inset",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="font-barlow italic font-900 text-[#111111] leading-none"
        style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.25rem)" }}
      >
        {value}
      </div>
      <div className="font-barlow font-700 uppercase text-[10px] md:text-xs tracking-[0.18em] text-[#6B7280] mt-3">
        {label}
      </div>
    </div>
  );
}

export default function HeroLight() {
  const ref = useRef<HTMLElement | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      setParallax({ x: cx, y: cy });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const headlineScale = Math.max(0.92, 1 - scrollY / 4000);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-screen flex items-center justify-center pt-24 pb-20 px-6 bg-background"
    >
      {/* Interactive particle field (white dots, repel on hover) */}
      <ParticleField variant="hero" />

      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,17,17,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      <div
        className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center"
        style={{
          transform: `scale(${headlineScale}) translateY(${scrollY * 0.08}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        {/* Status pills */}
        <div
          className="kpi-fade flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10"
          style={{ animationDelay: "0ms" }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#111111]/8 bg-white/70 backdrop-blur-sm text-[#111111] text-[10px] md:text-xs font-barlow font-700 uppercase tracking-[0.16em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] live-pulse-dot" />
            Pipeline Live
          </span>
          <span className="px-4 py-2 rounded-full border border-[#111111]/8 bg-white/70 backdrop-blur-sm text-[#374151] text-[10px] md:text-xs font-barlow font-600 uppercase tracking-[0.16em]">
            M1 · UAT Pass · 16 Apr 2026
          </span>
          <span className="px-4 py-2 rounded-full border border-[#111111]/8 bg-white/70 backdrop-blur-sm text-[#374151] text-[10px] md:text-xs font-barlow font-600 uppercase tracking-[0.16em]">
            Q2 2026
          </span>
        </div>

        <h1
          className="text-black tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Sharp Sans', 'DM Sans', sans-serif", fontWeight: 800, fontStyle: "normal", fontSize: "clamp(2.75rem, 6.4vw, 7.5rem)", lineHeight: 0.92 }}
        >
          <AnimatedHeadline text="Hyperautomation" startDelay={150} />
        </h1>

        <h1
          className="relative text-black tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Sharp Sans', 'DM Sans', sans-serif", fontWeight: 700, fontStyle: "italic", fontSize: "clamp(2.75rem, 6.4vw, 7.5rem)", lineHeight: 0.92 }}
        >
          <AnimatedHeadline text="FBM Malta." startDelay={150 + 15 * 35} />
        </h1>

        <p
          className="kpi-fade text-lg md:text-xl text-[#374151] max-w-2xl mx-auto mt-10"
          style={{ fontFamily: "'Sharp Sans', 'DM Sans', sans-serif", fontWeight: 500, animationDelay: "1700ms" }}
        >
          5 departments. Infinite scale. Zero manual bottlenecks.
        </p>

        <a
          href="#pipeline"
          className="kpi-fade group inline-flex items-center gap-2 mt-10 rounded-full bg-[#0A0A0A] text-white font-barlow font-700 px-10 py-4 text-lg transition-all duration-300 hover:scale-105 hover:bg-[#E41513]"
          style={{
            animationDelay: "1900ms",
            boxShadow: "0 12px 32px rgba(17,17,17,0.18)",
          }}
        >
          Explore the pipeline
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        <div
          className="kpi-fade grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-16 w-full"
          style={{ animationDelay: "2100ms" }}
        >
          <GlassKpi value="384" label="Invoices" delay={2200} />
          <GlassKpi value="100%" label="Accuracy" delay={2300} />
          <GlassKpi value="0" label="P0 Bugs" delay={2400} />
          <GlassKpi value="8" label="Entities" delay={2500} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-6 h-6 text-[#0A0A0A]/40 bounce-soft" />
      </div>
    </section>
  );
}
