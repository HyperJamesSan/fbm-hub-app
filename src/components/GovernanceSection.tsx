import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield } from "lucide-react";

const governanceRows = [
  {
    component: "n8n Orchestration",
    owner: "Finance Operations Lead",
    hosting: "To be confirmed by IT",
    governance: "Under IT governance",
  },
  {
    component: "Claude API",
    owner: "Finance Operations Lead",
    hosting: "External API (HTTPS only)",
    governance: "Monthly spend cap + DPA",
  },
  {
    component: "DBC API Integration",
    owner: "Business Systems Manager",
    hosting: "Internal (existing DBC)",
    governance: "IT-managed credentials",
  },
  {
    component: "VIES API",
    owner: "Finance Operations Lead",
    hosting: "EC public API (HTTPS)",
    governance: "No data stored externally",
  },
  {
    component: "Document Storage",
    owner: "IT / Admin",
    hosting: "Dropbox (existing)",
    governance: "Existing governance applies",
  },
  {
    component: "Audit Log",
    owner: "Finance + IT",
    hosting: "To be confirmed by IT",
    governance: "To be confirmed by IT",
  },
  {
    component: "Monitoring Dashboard",
    owner: "Finance Operations Lead",
    hosting: "Power BI (existing)",
    governance: "To be implemented in a later phase, once the system is stable and sufficient data is available for meaningful reporting.",
  },
];

export default function GovernanceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="fbm-badge-primary mb-4 block w-fit">Governance</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
            Governance &
            <br />
            <span className="text-primary">Ownership.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-roboto max-w-2xl">
            Clear accountability across every component of the AP automation pipeline.
          </p>
        </motion.div>

        {/* Governance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="fbm-card overflow-hidden"
        >
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-montserrat font-bold text-foreground uppercase tracking-wider">
              Component Governance Matrix
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Component", "Operational Owner", "Hosting Model", "Governance"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {governanceRows.map((row, i) => (
                  <motion.tr
                    key={row.component}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.5 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors align-top"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-montserrat font-bold text-foreground">{row.component}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-roboto text-foreground/80">{row.owner}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-roboto text-foreground/80">{row.hosting}</span>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <span className="text-xs font-roboto text-muted-foreground">{row.governance}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
