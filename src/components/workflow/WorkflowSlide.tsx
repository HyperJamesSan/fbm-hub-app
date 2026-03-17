import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, ToggleLeft, ToggleRight } from "lucide-react";
import {
  nodes,
  nodePositions,
  happyPathConnections,
  exceptionConnections,
  specialConnections,
  categoryColors,
  type WorkflowNode,
} from "./workflowData";
import WorkflowDetailPanel from "./WorkflowDetailPanel";

const NODE_W = 140;
const NODE_H = 80;
const GAP_X = 160;
const GAP_Y = 140;
const PAD_X = 40;
const PAD_Y = 60;

function getNodeCenter(id: number) {
  const pos = nodePositions[id];
  return {
    x: PAD_X + pos.col * GAP_X + NODE_W / 2,
    y: PAD_Y + pos.row * GAP_Y + NODE_H / 2,
  };
}

function getNodeRect(id: number) {
  const pos = nodePositions[id];
  return {
    x: PAD_X + pos.col * GAP_X,
    y: PAD_Y + pos.row * GAP_Y,
    w: NODE_W,
    h: NODE_H,
  };
}

const CANVAS_W = PAD_X * 2 + 8 * GAP_X;
const CANVAS_H = PAD_Y * 2 + 2 * GAP_Y + NODE_H;

export default function WorkflowSlide() {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [showAllPaths, setShowAllPaths] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [simNode, setSimNode] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation
  const simulateOrder = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15];
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
      n.category.toLowerCase().includes(q)
    );
  };

  // Pulsing dot along happy path
  const [pulsePos, setPulsePos] = useState(0);
  useEffect(() => {
    if (selectedNode || simulating) return;
    const interval = setInterval(() => {
      setPulsePos((p) => (p + 1) % simulateOrder.length);
    }, 800);
    return () => clearInterval(interval);
  }, [selectedNode, simulating]);

  const pulseNodeId = !selectedNode && !simulating ? simulateOrder[pulsePos] : 0;

  // Arrow drawing helper
  const drawArrow = (
    fromId: number,
    toId: number,
    dashed: boolean,
    color: string,
    key: string
  ) => {
    const from = getNodeCenter(fromId);
    const to = getNodeCenter(toId);

    // For same-row connections
    const fromPos = nodePositions[fromId];
    const toPos = nodePositions[toId];

    let path: string;
    if (fromPos.row === toPos.row) {
      // Simple horizontal
      const startX = from.x + NODE_W / 2;
      const endX = to.x - NODE_W / 2;
      path = `M${startX},${from.y} L${endX},${to.y}`;
    } else if (fromId === 7 && toId === 9) {
      // Row transition: 7 → 9 (go down and left)
      const startX = from.x;
      const startY = from.y + NODE_H / 2;
      const endX = to.x;
      const endY = to.y - NODE_H / 2;
      const midY = (startY + endY) / 2;
      path = `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`;
    } else {
      // Generic curve
      const startX = from.x + (toPos.col > fromPos.col ? NODE_W / 2 : -NODE_W / 2);
      const startY = from.y + (toPos.row > fromPos.row ? NODE_H / 2 : -NODE_H / 2);
      const endX = to.x + (toPos.col > fromPos.col ? -NODE_W / 2 : NODE_W / 2);
      const endY = to.y + (toPos.row > fromPos.row ? -NODE_H / 2 : NODE_H / 2);
      const midY = (startY + endY) / 2;
      path = `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`;
    }

    return (
      <path
        key={key}
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? "6 4" : "none"}
        opacity={dashed ? 0.5 : 0.6}
        markerEnd="url(#arrowhead)"
      />
    );
  };

  return (
    <section className="min-h-screen py-12 px-4 md:px-8 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="fbm-badge-primary">FBM</span>
          <h2 className="font-montserrat font-bold text-foreground text-lg md:text-xl">
            AP Automation — n8n Workflow
          </h2>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            P1.30 FMT
          </span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAllPaths(!showAllPaths)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-xs font-montserrat font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAllPaths ? <ToggleRight className="w-4 h-4 text-warning" /> : <ToggleLeft className="w-4 h-4" />}
            {showAllPaths ? "All paths" : "Happy path"}
          </button>
          <button
            onClick={simulate}
            disabled={simulating}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-montserrat font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            {simulating ? "Simulating..." : "Simulate Invoice"}
          </button>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-muted text-xs font-roboto text-foreground border-none outline-none focus:ring-2 focus:ring-primary/30 w-40"
            />
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto fbm-card p-4 relative"
        style={{ minHeight: selectedNode ? "55vh" : "75vh" }}
      >
        <svg
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          className="w-full h-full"
          style={{ minWidth: 900, minHeight: 380 }}
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
              drawArrow(conn.from, conn.to, true, conn.color, `sp-${conn.from}-${conn.to}`)
            )}

          {/* Pulse dot */}
          {pulseNodeId > 0 && (
            <motion.circle
              key={`pulse-${pulseNodeId}`}
              cx={getNodeCenter(pulseNodeId).x}
              cy={getNodeCenter(pulseNodeId).y}
              r={6}
              fill="hsl(var(--primary))"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 0.8 }}
            />
          )}

          {/* Simulation highlight */}
          {simulating && simNode > 0 && (
            <motion.rect
              key={`sim-${simNode}`}
              x={getNodeRect(simNode).x - 4}
              y={getNodeRect(simNode).y - 4}
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
            const rect = getNodeRect(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isSimActive = simulating && simNode === node.id;
            const isHovered = hoveredNode === node.id;
            const matches = matchesSearch(node);
            const catColor = node.categoryColor;

            return (
              <g
                key={node.id}
                onClick={() => { setSelectedNode(isSelected ? null : node); }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
                style={{ opacity: matches ? 1 : 0.2, transition: "opacity 0.3s" }}
              >
                {/* Node body */}
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={12}
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
                  height={4}
                  rx={2}
                  fill={catColor}
                  opacity={isSelected || isSimActive ? 0 : 1}
                />

                {/* Watermark number */}
                <text
                  x={rect.x + NODE_W - 12}
                  y={rect.y + NODE_H - 8}
                  textAnchor="end"
                  className="font-mono"
                  fontSize={28}
                  fontWeight={700}
                  fill={isSelected || isSimActive ? "rgba(255,255,255,0.2)" : "hsl(var(--border))"}
                >
                  {String(node.id).padStart(2, "0")}
                </text>

                {/* Node name */}
                <foreignObject x={rect.x + 8} y={rect.y + 12} width={NODE_W - 16} height={NODE_H - 20}>
                  <div
                    className="text-[10px] font-montserrat font-bold leading-tight"
                    style={{
                      color: isSelected || isSimActive ? "white" : "hsl(var(--foreground))",
                    }}
                  >
                    {node.name}
                  </div>
                  <div
                    className="text-[8px] font-mono mt-1 truncate"
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
