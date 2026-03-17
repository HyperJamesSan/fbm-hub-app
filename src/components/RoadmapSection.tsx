import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const timeline = [
  { week: "S1", phase: "Alignment", desc: "Sesión de alineación. Definir alcance POC. Asignar ownership.", status: "active" },
  { week: "S2", phase: "Setup", desc: "Configuración n8n, Claude API, credenciales DBC, estructura Dropbox.", status: "upcoming" },
  { week: "S3–4", phase: "POC Build", desc: "Construir workflow de extracción. Implementar 8 capas. Conectar APIs.", status: "upcoming" },
  { week: "S5", phase: "Evaluación", desc: "Correr POC contra set completo. Medir precisión. Producir reporte.", status: "upcoming" },
  { week: "S6", phase: "Decisión", desc: "Presentar resultados al CFO. Go / Adjust / No-Go.", status: "upcoming" },
];

const modules = [
  { id: 1, name: "AP Process (P1.30)", status: "En Progreso", type: "active" },
  { id: 2, name: "Revenue Invoicing MX + Online", status: "Planeado", type: "planned" },
  { id: 3, name: "Collections / AR Chase", status: "Planeado", type: "planned" },
  { id: 4, name: "VAT Return", status: "Planeado", type: "planned" },
  { id: 5, name: "Daily Cash Reconciliation", status: "Planeado", type: "planned" },
  { id: 6, name: "Intercompany Reconciliation", status: "Consideración", type: "consideration" },
  { id: 7, name: "DBC Data Completeness", status: "Consideración", type: "consideration" },
  { id: 8, name: "Month-End Closing", status: "Consideración", type: "consideration" },
  { id: 9, name: "Travel & Expense Mgmt", status: "Consideración", type: "consideration" },
];

export default function RoadmapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="fbm-badge-warning mb-4 block w-fit">Roadmap</span>
          <div className="fbm-section-divider mb-6" />
          <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
            6 semanas al POC.
            <br />
            <span className="text-primary">Q2 2026 producción.</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-16">
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top" }}
          />

          <div className="space-y-10">
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
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-card border-2 border-primary z-10 mt-1">
                  {item.status === "active" && (
                    <motion.div
                      className="absolute inset-0.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:text-right md:pr-8" : "md:text-left md:pl-8"}`}>
                  <span className="fbm-badge-primary text-[10px]">{item.week}</span>
                  <h3 className="text-lg font-montserrat font-bold text-foreground mt-2">{item.phase}</h3>
                  <p className="text-sm font-roboto text-muted-foreground mt-1">{item.desc}</p>
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
          className="fbm-card p-8"
        >
          <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-6">
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
                className={`rounded-xl p-4 cursor-default border transition-all ${
                  mod.type === "active"
                    ? "bg-primary/5 border-primary/20"
                    : mod.type === "planned"
                    ? "bg-ai/5 border-ai/10"
                    : "bg-muted/50 border-border/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-muted-foreground">M{mod.id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    mod.type === "active"
                      ? "fbm-badge-primary"
                      : mod.type === "planned"
                      ? "fbm-badge-ai"
                      : "fbm-badge-muted"
                  }`}>
                    {mod.status}
                  </span>
                </div>
                <h4 className="text-sm font-montserrat font-bold text-foreground mt-2">{mod.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
