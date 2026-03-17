import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const nodes = [
  { id: "email", label: "M365 Email", sub: "accounts.payable@fbm.mt", x: 0, y: 0, icon: "📧" },
  { id: "n8n", label: "n8n Orchestration", sub: "Workflow Engine", x: 1, y: 0, icon: "⚡" },
  { id: "claude", label: "Claude API", sub: "Reasoning Layer", x: 2, y: -1, icon: "🧠" },
  { id: "dbc", label: "Business Central", sub: "ERP Integration", x: 2, y: 1, icon: "📊" },
  { id: "vies", label: "VIES API", sub: "EU VAT Validation", x: 1, y: -1, icon: "🇪🇺" },
  { id: "dropbox", label: "Dropbox", sub: "Document Storage", x: 3, y: 0, icon: "📁" },
];

const connections = [
  { from: "email", to: "n8n", label: "Trigger" },
  { from: "n8n", to: "claude", label: "Text → JSON" },
  { from: "n8n", to: "dbc", label: "API Calls" },
  { from: "n8n", to: "vies", label: "VAT Check" },
  { from: "n8n", to: "dropbox", label: "Archive" },
  { from: "claude", to: "n8n", label: "Validation" },
];

const metricsData: Record<string, { metric: string; value: string }> = {
  email: { metric: "Volumen", value: "100–125 facturas/mes" },
  n8n: { metric: "Ejecuciones", value: "~200–300 exec/mes" },
  claude: { metric: "Costo", value: "$3–6/mes" },
  dbc: { metric: "Integración", value: "Read-only en POC" },
  vies: { metric: "Precisión", value: "100% determinístico" },
  dropbox: { metric: "Almacenamiento", value: "Existente ($0)" },
};

export default function ArchitectureSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section ref={ref} className="relative py-[20vh] px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-widest text-accent border border-accent/20 rounded-full bg-accent/5 mb-4">
            Arquitectura
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Stack propuesto.
            <br />
            <span className="text-gradient-indigo">Costo: $27–30/mes.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            n8n orquesta. Claude razona. DBC integra. Sin dependencias externas para documentos.
          </p>
        </motion.div>

        {/* Architecture nodes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {nodes.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -5 }}
              onHoverStart={() => setHoveredNode(node.id)}
              onHoverEnd={() => setHoveredNode(null)}
              className={`glass-panel rounded-2xl p-6 cursor-default transition-all duration-300 relative ${
                hoveredNode === node.id ? "border-glow-cyan glow-cyan" : ""
              }`}
            >
              <div className="text-3xl mb-3">{node.icon}</div>
              <h3 className="text-base font-bold text-foreground">{node.label}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{node.sub}</p>

              {/* Metric reveal on hover */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={hoveredNode === node.id ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-muted/30">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">{metricsData[node.id]?.metric}</div>
                  <div className="text-sm font-mono font-bold text-primary mt-0.5">{metricsData[node.id]?.value}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Data flow principle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 glass-panel-subtle rounded-2xl p-8"
        >
          <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-4">Principio de Seguridad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "PDF nunca sale", desc: "El documento permanece en el entorno de la empresa." },
              { step: "02", title: "Solo texto al AI", desc: "Solo texto extraído se envía a Claude via HTTPS. Sin retención." },
              { step: "03", title: "Audit inmutable", desc: "JSON estructurado por cada factura. Revisable en auditorías." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="text-2xl font-mono font-bold text-primary/30">{item.step}</span>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
