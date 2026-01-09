//Monthly Events Loader Script
async function loadEvents() {
  try {
    const res = await fetch("events.json", { cache: "no-store" });
    if (!res.ok) throw new Error("events.json not found");
    const data = await res.json();

    const list = document.getElementById("eventsList");
    const updated = document.getElementById("eventsUpdated");

    list.innerHTML = "";

    const today = new Date();
    today.setHours(0,0,0,0);

    // Sort by date
    const events = (data.events || []).sort((a,b) =>
      new Date(a.date + "T" + (a.time || "00:00")) - new Date(b.date + "T" + (b.time || "00:00"))
    );

    for (const ev of events) {
      const evDate = new Date(ev.date + "T" + (ev.time || "00:00"));
      if (evDate < today) continue; // hide past events

      const dateStr = evDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      const timeStr = ev.time ? evDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

      const card = document.createElement("div");
      card.className = "event-card";

      card.innerHTML = `
        <div class="event-header">
          <div class="event-title">${ev.title}</div>
          <div class="event-type ${typeClass(ev.type)}">${ev.type || ""}</div>
        </div>
        <div class="event-meta">${dateStr} ${timeStr}</div>
        <div class="event-location">${ev.location || ""}</div>
        <div class="event-desc">${ev.description || ""}</div>
      `;

      list.appendChild(card);
    }

    if (data.lastUpdated) {
      updated.textContent = new Date(data.lastUpdated).toLocaleString();
    }
  } catch (err) {
    console.error(err);
  }
}
function typeClass(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("training")) return "type-training";
  if (t.includes("meeting")) return "type-meeting";
  if (t.includes("in service training")) return "type-istraining";
  if (t.includes("class")) return "type-class";
  if (t.includes("special event")) return "type-sevent";
  return "type-other";
}
loadEvents();
