import { motion } from "framer-motion";

const phases = [
  { date: "Mar 2026", phase: "Kickoff", desc: "Session 1 — proposal approved. Architecture & POC plan signed off." },
  { date: "Mar 22", phase: "Test corpus", desc: "649 PDFs catalogued. 355 valid PDFs processed. 222 invoices classified across 8 entities." },
  { date: "Mar 23", phase: "Build", desc: "n8n workflow live, prompt v1.1 → v1.4, Dropbox & Notion audit wired." },
  { date: "Apr 16", phase: "UAT PASS", desc: "222/222 invoices classified · 100% accuracy · 6/6 AC · 0 bugs.", active: true },
  { date: "Apr 17", phase: "DBC creds", desc: "Business Central credentials received. Integration build kicks off." },
  { date: "Apr 20", phase: "We are here", desc: "Session 2 — present results, unlock the final gate.", current: true },
];

export default function BuildTimelineS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-card">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-ai mb-4 inline-block">From proposal to production</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            6 weeks.
            <br />
            <span className="text-primary">Promise kept.</span>
          </h2>
        </motion.div>

        <div className="mt-14 relative">
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-2 bottom-2 w-px bg-border" />
          <div className="space-y-8">
            {phases.map((p, i) => (
              <motion.div
                key={p.date}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`relative flex items-start gap-4 md:gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 z-10 ${
                  p.current ? "bg-primary border-primary animate-pulse" :
                  p.active ? "bg-success border-success" :
                  "bg-card border-border"
                }`} />
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{p.date}</div>
                  <h3 className={`text-lg font-montserrat font-bold mt-1 ${
                    p.current ? "text-primary" : p.active ? "text-success" : "text-foreground"
                  }`}>
                    {p.phase}
                  </h3>
                  <p className="text-sm font-roboto text-muted-foreground mt-1">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
