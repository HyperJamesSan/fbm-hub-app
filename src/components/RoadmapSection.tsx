import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const timeline = [
  { week: "S1", phase: "Alignment", desc: "Sesión de alineación. Definir alcance POC. Asignar ownership.", status: "active" },
  { week: "S2", phase: "Setup", desc: "Configuración n8n, Claude API, credenciales DBC, estructura Dropbox.", status: "upcoming" },
  { week: "S3–4", phase: "POC Build", desc: "Construir workflow de extracción. Implementar 8 capas. Conectar APIs.", status: "upcoming" },
  { week: "S5", phase: "Evaluación", desc: "Correr POC contra set completo. Medir precisión. Producir reporte.", status: "upcoming" },
  { week: "S6", phase: "Decisión", desc: "Presentar resultados al CFO. Go / Adjust / No-Go.", status: "upcoming" },
];

const modules = [
  { id: 1, name: "AP Process (P1.30)", status: "En Progreso", color: "primary" },
  { id: 2, name: "Revenue Invoicing MX + Online", status: "Planeado", color: "accent" },
  { id: 3, name: "Collections / AR Chase", status: "Planeado", color: "accent" },
  { id: 4, name: "VAT Return", status: "Planeado", color: "accent" },
  { id: 5, name: "Daily Cash Reconciliation", status: "Planeado", color: "accent" },
  { id: 6, name: "Intercompany Reconciliation", status: "Consideración", color: "muted" },
  { id: 7, name: "DBC Data Completeness", status: "Consideración", color: "muted" },
  { id: 8, name: "Month-End Closing", status: "Consideración", color: "muted" },
  { id: 9, name: "Travel & Expense Mgmt", status: "Consideración", color: "muted" },
];

export default function RoadmapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

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
            Roadmap
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            6 semanas al POC.
            <br />
            <span className="text-gradient-indigo">Q2 2026 producción.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-20">
          {/* Line */}
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-muted/30"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top" }}
          />

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.week}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30, y: 10 }}
                animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-start gap-4 md:gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-row`}
              >
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary z-10 mt-2">
                  {item.status === "active" && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary"
                      animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
                  <span className="text-xs font-mono font-bold text-primary">{item.week}</span>
                  <h3 className="text-lg font-bold text-foreground mt-1">{item.phase}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Multi-module roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="glass-panel rounded-2xl p-8"
        >
          <h3 className="text-sm font-mono text-accent uppercase tracking-widest mb-6">
            Programa Multi-Módulo — Hiperautomatización Finance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2 + i * 0.05 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className={`rounded-xl p-4 cursor-default transition-all ${
                  mod.color === "primary"
                    ? "bg-primary/10 border border-primary/20"
                    : mod.color === "accent"
                    ? "bg-accent/5 border border-accent/10"
                    : "bg-muted/20 border border-muted/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-muted-foreground">M{mod.id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    mod.color === "primary"
                      ? "text-primary bg-primary/20"
                      : mod.color === "accent"
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground bg-muted/30"
                  }`}>
                    {mod.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground mt-2">{mod.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
