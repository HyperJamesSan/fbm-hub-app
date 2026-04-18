// Single source of truth for program data — derived from Notion.

export const program = {
  name: "Hyperautomation Finance — FBM Malta",
  code: "P1.30 FMT",
  group: "BUHAY Group",
  owner: "James Sanabria · Finance Operations Lead",
  status: "M1 · UAT PASS · Awaiting DBC Sandbox",
  goLiveTarget: "Q2 2026",
};

export const uat = {
  date: "16 Apr 2026",
  corpusTotal: 649,
  validProcessed: 355,
  invoicesClassified: 222,
  accuracy: 100, // %
  maxConfidence: 0.98,
  threshold: 0.9,
  bugsOpen: 0,
  acceptanceCriteria: "6 / 6",
  manualReviewRate: 0,
  timePerInvoiceMin: 0.5,
  manualTimeMin: "12–17",
  manualVolumeMonth: "100–125",
  manualHoursMonth: "20–35",
  prompt: "PROMPT_AP_ClassifyEntity_v1.4",
  model: "claude-sonnet-4-20250514",
};

export const stack = [
  { name: "n8n", role: "Workflow orchestration", host: "Azure VM (Standard_D2s_v3)", status: "Operational" },
  { name: "Cloudflare Tunnel", role: "Secure ingress", host: "test.hyperjamessan.uk", status: "Operational" },
  { name: "Claude API", role: "AI classification", host: "Anthropic (claude-sonnet-4)", status: "Operational" },
  { name: "Microsoft 365", role: "Email trigger", host: "accounts.payable@fbm.mt", status: "Operational" },
  { name: "Dropbox Business", role: "Document storage", host: "/AP/[ENV]/[Entity]/[YYYY]/[MM]/", status: "Operational" },
  { name: "Doppler", role: "Secrets vault", host: "AutomationsFBM / fbm-automation", status: "Operational" },
  { name: "Notion", role: "Audit trail + Control Tower", host: "FBM workspace", status: "Operational" },
  { name: "Business Central", role: "ERP — Purchase Invoice Drafts", host: "Microsoft Dynamics", status: "Credentials received Apr 16 — integration in build" },
];

export const entities = [
  { code: "BHL", name: "BUHAY HOLDING LIMITED", type: "Holding" },
  { code: "FBM", name: "FBM LIMITED", type: "Operations" },
  { code: "NMT", name: "NTT LIMITED", type: "Operations" },
  { code: "DMT", name: "D2R LIMITED", type: "Operations" },
  { code: "FDS", name: "FBM DIGITAL SYSTEMS LIMITED", type: "Operations" },
  { code: "DRA", name: "DRAKO LIMITED", type: "Operations" },
  { code: "LUC", name: "LUCKYSIX LIMITED", type: "Operations" },
  { code: "EPS", name: "EPSILON TORO ENTERTAINMENT", type: "Added during UAT", highlight: true },
];

export const pipelineNodes = [
  { id: "TRIGGER_M365_APMailbox", desc: "Polls accounts.payable@fbm.mt every 5 min" },
  { id: "FILTER_AttachmentIsPDF", desc: "Pass only emails with a PDF attachment" },
  { id: "TRANSFORM_ExtractBase64", desc: "Extract PDF as base64 + email metadata" },
  { id: "VALIDATE_TextExtractable", desc: "If blank → ManualReview (ERR_IMAGE_ONLY_PDF)" },
  { id: "TRANSFORM_BuildPrompt", desc: "Inject entity list + supplier mappings into prompt v1.4" },
  { id: "AI_ClaudeClassifyEntity", desc: "POST to Claude API · returns JSON classification" },
  { id: "TRANSFORM_ValidateAPIResponse", desc: "Parse JSON, guard against hallucinated entities" },
  { id: "FILTER_ConfidenceThreshold", desc: "Score ≥ 0.90 → auto-route · < 0.90 → manual" },
  { id: "DRB_UploadInvoice", desc: "Upload to /AP/[ENV]/[Entity]/[YYYY]/[MM]/" },
  { id: "DBC_CreatePurchaseDraft", desc: "POST draft to BC OData API (pending sandbox)" },
  { id: "NOTIFY_APExecutive_AutoRoute", desc: "Confirm routing + metadata via Teams/email" },
  { id: "LOG_AuditNotion", desc: "POST event to Notion Audit Trail — runs on ALL branches" },
];

export const environments = [
  {
    name: "TEST · Azure VM",
    url: "https://test.hyperjamessan.uk",
    mailbox: "automations@fbm.mt",
    vault: "Doppler · AutomationsFBM",
    tunnel: "fbm-n8n-test",
    status: "Operational",
  },
  {
    name: "PROD · Master",
    url: "https://hyperjamessan.uk",
    mailbox: "accounts.payable@fbm.mt",
    vault: "Doppler · HyperJamesSan",
    tunnel: "fbm-n8n",
    status: "Awaiting DBC integration",
  },
];

export const modules = [
  { id: "M1", name: "AP Invoice Classification & Routing", code: "P1.30", status: "active", label: "UAT PASS" },
  { id: "M2", name: "Revenue Invoicing — Mexico + Online", code: "P5.20 / P5.40", status: "backlog", label: "Backlog" },
  { id: "M3", name: "Collections / AR Chase Automation", code: "P6.30", status: "backlog", label: "Backlog" },
  { id: "M4", name: "VAT Return Automation", code: "P7.30", status: "backlog", label: "Backlog" },
  { id: "M5", name: "Daily Cash Reconciliation", code: "P6.20", status: "backlog", label: "Backlog" },
];

export const decisions = [
  {
    n: 1,
    title: "DBC Integration — Confirm Company IDs & permissions scope",
    detail: "Confirm Company IDs for the 8 entities and validate permissions scope. ✅ Credentials received Apr 16.",
    owner: "BC / Dynamics Contact",
  },
  {
    n: 2,
    title: "Test Company ID confirmation",
    detail: "Which Company ID will be used for the Sandbox so we can wire DBC_CreatePurchaseDraft.",
    owner: "BC / Dynamics Contact",
  },
  {
    n: 3,
    title: "Vendor lookup strategy",
    detail: "Match suppliers in Business Central by VAT number or by name? Defines the contract for the integration.",
    owner: "BC / Dynamics Contact",
  },
  {
    n: 4,
    title: "Confirm Q2 2026 go-live target",
    detail: "Sign-off on the timeline: Sandbox → 2w integration → 1w Shadow Mode → Auto-route in PROD.",
    owner: "CFO",
  },
];

export const acceptanceCriteria = [
  { id: "AC-1", text: "Classification accuracy ≥ 90%", status: "100% (222/222)" },
  { id: "AC-2", text: "False positive rate = 0%", status: "0%" },
  { id: "AC-3", text: "Processing time < 30 sec end-to-end", status: "< 30 sec" },
  { id: "AC-4", text: "All events logged to Notion Audit Trail", status: "Verified" },
  { id: "AC-5", text: "DBC draft format validated", status: "Pending Sandbox" },
  { id: "AC-6", text: "All error paths tested & recoverable", status: "Verified" },
];
