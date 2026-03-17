import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Zap, Brain, BarChart3, Globe, FolderArchive } from "lucide-react";

const nodes = [
  { id: "email", label: "M365 Email", sub: "accounts.payable@fbm.mt", icon: Mail },
  { id: "n8n", label: "n8n Orchestration", sub: "Workflow Engine", icon: Zap },
  { id: "claude", label: "Claude API", sub: "Reasoning Layer", icon: Brain },
  { id: "dbc", label: "Business Central", sub: "ERP Integration", icon: BarChart3 },
  { id: "vies", label: "VIES API", sub: "EU VAT Validation", icon: Globe },
  { id: "dropbox", label: "Dropbox", sub: "Document Storage", icon: FolderArchive },
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
    <section ref={ref} className="relative py-24 md:py-32 px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="fbm-badge-ai mb-4 block w-fit">Arquitectura</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
            Stack propuesto.
            <br />
            <span className="text-primary">Costo: $27–30/mes.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-roboto max-w-2xl">
            n8n orquesta. Claude razona. DBC integra. Sin dependencias externas para documentos.
          </p>
        </motion.div>

        {/* Architecture nodes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {nodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, y: -4 }}
                onHoverStart={() => setHoveredNode(node.id)}
                onHoverEnd={() => setHoveredNode(null)}
                className={`fbm-card p-6 cursor-default ${
                  hoveredNode === node.id ? "border-primary/30 shadow-lg" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-montserrat font-bold text-foreground">{node.label}</h3>
                <p className="text-xs font-roboto text-muted-foreground mt-0.5">{node.sub}</p>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={hoveredNode === node.id ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">{metricsData[node.id]?.metric}</div>
                    <div className="text-sm font-mono font-bold text-primary mt-0.5">{metricsData[node.id]?.value}</div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Data flow principle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 fbm-card-dark p-8"
        >
          <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-4">Principio de Seguridad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "PDF nunca sale", desc: "El documento permanece en el entorno de la empresa." },
              { step: "02", title: "Solo texto al AI", desc: "Solo texto extraído se envía a Claude via HTTPS. Sin retención." },
              { step: "03", title: "Audit inmutable", desc: "JSON estructurado por cada factura. Revisable en auditorías." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="text-2xl font-mono font-bold text-primary/50">{item.step}</span>
                <div>
                  <h4 className="text-sm font-montserrat font-bold text-white">{item.title}</h4>
                  <p className="text-xs font-roboto text-white/50 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
