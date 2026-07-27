/**
 * Hello You Wellness — Order Tracker
 * =====================================================================
 * Google Apps Script backing a med-spa restock/order tracker.
 *
 * What it does:
 *   1. Creates a Google Form + linked Sheet ("Order Log")
 *   2. Auto-fills Status="Pending", Source="Form" on new form submissions
 *   3. Every morning at 8am ET: checks for orders past their expected
 *      arrival date, highlights the row red, and emails a reminder
 *   4. Every Monday at 8am ET: emails a summary of all pending orders
 *      sorted by age
 *   5. Exposes a doPost() endpoint so the Hello You website can add
 *      orders directly (mom submits a form on /admin/orders → posts here)
 *
 * ONE-TIME SETUP (~5 min):
 *   1. Go to https://script.google.com/ → New project
 *   2. Delete the empty myFunction stub, paste this entire file
 *   3. Edit the CONFIG below — set recipientEmail and change webhookSecret
 *      to a long random string (~40 chars). Save (Ctrl+S).
 *   4. Click Run → select the setup function → click Run
 *      Google will ask for permissions. Click "Review permissions" → your
 *      account → Advanced → "Go to (unsafe)" → Allow. This is normal for
 *      personal Apps Scripts and is safe because the code only touches
 *      YOUR Sheets/Forms.
 *   5. Check the Executions log — it prints the Form URL and Sheet URL
 *      when setup finishes. Save those.
 *   6. (Optional, only needed if the Hello You website will post orders
 *      here): Deploy → New deployment → gear icon → Web app → Execute as:
 *      Me, Who has access: Anyone → Deploy. Copy the Web app URL.
 *      Add to Vercel env:
 *        GOOGLE_ORDERS_WEBHOOK_URL=<that URL>
 *        GOOGLE_ORDERS_WEBHOOK_SECRET=<same secret as CONFIG.webhookSecret>
 *      Redeploy the website.
 *
 * HOW MOM USES IT:
 *   • To log an order: fill in the Form (bookmark the Form URL), OR go to
 *     hellyou.com/admin/orders after signing in (same data goes to the Sheet)
 *   • To mark received: open the Sheet, change Status dropdown to "Received"
 *   • She'll get automatic emails when things are overdue and every Monday
 * =====================================================================
 */

const CONFIG = {
  // Where reminder + summary emails are sent. Change this before running setup().
  recipientEmail: "dinomitedome@gmail.com",

  // Shared secret between this script and the Hello You website.
  // CHANGE THIS to a long random string (40+ chars) before running setup().
  // Then paste the same value into Vercel env var GOOGLE_ORDERS_WEBHOOK_SECRET.
  webhookSecret: "CHANGE-ME-TO-A-LONG-RANDOM-STRING-BEFORE-DEPLOYING",

  // Naming — usually you don't need to change these.
  spreadsheetName: "Hello You Wellness — Order Tracker",
  sheetName: "Order Log",
  formTitle: "Hello You Wellness — Log an Order",
  formDescription:
    "Log a new order or restock request. You'll get automatic reminders if it's late, plus a weekly Monday summary.",

  // Timing (24-hour clock, script's timezone — set in Project Settings if not America/New_York)
  dailyReminderHour: 8,
  weeklySummaryHour: 8,
};

const HEADERS = [
  "Timestamp",
  "Product/Service",
  "Date Ordered",
  "Expected Arrival",
  "Cost",
  "Notes",
  "Status",
  "Source",
];

const STATUS_OPTIONS = ["Pending", "Received", "Cancelled"];

const OVERDUE_HIGHLIGHT = "#fdecea";
const HEADER_BG = "#212020";
const HEADER_FG = "#ffffff";

// =====================================================================
// SETUP — run this ONCE from the Apps Script editor
// =====================================================================
function setup() {
  const existingId = PropertiesService.getScriptProperties().getProperty("spreadsheetId");
  if (existingId) {
    Logger.log(
      "Setup has already run. Spreadsheet ID: " + existingId +
      "\nIf you want to start over, delete the script property 'spreadsheetId' in Project Settings → Script properties, then re-run setup.",
    );
    return;
  }

  // 1. Create the spreadsheet + rename the default sheet
  const ss = SpreadsheetApp.create(CONFIG.spreadsheetName);
  const sheet = ss.getActiveSheet();
  sheet.setName(CONFIG.sheetName);

  // 2. Headers
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG);
  sheet.setFrozenRows(1);

  // 3. Column widths + formats
  sheet.setColumnWidth(1, 160); // Timestamp
  sheet.setColumnWidth(2, 260); // Product/Service
  sheet.setColumnWidth(3, 120); // Date Ordered
  sheet.setColumnWidth(4, 140); // Expected Arrival
  sheet.setColumnWidth(5, 100); // Cost
  sheet.setColumnWidth(6, 320); // Notes
  sheet.setColumnWidth(7, 130); // Status
  sheet.setColumnWidth(8, 90);  // Source

  // Date formatting for cols 3 + 4
  sheet.getRange("C:C").setNumberFormat("yyyy-mm-dd");
  sheet.getRange("D:D").setNumberFormat("yyyy-mm-dd");

  // 4. Status dropdown validation on column G (rows 2..1000)
  const statusRange = sheet.getRange(2, 7, 999, 1);
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS_OPTIONS, true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);

  // 5. Create the Form
  const form = FormApp.create(CONFIG.formTitle);
  form
    .setDescription(CONFIG.formDescription)
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setShowLinkToRespondAgain(true)
    .setConfirmationMessage(
      "Order logged. You'll get a reminder if it's late, plus a weekly Monday summary.",
    );

  form.addTextItem().setTitle("Product/Service Name").setRequired(true);
  form.addDateItem().setTitle("Date Ordered").setRequired(true);
  form.addDateItem().setTitle("Expected Arrival Date").setRequired(false);
  form.addTextItem().setTitle("Cost").setRequired(false);
  form.addParagraphTextItem().setTitle("Notes").setRequired(false);

  // 6. Link the form to the spreadsheet — this creates a "Form Responses 1"
  // sheet. We copy new responses into our "Order Log" sheet via onFormSubmit,
  // then delete the auto-created responses sheet at first submission (so we
  // only have one sheet to look at).
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // 7. Persist IDs for later runs
  const scriptProps = PropertiesService.getScriptProperties();
  scriptProps.setProperty("spreadsheetId", ss.getId());
  scriptProps.setProperty("formId", form.getId());

  // 8. Install triggers
  deleteExistingTriggers();
  ScriptApp.newTrigger("onFormSubmit").forSpreadsheet(ss).onFormSubmit().create();
  ScriptApp.newTrigger("dailyOverdueCheck")
    .timeBased()
    .everyDays(1)
    .atHour(CONFIG.dailyReminderHour)
    .create();
  ScriptApp.newTrigger("weeklyPendingSummary")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(CONFIG.weeklySummaryHour)
    .create();

  Logger.log("Setup complete.");
  Logger.log("Form URL (share this with mom):     " + form.getPublishedUrl());
  Logger.log("Sheet URL (bookmark for mom):        " + ss.getUrl());
  Logger.log("Spreadsheet ID:                      " + ss.getId());
  Logger.log(
    "Next: Deploy → New deployment → Web app to enable posting from the website. " +
    "Then paste the deployment URL into Vercel as GOOGLE_ORDERS_WEBHOOK_URL.",
  );
}

function deleteExistingTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const t of triggers) {
    ScriptApp.deleteTrigger(t);
  }
}

// =====================================================================
// FORM SUBMIT — fires when someone submits the linked Google Form.
// The form deposits a row into "Form Responses 1" (auto-created). We copy
// it into our Order Log sheet with Status="Pending" + Source="Form", and
// then delete the row from Form Responses 1 to keep it clean.
// =====================================================================
function onFormSubmit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const orderLog = ss.getSheetByName(CONFIG.sheetName);
  if (!orderLog) return;

  // Form event: e.values = [Timestamp, Product, DateOrdered, ExpectedArrival, Cost, Notes]
  const v = e.values || [];
  orderLog.appendRow([
    v[0] || new Date(), // Timestamp
    v[1] || "",         // Product/Service
    v[2] || "",         // Date Ordered
    v[3] || "",         // Expected Arrival
    v[4] || "",         // Cost
    v[5] || "",         // Notes
    "Pending",          // Status default
    "Form",             // Source
  ]);

  // Optional: delete the original row from "Form Responses 1" so the tracker
  // stays single-sheet clean. Comment out if you want an audit trail.
  const formSheet = e.range && e.range.getSheet();
  if (formSheet && formSheet.getName() !== CONFIG.sheetName) {
    formSheet.deleteRow(e.range.getRow());
  }
}

// =====================================================================
// DOPOST — endpoint for the Hello You website to add orders.
// Called from POST /api/admin/orders/add on the Next.js side.
// Body: { secret, product, dateOrdered, expectedArrival, cost, notes }
// =====================================================================
function doPost(e) {
  const respond = (obj, status) => {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
      ContentService.MimeType.JSON,
    );
  };

  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ ok: false, error: "Invalid JSON body" });
  }

  if (!payload.secret || payload.secret !== CONFIG.webhookSecret) {
    return respond({ ok: false, error: "Unauthorized" });
  }

  const product = String(payload.product || "").trim();
  if (!product) {
    return respond({ ok: false, error: "product is required" });
  }
  const dateOrdered = String(payload.dateOrdered || "").trim();
  if (!dateOrdered) {
    return respond({ ok: false, error: "dateOrdered is required (YYYY-MM-DD)" });
  }

  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("spreadsheetId"),
  );
  const sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) {
    return respond({ ok: false, error: "Order Log sheet not found — run setup() first" });
  }

  sheet.appendRow([
    new Date(),
    product,
    dateOrdered,
    String(payload.expectedArrival || "").trim(),
    String(payload.cost || "").trim(),
    String(payload.notes || "").trim(),
    "Pending",
    "Web",
  ]);

  return respond({ ok: true });
}

// =====================================================================
// DAILY OVERDUE CHECK — runs every morning at 8am
// =====================================================================
function dailyOverdueCheck() {
  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("spreadsheetId"),
  );
  const sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 2;
    const product = row[1];
    const expectedArrival = row[3];
    const status = row[6];

    if (status !== "Pending") continue;
    if (!expectedArrival) continue;

    const expected = new Date(expectedArrival);
    if (isNaN(expected.getTime())) continue;
    expected.setHours(0, 0, 0, 0);

    if (today <= expected) continue;

    const daysOverdue = Math.floor((today.getTime() - expected.getTime()) / (1000 * 60 * 60 * 24));
    overdue.push({ product, daysOverdue, expected });

    // Highlight the row red
    sheet.getRange(rowNum, 1, 1, HEADERS.length).setBackground(OVERDUE_HIGHLIGHT);
  }

  if (overdue.length === 0) return;

  const lines = overdue
    .map((o) => {
      const day = o.daysOverdue === 1 ? "day" : "days";
      return `  • ${o.product} — ${o.daysOverdue} ${day} overdue (expected ${formatDate(o.expected)})`;
    })
    .join("\n");

  const subject = `${overdue.length} overdue order${overdue.length === 1 ? "" : "s"} — Hello You Wellness`;
  const body =
    `Good morning.\n\n` +
    `The following order${overdue.length === 1 ? " is" : "s are"} past their expected arrival date:\n\n` +
    `${lines}\n\n` +
    `Open the tracker to mark them received or follow up:\n${ss.getUrl()}\n\n` +
    `— Hello You Wellness Order Tracker`;

  MailApp.sendEmail(CONFIG.recipientEmail, subject, body);
}

// =====================================================================
// WEEKLY PENDING SUMMARY — runs every Monday morning
// =====================================================================
function weeklyPendingSummary() {
  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("spreadsheetId"),
  );
  const sheet = ss.getSheetByName(CONFIG.sheetName);
  if (!sheet) return;

  const lastRow = sheet.getLastRow();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lastRow < 2) {
    MailApp.sendEmail(
      CONFIG.recipientEmail,
      "Weekly order summary — no orders logged yet",
      "Nothing in the tracker this week. Bookmark the tracker to start logging orders:\n\n" +
        ss.getUrl(),
    );
    return;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const pending = [];

  for (const row of data) {
    const [timestamp, product, dateOrdered, expectedArrival, cost, notes, status] = row;
    if (status !== "Pending") continue;

    const orderDate = dateOrdered ? new Date(dateOrdered) : new Date(timestamp);
    orderDate.setHours(0, 0, 0, 0);
    const ageDays = Math.max(
      0,
      Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)),
    );

    pending.push({
      product,
      ageDays,
      expected: expectedArrival ? formatDate(new Date(expectedArrival)) : "—",
      cost: cost || "—",
    });
  }

  if (pending.length === 0) {
    MailApp.sendEmail(
      CONFIG.recipientEmail,
      "Weekly order summary — all caught up",
      `Good morning.\n\nNo pending orders this week. Everything in the tracker is either Received or Cancelled.\n\nTracker: ${ss.getUrl()}\n\n— Hello You Wellness Order Tracker`,
    );
    return;
  }

  pending.sort((a, b) => b.ageDays - a.ageDays);

  const lines = pending
    .map((p) => {
      const day = p.ageDays === 1 ? "day" : "days";
      return `  • ${p.product} — ${p.ageDays} ${day} old · expected ${p.expected} · cost ${p.cost}`;
    })
    .join("\n");

  const subject = `Weekly order summary — ${pending.length} pending`;
  const body =
    `Good morning.\n\n` +
    `${pending.length} pending order${pending.length === 1 ? "" : "s"} in the tracker (oldest first):\n\n` +
    `${lines}\n\n` +
    `Open the tracker to update statuses:\n${ss.getUrl()}\n\n` +
    `— Hello You Wellness Order Tracker`;

  MailApp.sendEmail(CONFIG.recipientEmail, subject, body);
}

// =====================================================================
// Helpers
// =====================================================================
function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// =====================================================================
// TEST HELPERS — run manually from the editor to preview emails
// =====================================================================
function testDailyOverdueCheckNow() {
  dailyOverdueCheck();
}

function testWeeklySummaryNow() {
  weeklyPendingSummary();
}
