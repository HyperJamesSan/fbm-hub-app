import { motion } from "framer-motion";
import { Check } from "lucide-react";

type Card = {
  n: number;
  title: string;
  detail: string;
  tag: string;
  resolved?: boolean;
};

const cards: Card[] = [
  {
    n: 1,
    title: "Confirm the path to Shadow Mode",
    detail:
      "Sandbox this week → 2w integration → 1w Shadow Mode → auto-route ON. Are we all aligned on Q2?",
    tag: "Owner · All",
  },
  {
    n: 2,
    title: "What is the next module?",
    detail:
      "With M1 on its way to PROD — do we confirm Revenue Invoicing (M2) as the next priority?",
    tag: "Owner · CFO",
  },
  {
    n: 3,
    title: "Vendor lookup — resolved",
    detail: "Malta entities → VAT number · Others → by name",
    tag: "Resolved",
    resolved: true,
  },
  {
    n: 4,
    title: "OData v4 endpoints — confirmed",
    detail:
      "Companies · Vendors · Dimension Value · Chart of Accounts — received Apr 17.",
    tag: "Confirmed",
    resolved: true,
  },
];

export default function DecisionsS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-card">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-primary mb-4 inline-block">Decisions required today</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            Two questions.
            <br />
            <span className="text-primary">Before we leave the call.</span>
          </h2>
          <p className="mt-6 max-w-3xl text-base md:text-lg font-roboto text-muted-foreground">
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mt-12">
          {cards.map((d, i) => (
            <motion.div
              key={d.n}
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: d.resolved ? 0.6 : 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1 }}
              className={`fbm-card p-6 flex gap-5 ${d.resolved ? "border-dashed" : ""}`}
            >
              <div
                className={`text-5xl font-mono font-bold leading-none ${
                  d.resolved ? "text-muted-foreground/30" : "text-primary/30"
                }`}
              >
                {String(d.n).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-montserrat font-bold text-foreground">{d.title}</h3>
                <p className="text-sm font-roboto text-muted-foreground mt-2">{d.detail}</p>
                <div
                  className={`mt-3 inline-flex items-center gap-1.5 text-[10px] font-montserrat font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    d.resolved
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {d.resolved && <Check className="w-3 h-3" />}
                  {d.tag}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
