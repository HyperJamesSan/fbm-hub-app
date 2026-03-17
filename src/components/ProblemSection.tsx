import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const painPoints = [
  { icon: "⚠️", title: "100% Manual", desc: "Un operador procesa todo. Cero redundancia." },
  { icon: "🔴", title: "Operador Único", desc: "Conocimiento concentrado. Riesgo de continuidad." },
  { icon: "📧", title: "Buzón Compartido", desc: "Todas las facturas llegan a un solo buzón." },
  { icon: "⏱️", title: "Sin Escalabilidad", desc: "El proceso no escala con el crecimiento." },
  { icon: "❌", title: "Error Humano", desc: "Clasificación GL, VAT, duplicados — todo manual." },
  { icon: "📋", title: "Sin Auditoría", desc: "No hay trazabilidad estructurada del proceso." },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-[20vh] px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-widest text-destructive border border-destructive/20 rounded-full bg-destructive/5 mb-4">
            La Fricción
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            El proceso actual
            <br />
            <span className="text-destructive">no escala.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            100–125 facturas mensuales procesadas manualmente por una sola persona,
            a través de 7 entidades maltesas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {painPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-panel rounded-2xl p-6 group cursor-default"
            >
              <div className="text-2xl mb-3">{point.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-1">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.desc}</p>
              <div className="mt-4 h-0.5 w-full bg-destructive/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-destructive/50 rounded-full"
                  initial={{ width: "0%" }}
                  animate={inView ? { width: "100%" } : {}}
                  transition={{ delay: 0.5 + i * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
