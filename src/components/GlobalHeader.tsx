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
  const isHub = false;
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b"
      style={
        isHub
          ? { background: "rgba(10,10,10,0.95)", borderColor: "rgba(255,255,255,0.08)" }
          : { background: "hsl(var(--background) / 0.7)", borderColor: "hsl(var(--border) / 0.5)" }
      }
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-[#E41513] flex items-center justify-center text-white font-montserrat font-extrabold text-xs">
            F
          </div>
          <span
            className={`text-xs font-montserrat font-bold tracking-wide hidden sm:inline ${
              isHub ? "text-white" : "text-foreground"
            }`}
          >
            FBM · Hyperautomation Finance
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const cls = active
              ? "text-white bg-[#E41513]"
              : isHub
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted";
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 text-[11px] font-montserrat font-semibold uppercase tracking-wider rounded-md transition-all ${cls}`}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-barlow font-700 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] live-pulse-dot" />
            M1 · Live
          </span>
        </nav>
      </div>
    </motion.header>
  );
}
