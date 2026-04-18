import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, AlertTriangle, User, FileX, Mail, FileText, Brain, GitBranch,
  FolderOpen, Bell, BookOpen, Zap, Package, Shield, BarChart2, CheckCircle2,
  Lightbulb,
} from "lucide-react";
import GlobalHeader from "@/components/GlobalHeader";
import ParticleField from "@/components/effects/ParticleField";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import HeroLight from "@/components/hub/HeroLight";
import PipelineFlow from "@/components/hub/PipelineFlow";
import LiveNewsroom from "@/components/hub/LiveNewsroom";
import NumbersSection from "@/components/hub/NumbersSection";
import TransformationSection from "@/components/hub/TransformationSection";
import StackWave from "@/components/hub/StackWave";
import logoBHL from "@/assets/entities/bhl.jpg";
import logoFBM from "@/assets/entities/fbm.png";
import logoNMT from "@/assets/entities/nmt.jpg";
import logoDMT from "@/assets/entities/dmt.jpg";
import logoFDS from "@/assets/entities/fds.png";
import logoDRA from "@/assets/entities/dra.jpg";
import logoLUC from "@/assets/entities/luc.jpg";
import logoEPS from "@/assets/entities/eps.png";

/* ---------- Helpers ---------- */

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={`section-reveal ${isVisible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* GlassKpi moved into HeroLight */

/* ---------- Data ---------- */

const PIPELINE = [
  { Icon: Mail, label: "Email Received", tool: "M365", accent: "#86EFAC", backTitle: "Trigger", backDesc: "M365 email with PDF attachment detected" },
  { Icon: FileText, label: "PDF Validated", tool: "n8n", accent: "#93C5FD", backTitle: "Validate", backDesc: "PDF text extracted, size and format checked" },
  { Icon: Brain, label: "AI Brain", tool: "Claude API", glow: true, accent: "#E41513", backTitle: "Classify", backDesc: "Claude API · PROMPT v1.4 · confidence score returned" },
  { Icon: GitBranch, label: "Confidence Router", tool: "≥90% / <90%", accent: "#FCD34D", backTitle: "Route", backDesc: "≥0.90 → auto-file · <0.90 → manual queue" },
  { Icon: FolderOpen, label: "Filed in Dropbox", tool: "DRB Business", accent: "#A78BFA", backTitle: "Store", backDesc: "Dropbox /AP/{ENTITY_CODE}/ · naming convention applied" },
  { Icon: Bell, label: "AP Executive Notified", tool: "M365", accent: "#6EE7B7", backTitle: "Notify", backDesc: "AP Executive email sent with invoice summary" },
  { Icon: BookOpen, label: "Audit Logged", tool: "Notion", accent: "#F9A8D4", backTitle: "Log", backDesc: "Notion audit trail · ISO timestamp · outcome recorded" },
];

const MODULES = [
  { id: "M2", name: "Revenue Invoicing MX + Online", code: "P5.20 / P5.40", when: "Q3 2026" },
  { id: "M3", name: "Collections / AR Chase", code: "P6.30", when: "Q3 2026" },
  { id: "M4", name: "VAT Return Automation", code: "P7.30", when: "Q4 2026" },
  { id: "M5", name: "Daily Cash Reconciliation", code: "P6.20", when: "Q4 2026" },
];

const STACK = [
  { Icon: Zap, name: "n8n", role: "Workflow Orchestration", live: true },
  { Icon: Brain, name: "Claude API", role: "AI Classification", live: true },
  { Icon: Package, name: "MS Dynamics BC", role: "ERP Integration", live: false },
  { Icon: FolderOpen, name: "Dropbox Business", role: "Document Storage", live: true },
  { Icon: Mail, name: "M365 · AP Inbox", role: "accounts.payable@fbm.mt", live: true },
  { Icon: Shield, name: "Doppler", role: "Secrets Vault", live: true },
  { Icon: BarChart2, name: "Power BI", role: "Finance Reporting", live: true },
  { Icon: BookOpen, name: "Notion", role: "Audit & Operations", live: true },
];

const ENTITIES = [
  { code: "BHL", name: "BUHAY HOLDING LIMITED", type: "Holding", ctx: "Parent holding company · BUHAY Group", logo: logoBHL },
  { code: "FBM", name: "FBM LIMITED", type: "Operations", ctx: "Primary operations · MT26951112", logo: logoFBM },
  { code: "NMT", name: "NTT LIMITED", type: "Operations", ctx: "Operations entity · NTT Limited", logo: logoNMT },
  { code: "DMT", name: "D2R LIMITED", type: "Operations", ctx: "Operations entity · D2R Limited", logo: logoDMT },
  { code: "FDS", name: "FBM DIGITAL SYSTEMS LIMITED", type: "Digital", ctx: "Digital systems · MT26384814", logo: logoFDS },
  { code: "DRA", name: "DRAKO LIMITED", type: "Operations", ctx: "Operations entity · MT26521120", logo: logoDRA },
  { code: "LUC", name: "LUCKYSIX LIMITED", type: "Gaming", ctx: "Gaming entity · MT27940706", logo: logoLUC },
  { code: "EPS", name: "EPSILON TORO ENTERTAINMENT S.L.U.", type: "Operations", ctx: "Spain operations · Epsilon Toro", logo: logoEPS },
];

const NUMBERS = [
  { value: "384", label: "Invoices Classified", ctx: "PDFs classified in TEST corpus" },
  { value: "98%", label: "Auto-Route Rate", ctx: "invoiced auto-routed without human touch" },
  { value: "222/222", label: "Invoice Accuracy", ctx: "INVOICE class accuracy · UAT PASS" },
  { value: "6/6", label: "Acceptance Criteria", ctx: "acceptance criteria met · Apr 16 2026" },
];

const RISKS = [
  { Icon: AlertTriangle, t: "100% Manual", risk: "NOW: 0 sec", d: "One operator reads every PDF. Zero automation, zero redundancy." },
  { Icon: User, t: "Single Operator", risk: "NOW: 8 entities", d: "One person holds all the context. Vacation = backlog." },
  { Icon: FileX, t: "No Audit Trail", risk: "NOW: 100% logged", d: "No systematic record of who processed what, when, or why." },
];

/* ---------- Page ---------- */

export default function Hub() {
  const [m1Hover, setM1Hover] = useState(false);

  return (
    <div className="min-h-screen bg-white font-barlow text-[#111111]">
      <GlobalHeader />

      {/* ============ HERO — LIGHT, CINEMATIC, ANIMATED MESH ============ */}
      <HeroLight />

      {/* ============ MARQUEE TICKER ============ */}
      <div className="relative overflow-hidden bg-[#E41513]" style={{ height: 44 }}>
        <div className="marquee-track h-full items-center">
          {[0, 1].map((k) => (
            <span
              key={k}
              className="font-barlow font-700 uppercase text-sm text-white px-6 flex items-center"
              style={{ letterSpacing: "0.1em", height: 44 }}
            >
              M1 ACTIVE&nbsp; · &nbsp;UAT PASS APR 2026&nbsp; · &nbsp;100% INVOICE ACCURACY&nbsp; · &nbsp;384 PDFs CLASSIFIED&nbsp; · &nbsp;0 P0 BUGS&nbsp; · &nbsp;Q2 2026 GO-LIVE&nbsp; · &nbsp;8 ENTITIES&nbsp; · &nbsp;100% AUTO-ROUTE&nbsp; · &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ============ SECTION 2 — THE FRICTION (BEFORE / AFTER, MODULE-SCOPED) ============ */}
      <section className="relative overflow-hidden bg-[#F9FAFB] py-12 md:py-16 px-6 md:px-12">
        {/* Ambient background — soft red wash + grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(228,21,19,0.06), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(228,21,19,0.04), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent 80%)",
          }}
        />

        {/* Header */}
        <div className="relative max-w-6xl mx-auto mb-8 md:mb-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E41513]/8 border border-[#E41513]/20 mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#E41513] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E41513]" />
              </span>
              <span className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.3em] text-[11px] md:text-xs">
                M1 · Finance · AP Automation
              </span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="font-barlow font-900 text-[#0a0a0a] leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2rem, 4.2vw, 3.5rem)" }}
            >
              The Friction, <span className="text-[#E41513]">eliminated.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="font-barlow font-500 text-[#6B7280] mt-4 max-w-xl mx-auto text-sm md:text-base">
              From a manual, single-operator process to a fully automated pipeline running across 8 entities.
            </p>
          </Reveal>
        </div>

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#E41513]/15 rounded-3xl overflow-hidden border border-black/5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
          {/* ============ BEFORE ============ */}
          <div className="relative bg-[#FAFAFB] py-10 md:py-12 px-8 md:px-12 min-h-[420px] flex">
            {/* Subtle grain */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)",
                backgroundSize: "4px 4px",
              }}
            />
            <div className="relative w-full max-w-sm mx-auto my-auto">
              <Reveal>
                <div className="flex items-center gap-3 mb-7">
                  <span className="h-px w-8 bg-[#9CA3AF]" />
                  <div className="text-[#6B7280] font-barlow font-700 uppercase tracking-[0.3em] text-xs">
                    Before
                  </div>
                </div>
              </Reveal>

              <div className="space-y-7">
                {[
                  { n: "3–10 min", l: "per invoice, manually" },
                  { n: "100–125", l: "invoices per month, by hand" },
                  { n: "1", l: "operator. Single point of failure" },
                ].map((b, i) => (
                  <Reveal key={b.l} delay={i * 100}>
                    <div className="group">
                      <div
                        className="font-barlow font-900 leading-[0.9] tracking-tight"
                        style={{
                          fontSize: "clamp(2.25rem, 4.2vw, 3.75rem)",
                          background: "linear-gradient(180deg, #1a1a1a 0%, #4a4a4a 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        {b.n}
                      </div>
                      <p className="font-barlow font-500 text-sm text-[#6B7280] mt-2 tracking-wide">
                        {b.l}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={400}>
                <div className="mt-8 pt-5 border-t border-black/8">
                  <p className="font-barlow font-500 text-sm text-[#6B7280] tracking-wide">
                    Zero automation. Zero redundancy. Zero audit trail.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ============ AFTER ============ */}
          <div className="relative bg-[#FDF5F5] py-10 md:py-12 px-8 md:px-12 min-h-[420px] flex overflow-hidden">
            {/* Soft pastel red wash */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(228,21,19,0.07), transparent 75%)",
              }}
            />
            {/* Subtle grid */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(228,21,19,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(228,21,19,0.05) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative w-full max-w-sm mx-auto my-auto">
              <Reveal>
                <div className="flex items-center gap-3 mb-7">
                  <span className="h-px w-8 bg-[#E41513]" />
                  <div className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.3em] text-xs">
                    After
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="font-barlow font-700 uppercase tracking-[0.2em] text-[10px] text-[#15803D]">
                      Live
                    </span>
                  </span>
                </div>
              </Reveal>

              <div className="space-y-7">
                {[
                  { n: "< 5 sec", l: "per invoice, pipeline to audit log", chip: "−99% time" },
                  { n: "222/222", l: "invoices classified. 100% accuracy", chip: "0 errors" },
                  { n: "8 entities", l: "covered. No human intervention", chip: "+700% scale" },
                ].map((b, i) => (
                  <Reveal key={b.l} delay={i * 100}>
                    <div className="group">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <div
                          className="font-barlow font-900 leading-[0.9] tracking-tight text-[#E41513]"
                          style={{ fontSize: "clamp(2.25rem, 4.2vw, 3.75rem)" }}
                        >
                          {b.n}
                        </div>
                        <span className="font-barlow font-700 uppercase tracking-[0.15em] text-[10px] text-[#E41513] px-2 py-0.5 rounded-full bg-white/70 border border-[#E41513]/25">
                          {b.chip}
                        </span>
                      </div>
                      <p className="font-barlow font-500 text-sm text-[#6B7280] mt-2 tracking-wide">
                        {b.l}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={400}>
                <div className="mt-8 pt-5 border-t border-[#E41513]/15">
                  <p className="font-barlow font-500 text-sm text-[#374151] tracking-wide">
                    From inbox to audit log.{" "}
                    <span className="text-[#E41513] font-700">Fully automatic.</span>
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Center connector badge — vertical (desktop) / horizontal (mobile) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] text-white whitespace-nowrap"
              style={{
                background: "#E41513",
                boxShadow:
                  "0 10px 30px rgba(228,21,19,0.45), -6px 0 0 0 #FAFAFB, 6px 0 0 0 #FDF5F5",
              }}
            >
              <ArrowRight className="w-3 h-3" strokeWidth={3} />
              Transform
            </div>
          </div>
          <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full font-barlow font-700 uppercase tracking-[0.2em] text-[10px] text-white whitespace-nowrap"
              style={{
                background: "#E41513",
                boxShadow:
                  "0 10px 30px rgba(228,21,19,0.45), 0 -6px 0 0 #FAFAFB, 0 6px 0 0 #FDF5F5",
              }}
            >
              <ArrowRight className="w-3 h-3 rotate-90" strokeWidth={3} />
              Transform
            </div>
          </div>
        </div>
      </section>

      {/* Full-width LIVE NEWSROOM block */}
      <LiveNewsroom />

      {/* ============ SECTION 3 — PIPELINE (LIGHT, FLOWING) ============ */}
      <PipelineFlow />

      {/* ============ SECTION 4 — NUMBERS (premium, interactive) ============ */}
      <NumbersSection />

      {/* ============ SECTION 5 — TRANSFORMATION (cinematic) ============ */}
      <TransformationSection />

      {/* SECTION 6 — Module Pipeline removed */}

      {/* ============ SECTION 7 — STACK (FLOATING WAVE) ============ */}
      <section className="py-24 md:py-32 px-6" style={{ background: "#FAFAFB" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <div className="text-[#0F172A]/50 font-barlow font-700 uppercase tracking-[0.2em] text-sm">
                The Stack · Live
              </div>
            </div>
            <h2 className="font-barlow font-900 text-[#0F172A] leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
              8 services. 1 unified pipeline.
            </h2>
            <p className="mt-4 font-barlow font-400 md:text-lg text-[#0F172A]/55 max-w-2xl text-xl">
              Each tool plays a precise role. Hover any orb to see its function and status.
            </p>
          </Reveal>

          <div className="mt-16">
            <StackWave />
          </div>
        </div>
      </section>

      {/* ============ SECTION 8 — ENTITIES ============ */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.2em] mb-4 text-xl">
              8 Entities In Scope
            </div>
            <h2 className="font-barlow font-900 text-[#111111] leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
              One pipeline. Eight companies.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
            {ENTITIES.map((e, i) => (
              <Reveal key={e.code} delay={i * 50}>
                <div className="flip-card w-full h-[210px]">
                  <div className="flip-card-inner">
                    {/* FRONT — logo */}
                    <div className="flip-face bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center">
                      <div className="flex-1 w-full flex items-center justify-center">
                        <img
                          src={e.logo}
                          alt={e.name}
                          className="max-h-[90px] max-w-[80%] object-contain"
                          loading="lazy"
                        />
                      </div>
                      <span className="mt-3 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-barlow font-700 uppercase tracking-widest">
                        {e.type}
                      </span>
                    </div>
                    {/* BACK */}
                    <div className="flip-face flip-back rounded-2xl p-7 flex flex-col justify-between" style={{ background: "#0A0A0A" }}>
                      <div>
                        <div className="font-barlow font-900 italic text-6xl text-white leading-none">
                          {e.code}
                        </div>
                        <span
                          className="inline-block mt-4 px-2.5 py-1 rounded-full text-[10px] font-barlow font-700 uppercase tracking-widest"
                          style={{ background: "rgba(228,21,19,0.20)", color: "#E41513" }}
                        >
                          {e.type}
                        </span>
                      </div>
                      <p className="font-barlow font-400 text-xs text-white/70 leading-snug">
                        {e.ctx}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="text-center font-barlow font-600 text-[#6B7280] mt-12 text-lg">
            BUHAY Group · FBM® 2026 
          </p>
        </div>
      </section>

      {/* ============ SECTION 9 — IDEAS INBOX ============ */}
      <section className="bg-[#F9FAFB] py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.2em] text-sm mb-4">
              Ideas Inbox
            </div>
            <h2 className="font-barlow font-900 text-[#111111] leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
              Got a process that eats your time?
            </h2>
            <p className="font-barlow font-400 text-lg text-[#6B7280] mt-6 max-w-md">
              If it's repetitive, AI can do it. Anyone in the BUHAY Group can submit. No login. No friction.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {["Travel expense legalization", "Supplier onboarding docs", "Month-end accruals"].map((s) => (
                <span
                  key={s}
                  className="px-4 py-1.5 rounded-full text-sm font-barlow font-600 text-[#E41513]"
                  style={{ background: "rgba(228,21,19,0.08)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Link
              to="/ideas"
              className="block bg-white rounded-2xl border border-gray-100 p-10 transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(228,21,19,0.08)" }}
              >
                <Lightbulb className="w-7 h-7 text-[#E41513]" />
              </div>
              <h3 className="font-barlow font-800 text-3xl text-[#111111] mt-6">Submit your idea</h3>
              <p className="font-barlow font-400 text-base text-[#6B7280] mt-3">
                Open the form — name, department, the process. We'll review every submission.
              </p>
              <span
                className="inline-flex items-center gap-2 mt-8 rounded-full bg-[#E41513] text-white font-barlow font-700 px-8 py-3.5 text-base transition-all"
                style={{ boxShadow: "0 0 0 rgba(228,21,19,0)" }}
              >
                Open form <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer
        className="relative overflow-hidden pt-20 pb-10 px-6"
        style={{
          background: "#0A0A0A",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-[#E41513] font-barlow font-900 font-extrabold text-xs">
              F
            </div>
            <span className="text-white font-barlow font-700 text-xs uppercase tracking-widest">
              FBM · Hyperautomation Project
            </span>
          </div>

          <h2
            className="font-barlow italic font-900 text-white text-center mt-12 leading-none tracking-tight"
            style={{ fontSize: "clamp(5rem, 10vw, 12rem)", letterSpacing: "-0.02em" }}
          >
            Hyperautomation.
          </h2>

          <div className="w-24 h-[2px] bg-[#E41513] mx-auto my-10" />

          <p className="font-barlow font-400 text-sm text-white/40">
            James Sanabria · Finance Operations Lead · BUHAY Group · Malta · 2026
          </p>
          <p className="font-barlow font-400 text-xs text-white/30 mt-2">
          </p>
        </div>
      </footer>
    </div>
  );
}
