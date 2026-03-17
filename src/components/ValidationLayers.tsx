import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import ValidationFlowDiagram from "./ValidationFlowDiagram";

const layers = [
  { id: 1, name: "Legal Format", method: "Deterministic", stage: 1, desc: "Mandatory fields per VAT legislation: invoice number, VAT ID, taxable base, applied rate.", type: "rule", stageKey: "rules" },
  { id: 2, name: "VIES Validation", method: "API Call", stage: 1, desc: "For EU suppliers, VAT ID is validated against the VIES database in real time.", type: "rule", stageKey: "rules" },
  { id: 3, name: "Vendor Verification", method: "DBC API", stage: 1, desc: "Vendor cross-checked against Business Central vendor cards. Hierarchy: VAT ID → Reg. → Name.", type: "rule", stageKey: "rules" },
  { id: 4, name: "Contract Validation", method: "Deterministic", stage: 1, desc: "Amount and service type verified against contract reference table.", type: "rule", stageKey: "rules" },
  { id: 5, name: "Duplicate Detection", method: "Deterministic", stage: 1, desc: "Invoice number, vendor and amount validated against processing log and DBC entries.", type: "rule", stageKey: "rules" },
  { id: 6, name: "VAT Compliance", method: "AI + Rules", stage: 2, desc: "Evaluates whether the supplier's tax treatment is correct. Covers reverse charge and exemptions.", type: "ai", stageKey: "ai" },
  { id: 7, name: "GL Classification", method: "AI Reasoning", stage: 2, desc: "Suggests the appropriate GL account and VAT posting group based on invoice content.", type: "ai", stageKey: "ai" },
  { id: 8, name: "Final Decision", method: "Scoring", stage: 3, desc: "Weighted confidence score: Auto-draft (≥90%), Assisted review (70-89%), or Blocked (<70%).", type: "scoring", stageKey: "decision" },
];

const stageToIds: Record<string, number[]> = {
  rules: [1, 2, 3, 4, 5],
  ai: [6, 7],
  decision: [8],
};

export default function ValidationLayers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<number | null>(null);

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "ai": return "fbm-badge-ai";
      case "scoring": return "fbm-badge-warning";
      default: return "fbm-badge-success";
    }
  };

  const isLayerHighlighted = (layer: typeof layers[0]) => {
    if (activeLayerId !== null) return layer.id === activeLayerId;
    if (activeStage !== null) return stageToIds[activeStage]?.includes(layer.id);
    return false;
  };

  const hasSelection = activeStage !== null || activeLayerId !== null;

  return (
    <section ref={ref} className="relative py-16 md:py-20 px-8 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="fbm-badge-primary mb-4 block w-fit">The Synthesis</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
            8 validation layers.
            <br />
            <span className="text-primary">Hybrid intelligence.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-roboto max-w-2xl">
            Deterministic rules for binary checks. AI only where human judgment is needed.
            Every AI decision includes written justification.
          </p>
        </motion.div>

        {/* Interactive Flow Diagram */}
        <ValidationFlowDiagram
          activeStage={activeStage}
          activeLayerId={activeLayerId}
          onStageClick={setActiveStage}
          onLayerClick={setActiveLayerId}
        />

        {/* Stage labels */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Stage 1", desc: "Parallel checks (1-5)", badge: "fbm-badge-success" },
            { label: "Stage 2", desc: "AI interpretation (6-7)", badge: "fbm-badge-ai" },
            { label: "Stage 3", desc: "Final decision (8)", badge: "fbm-badge-warning" },
          ].map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-sm font-montserrat font-bold text-foreground">{stage.label}</div>
              <div className="text-xs font-roboto text-muted-foreground">{stage.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Layer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {layers.map((layer, i) => {
            const highlighted = isLayerHighlighted(layer);
            const dimmed = hasSelection && !highlighted;
            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`fbm-card p-5 cursor-default transition-all duration-300 ${
                  highlighted
                    ? "border-primary/40 shadow-lg ring-2 ring-primary/20 scale-[1.02] -translate-y-1"
                    : dimmed
                    ? "opacity-40"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`${getBadgeClass(layer.type)}`}>
                    L{layer.id}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {layer.method}
                  </span>
                </div>
                <h3 className="text-sm font-montserrat font-bold text-foreground mb-2">{layer.name}</h3>
                <p className="text-xs font-roboto text-muted-foreground leading-relaxed line-clamp-3">{layer.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Processing flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 fbm-card-dark p-8"
        >
          <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-6">Decision Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { score: "≥ 90%", decision: "AUTO-DRAFT", desc: "Invoice draft created automatically in DBC", color: "text-green-400", bg: "bg-green-400/10 border border-green-400/20" },
              { score: "70–89%", decision: "REVIEW", desc: "Draft with visible flags for AP Executive", color: "text-amber-400", bg: "bg-amber-400/10 border border-amber-400/20" },
              { score: "< 70%", decision: "MANUAL QUEUE", desc: "Saved to Dropbox. Email notification sent.", color: "text-red-400", bg: "bg-red-400/10 border border-red-400/20" },
              { score: "Error", decision: "BLOCKED", desc: "Immediate block. Urgent notification.", color: "text-red-500", bg: "bg-red-500/10 border border-red-500/20" },
            ].map((item) => (
              <motion.div
                key={item.decision}
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`rounded-xl p-4 ${item.bg}`}
              >
                <div className={`text-2xl font-mono font-bold ${item.color}`}>{item.score}</div>
                <div className="text-xs font-mono font-bold text-white/90 mt-1">{item.decision}</div>
                <div className="text-xs font-roboto text-white/50 mt-2">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
