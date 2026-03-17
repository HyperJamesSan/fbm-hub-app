import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import fbmLogo from "@/assets/fbm-logo.png";

const summaryItems = [
  { q: "What?", a: "AP automation system that processes invoices from 7 Malta entities — from email to draft in DBC — with complete traceability." },
  { q: "Why?", a: "100% manual process, dependent on one operator, no scalability. We eliminate repetitive validation, reduce classification error." },
  { q: "How?", a: "n8n + Claude API + DBC API. Hybrid model: deterministic rules + AI reasoning. Complete audit log per invoice." },
  { q: "When?", a: "POC: 6 weeks. Evaluation: Week 5. Decision: Week 6. Production: Q2 2026." },
  { q: "Cost?", a: "$27–30/month (cloud). $3–6/month (Claude only if n8n self-hosted). Hosting decision pending with IT." },
];

export default function SummarySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-8 bg-card">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="fbm-section-divider mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
            Recommendation.
          </h2>
          <p className="text-lg font-roboto text-muted-foreground max-w-2xl mx-auto">
            Proceed with a <span className="text-primary font-bold">6-week proof of concept</span>.
            Validate accuracy against real samples.
          </p>
        </motion.div>

        <div className="space-y-3 mb-14">
          {summaryItems.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 6 }}
              className="fbm-card p-6 flex gap-6 items-start"
            >
              <span className="text-xl font-montserrat font-extrabold text-primary shrink-0 w-20">{item.q}</span>
              <p className="text-sm font-roboto text-muted-foreground leading-relaxed">{item.a}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <div className="fbm-card-dark p-10 inline-block rounded-2xl">
            <img src={fbmLogo} alt="FBM" className="h-12 w-auto mx-auto mb-5 drop-shadow-lg" />
            <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-1">
              FBM Limited — Finance Operations
            </p>
            <p className="text-sm font-roboto text-white/70">
              Hyperautomation of Finance Processes — Module 1: AP Process
            </p>
            <p className="text-sm font-roboto text-white/70 mt-1">March 2026</p>
            <div className="mt-6 mb-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-xs font-mono text-primary">Alignment Session Ready</span>
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="text-sm font-montserrat font-bold text-white/90">James Sanabria</p>
              <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider mt-1">Finance Operation Lead</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
