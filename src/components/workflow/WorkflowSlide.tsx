import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Search, ShieldCheck, Brain, Gauge, Archive,
  Play, RotateCcw, Check, AlertTriangle, X,
  User, Shield, Copy,
} from "lucide-react";
import { scenarios, stations, type ScenarioId, type StationResult } from "./workflowData";

const STATION_ICONS = [Mail, Search, ShieldCheck, Brain, Gauge, Archive];
const TRAVEL_MS = 800;
const PAUSE_MS = 1500;

const statusColor = (s: string) =>
  s === "success" ? "#16A34A" : s === "warning" ? "#D97706" : s === "error" ? "#DC2626" : "#9CA3AF";

const StatusIcon = ({ status, size = 18 }: { status: string; size?: number }) => {
  if (status === "success") return <Check size={size} color="#16A34A" strokeWidth={3} />;
  if (status === "warning") return <AlertTriangle size={size} color="#D97706" strokeWidth={2.5} />;
  if (status === "error") return <X size={size} color="#DC2626" strokeWidth={3} />;
  return <div className="rounded-full bg-gray-200" style={{ width: size, height: size }} />;
};

const SubCheckIcon = ({ icon }: { icon: string }) => {
  if (icon === "vendor") return <User size={14} />;
  if (icon === "vat") return <Shield size={14} />;
  return <Copy size={14} />;
};

const WorkflowSlide = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [currentStation, setCurrentStation] = useState(0);
  const [visitedStations, setVisitedStations] = useState<Set<number>>(new Set());
  const [stationAnimPhase, setStationAnimPhase] = useState<"traveling" | "arrived" | "idle">("idle");
  const [showScore, setShowScore] = useState(false);
  const [animScore, setAnimScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const scenario = scenarios.find((s) => s.id === selectedScenario) ?? null;

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setPhase("idle");
    setCurrentStation(0);
    setVisitedStations(new Set());
    setStationAnimPhase("idle");
    setShowScore(false);
    setAnimScore(0);
  }, [clearTimers]);

  useEffect(() => { reset(); }, [selectedScenario, reset]);

  const advanceTo = useCallback(
    (stIdx: number) => {
      if (!scenario) return;
      setStationAnimPhase("traveling");
      setCurrentStation(stIdx);

      timerRef.current = setTimeout(() => {
        setStationAnimPhase("arrived");
        setVisitedStations((prev) => new Set(prev).add(stIdx));

        if (stIdx === 5 && scenario.stopsAt >= 5) {
          const target = scenario.stationResults[4].score ?? 0;
          setShowScore(true);
          let cur = 0;
          const step = () => {
            cur += 2;
            if (cur >= target) {
              setAnimScore(target);
            } else {
              setAnimScore(cur);
              rafRef.current = requestAnimationFrame(step);
            }
          };
          rafRef.current = requestAnimationFrame(step);
        }

        if (stIdx >= scenario.stopsAt) {
          timerRef.current = setTimeout(() => setPhase("done"), PAUSE_MS);
          return;
        }

        timerRef.current = setTimeout(() => advanceTo(stIdx + 1), PAUSE_MS);
      }, TRAVEL_MS);
    },
    [scenario],
  );

  const handlePlay = useCallback(() => {
    if (!scenario) return;
    reset();
    setTimeout(() => {
      setPhase("playing");
      advanceTo(1);
    }, 100);
  }, [scenario, reset, advanceTo]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const stationX = (idx: number) => 8 + idx * 16.8;
  const invoiceX = currentStation === 0 ? -5 : stationX(currentStation - 1);
  const currentResult: StationResult | null =
    scenario && currentStation > 0 ? scenario.stationResults[currentStation - 1] : null;

  const bottomMessage = (() => {
    if (phase === "done" && scenario) return scenario.destinationMessage;
    if (phase === "playing" && currentResult && stationAnimPhase === "arrived") return currentResult.detail;
    if (phase === "idle" && scenario) return scenario.description;
    if (phase === "idle") return "Select a scenario above, then press Play to watch the journey.";
    if (phase === "playing" && stationAnimPhase === "traveling" && currentStation > 0)
      return stations[currentStation - 1].plainLabel;
    return "";
  })();

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden select-none" style={{ fontFamily: "'Roboto', sans-serif", background: "white" }}>
      {/* ═══ TOP ═══ */}
      <div className="flex-shrink-0 px-8 pt-6 pb-4 flex flex-col items-center gap-4" style={{ height: "20%" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "#CC0000" }}>
            <span className="text-white font-bold text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>FBM</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "'Montserrat', sans-serif", color: "#111827" }}>
            How Your Invoice Is Processed — Automatically
          </h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2"
              style={{
                borderColor: sc.color,
                backgroundColor: selectedScenario === sc.id ? sc.color : "transparent",
                color: selectedScenario === sc.id ? "white" : sc.color,
              }}
            >
              {sc.emoji} {sc.name}
            </button>
          ))}

          <div className="w-px h-8 mx-2" style={{ backgroundColor: "#E5E7EB" }} />

          {phase === "done" ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold transition-colors"
              style={{ backgroundColor: "#CC0000" }}
            >
              <RotateCcw size={16} /> Replay
            </button>
          ) : (
            <button
              onClick={handlePlay}
              disabled={!selectedScenario || phase === "playing"}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: selectedScenario ? "#CC0000" : "#D1D5DB", color: "white" }}
            >
              <Play size={16} fill="white" /> Play
            </button>
          )}
        </div>
      </div>

      {/* ═══ MIDDLE — TRACK ═══ */}
      <div className="flex-1 relative px-6" style={{ minHeight: 0 }}>
        {/* Track line */}
        <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-[3px]">
          <div className="absolute inset-0" style={{ borderBottom: "3px dashed #E5E7EB" }} />
          {currentStation > 0 && (
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ backgroundColor: scenario ? statusColor(scenario.stationResults[Math.min(currentStation, scenario.stopsAt) - 1].status) : "#16A34A" }}
              initial={{ width: "0%" }}
              animate={{ width: `${((Math.min(currentStation, scenario?.stopsAt ?? 6) - 1) / 5) * 100}%` }}
              transition={{ duration: TRAVEL_MS / 1000, ease: "easeInOut" }}
            />
          )}
        </div>

        {/* Stations */}
        {stations.map((station, idx) => {
          const StIcon = STATION_ICONS[idx];
          const isVisited = visitedStations.has(idx + 1);
          const isCurrent = currentStation === idx + 1 && stationAnimPhase === "arrived";
          const result = scenario?.stationResults[idx];
          const isSkipped = result?.status === "skipped" && phase !== "idle";
          const xPct = stationX(idx);

          return (
            <div
              key={station.id}
              className="absolute top-1/2 flex flex-col items-center"
              style={{ left: `${xPct}%`, transform: "translate(-50%, -50%)" }}
            >
              <motion.div className="relative flex flex-col items-center" animate={{ opacity: isSkipped ? 0.3 : 1 }}>
                {/* Status badge above */}
                <AnimatePresence>
                  {isVisited && result && result.status !== "skipped" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-9 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
                      style={{ backgroundColor: `${statusColor(result.status)}18`, color: statusColor(result.status) }}
                    >
                      <StatusIcon status={result.status} size={12} />
                      {result.label}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-px h-4" style={{ backgroundColor: "#E5E7EB" }} />

                {/* Station box */}
                <motion.div
                  className="w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-colors duration-300"
                  style={{
                    borderColor: isCurrent || isVisited ? statusColor(result?.status ?? "pending") : "#E5E7EB",
                    backgroundColor: isCurrent ? `${statusColor(result?.status ?? "pending")}14` : "white",
                  }}
                  animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <StIcon size={22} style={{ color: isCurrent || isVisited ? statusColor(result?.status ?? "pending") : "#9CA3AF" }} />
                </motion.div>

                <div className="w-px h-4" style={{ backgroundColor: "#E5E7EB" }} />
                <span className="text-[11px] font-medium text-center max-w-[90px] leading-tight" style={{ color: "#6B7280" }}>{station.name}</span>

                {/* Sub-checks (station 3) */}
                {isCurrent && result?.subChecks && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="absolute -bottom-20 flex gap-2">
                    {result.subChecks.map((sc, i) => (
                      <motion.div
                        key={sc.icon}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.25 }}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border"
                        style={{ borderColor: statusColor(sc.status), color: statusColor(sc.status), backgroundColor: `${statusColor(sc.status)}10` }}
                      >
                        <SubCheckIcon icon={sc.icon} />
                        {sc.label}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Fields (station 4) */}
                {isCurrent && result?.fields && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="absolute -bottom-24 flex flex-col gap-1 min-w-[140px]">
                    {result.fields.map((f, i) => (
                      <motion.div
                        key={f.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.2 }}
                        className="flex items-center justify-between gap-2 px-2 py-0.5 rounded text-[10px] border"
                        style={{
                          borderColor: f.status === "warning" ? "#D97706" : "#E5E7EB",
                          backgroundColor: f.status === "warning" ? "#FEF3C7" : "#F9FAFB",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>{f.name}</span>
                        <span className="font-medium" style={{ color: f.status === "warning" ? "#D97706" : "#111827" }}>{f.value}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Score (station 5) */}
                {isCurrent && showScore && result?.score != null && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute -bottom-20 flex flex-col items-center gap-1">
                    <div className="text-3xl font-bold tabular-nums" style={{ color: statusColor(result.status), fontFamily: "'Montserrat', sans-serif" }}>
                      {animScore}
                    </div>
                    <div className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-white" style={{ backgroundColor: statusColor(result.status) }}>
                      {result.scoreLabel}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          );
        })}

        {/* ═══ INVOICE CARD ═══ */}
        {phase !== "idle" && (
          <motion.div
            className="absolute z-20"
            style={{ top: "calc(50% - 56px)" }}
            initial={{ left: "-5%" }}
            animate={{
              left: `${invoiceX}%`,
              rotate: scenario?.destination === "exception" && phase === "done" ? [0, -3, 3, -3, 0] : 0,
            }}
            transition={{
              left: { duration: TRAVEL_MS / 1000, ease: "easeInOut" },
              rotate: { duration: 0.4, repeat: phase === "done" && scenario?.destination === "exception" ? 2 : 0 },
            }}
          >
            <motion.div
              className="relative w-[72px] h-[56px] rounded-lg border-2 shadow-lg flex flex-col items-center justify-center"
              style={{
                background: "white",
                borderColor: phase === "done" && scenario?.destination === "exception" ? "#DC2626" : phase === "done" && scenario?.destination === "auto" ? "#16A34A" : "#E5E7EB",
                transform: "translateX(-50%)",
              }}
              animate={stationAnimPhase === "arrived" && phase === "playing" ? { y: [0, -4, 0, -4, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute top-0.5 left-1 w-4 h-3 rounded-sm flex items-center justify-center" style={{ backgroundColor: "#CC0000" }}>
                <span className="text-white text-[5px] font-bold" style={{ fontFamily: "'Montserrat'" }}>FBM</span>
              </div>
              <div className="mt-2 flex flex-col gap-[3px] w-10">
                <div className="h-[2px] rounded-full" style={{ backgroundColor: "#D1D5DB" }} />
                <div className="h-[2px] rounded-full w-8" style={{ backgroundColor: "#E5E7EB" }} />
                <div className="h-[2px] rounded-full w-6" style={{ backgroundColor: "#E5E7EB" }} />
              </div>

              <AnimatePresence>
                {phase === "done" && scenario?.destination === "auto" && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    className="absolute -top-2 -right-3 px-1.5 py-0.5 rounded text-[7px] font-bold text-white shadow" style={{ backgroundColor: "#16A34A" }}>
                    DRAFT READY
                  </motion.div>
                )}
                {phase === "done" && scenario?.destination === "assisted" && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    className="absolute -top-2 -right-3 px-1.5 py-0.5 rounded text-[7px] font-bold text-white shadow" style={{ backgroundColor: "#D97706" }}>
                    REVIEW
                  </motion.div>
                )}
                {phase === "done" && scenario?.destination === "exception" && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    className="absolute -top-2 -right-3 px-1.5 py-0.5 rounded text-[7px] font-bold text-white shadow" style={{ backgroundColor: "#DC2626" }}>
                    HOLD
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* Exception barrier */}
        <AnimatePresence>
          {phase === "done" && scenario?.destination === "exception" && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="absolute z-10 origin-bottom"
              style={{ left: `${stationX(2) + 8}%`, top: "calc(50% - 30px)", width: 4, height: 60, backgroundColor: "#DC2626", borderRadius: 2 }}
            />
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {stations.map((_, idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: currentStation === idx + 1
                  ? statusColor(scenario?.stationResults[idx]?.status ?? "pending")
                  : visitedStations.has(idx + 1)
                    ? `${statusColor(scenario?.stationResults[idx]?.status ?? "pending")}80`
                    : "#D1D5DB",
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══ BOTTOM ═══ */}
      <div className="flex-shrink-0 px-8 pb-6 flex items-center justify-center" style={{ height: "20%" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={bottomMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-center max-w-2xl"
          >
            {phase === "done" && scenario && (
              <div
                className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: scenario.color }}
              >
                {scenario.destination === "auto" && "✅ Auto-Prepared"}
                {scenario.destination === "assisted" && "⚠️ Assisted Review"}
                {scenario.destination === "exception" && "🛑 Exception"}
              </div>
            )}
            <p className="text-base md:text-lg leading-relaxed" style={{ color: "#374151" }}>{bottomMessage}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkflowSlide;
