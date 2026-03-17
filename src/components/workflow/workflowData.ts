export type ScenarioId = "clean" | "review" | "critical";

export type StationStatus = "success" | "warning" | "error" | "pending" | "skipped";

export interface StationResult {
  status: StationStatus;
  label: string;
  detail: string;
  fields?: { name: string; value: string; status: "success" | "warning" }[];
  score?: number;
  scoreLabel?: string;
  subChecks?: { icon: "vendor" | "vat" | "duplicate"; status: StationStatus; label: string }[];
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  emoji: string;
  color: string;
  description: string;
  stopsAt: number;
  destination: "auto" | "assisted" | "exception";
  destinationMessage: string;
  stationResults: StationResult[];
}

export interface Station {
  id: number;
  name: string;
  plainLabel: string;
}

export const stations: Station[] = [
  { id: 1, name: "Invoice Received", plainLabel: "A new invoice just arrived in the shared inbox" },
  { id: 2, name: "Document Check", plainLabel: "Is this a real, readable invoice?" },
  { id: 3, name: "Supplier Check", plainLabel: "Do we know this supplier? Is their VAT valid? Have we paid this before?" },
  { id: 4, name: "AI Analysis", plainLabel: "The AI reads the invoice and extracts all the key data automatically" },
  { id: 5, name: "Decision", plainLabel: "Based on everything found, the system decides what happens next" },
  { id: 6, name: "Destination", plainLabel: "The invoice arrives at its final stop" },
];

export const scenarios: Scenario[] = [
  {
    id: "clean",
    name: "Clean Invoice",
    emoji: "🟢",
    color: "#16A34A",
    description: "Everything passes. High confidence. Ready to post.",
    stopsAt: 6,
    destination: "auto",
    destinationMessage: "DBC draft created. AP Executive receives notification. One click to confirm and post.",
    stationResults: [
      { status: "success", label: "Email received", detail: "Invoice from a known supplier arrived with a valid PDF attachment." },
      { status: "success", label: "Valid PDF", detail: "The document is a readable, well-structured PDF — no issues found." },
      {
        status: "success", label: "Supplier verified", detail: "Supplier found in the system, VAT is valid, no duplicates.",
        subChecks: [
          { icon: "vendor", status: "success", label: "Known supplier" },
          { icon: "vat", status: "success", label: "VAT valid" },
          { icon: "duplicate", status: "success", label: "Not a duplicate" },
        ],
      },
      {
        status: "success", label: "All fields extracted", detail: "The AI identified the company, amounts, GL account, and VAT treatment with high confidence.",
        fields: [
          { name: "Entity", value: "FBM Limited", status: "success" },
          { name: "Amount", value: "€4,250.00", status: "success" },
          { name: "Invoice #", value: "INV-2025-0847", status: "success" },
          { name: "GL Account", value: "6110 — IT Services", status: "success" },
        ],
      },
      { status: "success", label: "Auto-Prepared", detail: "Confidence score: 94/100 — all checks passed.", score: 94, scoreLabel: "AUTO-PREPARED" },
      { status: "success", label: "Draft Ready", detail: "The invoice draft is created in the accounting system. AP Executive just needs to confirm." },
    ],
  },
  {
    id: "review",
    name: "Needs Review",
    emoji: "🟡",
    color: "#D97706",
    description: "Some fields are uncertain. AP Executive must review.",
    stopsAt: 6,
    destination: "assisted",
    destinationMessage: "DBC draft created with flagged fields. AP Executive reviews, corrects, and confirms.",
    stationResults: [
      { status: "success", label: "Email received", detail: "Invoice arrived with a valid PDF attachment." },
      { status: "success", label: "Valid PDF", detail: "The document is readable — no issues found." },
      {
        status: "warning", label: "Partially verified", detail: "Supplier is known, but the VAT number couldn't be fully verified through the EU system.",
        subChecks: [
          { icon: "vendor", status: "success", label: "Known supplier" },
          { icon: "vat", status: "warning", label: "VAT uncertain" },
          { icon: "duplicate", status: "success", label: "Not a duplicate" },
        ],
      },
      {
        status: "warning", label: "Some fields uncertain", detail: "Most data was extracted, but the entity and GL account need human confirmation.",
        fields: [
          { name: "Entity", value: "FBM Limited?", status: "warning" },
          { name: "Amount", value: "€1,890.00", status: "success" },
          { name: "Invoice #", value: "F-2025/312", status: "success" },
          { name: "GL Account", value: "Uncertain", status: "warning" },
        ],
      },
      { status: "warning", label: "Needs Review", detail: "Confidence score: 78/100 — some fields need human verification.", score: 78, scoreLabel: "NEEDS REVIEW" },
      { status: "warning", label: "Review Required", detail: "Draft created with highlighted fields. AP Executive reviews and corrects before posting." },
    ],
  },
  {
    id: "critical",
    name: "Critical Stop",
    emoji: "🔴",
    color: "#DC2626",
    description: "A problem detected. Invoice stops immediately.",
    stopsAt: 3,
    destination: "exception",
    destinationMessage: "Invoice stopped. AP Executive and Financial Manager notified immediately. Manual processing required.",
    stationResults: [
      { status: "success", label: "Email received", detail: "Invoice arrived with a valid PDF attachment." },
      { status: "success", label: "Valid PDF", detail: "The document is readable — no issues found." },
      {
        status: "error", label: "STOP — Duplicate found", detail: "This exact invoice was already paid last month. Processing halted immediately.",
        subChecks: [
          { icon: "vendor", status: "success", label: "Known supplier" },
          { icon: "vat", status: "pending", label: "Skipped" },
          { icon: "duplicate", status: "error", label: "DUPLICATE" },
        ],
      },
      { status: "skipped", label: "Skipped", detail: "" },
      { status: "skipped", label: "Skipped", detail: "" },
      { status: "error", label: "HOLD", detail: "Invoice stopped. Alerts sent to AP Executive and Financial Manager." },
    ],
  },
];
