import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, FileCheck, ShieldCheck, UserCheck, FileSearch2, CopyCheck, Calculator, BookOpen, Gauge,
  Play, RotateCcw, Check, AlertTriangle, X,
  Copy, CalendarDays,
} from "lucide-react";
import { scenarios, stations, type ScenarioId, type StationResult } from "./workflowData";

/* ─── CONFIG ─── */
// 9 icons: email + 8 layers
const STATION_ICONS = [Mail, FileCheck, ShieldCheck, UserCheck, FileSearch2, CopyCheck, Calculator, BookOpen, Gauge];
const TRAVEL_MS = 1000;
const PAUSE_MS = 2200;
const SCORE_TICK = 1;

const statusColor = (s: string) =>
  s === "success" ? "#16A34A" : s === "warning" ? "#D97706" : s === "error" ? "#DC2626" : "#9CA3AF";

const StatusIcon = ({ status, size = 16 }: { status: string; size?: number }) => {
  if (status === "success") return <Check size={size} color="#16A34A" strokeWidth={3} />;
  if (status === "warning") return <AlertTriangle size={size} color="#D97706" strokeWidth={2.5} />;
  if (status === "error") return <X size={size} color="#DC2626" strokeWidth={3} />;
  return <div className="rounded-full" style={{ width: size, height: size, backgroundColor: "#D1D5DB" }} />;
};

const SubIcon = ({ icon }: { icon: string }) => {
  if (icon === "copy") return <Copy size={12} />;
  if (icon === "calendar") return <CalendarDays size={12} />;
  return null;
};

/* Total stations: 9 (index 0 = email, 1-8 = layers) */
const TOTAL = stations.length; // 9

const WorkflowSlide = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [currentStation, setCurrentStation] = useState(-1); // -1=not started, 0-8=at station
  const [visitedStations, setVisitedStations] = useState<Set<number>>(new Set());
  const [stationAnimPhase, setStationAnimPhase] = useState<"traveling" | "arrived" | "idle">("idle");
  const [showScore, setShowScore] = useState(false);
  const [animScore, setAnimScore] = useState(0);
  const [tooltipStation, setTooltipStation] = useState<number | null>(null);
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
    setCurrentStation(-1);
    setVisitedStations(new Set());
    setStationAnimPhase("idle");
    setShowScore(false);
    setAnimScore(0);
    setTooltipStation(null);
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

        // Score animation on final layer (station index 8)
        if (stIdx === 8 && scenario.stopsAt >= 8) {
          const target = scenario.stationResults[8].score ?? 0;
          setShowScore(true);
          let cur = 0;
          const step = () => {
            cur += SCORE_TICK;
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
      advanceTo(0); // start at email node
    }, 150);
  }, [scenario, reset, advanceTo]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  /* ─── Layout: 9 stations from 4% to 96% ─── */
  const stationX = (idx: number) => 4 + idx * (92 / (TOTAL - 1)); // 0→4%, 8→96%
  const invoiceX = currentStation < 0 ? -4 : stationX(currentStation);

  const currentResult: StationResult | null =
    scenario && currentStation >= 0 ? scenario.stationResults[currentStation] : null;

  const bottomMessage = (() => {
    if (phase === "done" && scenario) return scenario.destinationMessage;
    if (phase === "playing" && currentResult && stationAnimPhase === "arrived") return currentResult.detail;
    if (phase === "playing" && stationAnimPhase === "traveling" && currentStation >= 0)
      return stations[currentStation].plainLabel;
    if (phase === "idle" && scenario) return scenario.description;
    if (phase === "idle") return "Select a scenario above, then press Play to watch the invoice journey through all 8 validation layers.";
    return "";
  })();

  const layerLabel = (() => {
    if (currentStation < 0 || phase !== "playing") return null;
    if (currentStation === 0) return "Email Trigger — Invoice arrives";
    return `Layer ${currentStation} of 8 — ${stations[currentStation].name}`;
  })();

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden select-none" style={{ fontFamily: "'Roboto', sans-serif", background: "white" }}>

      {/* ═══ TOP ═══ */}
      <div className="flex-shrink-0 px-6 pt-5 pb-3 flex flex-col items-center gap-3" style={{ height: "18%" }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: "#CC0000" }}>
            <span className="text-white font-bold text-[9px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>FBM</span>
          </div>
          <h2 className="text-lg md:text-xl font-semibold" style={{ fontFamily: "'Montserrat', sans-serif", color: "#111827" }}>
            How your invoice is processed — 8 validation layers
          </h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className="group relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2"
              style={{
                borderColor: sc.color,
                backgroundColor: selectedScenario === sc.id ? sc.color : "transparent",
                color: selectedScenario === sc.id ? "white" : sc.color,
              }}
            >
              <span>{sc.emoji} {sc.name}</span>
              <span className="block text-[10px] opacity-70 font-normal">{sc.tagline}</span>
            </button>
          ))}

          <div className="w-px h-10 mx-1" style={{ backgroundColor: "#E5E7EB" }} />

          {phase === "done" ? (
            <button onClick={handlePlay}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-semibold transition-colors"
              style={{ backgroundColor: "#CC0000" }}>
              <RotateCcw size={15} /> Replay
            </button>
          ) : (
            <button onClick={handlePlay}
              disabled={!selectedScenario || phase === "playing"}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: selectedScenario ? "#CC0000" : "#D1D5DB", color: "white" }}>
              <Play size={15} fill="white" /> Play
            </button>
          )}
        </div>
      </div>

      {/* ═══ MIDDLE — TRACK ═══ */}
      <div className="flex-1 relative px-4" style={{ minHeight: 0 }}>

        {/* Layer counter badge */}
        <AnimatePresence>
          {layerLabel && (
            <motion.div
              key={layerLabel}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide z-30"
              style={{ backgroundColor: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}
            >
              {layerLabel}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Track line */}
        <div className="absolute left-[4%] right-[4%] top-1/2 -translate-y-1/2 h-[3px]">
          <div className="absolute inset-0" style={{ borderBottom: "3px dashed #E5E7EB" }} />
          {currentStation >= 0 && (
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                backgroundColor: scenario
                  ? statusColor(scenario.stationResults[Math.min(currentStation, scenario.stopsAt)].status)
                  : "#16A34A",
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${(Math.min(currentStation, scenario?.stopsAt ?? 8) / (TOTAL - 1)) * 100}%` }}
              transition={{ duration: TRAVEL_MS / 1000, ease: "easeInOut" }}
            />
          )}
        </div>

        {/* ─── 9 Stations ─── */}
        {stations.map((station, idx) => {
          const StIcon = STATION_ICONS[idx];
          const isVisited = visitedStations.has(idx);
          const isCurrent = currentStation === idx && stationAnimPhase === "arrived";
          const result = scenario?.stationResults[idx];
          const isSkipped = result?.status === "skipped" && phase !== "idle";
          const xPct = stationX(idx);
          const isEmail = station.isEmailNode;

          return (
            <div
              key={station.id}
              className="absolute top-1/2 flex flex-col items-center"
              style={{ left: `${xPct}%`, transform: "translate(-50%, -50%)" }}
            >
              <motion.div className="relative flex flex-col items-center" animate={{ opacity: isSkipped ? 0.2 : 1 }}>

                {/* Status badge above */}
                <AnimatePresence>
                  {isVisited && result && result.status !== "skipped" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute -top-8 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                      style={{ backgroundColor: `${statusColor(result.status)}15`, color: statusColor(result.status) }}
                    >
                      <StatusIcon status={result.status} size={11} />
                      {result.label}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Layer number or envelope icon label */}
                <span className="text-[9px] font-bold mb-0.5" style={{ color: isCurrent || isVisited ? statusColor(result?.status ?? "pending") : "#9CA3AF" }}>
                  {isEmail ? "📧" : `L${station.layerNumber}`}
                </span>

                {/* Station box */}
                <motion.div
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center border-2 transition-colors duration-300 ${isVisited && !isCurrent ? "cursor-pointer" : ""}`}
                  style={{
                    borderColor: isCurrent || isVisited ? statusColor(result?.status ?? "pending") : "#E5E7EB",
                    backgroundColor: isCurrent ? `${statusColor(result?.status ?? "pending")}14` : "white",
                    boxShadow: isCurrent ? `0 0 12px ${statusColor(result?.status ?? "pending")}30` : "none",
                  }}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  onClick={() => {
                    if (isVisited && !isCurrent && result && result.status !== "skipped") {
                      setTooltipStation(tooltipStation === idx ? null : idx);
                    }
                  }}
                >
                  <StIcon size={16} style={{ color: isCurrent || isVisited ? statusColor(result?.status ?? "pending") : "#9CA3AF" }} />
                </motion.div>

                {/* Tooltip on click for visited stations */}
                <AnimatePresence>
                  {tooltipStation === idx && isVisited && !isCurrent && result && result.status !== "skipped" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full mb-2 z-40 w-56 p-2.5 rounded-lg shadow-lg border text-left"
                      style={{ backgroundColor: "white", borderColor: "#E5E7EB", left: "50%", transform: "translateX(-50%)" }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <StatusIcon status={result.status} size={13} />
                        <span className="text-[11px] font-semibold" style={{ color: statusColor(result.status) }}>
                          {station.isEmailNode ? "Email Trigger" : `Layer ${station.layerNumber} — ${station.name}`}
                        </span>
                      </div>
                      <p className="text-[10px] leading-relaxed" style={{ color: "#4B5563" }}>{result.detail}</p>
                      {result.subChecks && (
                        <div className="mt-1.5 flex flex-col gap-0.5">
                          {result.subChecks.map((sc, i) => (
                            <div key={i} className="flex items-center gap-1 text-[9px] font-medium" style={{ color: statusColor(sc.status) }}>
                              <StatusIcon status={sc.status} size={10} />
                              {sc.label}
                            </div>
                          ))}
                        </div>
                      )}
                      {result.fields && (
                        <div className="mt-1.5 flex flex-col gap-0.5">
                          {result.fields.map((f) => (
                            <div key={f.name} className="flex justify-between text-[9px]">
                              <span style={{ color: "#6B7280" }}>{f.name}</span>
                              <span className="font-medium" style={{ color: f.status === "warning" ? "#D97706" : "#111827" }}>{f.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {result.score != null && (
                        <div className="mt-1 text-center text-[10px] font-bold" style={{ color: statusColor(result.status) }}>
                          Score: {result.score}/100
                        </div>
                      )}
                      <div className="mt-1 text-[8px] text-center" style={{ color: "#9CA3AF" }}>click to close</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Station short name */}
                <span className="text-[8px] md:text-[9px] font-medium text-center max-w-[60px] leading-tight mt-1" style={{ color: "#6B7280" }}>
                  {station.shortName}
                </span>

                {/* Score badge inline for final decision when done */}
                {phase === "done" && idx === (scenario?.stopsAt ?? -1) && showScore && result?.score != null && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-0.5 mt-1">
                    <div className="text-lg font-bold tabular-nums" style={{ color: statusColor(result.status), fontFamily: "'Montserrat', sans-serif" }}>
                      {animScore}
                    </div>
                    <div className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider text-white whitespace-nowrap" style={{ backgroundColor: statusColor(result.status) }}>
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
            style={{ top: "calc(50% - 90px)" }}
            initial={{ left: "-4%" }}
            animate={{
              left: `${invoiceX}%`,
              rotate: scenario?.destination === "exception" && phase === "done" ? [0, -5, 5, -5, 5, 0] : 0,
            }}
            transition={{
              left: { duration: TRAVEL_MS / 1000, ease: "easeInOut" },
              rotate: { duration: 0.6, repeat: phase === "done" && scenario?.destination === "exception" ? 4 : 0 },
            }}
          >
            <motion.div
              className="relative w-[52px] h-[40px] rounded-md border-2 shadow-md flex flex-col items-center justify-center"
              style={{
                background: "white",
                borderColor:
                  phase === "done" && scenario?.destination === "exception" ? "#DC2626"
                    : phase === "done" && scenario?.destination === "auto" ? "#16A34A"
                      : phase === "done" && scenario?.destination === "assisted" ? "#D97706"
                        : "#E5E7EB",
                transform: "translateX(-50%)",
              }}
              animate={
                phase === "done" && scenario?.destination === "exception"
                  ? { y: 0, scale: [1, 1.1, 1], borderColor: "#DC2626" }
                  : phase === "done" && scenario?.destination === "assisted"
                    ? { y: 0, scale: [1, 1.05, 1], borderColor: "#D97706" }
                    : stationAnimPhase === "arrived" && phase === "playing"
                      ? { y: [0, -3, 0, -3, 0] }
                      : { y: 0 }
              }
              transition={
                phase === "done"
                  ? { duration: 0.5 }
                  : { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <div className="absolute top-0.5 left-0.5 w-3 h-2 rounded-sm flex items-center justify-center" style={{ backgroundColor: "#CC0000" }}>
                <span className="text-white text-[3px] font-bold" style={{ fontFamily: "'Montserrat'" }}>FBM</span>
              </div>
              <div className="mt-1 flex flex-col gap-[2px] w-7">
                <div className="h-[1.5px] rounded-full" style={{ backgroundColor: "#D1D5DB" }} />
                <div className="h-[1.5px] rounded-full w-5" style={{ backgroundColor: "#E5E7EB" }} />
                <div className="h-[1.5px] rounded-full w-3" style={{ backgroundColor: "#E5E7EB" }} />
              </div>

              <AnimatePresence>
                {phase === "done" && scenario?.destination === "auto" && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    className="absolute -top-2 -right-3 px-1 py-0.5 rounded text-[5px] font-bold text-white shadow"
                    style={{ backgroundColor: "#16A34A" }}>READY</motion.div>
                )}
                {phase === "done" && scenario?.destination === "assisted" && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    className="absolute -top-2 -right-3 px-1 py-0.5 rounded text-[5px] font-bold text-white shadow"
                    style={{ backgroundColor: "#D97706" }}>REVIEW</motion.div>
                )}
                {phase === "done" && scenario?.destination === "exception" && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    className="absolute -top-2 -right-3 px-1 py-0.5 rounded text-[5px] font-bold text-white shadow"
                    style={{ backgroundColor: "#DC2626" }}>HOLD</motion.div>
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
              style={{
                left: `${stationX(scenario.stopsAt) + 5}%`,
                top: "calc(50% - 20px)",
                width: 3,
                height: 40,
                backgroundColor: "#DC2626",
                borderRadius: 2,
              }}
            />
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {stations.map((st, idx) => (
            <div key={idx} className="flex flex-col items-center gap-0.5">
              <div
                className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: currentStation === idx
                    ? statusColor(scenario?.stationResults[idx]?.status ?? "pending")
                    : visitedStations.has(idx)
                      ? `${statusColor(scenario?.stationResults[idx]?.status ?? "pending")}80`
                      : "#D1D5DB",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ BOTTOM ═══ */}
      <div className="flex-shrink-0 px-8 pb-5 flex items-center justify-center" style={{ height: "18%" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={bottomMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl"
          >
            {phase === "done" && scenario && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: scenario.color }}
              >
                {scenario.destination === "auto" && "Auto-Prepared"}
                {scenario.destination === "assisted" && "Assisted Review"}
                {scenario.destination === "exception" && "Exception — Stopped"}
              </motion.div>
            )}
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "#374151" }}>{bottomMessage}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkflowSlide;
