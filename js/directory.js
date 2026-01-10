//Hospital Directory Card Loader
async function loadfaciliy() {
  try {
    const res = await fetch("hfacility.json", { cache: "no-store" });
    if (!res.ok) throw new Error("hfacility.json not found");
    const data = await res.json();

    const list = document.getElementById("facilityList");
    const updated = document.getElementById("facilityUpdated");

    list.innerHTML = "";


    // Sort by name
    const hfacilities = (data.hospitalFacilities || []).sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    for (const fac of hfacilities) {
      const card = document.createElement("div");
      card.className = "facility-card";

      const phone = (fac.contact || "").replace(/[^\d+]/g, ""); // strip formatting

const phoneLink = fac.contact
  ? `<a href="tel:${phone}" class="facility-phone">${fac.contact}</a>`
  : "—";

    
    card.innerHTML = `
        <div class="facility-header">
            <div class="facility-name">${fac.name}</div>
            <div class="facility-type ${facilityTypeClass(fac.type)}">${fac.type || ""}</div>
        </div>
        <div class="facility-location">${fac.location || ""}</div>  
        <div class="facility-contact">${phoneLink}</div>
        <div class="facility-door-access">${fac.doorAccess || ""}</div>
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
function facilityTypeClass(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("hospital")) return "type-hospital";
  if (t.includes("fed")) return "type-freestanding";
  if (t.includes("pediatric")) return "type-pediatric";
  if (t.includes("ob")) return "type-obgyn";
  return "type-other";
}
loadfaciliy();