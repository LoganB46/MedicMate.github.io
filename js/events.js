// ===== Config =====
const EVENTS_URL = "events.json";

// ===== State =====
let ALL_EVENTS = [];
let lastUpdatedISO = null;

const now = new Date();
let viewYear = now.getFullYear();
let viewMonth = now.getMonth(); // 0-11

// ===== Helpers =====
function pad2(n) { return String(n).padStart(2, "0"); }

function ymd(dateObj) {
  return `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`;
}

function parseEventDate(ev) {
  // Interpret as local time. If no time, treat as 00:00 local.
  const t = ev.time ? ev.time : "00:00";
  return new Date(`${ev.date}T${t}`);
}

function fmtLong(d) {
  return d.toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function typeTagClass(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("training")) return "tag-training";
  if (t.includes("meeting")) return "tag-meeting";
  if (t.includes("drill")) return "tag-drill";
  if (t.includes("class")) return "tag-class";
  return "tag-default";
}

function buildMonthSelect() {
  const sel = document.getElementById("monthSelect");
  sel.innerHTML = "";

  // Build a range: current month +/- 12 months (adjust if you want)
  const start = new Date(now.getFullYear(), now.getMonth() - 12, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 18, 1);

  const cursor = new Date(start);
  while (cursor <= end) {
    const opt = document.createElement("option");
    opt.value = `${cursor.getFullYear()}-${cursor.getMonth()}`;
    opt.textContent = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

    if (cursor.getFullYear() === viewYear && cursor.getMonth() === viewMonth) {
      opt.selected = true;
    }

    sel.appendChild(opt);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  sel.addEventListener("change", () => {
    const [y, m] = sel.value.split("-").map(Number);
    viewYear = y;
    viewMonth = m;
    render();
  }, { once: true }); // avoid stacking listeners if render() calls buildMonthSelect()
}

function renderDOW() {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const row = document.getElementById("dowRow");
  row.innerHTML = "";
  names.forEach(n => {
    const div = document.createElement("div");
    div.className = "dow";
    div.textContent = n;
    row.appendChild(div);
  });
}

function render() {
  buildMonthSelect();

  const grid = document.getElementById("monthGrid");
  grid.innerHTML = "";

  const first = new Date(viewYear, viewMonth, 1);
  const startDow = first.getDay(); // 0 Sun

  // We'll render 6 weeks * 7 days = 42 cells
  const startDate = new Date(viewYear, viewMonth, 1 - startDow);

  // Build a map date->events
  const eventMap = new Map();
  for (const ev of ALL_EVENTS) {
    if (!ev.date || !ev.title) continue;
    const key = ev.date; // already YYYY-MM-DD in your JSON
    if (!eventMap.has(key)) eventMap.set(key, []);
    eventMap.get(key).push(ev);
  }

  // Sort events per day by time
  for (const [k, arr] of eventMap.entries()) {
    arr.sort((a, b) => parseEventDate(a) - parseEventDate(b));
  }

  const todayKey = ymd(new Date());

  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const inMonth = (d.getMonth() === viewMonth);
    const key = ymd(d);

    const cell = document.createElement("div");
    cell.className = "day" + (inMonth ? "" : " muted");

    const head = document.createElement("div");
    head.className = "daynum";
    head.innerHTML = `<span>${d.getDate()}</span>` +
      (key === todayKey ? `<span class="today-badge">Today</span>` : "");
    cell.appendChild(head);

    const evWrap = document.createElement("div");
    evWrap.className = "events";

    const evs = eventMap.get(key) || [];
    const MAX = 3;

    evs.slice(0, MAX).forEach(ev => {
      const div = document.createElement("div");
      div.className = "ev";

      const t = ev.type ? `<span class="tag ${typeTagClass(ev.type)}">${ev.type}</span>` : "";
      const time = ev.time ? ev.time : "";

      // Signup button (only if ev.signup exists)
      const signupBtn = ev.signup
        ? `
          <div class="ev-actions">
            <a class="btn btn-sm btn-outline-light"
               href="${ev.signup}"
               target="_blank"
               rel="noopener"
               onclick="event.stopPropagation()">
              Sign up
            </a>
          </div>
        `
        : "";

      div.innerHTML = `
        <div class="ev-title">${ev.title}${t}</div>
        <div class="ev-meta">${time}${ev.location ? (time ? " • " : "") + ev.location : ""}</div>
        ${signupBtn}
      `;

      div.addEventListener("click", () => openEventModal(ev));
      evWrap.appendChild(div);
    });

    if (evs.length > MAX) {
      const more = document.createElement("div");
      more.className = "ev";
      more.style.opacity = ".85";
      more.textContent = `+ ${evs.length - MAX} more`;
      more.addEventListener("click", () => openDayModal(key, evs));
      evWrap.appendChild(more);
    }

    cell.appendChild(evWrap);
    grid.appendChild(cell);
  }

  // update lastUpdated line
  const lu = document.getElementById("lastUpdated");
  lu.textContent = lastUpdatedISO ? new Date(lastUpdatedISO).toLocaleString() : "—";
}

// ===== Modal behavior =====
function openEventModal(ev) {
  const dt = parseEventDate(ev);

  document.getElementById("modalTitle").textContent = ev.title || "Event";
  document.getElementById("modalWhen").innerHTML = `<strong>When:</strong> ${fmtLong(dt)}`;
  document.getElementById("modalWhere").innerHTML = `<strong>Where:</strong> ${ev.location || "—"}`;
  document.getElementById("modalType").innerHTML = `<strong>Type:</strong> ${ev.type || "—"}`;

  const signup = ev.signup
    ? `<div class="mt-3">
         <a href="${ev.signup}" target="_blank" rel="noopener" class="btn btn-primary w-100">
           Sign up for this event
         </a>
       </div>`
    : "";

  document.getElementById("modalDesc").innerHTML =
    `<strong>Details:</strong><br>${(ev.description || "—").replace(/\n/g, "<br>")}${signup}`;

  const modal = new bootstrap.Modal(document.getElementById("eventModal"));
  modal.show();
}

function openDayModal(dateKey, evs) {
  document.getElementById("modalTitle").textContent = `Events: ${dateKey}`;
  document.getElementById("modalWhen").innerHTML =
    `<strong>Date:</strong> ${new Date(dateKey + "T00:00").toLocaleDateString(undefined, {
      weekday: "long", month: "long", day: "numeric", year: "numeric"
    })}`;

  document.getElementById("modalWhere").innerHTML = "";
  document.getElementById("modalType").innerHTML = "";

  document.getElementById("modalDesc").innerHTML =
    evs.map(ev => {
      const t = ev.type ? ` <span class="tag ${typeTagClass(ev.type)}">${ev.type}</span>` : "";
      const time = ev.time ? ev.time : "";
      const loc = ev.location ? ` • ${ev.location}` : "";
      const desc = ev.description
        ? `<div style="opacity:.9; margin-top:.15rem;">${ev.description.replace(/\n/g, "<br>")}</div>`
        : "";

      const signup = ev.signup
        ? `<div class="mt-2">
             <a href="${ev.signup}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-light"
                onclick="event.stopPropagation()">
               Sign up
             </a>
           </div>`
        : "";

      return `<div style="border-top:1px solid #222; padding-top:.5rem; margin-top:.5rem;">
                <div><strong>${ev.title}</strong>${t}</div>
                <div style="opacity:.85;">${time}${loc}</div>
                ${desc}
                ${signup}
              </div>`;
    }).join("");

  const modal = new bootstrap.Modal(document.getElementById("eventModal"));
  modal.show();
}

// ===== Load data =====
async function loadEvents() {
  const res = await fetch(EVENTS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("events.json not found");
  const data = await res.json();

  lastUpdatedISO = data.lastUpdated || null;
  ALL_EVENTS = (data.events || []).slice();

  renderDOW();
  render();
}

// ===== Controls =====
document.getElementById("btnPrev").addEventListener("click", () => {
  const d = new Date(viewYear, viewMonth - 1, 1);
  viewYear = d.getFullYear();
  viewMonth = d.getMonth();
  render();
});

document.getElementById("btnNext").addEventListener("click", () => {
  const d = new Date(viewYear, viewMonth + 1, 1);
  viewYear = d.getFullYear();
  viewMonth = d.getMonth();
  render();
});

document.getElementById("btnToday").addEventListener("click", () => {
  const t = new Date();
  viewYear = t.getFullYear();
  viewMonth = t.getMonth();
  render();
});

document.getElementById("btnPrint").addEventListener("click", () => window.print());

loadEvents().catch(console.error);
