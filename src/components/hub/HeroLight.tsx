import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import ParticleField from "@/components/effects/ParticleField";

const LINE1 = "AI - Hyperautomation";
const LINE2 = "FBM Malta";
const START_DELAY = 350;
const LINE_PAUSE = 420; // pause between lines (caret jump)
const TAIL_PAUSE = 250;

/* Organic per-char delay: base speed with subtle variation,
   slower on spaces & punctuation for a human cadence. */
function charDelay(ch: string, i: number) {
  const base = 95;
  const jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1;
  const jitter2 = (Math.sin(i * 78.233 + 4.1) * 17231.17) % 1;
  const variance = (jitter - 0.5) * 70 + (jitter2 - 0.5) * 30; // organic ±50ms
  let extra = 0;
  if (ch === " ") extra = 110;
  else if (",.;:!?".includes(ch)) extra = 220;
  else if ("-".includes(ch)) extra = 90;
  // Occasional micro-hesitations like a real typist
  if ((jitter2 + 1) % 1 > 0.92) extra += 90;
  return Math.max(45, base + variance + extra);
}

type Stop = {
  code: string;
  name: string;
  status: string;
  state: "live" | "queued";
};

const ROADMAP_STOPS: Stop[] = [
  { code: "M1", name: "AP Automation", status: "LIVE", state: "live" },
  { code: "M2", name: "Revenue Invoicing", status: "Q3 2026", state: "queued" },
  { code: "M3", name: "AR Collections", status: "Q4 2026", state: "queued" },
  { code: "M4", name: "Administración", status: "2027", state: "queued" },
  { code: "M5", name: "Operaciones", status: "2027", state: "queued" },
];

function ProgramRoadmap() {
  return (
    <div className="w-full">
      {/* Desktop / tablet — horizontal */}
      <div className="hidden md:block relative">
        {/* Connector track */}
        <div className="absolute left-0 right-0 top-3 h-px bg-[#111111]/10" />
        {/* Progress segment from M1 → ~halfway to M2 (1 of 5 stops = 12.5% across centers) */}
        <div
          className="absolute top-3 h-px bg-[#E41513]"
          style={{ left: "10%", width: "15%" }}
        />

        <div className="relative grid grid-cols-5 gap-4">
          {ROADMAP_STOPS.map((s) => {
            const isLive = s.state === "live";
            return (
              <div key={s.code} className="flex flex-col items-center text-center">
                {/* Node */}
                <div className="relative flex items-center justify-center h-6 w-6">
                  {isLive && (
                    <span className="absolute inline-flex h-6 w-6 rounded-full bg-[#22C55E]/30 animate-ping" />
                  )}
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      isLive ? "bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.7)]" : "bg-[#111111]/25"
                    }`}
                  />
                </div>

                <div
                  className={`mt-4 font-barlow font-700 text-[11px] tracking-[0.18em] uppercase ${
                    isLive ? "text-[#E41513]" : "text-[#9CA3AF]"
                  }`}
                >
                  {s.code}
                </div>
                <div
                  className={`mt-1 font-barlow font-600 text-sm md:text-base ${
                    isLive ? "text-[#0A0A0A]" : "text-[#6B7280]"
                  }`}
                >
                  {s.name}
                </div>
                <div className="mt-2">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E41513] text-white text-[10px] font-barlow font-700 uppercase tracking-[0.14em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse-dot" />
                      {s.status}
                    </span>
                  ) : (
                    <span className="inline-block text-[10px] font-barlow font-600 uppercase tracking-[0.14em] text-[#9CA3AF]">
                      {s.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile — vertical */}
      <div className="md:hidden relative pl-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#111111]/10" />
        <div
          className="absolute left-[11px] w-px bg-[#E41513]"
          style={{ top: "0.5rem", height: "18%" }}
        />
        <ul className="space-y-7">
          {ROADMAP_STOPS.map((s) => {
            const isLive = s.state === "live";
            return (
              <li key={s.code} className="relative">
                <span className="absolute -left-[26px] top-1 flex items-center justify-center h-5 w-5">
                  {isLive && (
                    <span className="absolute inline-flex h-5 w-5 rounded-full bg-[#22C55E]/30 animate-ping" />
                  )}
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      isLive ? "bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.7)]" : "bg-[#111111]/25"
                    }`}
                  />
                </span>
                <div
                  className={`font-barlow font-700 text-[11px] tracking-[0.18em] uppercase ${
                    isLive ? "text-[#E41513]" : "text-[#9CA3AF]"
                  }`}
                >
                  {s.code}
                </div>
                <div
                  className={`mt-0.5 font-barlow font-600 text-base ${
                    isLive ? "text-[#0A0A0A]" : "text-[#6B7280]"
                  }`}
                >
                  {s.name}
                </div>
                <div className="mt-1.5">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E41513] text-white text-[10px] font-barlow font-700 uppercase tracking-[0.14em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse-dot" />
                      {s.status}
                    </span>
                  ) : (
                    <span className="inline-block text-[10px] font-barlow font-600 uppercase tracking-[0.14em] text-[#9CA3AF]">
                      {s.status}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function HeroLight() {
  const ref = useRef<HTMLElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [activeLine, setActiveLine] = useState<1 | 2>(1);
  const [caretVisible, setCaretVisible] = useState(false); // appears just before typing starts
  const [caretMounted, setCaretMounted] = useState(true);
  const [textDone, setTextDone] = useState(false);

  // Drive the typing with chained timeouts (organic cadence)
  useEffect(() => {
    const timers: number[] = [];
    let t = START_DELAY - 220; // caret fades in slightly before first char

    timers.push(window.setTimeout(() => setCaretVisible(true), Math.max(0, t)));
    t = START_DELAY;

    // Line 1
    for (let i = 1; i <= LINE1.length; i++) {
      const ch = LINE1[i - 1];
      t += charDelay(ch, i);
      const at = t;
      timers.push(window.setTimeout(() => setCount1(i), at));
    }
    // Pause + jump caret to line 2
    t += LINE_PAUSE;
    timers.push(window.setTimeout(() => setActiveLine(2), t));

    // Line 2
    for (let i = 1; i <= LINE2.length; i++) {
      const ch = LINE2[i - 1];
      t += charDelay(ch, i + 100);
      const at = t;
      timers.push(window.setTimeout(() => setCount2(i), at));
    }

    t += TAIL_PAUSE;
    // Start fading the caret out
    timers.push(window.setTimeout(() => setCaretVisible(false), t));
    // Then unmount it completely after the fade transition
    timers.push(window.setTimeout(() => setCaretMounted(false), t + 3400));
    timers.push(window.setTimeout(() => setTextDone(true), t + 200));

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headlineScale = Math.max(0.92, 1 - scrollY / 4000);

  // Render only chars typed so far — caret naturally rides at the end.
  const renderChars = (text: string, count: number, keyPrefix: string) => (
    <>
      {Array.from(text).slice(0, count).map((ch, i) => (
        <span
          key={`${keyPrefix}-${i}`}
          className="tw-char tw-char-in"
          style={{ whiteSpace: "pre" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </>
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-screen flex items-center justify-center pt-24 pb-20 px-6 bg-background"
    >
      {/* Particles fade in only after the text finishes typing */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
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
          className="font-montserrat not-italic font-extrabold text-[#0A0A0A] tracking-tighter whitespace-nowrap"
          style={{ fontSize: "clamp(2.625rem, 6.2vw, 7.125rem)", lineHeight: 0.96, minHeight: "1em" }}
        >
          {renderChars(LINE1, count1, "l1")}
          <span
            aria-hidden
            className={`tw-caret tw-caret-metallic ${
              caretMounted && activeLine === 1 && caretVisible ? "tw-caret-on" : "tw-caret-off"
            }`}
          />
        </h1>

        <h1
          className="relative font-montserrat not-italic font-extrabold tracking-tighter text-[#E41513] whitespace-nowrap"
          style={{ fontSize: "clamp(2.4375rem, 5.9vw, 6.8125rem)", lineHeight: 0.96, minHeight: "1em" }}
        >
          {renderChars(LINE2, count2, "l2")}
          <span
            aria-hidden
            className={`tw-caret tw-caret-metallic ${
              caretMounted && activeLine === 2 && caretVisible ? "tw-caret-on" : "tw-caret-off"
            }`}
          />
        </h1>

        <p
          className={`font-barlow font-normal md:text-xl text-muted-foreground text-2xl max-w-xl mx-auto mt-10 transition-all duration-700 ease-out ${
            textDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          Built for Finance. Designed for everyone.
        </p>

        <a
          href="#pipeline"
          className={`cta-pipeline group relative inline-flex items-center gap-3 mt-10 rounded-full bg-[#0A0A0A] text-white font-barlow font-700 px-10 py-4 text-lg overflow-hidden transition-all duration-700 ease-out hover:bg-[#141414] ${
            textDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{
            transitionDelay: textDone ? "180ms" : "0ms",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span aria-hidden className="cta-pipeline-sheen" />
          <span className="relative z-10">Explore the pipeline</span>
          <ArrowRight className="relative z-10 w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        <div
          className={`mt-16 w-full transition-all duration-700 ease-out ${
            textDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: textDone ? "360ms" : "0ms" }}
        >
          <ProgramRoadmap />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-6 h-6 text-[#0A0A0A]/40 bounce-soft" />
      </div>
    </section>
  );
}
