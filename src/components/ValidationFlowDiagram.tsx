import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Shield, Brain, Diamond } from "lucide-react";

const ruleFilters = [
  { id: 1, label: "Legal Format" },
  { id: 2, label: "VIES Validation" },
  { id: 3, label: "Vendor Verification" },
  { id: 4, label: "Contract Validation" },
  { id: 5, label: "Duplicate Detection" },
];

const aiLayers = [
  { id: 6, label: "VAT Compliance" },
  { id: 7, label: "GL & VAT Classification" },
];

const decisions = [
  { id: 8, key: "auto", label: "Auto-Draft", color: "text-success", border: "border-success", bg: "bg-success/10", arrow: "stroke-success", score: "≥ 90%", desc: "Invoice passes all layers with high confidence. Automatically drafted into Business Central." },
  { id: 8, key: "assisted", label: "Assisted Review", color: "text-warning", border: "border-warning", bg: "bg-warning/10", arrow: "stroke-warning", score: "70–89%", desc: "One or more layers flagged uncertainty. Routed to AP team with AI suggestions pre-filled." },
  { id: 8, key: "block", label: "Block / Manual", color: "text-primary", border: "border-primary", bg: "bg-primary/10", arrow: "stroke-primary", score: "< 70%", desc: "Critical validation failure. Invoice blocked and queued for full manual review." },
];

interface Props {
  activeStage: string | null;
  activeLayerId: number | null;
  onStageClick: (stage: string | null) => void;
  onLayerClick: (id: number | null) => void;
}

export default function ValidationFlowDiagram({ activeStage, activeLayerId, onStageClick, onLayerClick }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-50px" });
  const [activeDecision, setActiveDecision] = useState<string | null>(null);

  // Reset decision panel when stage/layer selection changes externally
  useEffect(() => {
    setActiveDecision(null);
  }, [activeStage, activeLayerId]);

  const stageActive = (stage: string) => activeStage === stage || activeStage === null;

  const handleStageClick = (stage: string) => {
    onLayerClick(null);
    onStageClick(activeStage === stage ? null : stage);
  };

  const handleItemClick = (id: number, stage: string) => {
    onStageClick(null);
    onLayerClick(activeLayerId === id ? null : id);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fbm-card p-6 md:p-10 mb-10 overflow-x-auto"
    >
      <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-2">
        The 8 Validation Layers
      </h3>
      <p className="text-xs font-roboto text-muted-foreground mb-8">System Flow — Click any component to highlight details</p>

      {/* Flow diagram */}
      <div className="min-w-[800px]">
        <div className="flex items-center gap-0 relative">

          {/* === STAGE 1: Rule-Based Filters === */}
          <div
            className="flex-shrink-0 w-[240px] cursor-pointer"
            onClick={() => handleStageClick("rules")}
          >
            <div className={`text-center mb-4 transition-opacity duration-300 ${stageActive("rules") ? "opacity-100" : "opacity-40"}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-xs font-montserrat font-bold text-foreground uppercase tracking-wider">Rule-Based Filters</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Stage 1 — Parallel</span>
            </div>

            <div className="space-y-2">
              {ruleFilters.map((filter, i) => (
                <motion.div
                  key={filter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  onClick={(e) => { e.stopPropagation(); handleItemClick(filter.id, "rules"); }}
                  className={`px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    activeLayerId === filter.id
                      ? "border-success bg-success/20 shadow-md scale-[1.03]"
                      : "border-success/30 bg-success/5"
                  } ${stageActive("rules") || activeLayerId === filter.id ? "opacity-100" : "opacity-40"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-success">{filter.id}.</span>
                    <span className="text-xs font-montserrat font-semibold text-foreground">{filter.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* === Arrow 1: Rules → AI === */}
          <div className="flex-shrink-0 w-[60px] flex items-center justify-center self-center">
            <svg width="60" height="40" viewBox="0 0 60 40" className={`transition-opacity duration-300 ${stageActive("rules") || stageActive("ai") ? "opacity-100" : "opacity-40"}`}>
              <motion.line
                x1="0" y1="20" x2="45" y2="20"
                stroke="hsl(var(--fbm-gray-medium))"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
              <motion.polygon
                points="45,14 57,20 45,26"
                fill="hsl(var(--fbm-gray-medium))"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
              />
            </svg>
          </div>

          {/* === STAGE 2: AI Brain === */}
          <div
            className="flex-shrink-0 w-[200px] flex flex-col items-center cursor-pointer"
            onClick={() => handleStageClick("ai")}
          >
            <div className={`text-center mb-4 transition-opacity duration-300 ${stageActive("ai") ? "opacity-100" : "opacity-40"}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-ai" />
                <span className="text-xs font-montserrat font-bold text-foreground uppercase tracking-wider">AI Brain</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Stage 2 — Interpretation</span>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05 }}
              className={`relative w-[180px] h-[180px] rounded-full border-4 border-ai/30 bg-ai/5 flex flex-col items-center justify-center transition-all duration-300 ${
                stageActive("ai") ? "opacity-100 shadow-lg" : "opacity-40"
              }`}
            >
              <motion.div
                className="absolute inset-[-4px] rounded-full border-4 border-ai/20"
                animate={activeStage === "ai" ? { scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-ai/10 to-transparent" />

              <div className="relative z-10 space-y-3 text-center px-4">
                {aiLayers.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={(e) => { e.stopPropagation(); handleItemClick(layer.id, "ai"); }}
                    className={`cursor-pointer rounded-md px-2 py-1 transition-all duration-200 ${
                      activeLayerId === layer.id ? "bg-ai/20 scale-105" : "hover:bg-ai/10"
                    }`}
                  >
                    <span className="text-xs font-mono font-bold text-ai">{layer.id}.</span>
                    <span className="text-xs font-montserrat font-semibold text-foreground ml-1">{layer.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* === Arrow 2: AI → Decision === */}
          <div className="flex-shrink-0 w-[60px] flex items-center justify-center self-center">
            <svg width="60" height="40" viewBox="0 0 60 40" className={`transition-opacity duration-300 ${stageActive("ai") || stageActive("decision") ? "opacity-100" : "opacity-40"}`}>
              <motion.line
                x1="0" y1="20" x2="45" y2="20"
                stroke="hsl(var(--fbm-gray-medium))"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ delay: 1.3, duration: 0.6 }}
              />
              <motion.polygon
                points="45,14 57,20 45,26"
                fill="hsl(var(--fbm-gray-medium))"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 1.7 }}
              />
            </svg>
          </div>

          {/* === STAGE 3: Decision Diamond + Outputs === */}
          <div
            className="flex-shrink-0 w-[280px] cursor-pointer"
            onClick={() => handleStageClick("decision")}
          >
            <div className={`text-center mb-4 transition-opacity duration-300 ${stageActive("decision") ? "opacity-100" : "opacity-40"}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Diamond className="w-4 h-4 text-warning" />
                <span className="text-xs font-montserrat font-bold text-foreground uppercase tracking-wider">Decision Gate</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Stage 3 — Scoring</span>
            </div>

            <div className={`flex items-center gap-4 transition-opacity duration-300 ${stageActive("decision") ? "opacity-100" : "opacity-40"}`}>
              {/* Diamond */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.5, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => { e.stopPropagation(); handleItemClick(8, "decision"); }}
                className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  activeLayerId === 8 ? "scale-[1.08]" : ""
                }`}
              >
                <div className={`w-[100px] h-[100px] rotate-45 rounded-xl border-3 bg-card flex items-center justify-center transition-all duration-200 ${
                  activeLayerId === 8 ? "border-warning/60 shadow-lg" : "border-foreground/20"
                }`}
                  style={{ boxShadow: "var(--shadow-lg)" }}
                >
                  <div className="-rotate-45 text-center">
                    <span className="text-[10px] font-mono font-bold text-foreground block">8.</span>
                     <span className="text-[9px] font-montserrat font-bold text-foreground leading-tight block">Confidence</span>
                     <span className="text-[9px] font-montserrat font-bold text-foreground leading-tight block">Scoring</span>
                  </div>
                </div>
              </motion.div>

              {/* Decision outputs */}
              <div className="space-y-2 flex-1">
                {decisions.map((d, i) => (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1.8 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.05, x: 4 }}
                    onClick={(e) => { e.stopPropagation(); setActiveDecision(activeDecision === d.key ? null : d.key); }}
                    className={`px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${d.border}/30 ${d.bg} ${
                      activeDecision === d.key ? "ring-2 ring-offset-1 ring-offset-card " + d.border + " scale-[1.03]" : ""
                    }`}
                  >
                    <span className={`text-xs font-montserrat font-semibold ${d.color}`}>{d.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Decision Detail Panel — appears to the right */}
          <AnimatePresence mode="wait">
            {activeDecision && (() => {
              const d = decisions.find(dec => dec.key === activeDecision)!;
              return (
                <motion.div
                  key={activeDecision}
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0 w-[200px] self-center"
                >
                  <div className={`rounded-lg border-2 ${d.border}/30 ${d.bg} p-4`}>
                    <div className={`text-3xl font-montserrat font-black ${d.color} mb-2`}>
                      {d.score}
                    </div>
                    <h4 className={`text-sm font-montserrat font-bold ${d.color} mb-1`}>{d.label}</h4>
                    <p className="text-[10px] font-roboto text-muted-foreground leading-relaxed">{d.desc}</p>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
