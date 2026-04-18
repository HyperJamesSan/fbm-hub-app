import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { uat } from "@/data/program";

export default function HeroS2() {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="fbm-badge-muted">Session 2 · 20 April 2026</span>
            <span className="fbm-badge-primary">Module 1 · AP Automation</span>
            <span className="fbm-badge-success inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              UAT PASS · {uat.date}
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-montserrat font-extrabold tracking-tighter text-foreground leading-[0.9]">
            It works.
          </h1>

          <p className="text-lg md:text-2xl font-roboto text-muted-foreground mt-6 max-w-3xl">
            We proposed it in March. We built it. <span className="text-foreground font-semibold">100% accuracy on 222 invoices.</span> One gate left to ship.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14"
        >
          {[
            { v: uat.invoicesClassified, l: "Invoices auto-routed" },
            { v: `${uat.accuracy}%`, l: "Classification accuracy" },
            { v: uat.bugsOpen, l: "P0 bugs open" },
            { v: uat.acceptanceCriteria, l: "Acceptance criteria" },
          ].map((m, i) => (
            <motion.div
              key={m.l}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="fbm-metric-card text-center"
            >
              <div className="text-3xl md:text-5xl font-mono font-bold text-primary">{m.v}</div>
              <div className="text-[10px] md:text-xs font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mt-2">
                {m.l}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-xs font-mono text-muted-foreground"
        >
          Presented by James Sanabria · Finance Operations Lead
        </motion.div>
      </div>
    </section>
  );
}
