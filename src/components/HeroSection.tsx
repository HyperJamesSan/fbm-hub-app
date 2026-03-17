import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span className="font-mono">{count.toLocaleString()}{suffix}</span>
  );
};

const PulseNode = () => (
  <div className="relative w-40 h-40 mx-auto">
    <motion.div
      className="absolute inset-0 rounded-full bg-primary/20"
      animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-2 rounded-full bg-primary/30"
      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.div
      className="absolute inset-4 rounded-full bg-primary/40 backdrop-blur-xl flex items-center justify-center"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="text-center">
        <div className="text-xs font-mono text-primary uppercase tracking-widest">Live</div>
        <div className="text-2xl font-bold text-foreground">AP</div>
      </div>
    </motion.div>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a,_#020617,_#000000)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.05)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-primary border border-primary/20 rounded-full bg-primary/5">
            FBM Limited — Module 1
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
        >
          <span className="text-foreground">De la fricción operativa</span>
          <br />
          <span className="text-gradient-cyan">a la velocidad cinética.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-16"
        >
          Hiperautomatización del proceso de Cuentas por Pagar.
          <br />
          <span className="text-foreground/60">7 entidades. 8 capas de validación. Cero intervención manual.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <PulseNode />
        </motion.div>

        {/* Key stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: 125, suffix: "", label: "Facturas / mes" },
            { value: 7, suffix: "", label: "Entidades Malta" },
            { value: 8, suffix: "", label: "Capas validación" },
            { value: 30, suffix: "s", label: "Tiempo / factura" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-2xl p-5 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-foreground">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
