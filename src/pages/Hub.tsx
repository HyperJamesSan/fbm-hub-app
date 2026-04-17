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
import { useCountUp } from "@/hooks/useCountUp";

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

function KpiCard({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>(0.4);
  const value = useCountUp(target, isVisible);
  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl shadow-sm border border-black/5 px-6 py-5 md:px-8 md:py-6 text-center"
    >
      <div className="font-barlow font-900 italic text-4xl md:text-5xl text-[#E41513] leading-none">
        {value}
        {suffix}
      </div>
      <div className="font-barlow font-600 uppercase text-[10px] md:text-xs tracking-[0.18em] text-[#6B7280] mt-2">
        {label}
      </div>
    </div>
  );
}

/* ---------- Data ---------- */

const PIPELINE = [
  { Icon: Mail, label: "Email Received", tool: "M365" },
  { Icon: FileText, label: "PDF Validated", tool: "n8n" },
  { Icon: Brain, label: "AI Classifies", tool: "Claude API", glow: true },
  { Icon: GitBranch, label: "Confidence Router", tool: "≥90% AUTO / <90% REVIEW" },
  { Icon: FolderOpen, label: "Filed in Dropbox", tool: "DRB Business" },
  { Icon: Bell, label: "AP Executive Notified", tool: "M365" },
  { Icon: BookOpen, label: "Audit Logged", tool: "Notion" },
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
  { Icon: Mail, name: "M365 · accounts.payable@fbm.mt", role: "AP Inbox", live: true },
  { Icon: Shield, name: "Doppler", role: "Secrets Vault", live: true },
  { Icon: BarChart2, name: "Power BI", role: "Finance Reporting", live: true },
  { Icon: BookOpen, name: "Notion", role: "Audit & Operations", live: true },
];

const AC = [
  { title: "Entity Detection", desc: "Correct entity matched on all 222 INVOICE-class PDFs." },
  { title: "Confidence Scoring", desc: "98% auto-route rate, threshold ≥0.90 validated." },
  { title: "Auto-Routing", desc: "Correct Dropbox Business folder per entity, every time." },
  { title: "Document Storage", desc: "File naming convention 100% compliant." },
  { title: "Audit Trail", desc: "Every execution logged with ISO timestamp and outcome." },
  { title: "Notification", desc: "AP Executive notified on every processed invoice." },
];

const ENTITIES = [
  { code: "BHL", name: "BUHAY HOLDING LIMITED", type: "Holding" },
  { code: "FBM", name: "FBM LIMITED", type: "Operations" },
  { code: "NMT", name: "NTT LIMITED", type: "Operations" },
  { code: "DMT", name: "D2R LIMITED", type: "Operations" },
  { code: "FDS", name: "FBM DIGITAL SYSTEMS LIMITED", type: "Digital" },
  { code: "DRA", name: "DRAKO LIMITED", type: "Operations" },
  { code: "LUC", name: "LUCKYSIX LIMITED", type: "Gaming" },
  { code: "EPS", name: "EPSILON TORO ENTERTAINMENT S.L.U.", type: "Operations" },
];

/* ---------- Page ---------- */

export default function Hub() {
  const [m1Hover, setM1Hover] = useState(false);

  return (
    <div className="min-h-screen bg-white font-barlow text-[#111111]">
      <GlobalHeader />

      {/* SECTION 2 — HERO */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center pt-20 pb-16 px-6 bg-white">
        <ParticleField variant="hero" interactive />
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8">
            <span className="px-3 py-1.5 rounded-full border border-black/10 text-[10px] md:text-xs font-barlow font-600 uppercase tracking-[0.14em] text-[#111111]">
              Program · P1.30 FMT
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22C55E]/10 text-[#15803d] text-[10px] md:text-xs font-barlow font-700 uppercase tracking-[0.14em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] live-pulse-dot" />
              M1 · UAT Pass · 16 Apr 2026
            </span>
            <span className="px-3 py-1.5 rounded-full bg-slate-900/5 text-slate-700 text-[10px] md:text-xs font-barlow font-600 uppercase tracking-[0.14em]">
              Target Go-Live · Q2 2026
            </span>
          </div>

          <h1 className="font-barlow italic font-900 leading-[0.95] tracking-tight text-[#111111] text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            Hyperautomation Finance
          </h1>
          <h1 className="font-barlow italic font-900 leading-[0.95] tracking-tight text-[#E41513] text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-2">
            FBM Malta.
          </h1>

          <p className="font-barlow font-400 text-lg md:text-xl text-[#6B7280] max-w-xl mx-auto mt-7">
            The infrastructure that turns AI into operational reality. 8 entities. 5 modules. Zero manual bottlenecks.
          </p>

          <a
            href="#pipeline"
            className="inline-flex items-center gap-2 mt-9 rounded-full bg-[#E41513] text-white font-barlow font-700 px-8 py-4 transition-all hover:scale-105 hover:shadow-[0_8px_32px_rgba(228,21,19,0.35)]"
          >
            Explore the pipeline <ArrowRight className="w-4 h-4" />
          </a>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mt-14 w-full">
            <KpiCard target={384} label="Invoices Classified" />
            <KpiCard target={100} suffix="%" label="Accuracy" />
            <KpiCard target={0} label="P0 Bugs Open" />
            <KpiCard target={8} label="Entities Covered" />
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE PROBLEM */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-600 uppercase tracking-[0.18em] text-sm mb-5">
              The Friction
            </div>
            <h2 className="font-barlow font-900 leading-[0.95] text-5xl md:text-6xl text-[#111111]">
              12–17 minutes
              <br />
              <span className="text-[#111111]">per invoice.</span>
            </h2>
            <p className="font-barlow font-400 text-lg text-[#6B7280] mt-6 max-w-md">
              100–125 invoices/month. One person. No audit trail. No scalability.
            </p>
          </Reveal>

          <div className="grid gap-4">
            {[
              { Icon: AlertTriangle, t: "100% Manual", d: "One operator reads every PDF. Zero automation, zero redundancy." },
              { Icon: User, t: "Single Point of Failure", d: "One person holds all the context. Vacation = backlog." },
              { Icon: FileX, t: "No Audit Trail", d: "No systematic record of who processed what, when, or why." },
            ].map(({ Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 80}>
                <div className="bg-white rounded-2xl border border-black/[0.06] p-6 flex gap-5 shadow-sm">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--fbm-red-dim)" }}
                  >
                    <Icon className="w-5 h-5 text-[#E41513]" />
                  </div>
                  <div>
                    <h3 className="font-barlow font-700 text-lg text-[#111111]">{t}</h3>
                    <p className="font-barlow font-400 text-sm text-[#6B7280] mt-1">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 px-2">
          <Reveal>
            <div className="bg-[#E41513] rounded-2xl py-10 px-6 text-center text-white">
              <p className="font-barlow font-800 text-xl md:text-2xl">
                Now: &lt;2 seconds. 98% auto-route. Full audit trail. Every invoice.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 4 — PIPELINE */}
      <section id="pipeline" className="bg-[#F9FAFB] py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-600 uppercase tracking-[0.18em] text-sm mb-3">
              The Pipeline
            </div>
            <h2 className="font-barlow font-900 text-5xl md:text-6xl text-[#111111] leading-[0.95]">
              7 nodes. End-to-end.
            </h2>
          </Reveal>

          <div className="mt-14 flex lg:items-stretch gap-3 md:gap-4 overflow-x-auto pb-6 lg:overflow-visible lg:flex-row flex-row">
            {PIPELINE.map(({ Icon, label, tool, glow }, i) => (
              <Reveal key={label} delay={i * 100} className="flex items-center flex-shrink-0">
                <div
                  className={`bg-white rounded-xl shadow-sm p-4 w-36 text-center ${glow ? "glow-pulse" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center" style={{ background: "var(--fbm-red-dim)" }}>
                    <Icon className="w-5 h-5 text-[#E41513]" />
                  </div>
                  <div className="font-barlow font-700 text-sm text-[#111111] mt-3 leading-tight">
                    {label}
                  </div>
                  <div className="mt-2 inline-block px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-barlow font-600 text-[#374151] leading-tight">
                    {tool}
                  </div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div className="dash-flow w-6 md:w-10 mx-1 flex-shrink-0" />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — DARK ARC */}
      <section className="relative overflow-hidden py-32 md:py-40 px-6" style={{ background: "#0F172A" }}>
        <ParticleField variant="dark-arc" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="text-[#E41513] font-barlow font-600 uppercase tracking-[0.2em] text-sm mb-5">
            The Transformation
          </div>
          <h2 className="font-barlow italic font-900 text-white text-5xl md:text-6xl lg:text-7xl leading-[0.95]">
            M1 is the pattern.
          </h2>
          <h2 className="font-barlow italic font-900 text-[#E41513] text-5xl md:text-6xl lg:text-7xl leading-[0.95] mt-2">
            Five modules.
          </h2>
          <h2 className="font-barlow italic font-900 text-white/60 text-5xl md:text-6xl lg:text-7xl leading-[0.95] mt-2">
            Full finance automation.
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mt-16 text-left">
            {[
              { Icon: FileText, t: "Every AP invoice auto-processed", d: "M1 LIVE — 100% accuracy on 222 invoices. DBC integration in final gate." },
              { Icon: BarChart2, t: "AR collections driven by AI", d: "M3 — Coming Q3 2026. Automated chase sequences. Zero manual follow-up." },
              { Icon: Shield, t: "VAT returns without manual lookup", d: "M4 — Coming Q4 2026. Rules engine + Claude API for Malta MGA compliance." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-white/10 p-7" style={{ background: "rgba(255,255,255,0.05)" }}>
                <Icon className="w-6 h-6 text-[#E41513]" />
                <h3 className="font-barlow font-700 text-white text-lg mt-4">{t}</h3>
                <p className="font-barlow font-400 text-sm text-gray-400 mt-2">{d}</p>
              </div>
            ))}
          </div>

          <p className="font-barlow italic font-900 text-white text-2xl md:text-3xl mt-20">
            By Q4 2026, FBM Finance runs on hyperautomation.
          </p>
        </div>
      </section>

      {/* SECTION 6 — MODULES */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-600 uppercase tracking-[0.18em] text-sm mb-3">
              Module Pipeline
            </div>
            <h2 className="font-barlow font-900 text-5xl md:text-6xl text-[#111111] leading-[0.95]">
              5 modules. Full transformation.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mt-14">
            {/* M1 active */}
            <div
              onMouseEnter={() => setM1Hover(true)}
              onMouseLeave={() => setM1Hover(false)}
              className="relative rounded-2xl bg-white border-2 border-[#E41513] shadow-lg shadow-red-100 p-6 overflow-visible"
            >
              <ParticleField variant="card-burst" isActive={m1Hover} />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="font-barlow font-900 text-4xl text-[#E41513] leading-none">M1</span>
                  <span className="px-2 py-1 rounded-full bg-[#E41513]/10 text-[#E41513] text-[10px] font-barlow font-700 uppercase tracking-widest">
                    In Progress
                  </span>
                </div>
                <h3 className="font-barlow font-700 text-base text-[#111111] mt-4 leading-snug">
                  AP Invoice Classification &amp; Routing
                </h3>
                <div className="font-barlow font-600 text-xs text-[#6B7280] mt-1">P1.30 FMT</div>
                <div className="flex items-center gap-1.5 mt-5 text-xs font-barlow font-600 text-[#15803d]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] live-pulse-dot" />
                  UAT Pass · 16 Apr 2026
                </div>
              </div>
            </div>

            {MODULES.map((m) => (
              <div
                key={m.id}
                className="group rounded-2xl bg-[#F9FAFB] border border-black/[0.08] p-6 opacity-80 hover:opacity-100 transition-all border-t-2 border-t-transparent hover:border-t-[#E41513]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-barlow font-900 text-4xl text-[#111111]/80 leading-none">{m.id}</span>
                  <span className="px-2 py-1 rounded-full bg-slate-200 text-slate-600 text-[10px] font-barlow font-700 uppercase tracking-widest">
                    Planned
                  </span>
                </div>
                <h3 className="font-barlow font-700 text-base text-[#111111] mt-4 leading-snug">{m.name}</h3>
                <div className="font-barlow font-600 text-xs text-[#6B7280] mt-1">{m.code}</div>
                <div className="font-barlow font-600 text-xs text-[#6B7280] mt-5 uppercase tracking-widest">
                  {m.when}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — STACK */}
      <section className="bg-[#F9FAFB] py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-600 uppercase tracking-[0.18em] text-sm mb-3">
              The Stack
            </div>
            <h2 className="font-barlow font-900 text-5xl md:text-6xl text-[#111111] leading-[0.95]">
              Built with enterprise-grade tools.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
            {STACK.map(({ Icon, name, role, live }) => (
              <div key={name} className="bg-white rounded-xl p-6 border border-black/[0.06] shadow-sm">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--fbm-red-dim)" }}>
                  <Icon className="w-6 h-6 text-[#E41513]" />
                </div>
                <h3 className="font-barlow font-700 text-base text-[#111111] mt-4 leading-tight">{name}</h3>
                <p className="font-barlow font-400 text-sm text-[#6B7280] mt-1">{role}</p>
                <span
                  className={`inline-block mt-4 px-2.5 py-1 rounded-full text-[10px] font-barlow font-700 uppercase tracking-widest ${
                    live ? "bg-[#22C55E]/10 text-[#15803d]" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {live ? "Live" : "In Progress"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — RESULTS */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-[#E41513] font-barlow font-600 uppercase tracking-[0.18em] text-sm mb-5">
            UAT Results
          </div>
          <h2 className="font-barlow italic font-900 text-5xl md:text-6xl text-[#E41513] leading-[0.95]">
            100% accuracy.
          </h2>
          <h2 className="font-barlow font-900 text-4xl md:text-5xl text-[#111111] mt-3 leading-[0.95]">
            222 invoices. Real FBM data.
          </h2>
          <p className="font-barlow font-400 text-lg text-[#6B7280] mt-6 max-w-2xl mx-auto">
            Not simulated. Real invoices from the BUHAY Group test corpus, processed by the live WF_AP_001 pipeline.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-14 text-left">
            {AC.map(({ title, desc }) => (
              <div key={title} className="rounded-xl border border-green-200 bg-green-50/30 p-5 flex gap-4">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-barlow font-700 text-base text-[#111111]">{title}</h3>
                  <p className="font-barlow font-400 text-sm text-[#6B7280] mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl py-8 px-6 flex flex-wrap gap-x-10 gap-y-3 justify-center" style={{ background: "#0F172A" }}>
            {[
              "355 valid PDFs",
              "6/6 AC",
              "0 P0 bugs",
              "Prompt v1.4",
              "Max confidence 0.98",
            ].map((s, i, arr) => (
              <span key={s} className="font-barlow font-800 text-white text-base md:text-lg flex items-center gap-x-10">
                {s}
                {i < arr.length - 1 && <span className="text-[#E41513]">·</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — ENTITIES */}
      <section className="bg-[#F9FAFB] py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-600 uppercase tracking-[0.18em] text-sm mb-3">
              8 Entities In Scope
            </div>
            <h2 className="font-barlow font-900 text-5xl md:text-6xl text-[#111111] leading-[0.95]">
              One pipeline. Eight companies.
            </h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
            {ENTITIES.map((e) => (
              <div
                key={e.code}
                className="bg-white rounded-2xl p-6 border border-black/[0.06] transition-all duration-200 hover:border-[#E41513] hover:-translate-y-0.5"
              >
                <div className="font-barlow font-900 italic text-4xl text-[#E41513] leading-none">{e.code}</div>
                <h3 className="font-barlow font-600 text-sm text-[#111111] mt-3 leading-snug">{e.name}</h3>
                <span className="inline-block mt-4 px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-barlow font-700 uppercase tracking-widest text-[#374151]">
                  {e.type}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center font-barlow font-600 text-sm text-[#6B7280] mt-10">
            BUHAY Group · Malta Gaming Authority · MGA Regulated · 2026
          </p>
        </div>
      </section>

      {/* SECTION 10 — IDEAS INBOX */}
      <section className="bg-white py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="text-[#E41513] font-barlow font-600 uppercase tracking-[0.18em] text-sm mb-3">
              Ideas Inbox
            </div>
            <h2 className="font-barlow font-900 text-5xl md:text-6xl text-[#111111] leading-[0.95]">
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
                  style={{ background: "var(--fbm-red-dim)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Link
              to="/ideas"
              className="block rounded-2xl bg-white shadow-md border border-black/[0.08] p-8 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--fbm-red-dim)" }}>
                <Lightbulb className="w-6 h-6 text-[#E41513]" />
              </div>
              <h3 className="font-barlow font-800 text-2xl text-[#111111] mt-5">Submit your idea →</h3>
              <p className="font-barlow font-400 text-sm text-[#6B7280] mt-2">
                Open the form — name, department, the process. We'll review every submission.
              </p>
              <span className="inline-flex items-center gap-2 mt-6 rounded-full bg-[#E41513] text-white font-barlow font-700 px-6 py-3">
                Open form <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SECTION 11 — FOOTER */}
      <footer
        className="relative overflow-hidden pt-20 pb-8 px-6"
        style={{
          background: "#0F172A",
          backgroundImage: "radial-gradient(rgba(228,21,19,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-[#E41513] font-barlow font-900 text-xs">
              F
            </div>
            <span className="text-white font-barlow font-700 text-xs uppercase tracking-widest">
              FBM · Hyperautomation Finance
            </span>
          </div>

          <h2 className="font-barlow italic font-900 text-white text-center mt-16 leading-none tracking-tight"
              style={{ fontSize: "clamp(56px, 16vw, 220px)", letterSpacing: "-0.02em" }}>
            Hyperautomation.
          </h2>

          <div className="mt-14 grid md:grid-cols-3 gap-4 text-xs font-barlow font-400 text-gray-400">
            <div className="md:text-left text-center">Finance Operations Lead · James Sanabria · BUHAY Group · Malta · 2026</div>
            <div className="text-center">P1.30 FMT · EBIS Master in AI Agents &amp; Hyperautomation</div>
            <div className="md:text-right text-center">accounts.payable@fbm.mt</div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-gray-600 font-barlow">
            © 2026 BUHAY Group · FBM Limited · All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
