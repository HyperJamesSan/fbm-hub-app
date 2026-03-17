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
  /** Which station index (0-based) does the journey stop at? */
  stopsAt: number;
  destination: "auto" | "assisted" | "exception";
  destinationMessage: string;
  /** Index 0 = email node, 1-8 = the 8 layers */
  stationResults: StationResult[];
}

export interface Station {
  id: number;
  name: string;
  shortName: string;
  /** 0 = email trigger, 1-8 = layer number */
  layerNumber: number;
  plainLabel: string;
  icon: string;
  isEmailNode?: boolean;
}

// ─── 9 STATIONS: 1 email trigger + 8 validation layers ───
export const stations: Station[] = [
  { id: 0, layerNumber: 0, name: "Email Received", shortName: "Inbox", plainLabel: "A new invoice just arrived in the AP shared inbox", icon: "mail", isEmailNode: true },
  { id: 1, layerNumber: 1, name: "Legal Format", shortName: "Legal", plainLabel: "Does this invoice have all the mandatory fields required by law?", icon: "file-check" },
  { id: 2, layerNumber: 2, name: "VIES Validation", shortName: "VIES", plainLabel: "Is the supplier's EU VAT number active and valid?", icon: "shield-check" },
  { id: 3, layerNumber: 3, name: "Vendor Verification", shortName: "Vendor", plainLabel: "Do we recognise this supplier in our accounting system?", icon: "user-check" },
  { id: 4, layerNumber: 4, name: "Contract Validation", shortName: "Contract", plainLabel: "Does the amount match what we agreed in the contract?", icon: "file-search" },
  { id: 5, layerNumber: 5, name: "Duplicate Detection", shortName: "Duplicate", plainLabel: "Have we already received and paid this exact invoice?", icon: "copy-check" },
  { id: 6, layerNumber: 6, name: "VAT Compliance", shortName: "VAT AI", plainLabel: "The AI checks if the tax treatment is correct — reverse charge, exemptions, rates", icon: "calculator" },
  { id: 7, layerNumber: 7, name: "GL Classification", shortName: "GL AI", plainLabel: "The AI suggests the right ledger account and cost centre", icon: "book-open" },
  { id: 8, layerNumber: 8, name: "Final Decision", shortName: "Decision", plainLabel: "All layers scored — the system decides what happens next", icon: "gauge" },
];

// ═══ SCENARIO A: CLEAN INVOICE ═══
const cleanResults: StationResult[] = [
  // Station 0 — Email
  { status: "success", label: "Email received", detail: "Invoice from a known supplier arrived with a valid PDF attachment in the AP inbox." },
  // Layer 1 — Legal Format
  { status: "success", label: "Format valid", detail: "All mandatory fields present: invoice number, date, VAT IDs, taxable base, and applied rate." },
  // Layer 2 — VIES
  { status: "success", label: "VAT valid", detail: "Supplier VAT number MT24837165 confirmed active in the EU VIES database." },
  // Layer 3 — Vendor
  { status: "success", label: "Vendor matched", detail: "Matched to 'Acme IT Solutions Ltd' in Business Central by VAT number — exact match." },
  // Layer 4 — Contract
  { status: "success", label: "Contract match", detail: "Amount €4,250 matches active contract within ±2% tolerance. Service type confirmed." },
  // Layer 5 — Duplicate
  { status: "success", label: "No duplicates", detail: "Checked 24 months of history — this invoice has never been processed before." },
  // Layer 6 — VAT Compliance (AI)
  {
    status: "success", label: "VAT correct", detail: "Standard rate 18% applies. No reverse charge needed. AI reasoning confirmed with audit trail.",
    fields: [
      { name: "Treatment", value: "Standard 18%", status: "success" },
      { name: "VAT Amount", value: "€765.00", status: "success" },
    ],
  },
  // Layer 7 — GL Classification (AI)
  {
    status: "success", label: "GL assigned", detail: "Account 6110 — IT Services. Budget project P130. Confidence 91%.",
    fields: [
      { name: "GL Account", value: "6110 — IT Services", status: "success" },
      { name: "Confidence", value: "91%", status: "success" },
    ],
  },
  // Layer 8 — Final Decision
  {
    status: "success", label: "Auto-Prepared", detail: "Weighted confidence score: 94/100 — all 8 layers passed. Draft ready for one-click posting.",
    score: 94, scoreLabel: "AUTO-PREPARED",
  },
];

// ═══ SCENARIO B: NEEDS REVIEW ═══
const reviewResults: StationResult[] = [
  { status: "success", label: "Email received", detail: "Invoice arrived with a valid PDF attachment." },
  { status: "success", label: "Format valid", detail: "All mandatory invoice fields are present." },
  { status: "warning", label: "VIES unavailable", detail: "The EU VIES service was temporarily down. VAT could not be verified — flagged for manual check." },
  { status: "success", label: "Vendor matched", detail: "Matched to 'Global Consulting GmbH' in Business Central." },
  { status: "success", label: "No contract", detail: "No active contract found for this vendor — common for ad-hoc consulting. Flagged as informational." },
  { status: "success", label: "No duplicates", detail: "This invoice has not been processed before." },
  {
    status: "success", label: "Reverse charge", detail: "Cross-border service from Germany — reverse charge mechanism applies correctly.",
    fields: [
      { name: "Treatment", value: "Reverse Charge", status: "success" },
      { name: "VAT", value: "€0.00", status: "success" },
    ],
  },
  {
    status: "warning", label: "GL uncertain", detail: "AI suggests 6200 — Consulting, but confidence is only 62%. Needs human confirmation.",
    fields: [
      { name: "GL Account", value: "6200 — Consulting?", status: "warning" },
      { name: "Confidence", value: "62%", status: "warning" },
    ],
  },
  {
    status: "warning", label: "Needs Review", detail: "Score: 78/100 — 6 of 8 layers passed, 2 flagged. Draft created with highlighted fields for AP Executive.",
    score: 78, scoreLabel: "NEEDS REVIEW",
  },
];

// ═══ SCENARIO C: CRITICAL STOP ═══
const criticalResults: StationResult[] = [
  { status: "success", label: "Email received", detail: "Invoice arrived with a valid PDF attachment." },
  { status: "success", label: "Format valid", detail: "All mandatory invoice fields are present." },
  { status: "success", label: "VAT valid", detail: "Supplier VAT number confirmed active in VIES." },
  { status: "success", label: "Vendor matched", detail: "Vendor found in Business Central." },
  { status: "success", label: "Contract OK", detail: "Amount matches the active contract." },
  {
    status: "error", label: "DUPLICATE FOUND", detail: "This exact invoice (INV-2025-0391) was already paid on 14 Feb 2025. Processing stopped immediately.",
    subChecks: [
      { icon: "copy", status: "error", label: "INV-2025-0391 already exists" },
      { icon: "calendar", status: "error", label: "Paid on 14 Feb 2025" },
    ],
  },
  { status: "skipped", label: "Skipped", detail: "Processing was halted at Duplicate Detection." },
  { status: "skipped", label: "Skipped", detail: "" },
  { status: "error", label: "HOLD", detail: "Invoice stopped at Layer 5. AP Executive and Financial Manager notified immediately." },
];

export const scenarios: Scenario[] = [
  {
    id: "clean",
    name: "Clean Invoice",
    emoji: "🟢",
    color: "#16A34A",
    tagline: "All 8 layers pass",
    description: "Everything passes. High confidence across all 8 validation layers. Invoice arrives auto-prepared and ready to post with one click.",
    stopsAt: 8, // 0-based: email=0, layers 1-8
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
    description: "Most layers pass, but VIES and GL are uncertain. AP Executive must review the flagged fields before posting.",
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
    tagline: "Hard stop at Layer 5",
    description: "A critical problem at Layer 5 — duplicate invoice detected. The system stops immediately and fires an alert.",
    stopsAt: 5, // stops at duplicate detection (index 5)
    destination: "exception",
    destinationMessage: "🛑 Hard stop at Layer 5 — Duplicate invoice detected. AP Executive and Financial Manager notified immediately. Manual processing required.",
    stationResults: criticalResults,
  },
];
