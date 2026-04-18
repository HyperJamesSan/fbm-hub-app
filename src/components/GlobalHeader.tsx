import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type NavLeaf = { to: string; label: string };
type NavGroup = {
  label: string;
  match: string[];
  items: { to: string; label: string; sub: string }[];
};
type NavItem = NavLeaf | NavGroup;

const nav: NavItem[] = [
  { to: "/", label: "Hub" },
  {
    label: "Sessions",
    match: ["/session-1", "/session-2"],
    items: [
      { to: "/session-1", label: "Session 1", sub: "Alignment & Architecture" },
      { to: "/session-2", label: "Session 2", sub: "ERP Integration & Go-Live" },
    ],
  },
  { to: "/knowledge", label: "Knowledge" },
  { to: "/ideas", label: "Ideas" },
];

export default function GlobalHeader() {
  const { pathname } = useLocation();
  const isHub = false;
  const [openGroup, setOpenGroup] = useState<string | null>(null);

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
            FBM · Hyperautomation Project
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            // ---- Group (dropdown) ----
            if ("items" in item) {
              const active = item.match.includes(pathname);
              const open = openGroup === item.label;
              const cls = active
                ? "text-white bg-[#E41513]"
                : isHub
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted";
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(item.label)}
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <button
                    type="button"
                    onClick={() => setOpenGroup(open ? null : item.label)}
                    aria-expanded={open}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-montserrat font-semibold uppercase tracking-wider rounded-md transition-all ${cls}`}
                  >
                    {item.label}
                    <ChevronDown
                      className="w-3 h-3 transition-transform"
                      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{
                          duration: 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ transformOrigin: "top right" }}
                        className="absolute right-0 top-full pt-2 min-w-[280px]"
                      >
                        <div
                          className="rounded-xl border bg-background shadow-xl overflow-hidden"
                          style={{
                            borderColor: "hsl(var(--border))",
                            boxShadow:
                              "0 20px 50px -20px rgba(17,24,39,0.25), 0 0 0 1px rgba(228,21,19,0.08)",
                          }}
                        >
                          {item.items.map((opt, idx) => {
                            const isCurrent = pathname === opt.to;
                            return (
                              <motion.div
                                key={opt.to}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.25,
                                  delay: 0.06 + idx * 0.05,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              >
                                <Link
                                  to={opt.to}
                                  onClick={() => setOpenGroup(null)}
                                  className="block px-4 py-3 transition-colors hover:bg-muted group/opt"
                                  style={{
                                    background: isCurrent ? "rgba(228,21,19,0.08)" : undefined,
                                    borderLeft: isCurrent
                                      ? "2px solid #E41513"
                                      : "2px solid transparent",
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <span
                                      className="text-[11px] font-montserrat font-bold uppercase tracking-wider"
                                      style={{ color: isCurrent ? "#E41513" : "hsl(var(--foreground))" }}
                                    >
                                      {opt.label}
                                    </span>
                                  </div>
                                  <div className="text-[11px] font-roboto text-muted-foreground mt-0.5">
                                    {opt.sub}
                                  </div>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // ---- Leaf link ----
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
