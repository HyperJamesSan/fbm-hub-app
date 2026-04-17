import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const nav = [
  { to: "/", label: "Hub" },
  { to: "/session-1", label: "Session 1" },
  { to: "/session-2", label: "Session 2" },
  { to: "/knowledge", label: "Knowledge" },
  { to: "/ideas", label: "Ideas" },
];

export default function GlobalHeader() {
  const { pathname } = useLocation();
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-montserrat font-extrabold text-xs">
            F
          </div>
          <span className="text-xs font-montserrat font-bold tracking-wide text-foreground hidden sm:inline">
            FBM · Hyperautomation Finance
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 text-[11px] font-montserrat font-semibold uppercase tracking-wider rounded-md transition-all ${
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#15803d] text-[10px] font-barlow font-700 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] live-pulse-dot" />
            M1 · Live
          </span>
        </nav>
      </div>
    </motion.header>
  );
}
