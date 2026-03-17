import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Users, AlertTriangle, CheckCircle, Settings, FileText } from "lucide-react";

const governanceRows = [
  {
    area: "Invoice Ingestion",
    owner: "AP Team Lead",
    approver: "Finance Director",
    escalation: "CFO",
    sla: "Same-day processing",
    review: "Weekly",
  },
  {
    area: "Validation Rules",
    owner: "IT / Automation Lead",
    approver: "AP Team Lead",
    escalation: "Finance Director",
    sla: "Rule changes within 48h",
    review: "Bi-weekly",
  },
  {
    area: "AI Confidence Thresholds",
    owner: "IT / Automation Lead",
    approver: "Finance Director",
    escalation: "CFO",
    sla: "Threshold tuning within 1 week",
    review: "Monthly",
  },
  {
    area: "ERP Integration (DBC)",
    owner: "IT Manager",
    approver: "Finance Director",
    escalation: "CTO / CFO",
    sla: "API issues resolved within 4h",
    review: "Monthly",
  },
  {
    area: "Exception Handling",
    owner: "AP Team",
    approver: "AP Team Lead",
    escalation: "Finance Director",
    sla: "Exceptions resolved within 24h",
    review: "Daily",
  },
  {
    area: "Audit & Compliance",
    owner: "Finance Director",
    approver: "CFO",
    escalation: "Board / External Auditor",
    sla: "Audit trail always available",
    review: "Quarterly",
  },
];

const raciData = [
  { task: "Configure n8n workflows", r: "IT / Automation", a: "IT Manager", c: "AP Team Lead", i: "Finance Director" },
  { task: "Define validation rules", r: "AP Team Lead", a: "Finance Director", c: "IT / Automation", i: "CFO" },
  { task: "Monitor AI accuracy", r: "IT / Automation", a: "AP Team Lead", c: "Finance Director", i: "External Auditor" },
  { task: "Handle exceptions", r: "AP Team", a: "AP Team Lead", c: "IT / Automation", i: "Finance Director" },
  { task: "Review audit logs", r: "Finance Director", a: "CFO", c: "External Auditor", i: "Board" },
  { task: "Approve vendor payments", r: "AP Team Lead", a: "Finance Director", c: "AP Team", i: "CFO" },
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
            Clear accountability across every layer of the AP automation pipeline.
          </p>
        </motion.div>

        {/* Ownership Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="fbm-card overflow-hidden mb-10"
        >
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-montserrat font-bold text-foreground uppercase tracking-wider">
              Ownership Matrix
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Area", "Owner", "Approver", "Escalation", "SLA", "Review Cycle"].map((h) => (
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
                    key={row.area}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.5 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-montserrat font-bold text-foreground">{row.area}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-roboto text-foreground/80 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-primary/60" />
                        {row.owner}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-roboto text-foreground/80 flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-success/60" />
                        {row.approver}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-roboto text-foreground/80 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-warning/60" />
                        {row.escalation}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-mono text-muted-foreground">{row.sla}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {row.review}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* RACI Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="fbm-card overflow-hidden"
        >
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ai/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-ai" />
            </div>
            <h3 className="text-sm font-montserrat font-bold text-foreground uppercase tracking-wider">
              RACI Matrix
            </h3>
            <div className="ml-auto flex gap-3">
              {[
                { letter: "R", label: "Responsible", color: "text-primary" },
                { letter: "A", label: "Accountable", color: "text-success" },
                { letter: "C", label: "Consulted", color: "text-warning" },
                { letter: "I", label: "Informed", color: "text-muted-foreground" },
              ].map((item) => (
                <span key={item.letter} className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                  <span className={`font-bold ${item.color}`}>{item.letter}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-5 py-3 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                    Task
                  </th>
                  {["Responsible", "Accountable", "Consulted", "Informed"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest text-center"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {raciData.map((row, i) => (
                  <motion.tr
                    key={row.task}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 + i * 0.07, duration: 0.5 }}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-montserrat font-bold text-foreground flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        {row.task}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-[10px] font-mono text-primary font-bold">{row.r}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-[10px] font-mono text-success font-bold">{row.a}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-[10px] font-mono text-warning font-bold">{row.c}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-[10px] font-mono text-muted-foreground">{row.i}</span>
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
