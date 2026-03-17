import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import type { WorkflowNode } from "./workflowData";

const allTabs = ["Does", "Code", "Config", "Outputs", "Errors", "Connections"] as const;
type Tab = typeof allTabs[number];

interface Props {
  node: WorkflowNode | null;
  onClose: () => void;
}

export default function WorkflowDetailPanel({ node, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Does");
  const [copied, setCopied] = useState(false);

  if (!node) return null;

  // Only show tabs that have content
  const availableTabs = allTabs.filter((tab) => {
    if (tab === "Code") return !!node.code;
    if (tab === "Config") return !!node.config;
    if (tab === "Connections") return !!node.connectionDesc;
    return true;
  });

  // Reset to Does if current tab not available
  const currentTab = availableTabs.includes(activeTab) ? activeTab : "Does";

  const getTabContent = (tab: Tab): string => {
    switch (tab) {
      case "Does": return `${node.trigger}\n\n${node.does}`;
      case "Code": return node.code || "";
      case "Config": return node.config || "";
      case "Outputs": return node.outputs;
      case "Errors": return node.errors;
      case "Connections": return node.connectionDesc;
      default: return "";
    }
  };

  const content = getTabContent(currentTab);
  const isCode = currentTab === "Code";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card border-t-2 border-border rounded-t-2xl shadow-xl px-5 py-4 relative"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold text-primary-foreground"
            style={{ backgroundColor: node.categoryColor }}
          >
            {String(node.id).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-montserrat font-bold text-foreground text-sm leading-tight truncate">
              {node.fullName}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[9px] font-montserrat font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full text-primary-foreground"
                style={{ backgroundColor: node.categoryColor }}
              >
                {node.category}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded truncate">
                {node.nodeType}
              </span>
              {node.retryConfig && (
                <span className="text-[9px] font-mono text-warning bg-warning/10 px-1.5 py-0.5 rounded">
                  {node.retryConfig}
                </span>
              )}
              {node.isSupport && (
                <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  SUPPORT
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5 bg-muted rounded-lg p-0.5 w-fit">
            {availableTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-[10px] font-montserrat font-semibold transition-all ${
                  currentTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {(isCode || currentTab === "Config") && (
            <button
              onClick={handleCopy}
              className="ml-auto p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className={`max-h-[200px] overflow-y-auto rounded-lg ${
              isCode
                ? "bg-fbm-charcoal text-green-400 p-3 text-[10px] font-mono leading-relaxed"
                : "text-[11px] font-roboto text-foreground/80 leading-relaxed whitespace-pre-line"
            }`}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
