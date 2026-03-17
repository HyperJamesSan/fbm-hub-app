export type ScenarioId = "clean" | "review" | "critical";
export type StationStatus = "success" | "warning" | "error" | "pending" | "skipped";

export interface StationResult {
  status: StationStatus;
  label: string;
  detail: string;
  fields?: { name: string; value: string; status: "success" | "warning" }[];
  score?: number;
  scoreLabel?: string;
  subChecks?: { icon: string; status: StationStatus; label: string }[];
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  emoji: string;
  color: string;
  tagline: string;
  description: string;
  stopsAt: number;
  destination: "auto" | "assisted" | "exception";
  destinationMessage: string;
  stationResults: StationResult[];
}

export interface Station {
  id: number;
  name: string;
  shortName: string;
  layerNumber: number;
  plainLabel: string;
  icon: string;
}

export const stations: Station[] = [
  { id: 1, layerNumber: 1, name: "PDF Quality", shortName: "PDF", plainLabel: "Is this a real, readable PDF document?", icon: "file-scan" },
  { id: 2, layerNumber: 2, name: "Duplicate Check", shortName: "Duplicate", plainLabel: "Have we already received and paid this invoice?", icon: "copy-check" },
  { id: 3, layerNumber: 3, name: "Vendor Match", shortName: "Vendor", plainLabel: "Do we recognise this supplier in our accounting system?", icon: "user-check" },
  { id: 4, layerNumber: 4, name: "VIES VAT Check", shortName: "VAT", plainLabel: "Is the supplier's VAT number valid across the EU?", icon: "shield-check" },
  { id: 5, layerNumber: 5, name: "PO Match", shortName: "PO", plainLabel: "Does this invoice reference a purchase order we have on file?", icon: "file-search" },
  { id: 6, layerNumber: 6, name: "Entity ID (AI)", shortName: "Entity", plainLabel: "The AI figures out which of our 7 companies this invoice belongs to", icon: "building" },
  { id: 7, layerNumber: 7, name: "VAT Analysis (AI)", shortName: "VAT AI", plainLabel: "The AI determines the correct VAT treatment for this invoice", icon: "calculator" },
  { id: 8, layerNumber: 8, name: "GL Account (AI)", shortName: "GL", plainLabel: "The AI suggests the right ledger account and cost centre", icon: "book-open" },
];

// ─── SCENARIO A: CLEAN INVOICE ───
const cleanResults: StationResult[] = [
  { status: "success", label: "Clear PDF", detail: "A well-structured, machine-readable PDF — 3 pages, quality score 92/100." },
  { status: "success", label: "No duplicates", detail: "We checked our records — this invoice has never been processed before." },
  { status: "success", label: "Vendor found", detail: "Matched to 'Acme IT Solutions Ltd' in our accounting system by VAT number." },
  { status: "success", label: "VAT valid", detail: "The supplier's VAT number MT24837165 is active and verified in the EU VIES database." },
  { status: "success", label: "PO matched", detail: "Found matching purchase order PO-2025-0412 for €4,500.00 — invoice is within tolerance." },
  {
    status: "success", label: "Entity identified", detail: "The AI identified this invoice belongs to FBM Limited (entity 02) with 96% confidence.",
    fields: [
      { name: "Entity", value: "FBM Limited", status: "success" },
      { name: "Confidence", value: "96%", status: "success" },
    ],
  },
  {
    status: "success", label: "VAT treatment clear", detail: "Standard rate 18% applies. No reverse charge. No flags detected.",
    fields: [
      { name: "Treatment", value: "Standard 18%", status: "success" },
      { name: "Amount", value: "€765.00", status: "success" },
    ],
  },
  {
    status: "success", label: "GL assigned", detail: "Account 6110 — IT Services. Budget project P130. GL confidence 91%.",
    score: 94, scoreLabel: "AUTO-PREPARED",
    fields: [
      { name: "GL Account", value: "6110 — IT Services", status: "success" },
      { name: "Score", value: "94 / 100", status: "success" },
    ],
  },
];

// ─── SCENARIO B: NEEDS REVIEW ───
const reviewResults: StationResult[] = [
  { status: "success", label: "Clear PDF", detail: "Readable PDF, 2 pages, quality score 85/100." },
  { status: "success", label: "No duplicates", detail: "This invoice has not been processed before." },
  { status: "success", label: "Vendor found", detail: "Matched to 'Global Consulting GmbH' in our system." },
  { status: "warning", label: "VAT uncertain", detail: "The EU VIES service was temporarily unavailable. VAT could not be verified — flagged for manual check." },
  { status: "success", label: "No PO reference", detail: "No purchase order number was found on the invoice — this is common for consulting services." },
  {
    status: "warning", label: "Entity uncertain", detail: "The AI thinks this belongs to FBM Limited, but the confidence is only 68%. Could also be NTT Limited.",
    fields: [
      { name: "Entity", value: "FBM Limited?", status: "warning" },
      { name: "Confidence", value: "68%", status: "warning" },
    ],
  },
  {
    status: "success", label: "Reverse charge", detail: "Cross-border service from Germany — reverse charge mechanism applies correctly.",
    fields: [
      { name: "Treatment", value: "Reverse Charge", status: "success" },
      { name: "VAT", value: "€0.00", status: "success" },
    ],
  },
  {
    status: "warning", label: "GL uncertain", detail: "The AI suggests 6200 — Consulting, but confidence is only 62%. Needs human confirmation.",
    score: 78, scoreLabel: "NEEDS REVIEW",
    fields: [
      { name: "GL Account", value: "6200 — Consulting?", status: "warning" },
      { name: "Score", value: "78 / 100", status: "warning" },
    ],
  },
];

// ─── SCENARIO C: CRITICAL STOP ───
const criticalResults: StationResult[] = [
  { status: "success", label: "Clear PDF", detail: "Readable PDF, 1 page, quality score 88/100." },
  {
    status: "error", label: "DUPLICATE FOUND", detail: "This exact invoice (INV-2025-0391) was already paid on 14 Feb 2025. Processing stopped immediately.",
    subChecks: [
      { icon: "copy", status: "error", label: "Invoice INV-2025-0391 already exists" },
      { icon: "calendar", status: "error", label: "Paid on 14 Feb 2025" },
    ],
  },
  { status: "skipped", label: "Skipped", detail: "Processing was halted at the previous step." },
  { status: "skipped", label: "Skipped", detail: "" },
  { status: "skipped", label: "Skipped", detail: "" },
  { status: "skipped", label: "Skipped", detail: "" },
  { status: "skipped", label: "Skipped", detail: "" },
  { status: "error", label: "HOLD", detail: "Invoice stopped. AP Executive and Financial Manager have been notified. Manual review required." },
];

export const scenarios: Scenario[] = [
  {
    id: "clean",
    name: "Clean Invoice",
    emoji: "🟢",
    color: "#16A34A",
    tagline: "All 8 layers pass",
    description: "Everything passes. High confidence across all 8 validation layers. Invoice arrives auto-prepared and ready to post with one click.",
    stopsAt: 8,
    destination: "auto",
    destinationMessage: "✅ All 8 layers passed — Score: 94/100. DBC draft created automatically. AP Executive receives one-click confirmation email.",
    stationResults: cleanResults,
  },
  {
    id: "review",
    name: "Needs Review",
    emoji: "🟡",
    color: "#D97706",
    tagline: "2 layers flagged",
    description: "Most layers pass, but the entity and GL account are uncertain. AP Executive must review the flagged fields before posting.",
    stopsAt: 8,
    destination: "assisted",
    destinationMessage: "⚠️ 6 of 8 layers passed, 2 flagged — Score: 78/100. DBC draft created with highlighted fields. AP Executive reviews and corrects.",
    stationResults: reviewResults,
  },
  {
    id: "critical",
    name: "Critical Stop",
    emoji: "🔴",
    color: "#DC2626",
    tagline: "Hard stop at Layer 2",
    description: "A critical problem is detected at Layer 2 — duplicate invoice. The system stops immediately and fires an alert.",
    stopsAt: 2,
    destination: "exception",
    destinationMessage: "🛑 Hard stop at Layer 2 — Duplicate invoice detected. AP Executive and Financial Manager notified immediately. Manual processing required.",
    stationResults: criticalResults,
  },
];
