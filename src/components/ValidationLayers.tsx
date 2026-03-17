import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import ValidationFlowDiagram from "./ValidationFlowDiagram";

const layers = [
  {
    id: 1, name: "Legal Format", method: "Deterministic", stage: 1,
    desc: "Mandatory fields per VAT legislation: invoice number, VAT ID, taxable base, applied rate.",
    type: "rule", stageKey: "rules",
    backTitle: "Legal Format Check",
    backDetails: "Validates mandatory invoice fields required by EU VAT Directive 2006/112/EC. Checks: invoice number, date, supplier/buyer VAT IDs, line descriptions, taxable amounts, and VAT rates.",
    backExtra: "Reject if any mandatory field is missing or malformed.",
  },
  {
    id: 2, name: "VIES Validation", method: "API Call", stage: 1,
    desc: "For EU suppliers, VAT ID is validated against the VIES database in real time.",
    type: "rule", stageKey: "rules",
    backTitle: "VIES API Integration",
    backDetails: "Real-time query to the European Commission VIES database. Confirms VAT registration status, legal name match, and country prefix consistency.",
    backExtra: "Fallback: retry queue if VIES is temporarily unavailable.",
  },
  {
    id: 3, name: "Vendor Verification", method: "DBC API", stage: 1,
    desc: "Vendor cross-checked against Business Central vendor cards. Hierarchy: VAT ID → Reg. → Name.",
    type: "rule", stageKey: "rules",
    backTitle: "Vendor Master Match",
    backDetails: "Three-tier matching hierarchy against Dynamics Business Central: (1) VAT ID exact match, (2) Registration number, (3) Fuzzy name match with confidence threshold.",
    backExtra: "Unmatched vendors flagged for manual onboarding.",
  },
  {
    id: 4, name: "Contract Validation", method: "Deterministic", stage: 1,
    desc: "Amount and service type verified against contract reference table.",
    type: "rule", stageKey: "rules",
    backTitle: "Contract Compliance",
    backDetails: "Cross-references invoice amounts against active contracts. Validates service type, agreed rates, billing frequency, and cumulative spend against contract ceilings.",
    backExtra: "Tolerance: ±2% for rounding differences.",
  },
  {
    id: 5, name: "Duplicate Detection", method: "Deterministic", stage: 1,
    desc: "Invoice number, vendor and amount validated against processing log and DBC entries.",
    type: "rule", stageKey: "rules",
    backTitle: "Duplicate Prevention",
    backDetails: "Multi-factor duplicate detection: exact invoice number + vendor match, plus fuzzy matching on amount ± date window (±5 days) to catch renumbered duplicates.",
    backExtra: "Historical lookback: 24 months of processed invoices.",
  },
  {
    id: 6, name: "VAT Compliance", method: "AI + Rules", stage: 2,
    desc: "Evaluates whether the supplier's tax treatment is correct. Covers reverse charge and exemptions.",
    type: "ai", stageKey: "ai",
    backTitle: "AI Tax Reasoning",
    backDetails: "Combines rule-based country/entity logic with LLM interpretation for edge cases: reverse charge applicability, exemption codes, and intra-community supply classification.",
    backExtra: "Every AI decision includes a written justification audit trail.",
  },
  {
    id: 7, name: "GL Classification", method: "AI Reasoning", stage: 2,
    desc: "Suggests the appropriate GL account and VAT posting group based on invoice content.",
    type: "ai", stageKey: "ai",
    backTitle: "Intelligent Coding",
    backDetails: "LLM analyzes invoice line descriptions to suggest GL accounts and VAT posting groups. Trained on 12 months of historical postings across all 7 Malta entities.",
    backExtra: "Confidence score per line item; low-confidence lines routed to review.",
  },
  {
    id: 8, name: "Final Decision", method: "Scoring", stage: 3,
    desc: "Weighted confidence score: Auto-draft (≥90%), Assisted review (70-89%), or Blocked (<70%).",
    type: "scoring", stageKey: "decision",
    backTitle: "Confidence Gate",
    backDetails: "Aggregates weighted scores from all 7 upstream layers. Each layer contributes proportionally based on risk impact. Final score determines routing path.",
    backExtra: "≥90% → Auto-draft  |  70-89% → Assisted  |  <70% → Block",
  },
];

const stageToIds: Record<string, number[]> = {
  rules: [1, 2, 3, 4, 5],
  ai: [6, 7],
  decision: [8],
};

export default function ValidationLayers() {
  const ref = useRef(null);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "ai": return "fbm-badge-ai";
      case "scoring": return "fbm-badge-warning";
      default: return "fbm-badge-success";
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "ai": return "border-ai/40 bg-ai/10 text-ai";
      case "scoring": return "border-warning/40 bg-warning/10 text-warning";
      default: return "border-success/40 bg-success/10 text-success";
    }
  };

  const isLayerHighlighted = (layer: typeof layers[0]) => {
    if (activeLayerId !== null) return layer.id === activeLayerId;
    if (activeStage !== null) return stageToIds[activeStage]?.includes(layer.id);
    return false;
  };

  const hasSelection = activeStage !== null || activeLayerId !== null;

  const handleStageClick = (stage: string | null) => {
    setActiveStage(stage);
    if (stage !== null) setFocusMode(true);
  };

  const handleLayerClick = (id: number | null) => {
    setActiveLayerId(id);
    if (id !== null) setFocusMode(true);
  };

  const handleCardClick = (layer: typeof layers[0]) => {
    // Sync with diagram (same as clicking inside diagram)
    handleLayerClick(activeLayerId === layer.id ? null : layer.id);
    // Toggle flip
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(layer.id)) {
        next.delete(layer.id);
      } else {
        next.add(layer.id);
      }
      return next;
    });
  };

  const handleExitFocus = () => {
    setFocusMode(false);
    setActiveStage(null);
    setActiveLayerId(null);
    setFlippedCards(new Set());
  };

  return (
    <section ref={ref} className="relative h-screen flex flex-col justify-center px-8 bg-card overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!focusMode ? (
            /* === DEFAULT VIEW: Header + Flow Diagram === */
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8">
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
              </div>

              <ValidationFlowDiagram
                activeStage={activeStage}
                activeLayerId={activeLayerId}
                onStageClick={handleStageClick}
                onLayerClick={handleLayerClick}
              />
            </motion.div>
          ) : (
            /* === FOCUS VIEW: Flow Diagram + 8 Layer Cards === */
            <motion.div
              key="focus"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ValidationFlowDiagram
                activeStage={activeStage}
                activeLayerId={activeLayerId}
                onStageClick={handleStageClick}
                onLayerClick={handleLayerClick}
              />

              {/* 8 Layer Flip Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {layers.map((layer, i) => {
                  const highlighted = isLayerHighlighted(layer);
                  const dimmed = hasSelection && !highlighted;
                  const isFlipped = flippedCards.has(layer.id);
                  return (
                    <div
                      key={layer.id}
                      onClick={() => handleCardClick(layer)}
                      className={`cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 ${dimmed ? "opacity-40" : ""}`}
                      style={{ perspective: "800px" }}
                    >
                      <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformStyle: "preserve-3d", position: "relative" }}
                        className="h-[140px]"
                      >
                        {/* FRONT */}
                        <div
                          className={`absolute inset-0 fbm-card p-4 transition-all duration-300 ${
                            highlighted
                              ? "border-primary/40 shadow-lg ring-2 ring-primary/20"
                              : ""
                          }`}
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={getBadgeClass(layer.type)}>L{layer.id}</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">{layer.method}</span>
                          </div>
                          <h3 className="text-sm font-montserrat font-bold text-foreground mb-1">{layer.name}</h3>
                          <p className="text-xs font-roboto text-muted-foreground leading-relaxed line-clamp-3">{layer.desc}</p>
                        </div>

                        {/* BACK */}
                        <div
                          className={`absolute inset-0 fbm-card p-4 flex flex-col justify-between transition-all duration-300 overflow-hidden ${getBadgeColor(layer.type)} border-2`}
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={getBadgeClass(layer.type)}>L{layer.id}</span>
                              <span className="text-[10px] font-mono text-muted-foreground/70">↩ flip</span>
                            </div>
                            <h3 className="text-xs font-montserrat font-bold text-foreground mb-1">{layer.backTitle}</h3>
                          </div>
                          <p className="text-[10px] font-mono text-foreground/80 bg-background/40 rounded px-2 py-1.5 leading-snug">{layer.backExtra}</p>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Exit focus button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleExitFocus}
                className="mt-4 mx-auto block text-xs font-mono text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 rounded-lg px-4 py-2 transition-all"
              >
                ← Back to overview
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
