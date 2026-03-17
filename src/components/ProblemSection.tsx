import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { AlertTriangle, User, Mail, TrendingDown, XCircle, FileQuestion, ArrowRight } from "lucide-react";

const AnimatedSeverity = ({ value, delay, inView }: { value: number; delay: number; inView: boolean }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const duration = 1400;
      const steps = 40;
      const interval = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = Math.min(step / steps, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (step >= steps) clearInterval(timer);
      }, interval);
      return () => clearInterval(timer);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [inView, value, delay]);

  return (
    <motion.span
      className="absolute top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold text-primary-foreground drop-shadow-sm z-10"
      initial={{ left: "0%", opacity: 0 }}
      animate={inView ? { left: `${value}%`, opacity: 1 } : { left: "0%", opacity: 0 }}
      transition={{ delay, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ transform: "translate(-100%, -50%)", paddingRight: "3px" }}
    >
      {display}%
    </motion.span>
  );
};

const painPoints = [
  { icon: AlertTriangle, title: "100% Manual", desc: "One operator processes everything. Zero redundancy.", color: "text-primary", severity: 95 },
  { icon: User, title: "Single Operator", desc: "Concentrated knowledge. Continuity risk.", color: "text-primary", severity: 90 },
  { icon: Mail, title: "Shared Mailbox", desc: "All invoices arrive to a single inbox.", color: "text-warning", severity: 70 },
  { icon: TrendingDown, title: "No Scalability", desc: "The process doesn't scale with growth.", color: "text-primary", severity: 85 },
  { icon: XCircle, title: "Human Error", desc: "GL classification, VAT, duplicates — all manual.", color: "text-destructive", severity: 88 },
  { icon: FileQuestion, title: "No Audit Trail", desc: "No structured traceability of the process.", color: "text-warning", severity: 75 },
];

const stats = [
  { value: "100–125", label: "invoices / month" },
  { value: "7", label: "legal entities" },
  { value: "1", label: "operator" },
  { value: "0%", label: "automation" },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative h-screen flex flex-col justify-center px-8 bg-background overflow-hidden">
      {/* Subtle danger gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(1_83%_48%/0.03),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(0_84%_60%/0.02),_transparent_50%)]" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <span className="fbm-badge-primary mb-4 block w-fit">The Friction</span>
          <div className="fbm-section-divider mb-6" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tighter mb-4 text-foreground">
                A non-scalable process
                <br />
                <span className="text-primary">and highly dependent.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-roboto max-w-xl">
                100–125 invoices per month processed manually by a single person across 7 entities.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-mono font-bold text-primary">{stat.value}</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pain points grid with connected visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            const isHovered = hoveredIndex === i;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, y: -4 }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={`fbm-card p-5 cursor-default relative overflow-hidden transition-all duration-300 ${
                  isHovered ? "border-primary/30 shadow-lg" : ""
                }`}
              >
                {/* Severity indicator glow */}
                <motion.div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2"
                  animate={isHovered ? { scale: 1.5, opacity: 1 } : { scale: 1, opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${point.color}`} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Risk {point.severity}%
                    </span>
                  </div>
                  <h3 className="text-base font-montserrat font-bold text-foreground mb-1">{point.title}</h3>
                  <p className="text-sm font-roboto text-muted-foreground mb-3">{point.desc}</p>

                  {/* Severity bar */}
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--destructive)))`,
                      }}
                      initial={{ width: "0%" }}
                      animate={inView ? { width: `${point.severity}%` } : {}}
                      transition={{ delay: 0.5 + i * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom connector line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex items-center justify-center mt-8 gap-3"
        >
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
            <span className="text-xs font-mono text-primary font-semibold">Result</span>
            <ArrowRight className="w-3 h-3 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">Operational bottleneck & compliance risk</span>
          </div>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
        </motion.div>

        <p className="text-[9px] text-muted-foreground/40 font-mono text-center mt-6 max-w-lg mx-auto leading-relaxed">
          Risk scores are indicative and based on qualitative assessment of the current process. They are intended to illustrate relative exposure, not precise measurement.
        </p>
      </div>
    </section>
  );
}
