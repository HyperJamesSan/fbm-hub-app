import { motion } from "framer-motion";
import { Clock, AlertTriangle, User, FileText } from "lucide-react";

export default function BeforeS2({ isActive }: { isActive: boolean }) {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16 py-20 bg-background">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="fbm-badge-muted mb-4 inline-block">Act 1 · Before</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter text-foreground">
            One person.
            <br />
            <span className="text-muted-foreground">3–10 minutes per invoice.</span>
          </h2>
          <p className="text-lg font-roboto text-muted-foreground mt-4 max-w-2xl">
            Manual. Repetitive. Unscalable.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: FileText, value: "100–125", label: "Invoices / month", color: "text-foreground" },
            { icon: Clock, value: "3–10", label: "Minutes / invoice", color: "text-foreground" },
            { icon: Clock, value: "20–35h", label: "Hours / month", color: "text-warning" },
            { icon: User, value: "1", label: "Single point of failure", color: "text-destructive" },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="fbm-card p-6"
              >
                <Icon className="w-5 h-5 text-muted-foreground mb-3" />
                <div className={`text-3xl font-mono font-bold ${m.color}`}>{m.value}</div>
                <div className="text-[11px] font-montserrat font-semibold uppercase tracking-wider text-muted-foreground mt-2">
                  {m.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-10 fbm-card-dark p-6 flex items-start gap-4"
        >
          <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-montserrat font-bold text-white">Read the PDF. Identify the entity. File it. Enter it in the ERP.</h3>
            <p className="text-sm font-roboto text-white/60 mt-1">
              Repeated 100+ times every month. Error rate unknown. No audit trail. If the AP Executive was on leave, the queue piled up.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
