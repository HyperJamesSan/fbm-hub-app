import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import ParticleField from "@/components/effects/ParticleField";

/* Typewriter: reveals chars one-by-one, with a metallic-red animated caret */
function Typewriter({
  text,
  startDelay = 0,
  speed = 70,
  className = "",
  style,
  caretColor = "metallic",
  onDone,
  showCaretWhenDone = false,
}: {
  text: string;
  startDelay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  caretColor?: "metallic" | "dark";
  onDone?: () => void;
  showCaretWhenDone?: boolean;
}) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = window.setTimeout(() => {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i++;
        setCount(i);
        if (i < text.length) {
          window.setTimeout(tick, speed);
        } else {
          setDone(true);
          onDone?.();
        }
      };
      tick();
    }, startDelay);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const visible = text.slice(0, count);
  const showCaret = !done || showCaretWhenDone;

  return (
    <span className={className} style={style} aria-label={text}>
      <span style={{ whiteSpace: "pre" }}>{visible}</span>
      {showCaret && (
        <span
          aria-hidden
          className={
            caretColor === "metallic"
              ? "tw-caret tw-caret-metallic"
              : "tw-caret tw-caret-dark"
          }
        />
      )}
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
  const [scrollY, setScrollY] = useState(0);
  const [textDone, setTextDone] = useState(false);

  // Timing: line 1 ~ "AI - Hyperautomation" (20 chars * 70ms ≈ 1400ms) + 200ms delay
  const LINE1 = "AI - Hyperautomation";
  const LINE2 = "FBM Malta";
  const LINE1_START = 250;
  const LINE1_SPEED = 70;
  const LINE2_START = LINE1_START + LINE1.length * LINE1_SPEED + 200;
  const LINE2_SPEED = 90;
  const TEXT_DONE_AT = LINE2_START + LINE2.length * LINE2_SPEED + 200;

  useEffect(() => {
    const t = window.setTimeout(() => setTextDone(true), TEXT_DONE_AT);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [TEXT_DONE_AT]);

  const headlineScale = Math.max(0.92, 1 - scrollY / 4000);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-screen flex items-center justify-center pt-24 pb-20 px-6 bg-background"
    >
      {/* Particles fade in only after the text finishes typing */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
        style={{ opacity: textDone ? 1 : 0 }}
      >
        <ParticleField variant="hero" />
      </div>

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
          className="font-barlow italic font-900 text-[#0A0A0A] tracking-tight whitespace-nowrap"
          style={{ fontSize: "clamp(2.25rem, 5.6vw, 6.5rem)", lineHeight: 0.96, minHeight: "1em" }}
        >
          <Typewriter text={LINE1} startDelay={LINE1_START} speed={LINE1_SPEED} caretColor="metallic" />
        </h1>

        <h1
          className="relative font-barlow italic font-900 tracking-tight text-[#E41513] whitespace-nowrap"
          style={{ fontSize: "clamp(2.25rem, 5.6vw, 6.5rem)", lineHeight: 0.96, minHeight: "1em" }}
        >
          <Typewriter
            text={LINE2}
            startDelay={LINE2_START}
            speed={LINE2_SPEED}
            caretColor="metallic"
          />
        </h1>

        <p
          className="kpi-fade font-barlow font-400 text-lg md:text-xl text-[#374151] max-w-xl mx-auto mt-10"
          style={{ animationDelay: `${TEXT_DONE_AT}ms` }}
        >
          8 entities. 5 modules. Zero manual bottlenecks.
        </p>

        <a
          href="#pipeline"
          className="kpi-fade group inline-flex items-center gap-2 mt-10 rounded-full bg-[#0A0A0A] text-white font-barlow font-700 px-10 py-4 text-lg transition-all duration-300 hover:scale-105 hover:bg-[#E41513]"
          style={{
            animationDelay: `${TEXT_DONE_AT + 200}ms`,
            boxShadow: "0 12px 32px rgba(17,17,17,0.18)",
          }}
        >
          Explore the pipeline
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        <div
          className="kpi-fade grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-16 w-full"
          style={{ animationDelay: `${TEXT_DONE_AT + 400}ms` }}
        >
          <GlassKpi value="384" label="Invoices" delay={TEXT_DONE_AT + 500} />
          <GlassKpi value="100%" label="Accuracy" delay={TEXT_DONE_AT + 600} />
          <GlassKpi value="0" label="P0 Bugs" delay={TEXT_DONE_AT + 700} />
          <GlassKpi value="8" label="Entities" delay={TEXT_DONE_AT + 800} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-6 h-6 text-[#0A0A0A]/40 bounce-soft" />
      </div>
    </section>
  );
}
