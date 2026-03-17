import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimatedNumber = ({ target, decimals = 0, prefix = "", suffix = "" }: { target: number; decimals?: number; prefix?: string; suffix?: string }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const steps = 50;
    const inc = target / steps;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(current);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} className="font-mono">{prefix}{val.toFixed(decimals)}{suffix}</span>;
};

const metrics = [
  { value: 84, suffix: "%", label: "Reducción latencia de decisión", desc: "De días a <30 segundos por factura" },
  { value: 125, suffix: "", label: "Facturas automatizadas / mes", desc: "Volumen actual a través de 7 entidades" },
  { value: 30, suffix: "", prefix: "$", label: "Costo mensual total", desc: "Stack cloud: n8n + Claude API" },
  { value: 95, suffix: "%+", label: "Precisión objetivo clasificación", desc: "Entity, VIES, duplicados, contratos" },
];

const pocCriteria = [
  { metric: "Clasificación entidad", target: "95%+", min: "90%" },
  { metric: "Validación VIES", target: "100%", min: "100%" },
  { metric: "Detección duplicados", target: "100%", min: "100%" },
  { metric: "Evaluación VAT", target: "90%+", min: "85%" },
  { metric: "Sugerencia GL", target: "85%+", min: "80%" },
  { metric: "Tiempo por factura", target: "<30s", min: "<60s" },
];

export default function MetricsSection() {
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
          <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-widest text-primary border border-primary/20 rounded-full bg-primary/5 mb-4">
            El Impacto
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Latencia de decisión:
            <br />
            <span className="text-gradient-cyan">−84%.</span>
          </h2>
        </motion.div>

        {/* Big metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="text-4xl md:text-5xl font-bold text-foreground">
                <AnimatedNumber target={m.value} prefix={m.prefix} suffix={m.suffix} />
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-2 uppercase tracking-wider">{m.label}</div>
              <p className="text-xs text-muted-foreground/60 mt-3">{m.desc}</p>

              {/* Sparkline placeholder */}
              <svg className="w-full h-8 mt-4" viewBox="0 0 100 20">
                <motion.path
                  d="M0,15 Q10,5 20,12 T40,8 T60,5 T80,3 T100,2"
                  fill="none"
                  stroke="hsl(187 82% 53%)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 0.5 } : {}}
                  transition={{ delay: 0.5 + i * 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* POC Criteria table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="glass-panel rounded-2xl p-8"
        >
          <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-6">Criterios de Éxito — POC</h3>
          <div className="space-y-3">
            {pocCriteria.map((c, i) => (
              <motion.div
                key={c.metric}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1 + i * 0.08 }}
                className="flex items-center justify-between py-3 border-b border-muted/20 last:border-0"
              >
                <span className="text-sm text-foreground">{c.metric}</span>
                <div className="flex gap-6">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Objetivo</div>
                    <div className="text-sm font-mono font-bold text-primary">{c.target}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Mínimo</div>
                    <div className="text-sm font-mono text-muted-foreground">{c.min}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
