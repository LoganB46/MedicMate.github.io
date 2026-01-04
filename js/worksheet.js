// worksheet.js - GitHub Pages safe worksheet
// Autosave (localStorage), Print to PDF (window.print), Download JSON

const STORAGE_KEY = "mm_call_worksheet_v1";

const fields = [
  "patientAge",
  "patientSex",
  "callLocation",
  "chiefComplaint",
  "hr",
  "bp",
  "spo2",
  "bgl",
  "interventions",
  "narrative",
  "destination",
  "destinationNotes"
];

const createdAtText = document.getElementById("createdAtText");
const lastSavedText = document.getElementById("lastSavedText");
const statusMsg = document.getElementById("statusMsg");

const btnNew = document.getElementById("btnNew");
const btnClearSaved = document.getElementById("btnClearSaved");
const btnPrint = document.getElementById("btnPrint");
const btnJson = document.getElementById("btnJson");

function fmtDateTime(d) {
  // Nice local format without libraries
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getFieldValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function setFieldValue(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = value ?? "";
}

function showStatus(text, type = "info") {
  statusMsg.classList.remove("d-none", "alert-info", "alert-success", "alert-warning", "alert-danger");
  statusMsg.classList.add(`alert-${type}`);
  statusMsg.textContent = text;
}

function hideStatus() {
  statusMsg.classList.add("d-none");
}

function collectWorksheet(existingMeta = null) {
  const now = new Date();

  // Keep createdAt stable for this worksheet
  const meta = existingMeta || {
    createdAtISO: now.toISOString(),
    createdAtLocal: fmtDateTime(now)
  };

  const data = {
    meta: {
      ...meta,
      lastSavedISO: now.toISOString(),
      lastSavedLocal: fmtDateTime(now),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown"
    },
    worksheet: {}
  };

  fields.forEach(id => {
    data.worksheet[id] = getFieldValue(id);
  });

  return data;
}



function saveToLocalStorage(meta = null, silent = false) {
  const data = collectWorksheet(meta);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Update UI timestamps
  const created = new Date(data.meta.createdAtISO);
  const saved = new Date(data.meta.lastSavedISO);

  createdAtText.textContent = fmtDateTime(created);
  lastSavedText.textContent = fmtDateTime(saved);

  if (!silent) showStatus("Saved locally.", "success");
  return data;
}

function loadFromLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function applyData(data) {
  if (!data) return;

  fields.forEach(id => {
    setFieldValue(id, data.worksheet?.[id] ?? "");
  });

  // Update timestamps
  const created = data.meta?.createdAtISO ? new Date(data.meta.createdAtISO) : new Date();
  const saved = data.meta?.lastSavedISO ? new Date(data.meta.lastSavedISO) : null;

  createdAtText.textContent = fmtDateTime(created);
  lastSavedText.textContent = saved ? fmtDateTime(saved) : "—";
}

function clearForm() {
  fields.forEach(id => setFieldValue(id, ""));
}

function newWorksheet() {
  clearForm();
  const now = new Date();
  createdAtText.textContent = fmtDateTime(now);
  lastSavedText.textContent = "—";
  hideStatus();

  // Save immediately with new createdAt
  saveToLocalStorage({ createdAtISO: now.toISOString(), createdAtLocal: fmtDateTime(now) }, true);
}

function clearSaved() {
  localStorage.removeItem(STORAGE_KEY);
  clearForm();
  createdAtText.textContent = "—";
  lastSavedText.textContent = "—";
  showStatus("Saved worksheet cleared.", "warning");
}

function downloadJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const createdISO = data?.meta?.createdAtISO || new Date().toISOString();
  const safeStamp = createdISO.replace(/[:.]/g, "-");
  const filename = `medicmate-worksheet-${safeStamp}.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

// Autosave (debounced)
let saveTimer = null;
function scheduleAutosave(existingMeta) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveToLocalStorage(existingMeta, true);
    const data = loadFromLocalStorage();
    if (data?.meta?.lastSavedISO) lastSavedText.textContent = fmtDateTime(new Date(data.meta.lastSavedISO));
  }, 400);
}

function wireAutosave() {
  const meta = existing?.meta
  ? { createdAtISO: existing.meta.createdAtISO, createdAtLocal: existing.meta.createdAtLocal }
  : { createdAtISO: new Date().toISOString(), createdAtLocal: fmtDateTime(new Date()) };


  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => scheduleAutosave(meta));
    el.addEventListener("change", () => scheduleAutosave(meta));
  });
}

// Buttons
btnNew.addEventListener("click", newWorksheet);
btnClearSaved.addEventListener("click", clearSaved);
btnPrint.addEventListener("click", () => window.print());
btnJson.addEventListener("click", () => {
  const existing = loadFromLocalStorage();
  const meta = existing?.meta
  ? { createdAtISO: existing.meta.createdAtISO, createdAtLocal: existing.meta.createdAtLocal }
  : { createdAtISO: new Date().toISOString(), createdAtLocal: fmtDateTime(new Date()) };

  const data = saveToLocalStorage(meta, true);
  downloadJSON(data);
  showStatus("JSON downloaded.", "success");
});

// Initial load
(function init() {
  const existing = loadFromLocalStorage();
  if (existing) {
    applyData(existing);
    showStatus("Loaded saved worksheet from this device.", "info");
  } else {
    // Start a new worksheet automatically
    const now = new Date();
    createdAtText.textContent = fmtDateTime(now);
    lastSavedText.textContent = "—";
    saveToLocalStorage({ createdAtISO: now.toISOString() }, true);
    hideStatus();
  }

  wireAutosave();
})();
