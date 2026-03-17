import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
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
  { label: "Auto-Draft", color: "text-success", border: "border-success", bg: "bg-success/10", arrow: "stroke-success" },
  { label: "Assisted Review", color: "text-warning", border: "border-warning", bg: "bg-warning/10", arrow: "stroke-warning" },
  { label: "Block / Manual", color: "text-primary", border: "border-primary", bg: "bg-primary/10", arrow: "stroke-primary" },
];

export default function ValidationFlowDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const stageActive = (stage: string) => hoveredStage === stage || hoveredStage === null;

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
      <p className="text-xs font-roboto text-muted-foreground mb-8">System Flow</p>

      {/* Flow diagram */}
      <div className="min-w-[800px]">
        <div className="flex items-center gap-0 relative">

          {/* === STAGE 1: Rule-Based Filters === */}
          <div
            className="flex-shrink-0 w-[240px]"
            onMouseEnter={() => setHoveredStage("rules")}
            onMouseLeave={() => setHoveredStage(null)}
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
                  className={`px-4 py-2.5 rounded-lg border-2 border-success/30 bg-success/5 cursor-default transition-all duration-300 ${
                    stageActive("rules") ? "opacity-100" : "opacity-40"
                  }`}
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
            className="flex-shrink-0 w-[200px] flex flex-col items-center"
            onMouseEnter={() => setHoveredStage("ai")}
            onMouseLeave={() => setHoveredStage(null)}
          >
            <div className={`text-center mb-4 transition-opacity duration-300 ${stageActive("ai") ? "opacity-100" : "opacity-40"}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-ai" />
                <span className="text-xs font-montserrat font-bold text-foreground uppercase tracking-wider">El Cerebro de IA</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Etapa 2 — Interpretación</span>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05 }}
              className={`relative w-[180px] h-[180px] rounded-full border-4 border-ai/30 bg-ai/5 flex flex-col items-center justify-center cursor-default transition-all duration-300 ${
                stageActive("ai") ? "opacity-100 shadow-lg" : "opacity-40"
              }`}
            >
              {/* Outer ring animation */}
              <motion.div
                className="absolute inset-[-4px] rounded-full border-4 border-ai/20"
                animate={hoveredStage === "ai" ? { scale: [1, 1.06, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Inner glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-ai/10 to-transparent" />

              <div className="relative z-10 space-y-3 text-center px-4">
                {aiLayers.map((layer) => (
                  <div key={layer.id}>
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
            className="flex-shrink-0 w-[280px]"
            onMouseEnter={() => setHoveredStage("decision")}
            onMouseLeave={() => setHoveredStage(null)}
          >
            <div className={`text-center mb-4 transition-opacity duration-300 ${stageActive("decision") ? "opacity-100" : "opacity-40"}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Diamond className="w-4 h-4 text-warning" />
                <span className="text-xs font-montserrat font-bold text-foreground uppercase tracking-wider">Semáforo de Decisión</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Etapa 3 — Puntuación</span>
            </div>

            <div className={`flex items-center gap-4 transition-opacity duration-300 ${stageActive("decision") ? "opacity-100" : "opacity-40"}`}>
              {/* Diamond */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.5, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="relative flex-shrink-0"
              >
                <div className="w-[100px] h-[100px] rotate-45 rounded-xl border-3 border-foreground/20 bg-card flex items-center justify-center"
                  style={{ boxShadow: "var(--shadow-lg)" }}
                >
                  <div className="-rotate-45 text-center">
                    <span className="text-[10px] font-mono font-bold text-foreground block">8.</span>
                    <span className="text-[9px] font-montserrat font-bold text-foreground leading-tight block">Puntuación</span>
                    <span className="text-[9px] font-montserrat font-bold text-foreground leading-tight block">de Confianza</span>
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
                    className={`px-3 py-2 rounded-lg border-2 ${d.border}/30 ${d.bg} cursor-default`}
                  >
                    <span className={`text-xs font-montserrat font-semibold ${d.color}`}>{d.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
