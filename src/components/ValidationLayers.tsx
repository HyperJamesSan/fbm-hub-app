import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const layers = [
  { id: 1, name: "Formato Legal", method: "Deterministic", stage: 1, desc: "Campos obligatorios por legislación IVA: número factura, NIF, base imponible, tasa aplicada.", color: "primary" },
  { id: 2, name: "Validación VIES", method: "API Call", stage: 1, desc: "Para proveedores UE, el NIF se valida contra la base VIES en tiempo real.", color: "primary" },
  { id: 3, name: "Verificación Vendor", method: "DBC API", stage: 1, desc: "Proveedor cruzado contra BD de vendors en Business Central. Jerarquía: NIF → Reg. → Nombre.", color: "primary" },
  { id: 4, name: "Validación Contrato", method: "Deterministic", stage: 1, desc: "Monto y tipo de servicio verificados contra tabla de referencia de contratos.", color: "primary" },
  { id: 5, name: "Detección Duplicados", method: "Deterministic", stage: 1, desc: "Número factura, proveedor y monto validados contra log de procesamiento y entradas en DBC.", color: "primary" },
  { id: 6, name: "Cumplimiento VAT", method: "AI + Rules", stage: 2, desc: "Evalúa si el tratamiento fiscal del proveedor es correcto. Cubre reverse charge y exenciones.", color: "accent" },
  { id: 7, name: "Clasificación GL", method: "AI Reasoning", stage: 2, desc: "Sugiere la cuenta GL y grupo de posting VAT apropiados basándose en el contenido de la factura.", color: "accent" },
  { id: 8, name: "Decisión Final", method: "Scoring", stage: 3, desc: "Score de confianza ponderado: Auto-draft (≥90%), Revisión asistida (70-89%), o Bloqueo (<70%).", color: "primary" },
];

export default function ValidationLayers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-[20vh] px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-widest text-primary border border-primary/20 rounded-full bg-primary/5 mb-4">
            La Síntesis
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            8 capas de validación.
            <br />
            <span className="text-gradient-cyan">Inteligencia híbrida.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Reglas determinísticas para checks binarios. IA solo donde se necesita juicio humano.
            Cada decisión AI incluye justificación escrita.
          </p>
        </motion.div>

        {/* Stage labels */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Etapa 1", desc: "Checks paralelos (1-5)", color: "text-primary" },
            { label: "Etapa 2", desc: "Interpretación AI (6-7)", color: "text-accent" },
            { label: "Etapa 3", desc: "Decisión final (8)", color: "text-primary" },
          ].map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <div className={`text-sm font-mono font-bold ${stage.color}`}>{stage.label}</div>
              <div className="text-xs text-muted-foreground">{stage.desc}</div>
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
              whileHover={{ scale: 1.02, y: -5 }}
              onHoverStart={() => setActiveLayer(layer.id)}
              onHoverEnd={() => setActiveLayer(null)}
              className={`glass-panel rounded-2xl p-5 cursor-default transition-all duration-300 ${
                activeLayer === layer.id
                  ? layer.color === "accent" ? "border-glow-indigo glow-indigo" : "border-glow-cyan glow-cyan"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                  layer.color === "accent"
                    ? "text-accent bg-accent/10"
                    : "text-primary bg-primary/10"
                }`}>
                  L{layer.id}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {layer.method}
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground mb-2">{layer.name}</h3>
              <motion.p
                className="text-xs text-muted-foreground leading-relaxed"
                initial={{ height: 0, opacity: 0 }}
                animate={activeLayer === layer.id ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {layer.desc}
              </motion.p>
              {activeLayer !== layer.id && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{layer.desc}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Processing flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 glass-panel rounded-2xl p-8"
        >
          <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-6">Flujo de Decisión</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { score: "≥ 90%", decision: "AUTO-DRAFT", desc: "Factura creada automáticamente en DBC", color: "text-primary", bg: "bg-primary/10" },
              { score: "70–89%", decision: "REVISIÓN", desc: "Draft con flags visibles para AP Executive", color: "text-amber-400", bg: "bg-amber-400/10" },
              { score: "< 70%", decision: "COLA MANUAL", desc: "Guardada en Dropbox. Notificación por email.", color: "text-destructive", bg: "bg-destructive/10" },
              { score: "Error", decision: "BLOQUEADO", desc: "Bloqueo inmediato. Notificación urgente.", color: "text-destructive", bg: "bg-destructive/10" },
            ].map((item, i) => (
              <motion.div
                key={item.decision}
                whileHover={{ scale: 1.02, y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`rounded-xl p-4 ${item.bg} border border-muted/30`}
              >
                <div className={`text-2xl font-mono font-bold ${item.color}`}>{item.score}</div>
                <div className="text-xs font-mono font-bold text-foreground mt-1">{item.decision}</div>
                <div className="text-xs text-muted-foreground mt-2">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
