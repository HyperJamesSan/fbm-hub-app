import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlobalHeader from "@/components/GlobalHeader";
import { stack, entities, pipelineNodes, environments, acceptanceCriteria, uat } from "@/data/program";
import { CheckCircle2, Clock, Brain, Settings, BookOpen, Newspaper, Lightbulb, Baseline } from "lucide-react";

// TODO: Connect to Notion API via backend — each card maps to a Notion DB
const knowledgeCards = [
  {
    icon: Brain,
    title: "What is AI Automation",
    desc: "What it is, what it does, what it doesn't. No jargon.",
    badge: "EVERYONE",
    pill: "Coming soon",
    action: null as null | (() => void),
  },
  {
    icon: Settings,
    title: "Stack & Tools",
    desc: "Every tool in the pipeline. Role, status, owner.",
    badge: "TECHNICAL",
    pill: "Live ↓",
    action: () => document.getElementById("stack")?.scrollIntoView({ behavior: "smooth", block: "start" }),
  },
  {
    icon: BookOpen,
    title: "Skills & Prompts",
    desc: "Active prompt library. Claude API configurations.",
    badge: "TECHNICAL",
    pill: "Coming soon",
    action: null,
  },
  {
    icon: Newspaper,
    title: "AI News & Updates",
    desc: "Latest in AI relevant to FBM operations.",
    badge: "EVERYONE",
    pill: "Coming soon",
    action: null,
  },
  {
    icon: Lightbulb,
    title: "Lessons Learned",
    desc: "What worked. What didn't. What we'd change.",
    badge: "EVERYONE",
    pill: "Coming soon",
    action: null,
  },
  {
    icon: Baseline,
    title: "Glossary",
    desc: "DBC, n8n, Claude API, UAT — explained plainly.",
    badge: "EVERYONE",
    pill: "Coming soon",
    action: null,
  },
];

const sections = [
  { id: "architecture", label: "Architecture" },
  { id: "pipeline", label: "Pipeline" },
  { id: "stack", label: "Stack" },
  { id: "entities", label: "Entities" },
  { id: "environments", label: "Environments" },
  { id: "uat", label: "UAT Results" },
];

export default function Knowledge() {
  const [active, setActive] = useState("architecture");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    // Hash anchor scroll
    if (window.location.hash) {
      setTimeout(() => {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <div className="pt-20 max-w-7xl mx-auto px-6 md:px-10 py-12">
        <header className="mb-12">
          <span className="fbm-badge-ai mb-3 inline-block">Knowledge base</span>
          <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            How the system is built.
          </h1>
          <p className="text-muted-foreground font-roboto mt-3 max-w-3xl">
            Live architecture, real nodes, real entities. Direct from the source — no Notion required.
          </p>
        </header>

        <div className="grid md:grid-cols-[200px_1fr] gap-10">
          {/* Sticky nav */}
          <aside className="hidden md:block">
            <nav className="sticky top-24 flex flex-col gap-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`px-3 py-2 text-xs font-montserrat font-semibold uppercase tracking-wider rounded-md transition-all ${
                    active === s.id
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-20">
            {/* Architecture */}
            <section id="architecture" className="scroll-mt-24">
              <h2 className="text-2xl font-montserrat font-extrabold text-foreground mb-2">Architecture</h2>
              <div className="fbm-section-divider mb-6" />
              <p className="text-muted-foreground font-roboto mb-6">
                Six layers from email trigger to ERP. PDF never leaves the company environment — only extracted text reaches the AI.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { layer: "Trigger", tool: "M365 mailbox" },
                  { layer: "Orchestration", tool: "n8n on Azure VM" },
                  { layer: "AI", tool: "Claude Sonnet · prompt v1.4" },
                  { layer: "Storage", tool: "Dropbox Business" },
                  { layer: "Audit", tool: "Notion log + Control Tower" },
                  { layer: "ERP", tool: "Business Central (pending)" },
                ].map((l, i) => (
                  <div key={l.layer} className="fbm-card p-4">
                    <div className="text-[10px] font-mono text-muted-foreground">L{i + 1}</div>
                    <div className="text-sm font-montserrat font-bold text-foreground">{l.layer}</div>
                    <div className="text-xs font-roboto text-muted-foreground mt-1">{l.tool}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pipeline */}
            <section id="pipeline" className="scroll-mt-24">
              <h2 className="text-2xl font-montserrat font-extrabold text-foreground mb-2">Pipeline · WF_AP_001</h2>
              <div className="fbm-section-divider mb-6" />
              <p className="text-muted-foreground font-roboto mb-6">
                12 nodes from inbox to audit. Confidence ≥ 0.90 → auto-route. Below → manual review queue.
              </p>
              <ol className="space-y-2">
                {pipelineNodes.map((n, i) => (
                  <li key={n.id} className="fbm-card p-4 flex gap-4 items-start">
                    <span className="text-xs font-mono font-bold text-primary w-8 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono font-semibold text-foreground break-all">{n.id}</div>
                      <div className="text-xs font-roboto text-muted-foreground mt-1">{n.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Stack */}
            <section id="stack" className="scroll-mt-24">
              <h2 className="text-2xl font-montserrat font-extrabold text-foreground mb-2">Live stack</h2>
              <div className="fbm-section-divider mb-6" />
              <div className="fbm-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Tool</th>
                      <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Role</th>
                      <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hidden md:table-cell">Host</th>
                      <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stack.map((s) => (
                      <tr key={s.name} className="border-t border-border/50">
                        <td className="px-4 py-3 font-montserrat font-semibold text-foreground">{s.name}</td>
                        <td className="px-4 py-3 font-roboto text-muted-foreground">{s.role}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{s.host}</td>
                        <td className="px-4 py-3">
                          <span className={s.status === "Operational" ? "fbm-badge-success" : "fbm-badge-warning"}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Entities */}
            <section id="entities" className="scroll-mt-24">
              <h2 className="text-2xl font-montserrat font-extrabold text-foreground mb-2">8 Malta entities</h2>
              <div className="fbm-section-divider mb-6" />
              <div className="grid sm:grid-cols-2 gap-3">
                {entities.map((e) => (
                  <div
                    key={e.code}
                    className={`fbm-card p-4 flex items-center gap-4 ${e.highlight ? "border-primary/30 bg-primary/5" : ""}`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
                      e.highlight ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      {e.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-montserrat font-bold text-foreground truncate">{e.name}</div>
                      <div className="text-xs font-roboto text-muted-foreground">{e.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Environments */}
            <section id="environments" className="scroll-mt-24">
              <h2 className="text-2xl font-montserrat font-extrabold text-foreground mb-2">Environments</h2>
              <div className="fbm-section-divider mb-6" />
              <div className="grid md:grid-cols-2 gap-4">
                {environments.map((env) => (
                  <div key={env.name} className="fbm-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-montserrat font-bold text-foreground">{env.name}</h3>
                      <span className={env.status === "Operational" ? "fbm-badge-success" : "fbm-badge-warning"}>
                        {env.status}
                      </span>
                    </div>
                    <dl className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">URL</dt><dd className="text-foreground truncate">{env.url}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Mailbox</dt><dd className="text-foreground truncate">{env.mailbox}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Vault</dt><dd className="text-foreground truncate">{env.vault}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Tunnel</dt><dd className="text-foreground truncate">{env.tunnel}</dd></div>
                    </dl>
                  </div>
                ))}
              </div>
            </section>

            {/* UAT */}
            <section id="uat" className="scroll-mt-24">
              <h2 className="text-2xl font-montserrat font-extrabold text-foreground mb-2">UAT Results · {uat.date}</h2>
              <div className="fbm-section-divider mb-6" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { v: uat.invoicesClassified, l: "Invoices" },
                  { v: `${uat.accuracy}%`, l: "Accuracy" },
                  { v: uat.maxConfidence, l: "Max confidence" },
                  { v: uat.bugsOpen, l: "P0 bugs" },
                ].map((m) => (
                  <div key={m.l} className="fbm-metric-card text-center">
                    <div className="text-2xl font-mono font-bold text-primary">{m.v}</div>
                    <div className="text-[10px] font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mt-1">{m.l}</div>
                  </div>
                ))}
              </div>
              <ul className="space-y-2">
                {acceptanceCriteria.map((ac) => (
                  <li key={ac.id} className="fbm-card p-4 flex items-center gap-4">
                    {ac.status.toLowerCase().includes("pending") ? (
                      <Clock className="w-5 h-5 text-warning flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-muted-foreground">{ac.id}</div>
                      <div className="text-sm font-montserrat font-semibold text-foreground">{ac.text}</div>
                    </div>
                    <div className="text-xs font-mono text-foreground text-right">{ac.status}</div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
