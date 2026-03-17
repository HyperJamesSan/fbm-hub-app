// ═══════════════════════════════════════════════════════════════
// FBM AP Automation — n8n Workflow Data (P130 FMT)
// 15 Main Nodes + 4 Support Nodes = 19 Total | 31 Connections
// ═══════════════════════════════════════════════════════════════

export interface WorkflowNode {
  id: number;
  name: string;
  fullName: string;
  tool: string;
  nodeType: string;
  category: string;
  categoryColor: string;
  isSupport?: boolean;
  trigger: string;
  does: string;
  outputs: string;
  errors: string;
  code?: string;
  config?: string;
  connectionDesc: string;
  retryConfig?: string;
}

// ─── Workflow Metadata ──────────────────────────────────────
export const workflowMeta = {
  name: "FBM_AP_Automation_P130_FMT",
  version: "1.0.0-POC",
  environment: "TEST",
  timezone: "Europe/Malta (CET/CEST)",
  execution: "Event-driven (email trigger)",
  errorHandling: "Fail explicitly (continue on error = OFF)",
  retryGlobal: "No (per-node retry)",
  totalNodes: 19,
  mainNodes: 15,
  supportNodes: 4,
  connections: 31,
};

// ─── Credentials ────────────────────────────────────────────
export const credentials = [
  { key: "IMAP_FBM_AP", desc: "IMAP credentials — accounts.payable@fbm.mt" },
  { key: "DROPBOX_FBM", desc: "Dropbox Business OAuth2" },
  { key: "ANTHROPIC_CLAUDE", desc: "API Key Claude" },
  { key: "DBC_API", desc: "HTTP Header Auth — Bearer token DBC sandbox" },
  { key: "SMTP_FBM", desc: "SMTP M365 email send" },
  { key: "VIES_API", desc: "No auth — EU public API" },
];

// ─── Environment Variables ──────────────────────────────────
export const envVars: Record<string, string> = {
  ap_executive_email: "leslie.rojas@fbm.mt",
  financial_manager_email: "leonell.buena@fbm.mt",
  finance_ops_lead_email: "james.sanabria@fbm.mt",
  noc_soc_email: "miguel.tonolli@fbm.mt",
  dbc_company_id: "FBM_TEST",
  dbc_base_url: "https://dbc-sandbox.fbm.mt/api/v2.0",
  dropbox_base_path: "/AP_Automation/TEST",
  score_threshold_auto: "90",
  score_threshold_assisted: "70",
  max_pdf_size_mb: "10",
  vendor_creation_timeout_hours: "72",
  daily_digest_time: "17:00",
  daily_digest_timezone: "Europe/Malta",
  exception_alert_threshold: "3",
};

// ─── Category Colors ────────────────────────────────────────
export const categoryColors: Record<string, string> = {
  TRIGGER: "hsl(var(--fbm-gray-medium))",
  TRANSFORM: "hsl(var(--fbm-gray-dark))",
  STORAGE: "hsl(var(--ai))",
  VALIDATION: "hsl(var(--success))",
  "AI CORE": "hsl(var(--primary))",
  "DECISION ENGINE": "hsl(270 60% 50%)",
  EXCEPTION: "hsl(var(--warning))",
  "DBC INTEGRATION": "hsl(var(--ai))",
  NOTIFICATION: "hsl(var(--success))",
  "HUMAN GATE": "hsl(158 72% 36%)",
  AUDIT: "hsl(var(--fbm-gray-medium))",
  SUPPORT: "hsl(var(--fbm-gray-dark))",
};

// ─── Nodes ──────────────────────────────────────────────────
export const nodes: WorkflowNode[] = [
  {
    id: 1,
    name: "Email Trigger",
    fullName: "01 | Email Trigger — AP Inbox",
    tool: "n8n — IMAP Email Trigger",
    nodeType: "n8n-nodes-base.emailReadImap",
    category: "TRIGGER",
    categoryColor: categoryColors.TRIGGER,
    trigger: "New unread email arrives at accounts.payable@fbm.mt. IMAP polling every 60 seconds, filter: UNSEEN.",
    does: "• Connects to M365 via IMAP (outlook.office365.com:993, TLS)\n• Downloads all attachments (binary)\n• Post-processing: marks email as read\n• Emits 1 item per email — if 3 new emails → 3 parallel executions",
    outputs: "json.from.value[0].address → sender_email\njson.from.value[0].name → sender_name\njson.subject → subject\njson.date → received_at\njson.text → body_text\njson.html → body_html\njson.attachments[] → { filename, contentType, size, content (base64) }",
    errors: "All emails proceed to Node 02 for validation. No filtering at this stage.",
    config: "Credential: IMAP_FBM_AP\nHost: outlook.office365.com\nPort: 993 (TLS)\nMailbox: INBOX\nAction: Read emails\nPost-processing: Mark as read\nDownload Attachments: true\nFormat: RAW + Resolved\nPolling: 60s, Filter: UNSEEN",
    connectionDesc: "→ NODO 02 (always, all emails)",
  },
  {
    id: 2,
    name: "Attachment Validator",
    fullName: "02 | Attachment Validator & ID Generator",
    tool: "n8n — Code Node (JS)",
    nodeType: "n8n-nodes-base.code",
    category: "TRANSFORM",
    categoryColor: categoryColors.TRANSFORM,
    trigger: "Output from Node 01 — every new email.",
    does: "• Filters attachments: only PDFs (by contentType or .pdf extension)\n• No PDF → EXCEPTION: NO_PDF_ATTACHMENT\n• Per PDF: validates size (max 10MB = 10,485,760 bytes)\n• Validates magic bytes (%PDF header check)\n• Generates unique invoice_id: INV-YYYYMMDD-HHMMSS-{random4}\n• Extracts email metadata into clean fields",
    outputs: "invoice_id · sender_email · sender_name · subject · received_at\npdf_filename · file_size_kb · pdf_base64\npipeline_status (PROCESSING | EXCEPTION)\nroute_to_exception (boolean)",
    errors: "• NO_PDF_ATTACHMENT → Node 13\n• OVERSIZED_PDF (>10MB) → Node 13\n• INVALID_PDF (bad header) → Node 13",
    code: `const items = $input.all();
const results = [];
for (const item of items) {
  const attachments = item.json.attachments || [];
  const pdfAttachments = attachments.filter(att => 
    att.contentType === 'application/pdf' || 
    att.filename?.toLowerCase().endsWith('.pdf')
  );
  if (pdfAttachments.length === 0) {
    results.push({ json: { ...item.json,
      pipeline_status: 'EXCEPTION',
      exception_type: 'NO_PDF_ATTACHMENT',
      route_to_exception: true
    }});
    continue;
  }
  for (const pdf of pdfAttachments) {
    if (pdf.size > 10485760) { /* OVERSIZED */ continue; }
    const buffer = Buffer.from(pdf.content, 'base64');
    const header = buffer.slice(0, 4).toString('ascii');
    if (header !== '%PDF') { /* INVALID */ continue; }
    const now = new Date();
    const invoiceId = \`INV-\${now.toISOString().slice(0,10).replace(/-/g,'')}-\${now.toISOString().slice(11,19).replace(/:/g,'')}-\${Math.random().toString(36).substring(2,6).toUpperCase()}\`;
    results.push({ json: {
      sender_email: item.json.from?.value?.[0]?.address,
      invoice_id: invoiceId,
      pdf_filename: pdf.filename,
      pdf_base64: pdf.content,
      pipeline_status: 'PROCESSING',
      route_to_exception: false,
      processing_started_at: now.toISOString()
    }});
  }
}
return results;`,
    connectionDesc: "→ IF route_to_exception = true → Node 13\n→ IF false → Node 03 + Node 04 (parallel)",
  },
  {
    id: 3,
    name: "DRB Storage",
    fullName: "03 | DRB — Save Original PDF",
    tool: "n8n — HTTP Request (Dropbox API)",
    nodeType: "n8n-nodes-base.httpRequest",
    category: "STORAGE",
    categoryColor: categoryColors.STORAGE,
    trigger: "Runs in PARALLEL with Node 04, after Node 02 (valid PDF).",
    does: "• Saves original untouched PDF to Dropbox\n• Path: /AP_Automation/TEST/Inbox/{YYYY-MM}/{invoice_id}_ORIGINAL.pdf\n• Immutable archive — never overwritten\n• Pre-processing: converts base64 → binary for upload\n• Records DRB path + file ID in output",
    outputs: "drb_original_path · drb_file_id · drb_file_size · drb_storage_confirmed (boolean) · drb_saved_at",
    errors: "• Dropbox unavailable → retry 3× (30s delay each)\n• After 3 retries: CRITICAL — STORAGE_FAILED\n• Alert NOC SOC Specialist immediately\n• STOP execution (cannot proceed without confirmed storage)",
    config: "Method: POST\nURL: https://content.dropboxapi.com/2/files/upload\nCredential: DROPBOX_FBM (OAuth2)\nHeaders:\n  Content-Type: application/octet-stream\n  Dropbox-API-Arg: { path, mode: add, autorename: false }",
    retryConfig: "Retries: 3 | Wait: 30,000ms",
    connectionDesc: "→ Node 16 (Merge — waits for Node 04)\n→ On error (3 retries exhausted) → Node 13 + alert NOC SOC",
  },
  {
    id: 4,
    name: "PDF Text Extractor",
    fullName: "04 | PDF Text Extractor",
    tool: "n8n — Code Node (pdf-parse)",
    nodeType: "n8n-nodes-base.code",
    category: "TRANSFORM",
    categoryColor: categoryColors.TRANSFORM,
    trigger: "Runs in PARALLEL with Node 03, after Node 02 (valid PDF).",
    does: "• Extracts all text content from PDF using pdf-parse\n• Calculates quality score based on char density per page\n• Detects if scanned (< 50 chars/page)\n• Detects language (en/es/pt/de) by keyword matching\n• Low quality or scanned → exception route",
    outputs: "extracted_text · page_count · detected_language · is_scanned (boolean)\nextraction_quality_score (0–100) · pdf_info",
    errors: "• SCANNED_PDF (no extractable text) → Node 13\n• LOW_QUALITY_PDF (quality < 40) → Node 13\n• Parse error → exception with error message",
    code: `const pdfParse = require('pdf-parse');
const buffer = Buffer.from($json.pdf_base64, 'base64');
const data = await pdfParse(buffer);

const charCount = data.text.replace(/\\s/g, '').length;
const charsPerPage = charCount / data.numpages;
const qualityScore = Math.min(100, Math.round(charsPerPage / 5));
const isScanned = charsPerPage < 50;

// Language detection by keywords
let language = 'en';
const text = data.text.toLowerCase();
if (text.includes('factura')) language = 'es';
if (text.includes('rechnung')) language = 'de';

return [{ json: {
  ...$input.first().json,
  extracted_text: data.text,
  page_count: data.numpages,
  detected_language: language,
  is_scanned: isScanned,
  extraction_quality_score: qualityScore
}}];`,
    connectionDesc: "→ Node 16 (Merge — waits for Node 03)\n→ If scanned or quality < 40 → Node 13",
  },
  {
    id: 16,
    name: "Merge",
    fullName: "16 | Merge — Storage + Extraction",
    tool: "n8n — Merge Node",
    nodeType: "n8n-nodes-base.merge",
    category: "SUPPORT",
    categoryColor: categoryColors.SUPPORT,
    isSupport: true,
    trigger: "Waits for BOTH Node 03 and Node 04 to complete.",
    does: "• Mode: Merge by Position\n• Combines output from storage (Node 03) and extraction (Node 04)\n• Merges: drb_path + drb_file_id + extracted_text + quality metrics\n• Waits for both inputs before proceeding\n• Single output item with all combined data",
    outputs: "All fields from Node 03 (drb_*) + all fields from Node 04 (extracted_*, page_count, etc.)",
    errors: "If either input fails, merge does not execute — error routes handle upstream.",
    connectionDesc: "→ Node 05 (Deterministic Validation)",
  },
  {
    id: 5,
    name: "Stage 1: Validation",
    fullName: "05 | Stage 1 — Deterministic Validation",
    tool: "n8n — Code + DBC API + VIES API",
    nodeType: "n8n-nodes-base.code",
    category: "VALIDATION",
    categoryColor: categoryColors.VALIDATION,
    trigger: "Output from Node 16 (merged storage + extraction data).",
    does: "5 sequential checks against DBC and VIES:\n\n① DUPLICATE DETECTION — Regex extracts invoice number from text, queries DBC purchaseInvoices. Duplicate = CRITICAL STOP.\n\n② VENDOR IDENTIFICATION — Extracts VAT number (regex: MT, EU formats), queries DBC vendors by taxRegistrationNumber. Fallback: search by company name.\n\n③ VIES VAT VALIDATION — For EU VAT numbers, calls VIES REST API. Invalid = flag (non-critical).\n\n④ OPEN PO MATCH — Extracts PO reference, queries DBC purchaseOrders.\n\n⑤ VENDOR BLOCK CHECK — Queries vendor status in DBC. Blocked = CRITICAL STOP.",
    outputs: "stage1_passed · stage1_critical_error · stage1_critical_error_type\nstage1_flags[] · stage1_checks (detailed per-check results)\nvendor_id · vendor_name · vendor_currency\nnew_vendor_required · po_id · po_amount\nroute_to_new_vendor · route_to_exception",
    errors: "• DUPLICATE_INVOICE → CRITICAL → Node 13\n• VENDOR_BLOCKED → CRITICAL → Node 13\n• DBC_UNAVAILABLE → retry 2× → Node 13\n• VIES unavailable → log warning, continue (non-critical)\n• Vendor not found → flag NEW_VENDOR_REQUIRED → Node 08",
    code: `// CHECK 1 — DUPLICATE DETECTION
const invoicePatterns = [
  /invoice\\s*(?:no|number|#)?:?\\s*([A-Z0-9\\-\\/]+)/i,
  /factura\\s*(?:no|número)?:?\\s*([A-Z0-9\\-\\/]+)/i
];
// → Query DBC: purchaseInvoices?$filter=vendorInvoiceNumber eq '{no}'

// CHECK 2 — VENDOR IDENTIFICATION
const vatPatterns = [/\\b(MT\\d{8})\\b/i, /\\b([A-Z]{2}\\d{8,12})\\b/];
// → Query DBC: vendors?$filter=taxRegistrationNumber eq '{vat}'
// Fallback: search by displayName

// CHECK 3 — VIES VAT VALIDATION
// GET https://ec.europa.eu/taxation_customs/vies/rest-api/ms/{CC}/vat/{num}

// CHECK 4 — OPEN PO MATCH
// → Query DBC: purchaseOrders?$filter=number eq '{po}'

// CHECK 5 — VENDOR BLOCK CHECK
// → Query DBC: vendors({vendorId}) → check blocked field`,
    connectionDesc: "→ Switch:\n  • route_to_exception = true → Node 13\n  • route_to_new_vendor = true → Node 08\n  • Otherwise → Node 06",
  },
  {
    id: 6,
    name: "Claude API Intelligence",
    fullName: "06 | Claude API — Invoice Intelligence",
    tool: "Anthropic Claude API (claude-sonnet-4-6)",
    nodeType: "n8n-nodes-base.httpRequest",
    category: "AI CORE",
    categoryColor: categoryColors["AI CORE"],
    trigger: "Output from Node 05 — Stage 1 complete, no critical errors.",
    does: "Sends extracted text to Claude with structured prompt:\n• Identify recipient entity (7 Malta entities: BUHAY, FBM, NTT, D2R, FBM Digital, DRAKO, LuckySix)\n• Extract: invoice number, dates, currency, amounts, line items\n• Analyze VAT treatment (standard/reverse_charge/exempt/zero_rated)\n• Suggest GL account code with reasoning\n• Suggest budget dimensions\n• Flag anomalies with severity (low/medium/high)\n• Return overall confidence 0–100\n\nPost-processing: Parse JSON response, handle markdown cleanup.",
    outputs: "claude_output: { recipient_entity, invoice_data, vendor_data, line_items[], vat_analysis, suggested_gl, suggested_dimensions, anomalies[], overall_confidence }\nclaude_model · claude_input_tokens · claude_output_tokens",
    errors: "• API timeout (>30s) → retry once (5s wait)\n• 5xx error → retry once\n• Invalid JSON response → AI_EXTRACTION_FAILED → Node 13",
    config: "Method: POST\nURL: https://api.anthropic.com/v1/messages\nModel: claude-sonnet-4-6\nmax_tokens: 2000\nSystem: AP document processor for FBM Limited Malta\nResponse: Strict JSON schema (no markdown)\nTimeout: 30,000ms",
    retryConfig: "Retries: 1 | Wait: 5,000ms | On: timeout or 5xx",
    connectionDesc: "→ If parse error → Node 13\n→ Success → Node 07",
  },
  {
    id: 7,
    name: "Confidence Scoring",
    fullName: "07 | Confidence Scoring & Routing Decision",
    tool: "n8n — Code Node (JS)",
    nodeType: "n8n-nodes-base.code",
    category: "DECISION ENGINE",
    categoryColor: categoryColors["DECISION ENGINE"],
    trigger: "Output from Node 06 — Claude JSON response parsed successfully.",
    does: "Calculates weighted composite confidence score from 8 layers:\n\n• Layer 1 — PDF Quality: 5%\n• Layer 2 — Duplicate Check: 15%\n• Layer 3 — Vendor Match: 20%\n• Layer 4 — VIES Validation: 10%\n• Layer 5 — PO Match: 10%\n• Layer 6 — Entity ID (Claude): 20%\n• Layer 7 — VAT Treatment: 10%\n• Layer 8 — GL Suggestion: 10%\n\nRouting thresholds:\n≥ 90 → AUTO_PREPARED\n70–89 → ASSISTED\n< 70 or high anomaly → ESCALATED\nCritical error → BLOCKED",
    outputs: "composite_score · score_breakdown (per layer)\nrouting_decision: AUTO_PREPARED | ASSISTED | ESCALATED | BLOCKED\nrouting_reasons[] · fields_to_review[]\nanomaly_count · has_high_anomaly · has_medium_anomaly",
    errors: "• Any CRITICAL ERROR → BLOCKED (bypasses scoring)\n• High severity anomaly → forces ESCALATED regardless of score",
    code: `const WEIGHTS = {
  layer1_pdf_quality: 0.05,
  layer2_duplicate: 0.15,
  layer3_vendor: 0.20,
  layer4_vies: 0.10,
  layer5_po: 0.10,
  layer6_entity: 0.20,
  layer7_vat: 0.10,
  layer8_gl: 0.10
};

// Score each layer 0-100, then weighted sum
let compositeScore = Math.round(
  Object.keys(WEIGHTS).reduce((sum, key, i) => 
    sum + (scores[\`layer\${i+1}\`] || 0) * WEIGHTS[key], 0)
);

// Routing decision
if (critical_error) return 'BLOCKED';
if (compositeScore < 70 || hasHighAnomaly) return 'ESCALATED';
if (compositeScore < 90 || hasMediumAnomaly) return 'ASSISTED';
return 'AUTO_PREPARED';`,
    connectionDesc: "→ BLOCKED → Node 13\n→ ESCALATED → Node 10 (notify, no DBC draft)\n→ ASSISTED → Node 09 (draft with flagged fields)\n→ AUTO_PREPARED → Node 09 (clean draft)",
  },
  {
    id: 8,
    name: "New Vendor Handler",
    fullName: "08 | New Vendor — Email & Wait",
    tool: "n8n — Email Send + Wait Node",
    nodeType: "n8n-nodes-base.emailSend + wait",
    category: "EXCEPTION",
    categoryColor: categoryColors.EXCEPTION,
    trigger: "Node 05 output where new_vendor_required = true.",
    does: "• Sends structured email to AP Executive (leslie.rojas@fbm.mt)\n• Contains: vendor name, VAT, invoice amount, PDF link in DRB\n• Subject: ⚠️ New Vendor — Action Required — {invoice_id}\n• Puts workflow into WAIT state\n• Listens for email reply containing 'VENDOR CREATED — [DBC Vendor ID]'\n• On reply: extracts vendor_id, resumes from Node 05 CHECK 2\n• Timeout: 72 hours → route to Node 13 (VENDOR_CREATION_TIMEOUT)",
    outputs: "vendor_creation_requested_at · vendor_creation_email_sent\nresume_trigger (email reply with vendor_id)",
    errors: "• No response after 72h → VENDOR_CREATION_TIMEOUT → Node 13\n• Unrecognized reply → re-send instructions and wait again",
    connectionDesc: "→ When vendor_id received → Node 05 (retry from check 2)\n→ Timeout 72h → Node 13",
  },
  {
    id: 9,
    name: "DBC Draft Creator",
    fullName: "09 | DBC — Create Purchase Invoice Draft",
    tool: "n8n — HTTP Request → DBC API",
    nodeType: "n8n-nodes-base.httpRequest",
    category: "DBC INTEGRATION",
    categoryColor: categoryColors["DBC INTEGRATION"],
    trigger: "Output from Node 07 — routing is AUTO_PREPARED or ASSISTED.",
    does: "• Pre-step: resolves GL Account ID in DBC by account code\n• Creates Purchase Invoice Draft via DBC API (POST)\n• Populates: vendorId, invoiceNumber, dates, currency, purchaseLines[]\n• Each line: GL account, description, quantity, unit cost, budget dimensions\n• For ASSISTED: marks low-confidence fields for review\n• Does NOT post — creates draft only\n• Tags draft with invoice_id + composite_score for traceability",
    outputs: "dbc_draft_id · dbc_draft_number · draft_created_at\nfields_flagged_for_review[] (for ASSISTED routing)",
    errors: "• DBC validation error → capture error, include in AP notification\n• DBC unavailable → retry 2× → DBC_DRAFT_FAILED → Node 13",
    config: "Method: POST\nURL: {DBC_BASE}/companies({DBC_COMPANY})/purchaseInvoices\nAuth: Bearer {DBC_TOKEN}\nPre-step: GET /accounts?$filter=number eq '{gl_code}' → resolve GL ID",
    connectionDesc: "→ Node 10 (Notification)\n→ On DBC error → Node 13",
  },
  {
    id: 10,
    name: "AP Notification",
    fullName: "10 | Notify AP Executive",
    tool: "n8n — Code + Email Send (M365)",
    nodeType: "n8n-nodes-base.emailSend",
    category: "NOTIFICATION",
    categoryColor: categoryColors.NOTIFICATION,
    trigger: "Output from Node 09 (draft created) or Node 07 (ESCALATED — no draft).",
    does: "Builds dynamic email per routing decision:\n\n✅ AUTO_PREPARED (≥90): 'Ready for Posting' — full invoice details, score, DBC draft link, DRB PDF link. Reply CONFIRM or REJECT.\n\n⚠️ ASSISTED (70–89): 'Review Required' — flagged fields highlighted, DBC draft link. Reply CONFIRM after corrections.\n\n🔴 ESCALATED (<70): 'Manual Processing Required' — escalation reasons, no DBC draft. CC: Financial Manager. Reply MANUAL_DONE when complete.",
    outputs: "notification_sent_at · email_subject · email_body_html · recipient_email",
    errors: "• Email send failure → retry once → log to audit",
    connectionDesc: "→ Node 11 (Wait for human action)",
  },
  {
    id: 11,
    name: "Human Gate",
    fullName: "11 | Human Gate — Wait for AP Executive",
    tool: "n8n — Wait (Webhook/Email Reply)",
    nodeType: "n8n-nodes-base.wait",
    category: "HUMAN GATE",
    categoryColor: categoryColors["HUMAN GATE"],
    trigger: "AP Executive receives notification email from Node 10.",
    does: "• Waits indefinitely for AP Executive response\n• Monitors for email replies matching invoice_id\n• Parses response:\n  — 'CONFIRM — {invoice_id}' → CONFIRMED\n  — 'REJECT — {invoice_id} — [reason]' → REJECTED\n  — 'MANUAL_DONE — {invoice_id}' → MANUAL_COMPLETE\n• Records: action, timestamp, who, rejection reason\n• UNKNOWN reply → re-send instructions",
    outputs: "human_action: CONFIRMED | REJECTED | MANUAL_COMPLETE\naction_taken_at · action_taken_by · rejection_reason\ncorrections_made[]",
    errors: "• REJECTED → Node 13 (with rejection reason)\n• UNKNOWN reply → re-send instructions, wait again",
    connectionDesc: "→ CONFIRMED → Node 12\n→ MANUAL_COMPLETE → Node 14\n→ REJECTED → Node 13\n→ UNKNOWN → re-send instructions",
  },
  {
    id: 12,
    name: "DBC Posting",
    fullName: "12 | DBC — Post Invoice",
    tool: "n8n — HTTP Request → DBC API",
    nodeType: "n8n-nodes-base.httpRequest",
    category: "DBC INTEGRATION",
    categoryColor: categoryColors["DBC INTEGRATION"],
    trigger: "Output from Node 11 — human_action is CONFIRMED.",
    does: "3-step process:\n\n① PATCH corrections (if any) — update DBC draft with corrected values\n\n② POST invoice — calls DBC action endpoint to convert Draft → Posted:\nPOST /purchaseInvoices({dbc_draft_id})/Microsoft.NAV.post\n\n③ RENAME PDF in Dropbox — move from Inbox to Posted folder:\n/AP_Automation/TEST/Posted/{invoice_number}_INVOICE_{VENDOR_NAME}.pdf",
    outputs: "dbc_posted_entry_id · posted_at · final_drb_filename · posting_confirmed",
    errors: "• DBC rejects posting → capture error, notify AP Executive\n• DBC unavailable → retry 2× → alert Financial Manager\n• Dropbox rename fails → log warning, continue (non-blocking)",
    config: "Step 1 — PATCH: /purchaseInvoices({id}) with corrections\nStep 2 — POST: /purchaseInvoices({id})/Microsoft.NAV.post\nStep 3 — Dropbox: /2/files/move_v2 (rename to final)",
    connectionDesc: "→ Node 14 (Audit Logger)\n→ Node 15 (Completion Notifier)\n→ On DBC error → Node 13",
  },
  {
    id: 13,
    name: "Exception Handler",
    fullName: "13 | Exception Handler",
    tool: "n8n — Code + Email Send",
    nodeType: "n8n-nodes-base.code + emailSend",
    category: "EXCEPTION",
    categoryColor: categoryColors.EXCEPTION,
    trigger: "Any CRITICAL ERROR or failure from any node in the pipeline.",
    does: "• Receives exception with: invoice_id, exception_type, detail, originating_stage\n• Determines severity: CRITICAL vs WARNING\n  — CRITICAL types: DUPLICATE_INVOICE, VENDOR_BLOCKED, STORAGE_FAILED\n• CRITICAL: notifies AP Executive + Financial Manager + NOC SOC\n• WARNING: notifies AP Executive only\n• Logs full exception record to audit\n• Saves exception JSON to DRB: /Exceptions/{YYYY-MM}/{invoice_id}_EXCEPTION.json\n\n10 exception types:\nNO_PDF_ATTACHMENT · OVERSIZED_PDF · INVALID_PDF · SCANNED_PDF · DUPLICATE_INVOICE · VENDOR_BLOCKED · DBC_UNAVAILABLE · AI_EXTRACTION_FAILED · HUMAN_REJECTED · STORAGE_FAILED",
    outputs: "exception_logged_at · exception_type · is_critical\nnotification_sent_to[] · manual_processing_required (always true)",
    errors: "Final catch-all handler — all exceptions logged here.",
    connectionDesc: "→ Node 14 (Audit Logger)",
  },
  {
    id: 14,
    name: "Audit Logger",
    fullName: "14 | Audit Logger",
    tool: "n8n — Code + Dropbox HTTP",
    nodeType: "n8n-nodes-base.code + httpRequest",
    category: "AUDIT",
    categoryColor: categoryColors.AUDIT,
    trigger: "Called from Node 12 (posted), Node 13 (exception), Node 11 (MANUAL_COMPLETE).",
    does: "Builds comprehensive audit JSON record:\n• Identifiers: invoice_id, workflow_execution_id\n• Email: received_at, sender, subject\n• Storage: drb_paths, file_id\n• Extraction: filename, pages, language, quality\n• Stage 1: 5 check results (pass/fail each)\n• Stage 2: Claude model, tokens, full extraction output\n• Stage 3: composite score, 8-layer breakdown, routing\n• DBC: draft_id, posted_entry_id\n• Human: action, corrections, rejection reason\n• Exceptions: full record if any\n• Final status: POSTED | MANUAL_PROCESSING | EXCEPTION\n• Timing: total_processing_time_ms\n\nSaves to: /AP_Automation/TEST/AuditLogs/{YYYY-MM}/{invoice_id}_AUDIT.json",
    outputs: "audit_record_complete · audit_drb_path · final_status\ntotal_processing_time_ms",
    errors: "• Dropbox unavailable → buffer locally, retry on next event",
    connectionDesc: "→ Node 15 (Completion Notifier)",
  },
  {
    id: 15,
    name: "Daily Digest",
    fullName: "15 | Daily Digest — Financial Manager",
    tool: "n8n — Schedule + Dropbox + Email",
    nodeType: "n8n-nodes-base.scheduleTrigger + httpRequest + emailSend",
    category: "NOTIFICATION",
    categoryColor: categoryColors.NOTIFICATION,
    trigger: "Scheduled: Mon–Fri 17:00 (Europe/Malta). Also triggered from Node 14 completion.",
    does: "• Reads all _AUDIT.json files from today's DRB folder\n• Calculates daily metrics:\n  — total_processed, auto_prepared, assisted, escalated, posted\n  — exceptions, pending_review\n  — avg_score, avg_processing_time\n• Sends HTML summary to Financial Manager + Finance Ops Lead\n• IMMEDIATE ALERT: if exceptions_today > 3 → alert Financial Manager instantly\n\nTo: leonell.buena@fbm.mt, james.sanabria@fbm.mt",
    outputs: "daily_summary_sent_at · invoices_processed_count\nbreakdown_by_routing · pending_review_count · unresolved_exceptions_count",
    errors: "• Email delivery failure → retry once → log to audit",
    connectionDesc: "End of pipeline.",
  },
];

// ─── Node Positions (x, y in SVG units) ─────────────────────
// Layout: Row 0 = main flow top, Row 1 = parallel/branch, Row 2 = post-decision
export const nodePositions: Record<number, { x: number; y: number }> = {
  1:  { x: 0, y: 140 },
  2:  { x: 170, y: 140 },
  3:  { x: 340, y: 50 },    // parallel top
  4:  { x: 340, y: 230 },   // parallel bottom
  16: { x: 510, y: 140 },   // merge
  5:  { x: 680, y: 140 },
  6:  { x: 850, y: 140 },
  7:  { x: 1020, y: 140 },
  8:  { x: 750, y: 330 },   // new vendor branch
  9:  { x: 0, y: 430 },
  10: { x: 170, y: 430 },
  11: { x: 340, y: 430 },
  12: { x: 510, y: 430 },
  13: { x: 680, y: 430 },
  14: { x: 850, y: 430 },
  15: { x: 1020, y: 430 },
};

// ─── Connections ─────────────────────────────────────────────
// Happy path (solid lines)
export const happyPathConnections: [number, number][] = [
  [1, 2],
  [2, 3], [2, 4],       // parallel split
  [3, 16], [4, 16],     // merge
  [16, 5],
  [5, 6], [6, 7],
  [7, 9],                // row transition
  [9, 10], [10, 11], [11, 12],
  [12, 14], [14, 15],
  [13, 14],              // exception → audit
];

// Exception connections (dashed amber lines)
export const exceptionConnections: [number, number][] = [
  [2, 13], [3, 13], [4, 13], [5, 13],
  [6, 13], [7, 13], [9, 13], [11, 13], [12, 13],
];

// Special connections (labeled)
export const specialConnections: { from: number; to: number; color: string; label: string; dashed?: boolean }[] = [
  { from: 5, to: 8, color: "hsl(var(--warning))", label: "New Vendor", dashed: true },
  { from: 8, to: 5, color: "hsl(var(--ai))", label: "Resume", dashed: true },
  { from: 7, to: 10, color: "hsl(var(--primary))", label: "Escalated", dashed: true },
];
