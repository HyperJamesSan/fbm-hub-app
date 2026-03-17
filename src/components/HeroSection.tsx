import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import fbmLogo from "@/assets/fbm-logo.png";

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 33);
    return () => clearInterval(timer);
  }, [target]);
  return <span className="font-mono">{count.toLocaleString()}{suffix}</span>;
};

const PulseNode = () => (
  <div className="relative w-32 h-32 mx-auto">
    <motion.div
      className="absolute inset-0 rounded-full bg-primary/10"
      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute inset-2 rounded-full bg-primary/15"
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.div
      className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center"
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="text-center">
        <div className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">Live</div>
        <div className="text-xl font-montserrat font-bold text-foreground">AP</div>
      </div>
    </motion.div>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-8 bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_hsl(1_83%_48%/0.04),_transparent_60%)]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <img src={fbmLogo} alt="FBM Limited" className="h-16 w-auto mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-4"
        >
          <span className="fbm-badge-primary">
            Finance Operations — Module 1
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-montserrat font-extrabold tracking-tighter mb-6 text-foreground"
        >
          AP Process
          <br />
          <span className="text-gradient-fbm">Automation.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl font-roboto text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          Hyperautomation of the Accounts Payable process.
          <br />
          <span className="text-foreground/70 font-medium">7 entities. 8 validation layers.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <PulseNode />
        </motion.div>

        {/* Key stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
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
              transition={{ delay: 0.9 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="fbm-metric-card text-center"
            >
              <div className="text-3xl md:text-4xl font-montserrat font-extrabold text-foreground">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-wider">
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
        <div className="w-5 h-8 rounded-full border-2 border-border flex items-start justify-center p-1">
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
