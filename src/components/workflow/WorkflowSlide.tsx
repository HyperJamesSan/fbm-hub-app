import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, ToggleLeft, ToggleRight, Info, Settings2 } from "lucide-react";
import {
  nodes,
  nodePositions,
  happyPathConnections,
  exceptionConnections,
  specialConnections,
  workflowMeta,
  credentials,
  envVars,
  type WorkflowNode,
} from "./workflowData";
import WorkflowDetailPanel from "./WorkflowDetailPanel";

const NODE_W = 130;
const NODE_H = 72;
const PAD_X = 30;
const PAD_Y = 30;
const CANVAS_W = PAD_X * 2 + 1020 + NODE_W;
const CANVAS_H = PAD_Y * 2 + 430 + NODE_H + 20;

function getPos(id: number) {
  const p = nodePositions[id];
  return { x: PAD_X + p.x, y: PAD_Y + p.y };
}

function getCenter(id: number) {
  const p = getPos(id);
  return { x: p.x + NODE_W / 2, y: p.y + NODE_H / 2 };
}

function getRect(id: number) {
  const p = getPos(id);
  return { x: p.x, y: p.y, w: NODE_W, h: NODE_H };
}

// Simulation happy path order
const simulateOrder = [1, 2, 3, 4, 16, 5, 6, 7, 9, 10, 11, 12, 14, 15];

// Stage regions for visual grouping
const stageRegions = [
  {
    label: "INGESTION",
    x: PAD_X - 10,
    y: PAD_Y - 10,
    w: 340 + NODE_W + 20 + 170,
    h: 230 + NODE_H - 50 + 20 + 20,
    color: "var(--fbm-gray-medium)",
  },
  {
    label: "DETERMINISTIC",
    x: PAD_X + 680 - 10,
    y: PAD_Y + 140 - 30,
    w: NODE_W + 20,
    h: NODE_H + 50,
    color: "var(--success)",
  },
  {
    label: "AI CORE",
    x: PAD_X + 850 - 10,
    y: PAD_Y + 140 - 30,
    w: NODE_W + 20,
    h: NODE_H + 50,
    color: "var(--primary)",
  },
  {
    label: "DECISION",
    x: PAD_X + 1020 - 10,
    y: PAD_Y + 140 - 30,
    w: NODE_W + 20,
    h: NODE_H + 50,
    color: "270 60% 50%",
  },
  {
    label: "POST-DECISION — EXECUTION & AUDIT",
    x: PAD_X - 10,
    y: PAD_Y + 430 - 25,
    w: 1020 + NODE_W + 20,
    h: NODE_H + 45,
    color: "var(--ai)",
  },
];

export default function WorkflowSlide() {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [simNode, setSimNode] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [showMeta, setShowMeta] = useState(false);

  // Simulation
  const simulate = useCallback(() => {
    if (simulating) return;
    setSimulating(true);
    setSelectedNode(null);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= simulateOrder.length) {
        clearInterval(interval);
        setSimulating(false);
        setSimNode(0);
        return;
      }
      setSimNode(simulateOrder[i]);
      i++;
    }, 600);
  }, [simulating]);

  // Search filter
  const matchesSearch = (n: WorkflowNode) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.name.toLowerCase().includes(q) ||
      n.tool.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.fullName.toLowerCase().includes(q)
    );
  };

  // Pulsing dot
  const [pulsePos, setPulsePos] = useState(0);
  useEffect(() => {
    if (selectedNode || simulating) return;
    const interval = setInterval(() => {
      setPulsePos((p) => (p + 1) % simulateOrder.length);
    }, 800);
    return () => clearInterval(interval);
  }, [selectedNode, simulating]);
  const pulseNodeId = !selectedNode && !simulating ? simulateOrder[pulsePos] : 0;

  // Arrow drawing
  const drawArrow = (
    fromId: number,
    toId: number,
    dashed: boolean,
    color: string,
    key: string,
    label?: string
  ) => {
    const from = getCenter(fromId);
    const to = getCenter(toId);
    const fromRect = getRect(fromId);
    const toRect = getRect(toId);

    let path: string;
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (Math.abs(dy) < 20 && dx > 0) {
      // Horizontal same row
      path = `M${fromRect.x + NODE_W},${from.y} L${toRect.x},${to.y}`;
    } else if (fromId === 7 && toId === 9) {
      // Row transition: 7 → 9 (down and far left)
      const sx = from.x;
      const sy = fromRect.y + NODE_H;
      const ex = to.x;
      const ey = toRect.y;
      const midY = (sy + ey) / 2;
      path = `M${sx},${sy} C${sx},${midY} ${ex},${midY} ${ex},${ey}`;
    } else if (fromId === 7 && toId === 10) {
      // Escalated: 7 → 10 (down and left)
      const sx = from.x - NODE_W / 4;
      const sy = fromRect.y + NODE_H;
      const ex = to.x;
      const ey = toRect.y;
      const midY = (sy + ey) / 2;
      path = `M${sx},${sy} C${sx},${midY} ${ex},${midY} ${ex},${ey}`;
    } else if (dx > 0 && dy > 60) {
      // Down-right
      const sx = from.x;
      const sy = fromRect.y + NODE_H;
      const ex = to.x;
      const ey = toRect.y;
      const midY = (sy + ey) / 2;
      path = `M${sx},${sy} C${sx},${midY} ${ex},${midY} ${ex},${ey}`;
    } else if (dx < 0 && dy > 60) {
      // Down-left (e.g. exception routes from top row to node 13)
      const sx = from.x;
      const sy = fromRect.y + NODE_H;
      const ex = to.x;
      const ey = toRect.y;
      const midY = (sy + ey) / 2;
      path = `M${sx},${sy} C${sx},${midY} ${ex},${midY} ${ex},${ey}`;
    } else if (dx < 0 && Math.abs(dy) < 60) {
      // Left (return arrow, e.g. 8→5)
      const sx = fromRect.x;
      const sy = from.y;
      const ex = toRect.x + NODE_W;
      const ey = to.y;
      const midX = (sx + ex) / 2 - 40;
      path = `M${sx},${sy} C${midX},${sy} ${midX},${ey} ${ex},${ey}`;
    } else if (Math.abs(dx) < 20 && dy > 0) {
      // Straight down
      path = `M${from.x},${fromRect.y + NODE_H} L${to.x},${toRect.y}`;
    } else if (Math.abs(dx) < 20 && dy < 0) {
      // Straight up
      path = `M${from.x},${fromRect.y} L${to.x},${toRect.y + NODE_H}`;
    } else {
      // Generic curve
      const sx = dx > 0 ? fromRect.x + NODE_W : fromRect.x;
      const sy = from.y;
      const ex = dx > 0 ? toRect.x : toRect.x + NODE_W;
      const ey = to.y;
      const midX = (sx + ex) / 2;
      path = `M${sx},${sy} C${midX},${sy} ${midX},${ey} ${ex},${ey}`;
    }

    return (
      <g key={key}>
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={dashed ? 1.5 : 2}
          strokeDasharray={dashed ? "6 4" : "none"}
          opacity={dashed ? 0.45 : 0.6}
          markerEnd={dashed ? "url(#arrowhead-amber)" : "url(#arrowhead)"}
        />
        {label && (
          <text
            x={(getCenter(fromId).x + getCenter(toId).x) / 2}
            y={(getCenter(fromId).y + getCenter(toId).y) / 2 - 6}
            textAnchor="middle"
            fontSize={8}
            fill={color}
            className="font-mono"
            fontWeight={600}
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <section className="min-h-screen py-8 px-4 md:px-8 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="fbm-badge-primary">FBM</span>
          <div>
            <h2 className="font-montserrat font-bold text-foreground text-base md:text-lg leading-tight">
              AP Automation — n8n Workflow
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {workflowMeta.version}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {workflowMeta.totalNodes} nodes · {workflowMeta.connections} connections
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowMeta(!showMeta)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted text-[10px] font-montserrat font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showMeta ? <Settings2 className="w-3.5 h-3.5 text-primary" /> : <Info className="w-3.5 h-3.5" />}
            {showMeta ? "Hide Config" : "Config"}
          </button>
          <button
            onClick={() => setShowAllPaths(!showAllPaths)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted text-[10px] font-montserrat font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAllPaths ? <ToggleRight className="w-3.5 h-3.5 text-warning" /> : <ToggleLeft className="w-3.5 h-3.5" />}
            {showAllPaths ? "All paths" : "Happy path"}
          </button>
          <button
            onClick={simulate}
            disabled={simulating}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-montserrat font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3" />
            {simulating ? "Simulating..." : "Simulate"}
          </button>
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1.5 rounded-lg bg-muted text-[10px] font-roboto text-foreground border-none outline-none focus:ring-2 focus:ring-primary/30 w-32"
            />
          </div>
        </div>
      </div>

      {/* Config Panel */}
      <AnimatePresence>
        {showMeta && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="fbm-card p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Metadata */}
              <div>
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2">Workflow Metadata</h4>
                <div className="space-y-1 text-[10px] font-mono text-muted-foreground">
                  <div><span className="text-foreground">Name:</span> {workflowMeta.name}</div>
                  <div><span className="text-foreground">Env:</span> {workflowMeta.environment}</div>
                  <div><span className="text-foreground">TZ:</span> {workflowMeta.timezone}</div>
                  <div><span className="text-foreground">Exec:</span> {workflowMeta.execution}</div>
                  <div><span className="text-foreground">Errors:</span> {workflowMeta.errorHandling}</div>
                </div>
              </div>
              {/* Credentials */}
              <div>
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2">Credentials (n8n)</h4>
                <div className="space-y-1">
                  {credentials.map((c) => (
                    <div key={c.key} className="text-[10px] font-mono">
                      <span className="text-foreground">{c.key}</span>
                      <span className="text-muted-foreground ml-1">— {c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Env Vars */}
              <div>
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2">Environment Variables</h4>
                <div className="space-y-0.5 max-h-[140px] overflow-y-auto">
                  {Object.entries(envVars).map(([k, v]) => (
                    <div key={k} className="text-[9px] font-mono">
                      <span className="text-foreground">{k}:</span>
                      <span className="text-muted-foreground ml-1">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flow Diagram */}
      <div
        className="flex-1 overflow-auto fbm-card p-3 relative"
        style={{ minHeight: selectedNode ? "48vh" : "68vh" }}
      >
        <svg
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          className="w-full h-full"
          style={{ minWidth: 850, minHeight: 350 }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--fbm-gray-medium))" />
            </marker>
            <marker id="arrowhead-amber" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--warning))" />
            </marker>
          </defs>

          {/* Stage grouping regions */}
          {stageRegions.map((region) => (
            <g key={region.label}>
              <rect
                x={region.x}
                y={region.y}
                width={region.w}
                height={region.h}
                rx={14}
                fill={`hsl(${region.color} / 0.04)`}
                stroke={`hsl(${region.color} / 0.15)`}
                strokeWidth={1.5}
                strokeDasharray="6 3"
              />
              <text
                x={region.x + 8}
                y={region.y + 12}
                fontSize={8}
                fontWeight={700}
                fill={`hsl(${region.color})`}
                className="font-mono"
                letterSpacing="0.08em"
              >
                {region.label}
              </text>
            </g>
          ))}

          {/* Parallel indicator between 03 and 04 */}
          <text
            x={PAD_X + 340 + NODE_W / 2}
            y={PAD_Y + 50 + NODE_H + 18}
            textAnchor="middle"
            fontSize={9}
            fontWeight={700}
            fill="hsl(var(--muted-foreground))"
            className="font-mono"
          >
            ‖ PARALLEL
          </text>

          {/* Happy path arrows */}
          {happyPathConnections.map(([from, to]) =>
            drawArrow(from, to, false, "hsl(var(--fbm-gray-medium))", `hp-${from}-${to}`)
          )}

          {/* Exception arrows */}
          {showAllPaths &&
            exceptionConnections.map(([from, to]) =>
              drawArrow(from, to, true, "hsl(var(--warning))", `exc-${from}-${to}`)
            )}

          {/* Special arrows */}
          {showAllPaths &&
            specialConnections.map((conn) =>
              drawArrow(conn.from, conn.to, conn.dashed ?? true, conn.color, `sp-${conn.from}-${conn.to}`, conn.label)
            )}

          {/* Pulse dot */}
          {pulseNodeId > 0 && (
            <motion.circle
              key={`pulse-${pulseNodeId}`}
              cx={getCenter(pulseNodeId).x}
              cy={getCenter(pulseNodeId).y}
              r={5}
              fill="hsl(var(--primary))"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Simulation highlight */}
          {simulating && simNode > 0 && (
            <motion.rect
              key={`sim-${simNode}`}
              x={getRect(simNode).x - 4}
              y={getRect(simNode).y - 4}
              width={NODE_W + 8}
              height={NODE_H + 8}
              rx={14}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 1, 0.6], scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Nodes */}
          {nodes.map((node) => {
            const rect = getRect(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isSimActive = simulating && simNode === node.id;
            const isHovered = hoveredNode === node.id;
            const matches = matchesSearch(node);
            const catColor = node.categoryColor;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
                style={{ opacity: matches ? 1 : 0.15, transition: "opacity 0.3s" }}
              >
                {/* Node body */}
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  fill={isSelected || isSimActive ? catColor : "hsl(var(--card))"}
                  stroke={isHovered && !isSelected ? catColor : "hsl(var(--border))"}
                  strokeWidth={isSelected || isSimActive ? 0 : isHovered ? 2.5 : 1.5}
                  style={{
                    filter: isHovered || isSelected ? "drop-shadow(0 4px 12px rgba(0,0,0,0.12))" : "none",
                    transition: "all 0.2s ease",
                  }}
                />

                {/* Category accent bar */}
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={NODE_W}
                  height={3}
                  rx={2}
                  fill={catColor}
                  opacity={isSelected || isSimActive ? 0 : 1}
                />

                {/* Support badge */}
                {node.isSupport && (
                  <rect
                    x={rect.x + NODE_W - 8}
                    y={rect.y - 4}
                    width={8}
                    height={8}
                    rx={4}
                    fill="hsl(var(--muted-foreground))"
                    opacity={0.5}
                  />
                )}

                {/* Watermark number */}
                <text
                  x={rect.x + NODE_W - 8}
                  y={rect.y + NODE_H - 6}
                  textAnchor="end"
                  className="font-mono"
                  fontSize={22}
                  fontWeight={700}
                  fill={isSelected || isSimActive ? "rgba(255,255,255,0.2)" : "hsl(var(--border))"}
                >
                  {String(node.id).padStart(2, "0")}
                </text>

                {/* Node name */}
                <foreignObject x={rect.x + 6} y={rect.y + 8} width={NODE_W - 12} height={NODE_H - 16}>
                  <div
                    className="text-[9px] font-montserrat font-bold leading-tight"
                    style={{
                      color: isSelected || isSimActive ? "white" : "hsl(var(--foreground))",
                    }}
                  >
                    {node.name}
                  </div>
                  <div
                    className="text-[7px] font-mono mt-0.5 truncate"
                    style={{
                      color: isSelected || isSimActive ? "rgba(255,255,255,0.7)" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {node.category}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <WorkflowDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
