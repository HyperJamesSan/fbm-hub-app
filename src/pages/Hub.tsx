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
  { code: "BHL", name: "BUHAY HOLDING LIMITED", type: "Holding", ctx: "Parent holding company · BUHAY Group" },
  { code: "FBM", name: "FBM LIMITED", type: "Operations", ctx: "Primary operations · MT26951112" },
  { code: "NMT", name: "NTT LIMITED", type: "Operations", ctx: "Operations entity · NTT Limited" },
  { code: "DMT", name: "D2R LIMITED", type: "Operations", ctx: "Operations entity · D2R Limited" },
  { code: "FDS", name: "FBM DIGITAL SYSTEMS LIMITED", type: "Digital", ctx: "Digital systems · MT26384814" },
  { code: "DRA", name: "DRAKO LIMITED", type: "Operations", ctx: "Operations entity · MT26521120" },
  { code: "LUC", name: "LUCKYSIX LIMITED", type: "Gaming", ctx: "Gaming entity · MT27940706" },
  { code: "EPS", name: "EPSILON TORO ENTERTAINMENT S.L.U.", type: "Operations", ctx: "Spain operations · Epsilon Toro" },
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

      {/* ============ SECTION 2 — THE PROBLEM ============ */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.2em] text-sm mb-8">
              The Friction
            </div>
            <div className="space-y-10">
              <div>
                <div className="font-barlow italic font-900 text-[#111111] leading-none text-5xl md:text-6xl">
                  3–10 min
                </div>
                <p className="font-barlow font-400 text-sm text-[#374151] mt-3">
                  per invoice, before automation
                </p>
              </div>
              <div>
                <div className="font-barlow italic font-900 text-[#111111] leading-none text-5xl md:text-6xl">
                  100–125
                </div>
                <p className="font-barlow font-400 text-sm text-[#374151] mt-3">
                  invoices processed monthly, manually
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5">
            {RISKS.map(({ Icon, t, risk, d }, i) => (
              <Reveal key={t} delay={i * 80}>
                <div
                  className="relative bg-white border-l-4 border-[#E41513] rounded-r-2xl p-6 pr-44"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
                >
                  <div className="absolute top-5 right-6 font-barlow font-900 text-sm text-[#E41513] leading-none uppercase tracking-wider whitespace-nowrap">
                    {risk}
                  </div>
                  <div className="flex gap-4 items-start">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(228,21,19,0.08)" }}
                    >
                      <Icon className="w-5 h-5 text-[#E41513]" />
                    </div>
                    <div>
                      <h3 className="font-barlow font-700 text-lg text-[#111111]">{t}</h3>
                      <p className="font-barlow font-400 text-sm text-[#6B7280] mt-1">{d}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width LIVE NEWSROOM block */}
      <LiveNewsroom />

      {/* ============ SECTION 3 — PIPELINE (LIGHT, FLOWING) ============ */}
      <PipelineFlow />

      {/* ============ SECTION 4 — NUMBERS (white, full-bleed grid) ============ */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <div className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.2em] text-sm mb-4">
              The Numbers
            </div>
            <h2 className="font-barlow font-900 text-[#111111] leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
              Real data. Real results.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {NUMBERS.map((n, i) => (
              <Reveal key={n.label} delay={i * 80}>
                <div className="border-t-2 border-r border-b border-gray-100 py-12 md:py-16 px-8 md:px-14">
                  <div
                    className="font-barlow italic font-900 text-[#E41513] leading-none"
                    style={{ fontSize: "clamp(3.5rem, 6vw, 7rem)" }}
                  >
                    {n.value}
                  </div>
                  <div className="font-barlow font-700 uppercase tracking-[0.2em] text-sm text-[#9CA3AF] mt-4">
                    {n.label}
                  </div>
                  <div className="font-barlow font-400 text-xs text-gray-400 mt-2">
                    {n.ctx}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 5 — DARK ARC VISION ============ */}
      <section className="relative overflow-hidden py-32 md:py-40 px-6" style={{ background: "#0F172A" }}>
        <ParticleField variant="dark-arc" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.2em] text-sm mb-6">
            The Transformation
          </div>
          <h2 className="font-barlow italic font-900 text-white leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}>
            M1 is the pattern.
          </h2>
          <h2 className="font-barlow italic font-900 leading-[0.95] mt-2" style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", color: "#E41513" }}>
            Five modules.
          </h2>
          <h2 className="font-barlow italic font-900 text-white/40 leading-[0.95] mt-2" style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}>
            Full transformation.
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mt-16 text-left">
            {[
              { Icon: FileText, t: "Every AP invoice auto-processed", d: "M1 LIVE — 100% accuracy on 222 invoices. DBC integration in final gate." },
              { Icon: BarChart2, t: "AR collections driven by AI", d: "M3 — Coming Q3 2026. Automated chase sequences. Zero manual follow-up." },
              { Icon: Shield, t: "VAT returns without manual lookup", d: "M4 — Coming Q4 2026. Rules engine + Claude API for Malta MGA compliance." },
            ].map(({ Icon, t, d }) => (
              <div
                key={t}
                className="rounded-2xl p-8 border"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <Icon className="w-7 h-7 text-[#E41513]" />
                <h3 className="font-barlow font-700 text-white text-lg mt-5">{t}</h3>
                <p className="font-barlow font-400 text-sm text-white/50 mt-2">{d}</p>
              </div>
            ))}
          </div>

          <p className="font-barlow italic font-900 text-white text-2xl md:text-3xl mt-20">
            By Q4 2026, FBM Finance runs on hyperautomation.
          </p>
        </div>
      </section>

      {/* ============ SECTION 6 — 5 MODULES ============ */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.2em] text-sm mb-4">
              Module Pipeline
            </div>
            <h2 className="font-barlow font-900 text-[#111111] leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
              5 modules. Full transformation.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mt-16">
            {/* M1 active — DARK */}
            <div
              onMouseEnter={() => setM1Hover(true)}
              onMouseLeave={() => setM1Hover(false)}
              className="relative rounded-2xl bg-[#0A0A0A] border-2 border-[#E41513] p-7 overflow-visible transition-all duration-300"
              style={{ boxShadow: "0 0 40px rgba(228,21,19,0.2)" }}
            >
              {m1Hover && <ParticleField variant="dark-arc" />}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <span className="font-barlow font-900 italic text-5xl text-[#E41513] leading-none">M1</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#E41513]/20 text-[#E41513] text-[10px] font-barlow font-700 uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <h3 className="font-barlow font-700 text-base text-white mt-5 leading-snug">
                  AP Invoice Classification &amp; Routing
                </h3>
                <div className="font-barlow font-600 text-xs text-white/40 mt-1">P1.30 FMT</div>
                <div className="flex items-center gap-1.5 mt-6 text-xs font-barlow font-700 text-[#22C55E]">
                  <CheckCircle2 className="w-4 h-4" />
                  UAT Pass · 16 Apr 2026
                </div>
              </div>
            </div>

            {MODULES.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl bg-[#F9FAFB] border border-gray-200 p-7 transition-all duration-300 hover:bg-white hover:border-[#E41513] hover:-translate-y-1"
                style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)")}
              >
                <div className="flex items-start justify-between">
                  <span className="font-barlow font-900 italic text-4xl text-gray-300 leading-none">{m.id}</span>
                  <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-500 text-[10px] font-barlow font-700 uppercase tracking-widest">
                    Planned
                  </span>
                </div>
                <h3 className="font-barlow font-700 text-base text-gray-700 mt-5 leading-snug">{m.name}</h3>
                <div className="font-barlow font-600 text-xs text-gray-400 mt-1">{m.code}</div>
                <div className="font-barlow font-700 text-xs text-gray-400 mt-6 uppercase tracking-widest">
                  {m.when}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 7 — STACK (DARK) ============ */}
      <section className="bg-[#0A0A0A] py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-white/50 font-barlow font-700 uppercase tracking-[0.2em] text-sm mb-4">
              The Stack
            </div>
            <h2 className="font-barlow font-900 text-white leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}>
              Built with enterprise-grade tools.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
            {STACK.map(({ Icon, name, role, live }, i) => (
              <Reveal key={name} delay={i * 60}>
                <div
                  className="rounded-2xl p-6 border h-full backdrop-blur-xl"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.10)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(228,21,19,0.15)" }}
                  >
                    <Icon className="w-6 h-6 text-[#E41513]" />
                  </div>
                  <h3 className="font-barlow font-700 text-base text-white mt-5 leading-tight">{name}</h3>
                  <p className="font-barlow font-400 text-sm text-white/50 mt-1">{role}</p>
                  <span
                    className={`inline-block mt-5 px-2.5 py-1 rounded-full text-[10px] font-barlow font-700 uppercase tracking-widest ${
                      live ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {live ? "Live" : "In Progress"}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 8 — ENTITIES ============ */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-700 uppercase tracking-[0.2em] text-sm mb-4">
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
                    {/* FRONT */}
                    <div className="flip-face bg-white border border-gray-100 rounded-2xl p-7">
                      <div className="font-barlow font-900 italic text-6xl text-[#E41513] leading-none">
                        {e.code}
                      </div>
                      <h3 className="font-barlow font-600 text-sm text-gray-700 mt-4 leading-snug">
                        {e.name}
                      </h3>
                      <span className="inline-block mt-4 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-barlow font-700 uppercase tracking-widest">
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

          <p className="text-center font-barlow font-600 text-sm text-[#6B7280] mt-12">
            BUHAY Group · Malta Gaming Authority · MGA Regulated · 2026
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
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-[#E41513] font-barlow font-900 text-xs">
              F
            </div>
            <span className="text-white font-barlow font-700 text-xs uppercase tracking-widest">
              FBM · Hyperautomation Finance
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
            P1.30 FMT · accounts.payable@fbm.mt
          </p>
        </div>
      </footer>
    </div>
  );
}
