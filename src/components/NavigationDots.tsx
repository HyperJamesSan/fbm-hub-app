import { motion } from "framer-motion";

const sections = [
  { id: "hero", label: "Inicio" },
  { id: "problem", label: "Fricción" },
  { id: "validation", label: "Validación" },
  { id: "architecture", label: "Arquitectura" },
  { id: "metrics", label: "Impacto" },
  { id: "roadmap", label: "Roadmap" },
  { id: "summary", label: "Resumen" },
];

export default function NavigationDots({ activeSection }: { activeSection: string }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3"
    >
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="group flex items-center gap-3 justify-end"
        >
          <span className={`text-[10px] font-mono uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 ${
            activeSection === s.id ? "text-primary" : "text-muted-foreground"
          }`}>
            {s.label}
          </span>
          <div className={`w-2 h-2 rounded-full transition-all ${
            activeSection === s.id
              ? "bg-primary scale-125"
              : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
          }`} />
        </button>
      ))}
    </motion.nav>
  );
}
