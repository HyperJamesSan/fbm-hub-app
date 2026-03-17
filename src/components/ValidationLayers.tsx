import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import ValidationFlowDiagram from "./ValidationFlowDiagram";

const layers = [
  { id: 1, name: "Formato Legal", method: "Deterministic", stage: 1, desc: "Campos obligatorios por legislación IVA: número factura, NIF, base imponible, tasa aplicada.", type: "rule" },
  { id: 2, name: "Validación VIES", method: "API Call", stage: 1, desc: "Para proveedores UE, el NIF se valida contra la base VIES en tiempo real.", type: "rule" },
  { id: 3, name: "Verificación Vendor", method: "DBC API", stage: 1, desc: "Proveedor cruzado contra BD de vendors en Business Central. Jerarquía: NIF → Reg. → Nombre.", type: "rule" },
  { id: 4, name: "Validación Contrato", method: "Deterministic", stage: 1, desc: "Monto y tipo de servicio verificados contra tabla de referencia de contratos.", type: "rule" },
  { id: 5, name: "Detección Duplicados", method: "Deterministic", stage: 1, desc: "Número factura, proveedor y monto validados contra log de procesamiento y entradas en DBC.", type: "rule" },
  { id: 6, name: "Cumplimiento VAT", method: "AI + Rules", stage: 2, desc: "Evalúa si el tratamiento fiscal del proveedor es correcto. Cubre reverse charge y exenciones.", type: "ai" },
  { id: 7, name: "Clasificación GL", method: "AI Reasoning", stage: 2, desc: "Sugiere la cuenta GL y grupo de posting VAT apropiados basándose en el contenido de la factura.", type: "ai" },
  { id: 8, name: "Decisión Final", method: "Scoring", stage: 3, desc: "Score de confianza ponderado: Auto-draft (≥90%), Revisión asistida (70-89%), o Bloqueo (<70%).", type: "scoring" },
];

export default function ValidationLayers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "ai": return "fbm-badge-ai";
      case "scoring": return "fbm-badge-warning";
      default: return "fbm-badge-success";
    }
  };

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-8 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="fbm-badge-primary mb-4 block w-fit">La Síntesis</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
            8 capas de validación.
            <br />
            <span className="text-primary">Inteligencia híbrida.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-roboto max-w-2xl">
            Reglas determinísticas para checks binarios. IA solo donde se necesita juicio humano.
            Cada decisión AI incluye justificación escrita.
          </p>
        </motion.div>

        {/* Interactive Flow Diagram */}
        <ValidationFlowDiagram />

        {/* Stage labels */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Etapa 1", desc: "Checks paralelos (1-5)", badge: "fbm-badge-success" },
            { label: "Etapa 2", desc: "Interpretación AI (6-7)", badge: "fbm-badge-ai" },
            { label: "Etapa 3", desc: "Decisión final (8)", badge: "fbm-badge-warning" },
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
          {layers.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -4 }}
              onHoverStart={() => setActiveLayer(layer.id)}
              onHoverEnd={() => setActiveLayer(null)}
              className={`fbm-card p-5 cursor-default transition-all duration-300 ${
                activeLayer === layer.id ? "border-primary/30 shadow-lg" : ""
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
          ))}
        </div>

        {/* Processing flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 fbm-card-dark p-8"
        >
          <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-6">Flujo de Decisión</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { score: "≥ 90%", decision: "AUTO-DRAFT", desc: "Factura creada automáticamente en DBC", color: "text-green-400", bg: "bg-green-400/10 border border-green-400/20" },
              { score: "70–89%", decision: "REVISIÓN", desc: "Draft con flags visibles para AP Executive", color: "text-amber-400", bg: "bg-amber-400/10 border border-amber-400/20" },
              { score: "< 70%", decision: "COLA MANUAL", desc: "Guardada en Dropbox. Notificación por email.", color: "text-red-400", bg: "bg-red-400/10 border border-red-400/20" },
              { score: "Error", decision: "BLOQUEADO", desc: "Bloqueo inmediato. Notificación urgente.", color: "text-red-500", bg: "bg-red-500/10 border border-red-500/20" },
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
