import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────
const PROPERTY_STYLES = [
  "House","Unit","Apartment","Townhouse","Villa","Flat","Studio","Terrace",
  "Duplex / Semi-detached","Acreage / Semi-rural","Block of Units",
  "Retirement Living","Warehouse","Other",
];
const LISTING_TYPES = [
  { value: "residential", label: "Residential Sale" },
  { value: "rental",      label: "Residential Rental" },
  { value: "land",        label: "Land" },
  { value: "rural",       label: "Rural" },
  { value: "commercial",  label: "Commercial" },
  { value: "holidayRental", label: "Holiday Rental" },
];
const STATUSES = [
  { value: "active",     label: "Active / Current" },
  { value: "withdrawn",  label: "Withdrawn" },
  { value: "sold",       label: "Sold" },
  { value: "leased",     label: "Leased" },
  { value: "offmarket",  label: "Off Market" },
];
const AUTHORITIES = ["exclusive","auction","open","multilist","conjunctional"];
const STATES_AU = ["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];
const FURNISHING = ["Unfurnished","Semi-Furnished","Furnished"];
const LAND_UNITS = [
  { value: "squareMeter", label: "m²" },
  { value: "square",      label: "Square" },
  { value: "acre",        label: "Acre" },
  { value: "hectare",     label: "Hectare" },
];
const PRICE_PREFIXES = ["From","Offers Over","Contact Agent","Guide"];
const TOGGLE_FEATURES = [
  "airConditioning","alarmSystem","vacuumSystem","intercom","poolInGround","poolAboveGround",
  "spa","tennisCourt","balcony","deck","courtyard","outdoorEnt","shed","fullyFenced",
  "openFirePlace","broadband","builtInRobes","dishwasher","ductedCooling","ductedHeating",
  "evaporativeCooling","floorboards","gasHeating","gym","hydronicHeating","payTV",
  "reverseCycleAirCon","rumpusRoom","splitSystemAirCon","study","workshop","remoteGarage","secureParking",
];
const ECO_FEATURES = ["solarPanels","solarHotWater","waterTank","greyWaterSystem"];
const VIEW_OPTIONS  = ["city","water","valley","mountain","ocean"];
const IDEAL_FOR     = ["firstHomeBuyer","investors","downsizing","couples","students","lrgFamilies","retirees"];

const SECTIONS = [
  { id: "basic",       label: "Basic Info" },
  { id: "ids",         label: "Platform IDs" },
  { id: "location",    label: "Location"},
  { id: "details",     label: "Details"},
  { id: "pricing",     label: "Pricing"},
  { id: "description", label: "Description"},
  { id: "photos",      label: "Photos"},
  { id: "schedule",    label: "Schedule"},
];

function camelLabel(s) {
  return s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

const DEFAULT_FORM = {
  title: "", listingType: "residential", propStyle: "House",
  listingStatus: "active", authority: "exclusive", underOffer: "no",
  locationArea: "", priceAud: "",
  reaAgentId: "", uniqueId: "", agencyId: "32564", agentId: "1614718",
  agentName: "", agentMobile: "", agentEmail: "", domainClientId: "",
  subNumber: "", lotNumber: "", streetNum: "", street: "",
  suburb: "", state: "", postcode: "", municipality: "",
  bedrooms: "", bathrooms: "", ensuites: "", garages: "",
  carports: "", carSpaces: "", toilets: "", livingAreas: "",
  openSpaces: "", heatingType: "", hotWater: "",
  toggleFeatures: [], ecoFeatures: [], views: [], idealFor: [],
  landArea: "", landUnit: "squareMeter", frontage: "",
  sqft: "", buildArea: "", energyRating: "", floorLevel: "",
  furnishing: "", yearBuilt: "", newConstruction: "",
  priceView: "", pricePrefix: "", priceFrom: "", priceTo: "",
  priceDisplay: "yes", rentPeriod: "", bond: "", dateAvailable: "",
  headline: "", description: "", otherFeatures: "",
  customFeatures: [],
  inspStart: "", inspEnd: "", auctionDate: "",
  soldPrice: "", soldDate: "",
};

export default function AddListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [activeSection, setActiveSection] = useState("basic");
  const [photos, setPhotos] = useState([]);
  const [featInput, setFeatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileRef = useRef(null);

  const sectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const activeData   = SECTIONS[sectionIndex];

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const toggleArr = (key, val) =>
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter((x) => x !== val) : [...p[key], val],
    }));

  const handlePhotoUpload = (e) => {
    Array.from(e.target.files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((p) => [...p, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };
  const removePhoto = (i) => setPhotos((p) => p.filter((_, idx) => idx !== i));
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handlePhotoUpload({ target: { files: e.dataTransfer.files } });
  }, []);

  const addFeat = () => {
    const val = featInput.trim();
    if (!val) return;
    const newFeats = val.split(",").map((s) => s.trim()).filter((f) => f && !form.customFeatures.includes(f));
    if (newFeats.length) set("customFeatures", [...form.customFeatures, ...newFeats]);
    setFeatInput("");
  };

  const handleSave = async () => {
    if (!form.title) {
      alert("Please enter a listing title before saving.");
      setActiveSection("basic");
      return;
    }
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photos }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      navigate("/listing");
    } catch (err) {
      console.error("Save listing error:", err);
      alert("Error saving listing: " + err.message);
    }
  };

  const goNext = () => {
    if (sectionIndex < SECTIONS.length - 1)
      setActiveSection(SECTIONS[sectionIndex + 1].id);
  };
  const goPrev = () => {
    if (sectionIndex > 0)
      setActiveSection(SECTIONS[sectionIndex - 1].id);
  };

  const inp = "w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* ── TOP NAV ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button onClick={() => navigate("/listing")} className="hidden sm:flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition text-sm flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <span className="hidden sm:block text-gray-200">|</span>

          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-800 truncate">Add New Listing</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              {activeData.icon} {activeData.label} — Step {sectionIndex + 1} of {SECTIONS.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate("/listing")}
            className="hidden sm:block text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-sm bg-[#004f98] text-white px-4 py-2 rounded-lg hover:bg-[#003b75] transition font-medium"
          >
            Save
          </button>
        </div>
      </header>

      {/* ── PROGRESS BAR (mobile) ── */}
      <div className="lg:hidden h-1 bg-gray-100">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${((sectionIndex + 1) / SECTIONS.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── SIDEBAR OVERLAY (mobile/tablet) ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:static lg:w-52 lg:translate-x-0 lg:flex lg:z-auto lg:h-auto lg:flex-shrink-0
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}>
          {/* Sidebar header (mobile only) */}
          <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">Sections</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-3">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition border-l-2 ${
                  activeSection === s.id
                    ? "border-[#004f98] bg-blue-50 text-[#004f98] font-medium"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition ${
                  activeSection === s.id ? "bg-[#004f98] text-white" : "bg-gray-100 text-gray-400"
                }`}>{i + 1}</span>
                <span className="flex-1 text-left">{s.label}</span>
                <span className="text-base">{s.icon}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── MAIN FORM CONTENT ── */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile section title pill */}
          <div className="lg:hidden px-4 pt-4 pb-1">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#004f98] text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
              <span>{activeData.icon}</span>
              <span>{activeData.label}</span>
              <span className="text-blue-300">·</span>
              <span className="text-blue-400">{sectionIndex + 1}/{SECTIONS.length}</span>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-2xl mx-auto lg:mx-0 space-y-4 pb-32 lg:pb-8">

            {/* ── BASIC INFO ── */}
            {activeSection === "basic" && (
              <>
                <SectionHeader title="Basic Information" subtitle="Core details about this listing" />
                <Card>
                  <Field label="Listing Title" required>
                    <input value={form.title} onChange={(e) => set("title", e.target.value)}
                      placeholder="e.g. Modern 3BR Villa with Pool in Pyrmont" className={inp} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <Field label="Listing Type" required>
                      <select value={form.listingType} onChange={(e) => set("listingType", e.target.value)} className={inp}>
                        {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Property Style" required>
                      <select value={form.propStyle} onChange={(e) => set("propStyle", e.target.value)} className={inp}>
                        {PROPERTY_STYLES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Listing Status" required>
                      <select value={form.listingStatus} onChange={(e) => set("listingStatus", e.target.value)} className={inp}>
                        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Authority">
                      <select value={form.authority} onChange={(e) => set("authority", e.target.value)} className={inp}>
                        {AUTHORITIES.map((a) => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                      </select>
                    </Field>
                    <Field label="Under Offer?">
                      <select value={form.underOffer} onChange={(e) => set("underOffer", e.target.value)} className={inp}>
                        <option value="no">No</option><option value="yes">Yes</option>
                      </select>
                    </Field>
                    <Field label="Location / Area">
                      <input value={form.locationArea} onChange={(e) => set("locationArea", e.target.value)}
                        placeholder="e.g. Inner West, Sydney" className={inp} />
                    </Field>
                  </div>
                </Card>
                <Card title="Price">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Price (AUD)" required>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input type="number" value={form.priceAud} onChange={(e) => set("priceAud", e.target.value)}
                          placeholder="0" className={`${inp} pl-8`} />
                      </div>
                    </Field>
                    <Field label="New Construction?">
                      <select value={form.newConstruction} onChange={(e) => set("newConstruction", e.target.value)} className={inp}>
                        <option value="">No</option><option value="yes">Yes</option>
                      </select>
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ── PLATFORM IDs ── */}
            {activeSection === "ids" && (
              <>
                <SectionHeader title="Platform IDs" subtitle="IDs used to submit to Domain & realestate.com.au" />
                <Card title="Agent Profile">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Field label="Agent Name">
                      <input value={form.agentName} onChange={(e) => set("agentName", e.target.value)} placeholder="e.g. Jane Smith" className={inp} />
                    </Field>
                    <Field label="Mobile">
                      <input value={form.agentMobile} onChange={(e) => set("agentMobile", e.target.value)} placeholder="04XX XXX XXX" className={inp} />
                    </Field>
                    <Field label="Email" className="sm:col-span-2 lg:col-span-1">
                      <input type="email" value={form.agentEmail} onChange={(e) => set("agentEmail", e.target.value)} placeholder="agent@agency.com.au" className={inp} />
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ── LOCATION ── */}
            {activeSection === "location" && (
              <>
                <SectionHeader title="Location" subtitle="Where is the property?" />
                <Card>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Sub / Unit Number">
                      <input value={form.subNumber} onChange={(e) => set("subNumber", e.target.value)} placeholder="e.g. 5A" className={inp} />
                    </Field>
                    <Field label="Lot Number">
                      <input value={form.lotNumber} onChange={(e) => set("lotNumber", e.target.value)} placeholder="e.g. Lot 12" className={inp} />
                    </Field>
                    <Field label="Street Number" required>
                      <input value={form.streetNum} onChange={(e) => set("streetNum", e.target.value)} placeholder="e.g. 167" className={inp} />
                    </Field>
                    <Field label="Street Name" required>
                      <input value={form.street} onChange={(e) => set("street", e.target.value)} placeholder="e.g. Pyrmont Street" className={inp} />
                    </Field>
                    <Field label="Suburb" required>
                      <input value={form.suburb} onChange={(e) => set("suburb", e.target.value)} placeholder="e.g. Pyrmont" className={inp} />
                    </Field>
                    <Field label="State" required>
                      <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inp}>
                        <option value="">— Select —</option>
                        {STATES_AU.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Postcode" required>
                      <input value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="e.g. 2009" maxLength={4} className={inp} />
                    </Field>
                    <Field label="Municipality">
                      <input value={form.municipality} onChange={(e) => set("municipality", e.target.value)} placeholder="e.g. Inner West" className={inp} />
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ── PROPERTY DETAILS ── */}
            {activeSection === "details" && (
              <>
                <SectionHeader title="Property Details" subtitle="Rooms, sizes & features" />
                <Card title="Rooms">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ["Bedrooms","bedrooms"],["Bathrooms","bathrooms"],["Ensuites","ensuites"],
                      ["Garages","garages"],["Carports","carports"],["Car Spaces","carSpaces"],
                      ["Toilets","toilets"],["Living Areas","livingAreas"],["Open Spaces","openSpaces"],
                    ].map(([label, key]) => (
                      <Field key={key} label={label}>
                        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                          <button type="button" onClick={() => set(key, Math.max(0, (parseInt(form[key]) || 0) - 1))}
                            className="w-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 text-xl transition flex-shrink-0 border-r border-gray-200 active:bg-gray-100">−</button>
                          <input type="number" value={form[key]} onChange={(e) => set(key, e.target.value)}
                            className="flex-1 text-center text-sm font-semibold text-gray-800 py-3 focus:outline-none bg-white min-w-0" min="0" />
                          <button type="button" onClick={() => set(key, (parseInt(form[key]) || 0) + 1)}
                            className="w-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 text-xl transition flex-shrink-0 border-l border-gray-200 active:bg-gray-100">+</button>
                        </div>
                      </Field>
                    ))}
                  </div>
                </Card>

                <Card title="Size & Build">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Field label="Land Area">
                      <input type="number" value={form.landArea} onChange={(e) => set("landArea", e.target.value)} placeholder="e.g. 450" className={inp} />
                    </Field>
                    <Field label="Land Unit">
                      <select value={form.landUnit} onChange={(e) => set("landUnit", e.target.value)} className={inp}>
                        {LAND_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Frontage (m)">
                      <input type="number" value={form.frontage} onChange={(e) => set("frontage", e.target.value)} placeholder="e.g. 12" className={inp} />
                    </Field>
                    <Field label="Floor Area (sq.ft.)">
                      <input type="number" value={form.sqft} onChange={(e) => set("sqft", e.target.value)} placeholder="e.g. 1200" className={inp} />
                    </Field>
                    <Field label="Building Area (m²)">
                      <input type="number" value={form.buildArea} onChange={(e) => set("buildArea", e.target.value)} placeholder="e.g. 180" className={inp} />
                    </Field>
                    <Field label="Year Built">
                      <input type="number" value={form.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)} placeholder="e.g. 2010" className={inp} />
                    </Field>
                    <Field label="Furnishing">
                      <select value={form.furnishing} onChange={(e) => set("furnishing", e.target.value)} className={inp}>
                        <option value="">Select</option>
                        {FURNISHING.map((f) => <option key={f}>{f}</option>)}
                      </select>
                    </Field>
                    <Field label="Energy Rating">
                      <input type="number" value={form.energyRating} onChange={(e) => set("energyRating", e.target.value)} placeholder="0–10" step="0.5" min="0" max="10" className={inp} />
                    </Field>
                    <Field label="Floor Level">
                      <input type="number" value={form.floorLevel} onChange={(e) => set("floorLevel", e.target.value)} placeholder="e.g. 3" className={inp} />
                    </Field>
                  </div>
                </Card>

                <Card title="Property Features">
                  <div className="flex flex-wrap gap-2">
                    {TOGGLE_FEATURES.map((f) => (
                      <button type="button" key={f} onClick={() => toggleArr("toggleFeatures", f)}
                        className={`text-xs px-3 py-2 rounded-full border transition active:scale-95 ${
                          form.toggleFeatures.includes(f)
                            ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        }`}>{camelLabel(f)}</button>
                    ))}
                  </div>
                </Card>

                <Card title="Eco Friendly">
                  <div className="flex flex-wrap gap-2">
                    {ECO_FEATURES.map((f) => (
                      <button type="button" key={f} onClick={() => toggleArr("ecoFeatures", f)}
                        className={`text-xs px-3 py-2 rounded-full border transition active:scale-95 ${
                          form.ecoFeatures.includes(f)
                            ? "bg-green-50 border-green-300 text-green-700 font-medium"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}>{camelLabel(f)}</button>
                    ))}
                  </div>
                </Card>

                <Card title="Views">
                  <div className="flex flex-wrap gap-2">
                    {VIEW_OPTIONS.map((f) => (
                      <button type="button" key={f} onClick={() => toggleArr("views", f)}
                        className={`text-xs px-3 py-2 rounded-full border transition active:scale-95 ${
                          form.views.includes(f)
                            ? "bg-sky-50 border-sky-300 text-sky-700 font-medium"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}>{camelLabel(f)}</button>
                    ))}
                  </div>
                </Card>

                <Card title="Ideal For">
                  <div className="flex flex-wrap gap-2">
                    {IDEAL_FOR.map((f) => (
                      <button type="button" key={f} onClick={() => toggleArr("idealFor", f)}
                        className={`text-xs px-3 py-2 rounded-full border transition active:scale-95 ${
                          form.idealFor.includes(f)
                            ? "bg-purple-50 border-purple-300 text-purple-700 font-medium"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}>{camelLabel(f)}</button>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* ── PRICING ── */}
            {activeSection === "pricing" && (
              <>
                <SectionHeader title="Pricing" subtitle="Set the price and display preferences" />
                <Card>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Display Price" required>
                      <input value={form.priceView} onChange={(e) => set("priceView", e.target.value)}
                        placeholder="e.g. Offers Over $850,000" className={inp} />
                      <p className="text-xs text-gray-400 mt-1">Shown to buyers on both platforms</p>
                    </Field>
                    <Field label="Price Prefix">
                      <select value={form.pricePrefix} onChange={(e) => set("pricePrefix", e.target.value)} className={inp}>
                        <option value="">None</option>
                        {PRICE_PREFIXES.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </Field>
                    <Field label="Price From (numeric)" required>
                      <input type="number" value={form.priceFrom} onChange={(e) => set("priceFrom", e.target.value)} placeholder="e.g. 850000" className={inp} />
                    </Field>
                    <Field label="Price To (numeric)">
                      <input type="number" value={form.priceTo} onChange={(e) => set("priceTo", e.target.value)} placeholder="e.g. 920000" className={inp} />
                    </Field>
                    <Field label="Show Price to Buyers?">
                      <select value={form.priceDisplay} onChange={(e) => set("priceDisplay", e.target.value)} className={inp}>
                        <option value="yes">Yes</option><option value="no">No</option>
                      </select>
                    </Field>
                    <Field label="Rent Period">
                      <select value={form.rentPeriod} onChange={(e) => set("rentPeriod", e.target.value)} className={inp}>
                        <option value="">N/A</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                      </select>
                    </Field>
                    <Field label="Bond">
                      <input type="number" value={form.bond} onChange={(e) => set("bond", e.target.value)} placeholder="e.g. 3400" className={inp} />
                    </Field>
                    <Field label="Available From">
                      <input type="date" value={form.dateAvailable} onChange={(e) => set("dateAvailable", e.target.value)} className={inp} />
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ── DESCRIPTION ── */}
            {activeSection === "description" && (
              <>
                <SectionHeader title="Description" subtitle="Tell the story of the property" />
                <Card>
                  <Field label="Headline" required>
                    <input value={form.headline} onChange={(e) => set("headline", e.target.value)}
                      placeholder="e.g. Stunning 3BR with Harbour Views" className={inp} />
                  </Field>
                  <div className="mt-4">
                    <Field label="Full Description" required>
                      <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                        placeholder="Describe the property..." rows={6} className={`${inp} resize-none`} />
                    </Field>
                  </div>
                  <div className="mt-4">
                    <Field label="Other Features / Extra Notes">
                      <input value={form.otherFeatures} onChange={(e) => set("otherFeatures", e.target.value)}
                        placeholder="e.g. Rooftop terrace, wine cellar" className={inp} />
                    </Field>
                  </div>
                </Card>

                <Card title="Custom Features & Amenities">
                  <div className="flex gap-2 mb-3">
                    <input value={featInput} onChange={(e) => setFeatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeat())}
                      placeholder="e.g. Swimming Pool, Gym..." className={`${inp} flex-1 min-w-0`} />
                    <button type="button" onClick={addFeat}
                      className="px-4 py-2 bg-[#004f98] text-white text-sm rounded-xl hover:bg-[#003b75] transition flex-shrink-0 active:scale-95">
                      Add
                    </button>
                  </div>
                  {form.customFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.customFeatures.map((f, i) => (
                        <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-100">
                          {f}
                          <button type="button" onClick={() => set("customFeatures", form.customFeatures.filter((_, j) => j !== i))} className="hover:text-blue-900 transition ml-0.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            )}

            {/* ── PHOTOS ── */}
            {activeSection === "photos" && (
              <>
                <SectionHeader title="Photos" subtitle="Upload high-quality images of the property" />
                <Card>
                  <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                    onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 active:bg-blue-50/50 transition">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 text-center">Tap to upload photos</p>
                    <p className="text-xs text-gray-400 mt-1 text-center">JPG, PNG, WEBP — up to 30 images</p>
                    <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp"
                      className="hidden" onChange={handlePhotoUpload} />
                  </div>

                  {photos.length > 0 && (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                        {photos.map((src, i) => (
                          <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100">
                            <img src={src} alt={`photo-${i}`} className="w-full h-full object-cover" />
                            {i === 0 && (
                              <span className="absolute top-2 left-2 bg-[#004f98] text-white text-xs px-2 py-0.5 rounded-full">Cover</span>
                            )}
                            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">#{i+1}</span>
                            {/* Always visible delete on mobile, hover on desktop */}
                            <button type="button" onClick={() => removePhoto(i)}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center transition sm:opacity-0 sm:group-hover:opacity-100 active:scale-95">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-green-600 font-medium mt-3">✓ {photos.length} photo{photos.length > 1 ? "s" : ""} ready</p>
                    </>
                  )}
                </Card>
              </>
            )}

            {/* ── SCHEDULE ── */}
            {activeSection === "schedule" && (
              <>
                <SectionHeader title="Schedule" subtitle="Inspections, auctions and sold details" />
                <Card title="Inspection">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Start Date & Time">
                      <input type="datetime-local" value={form.inspStart} onChange={(e) => set("inspStart", e.target.value)} className={inp} />
                    </Field>
                    <Field label="End Time">
                      <input type="datetime-local" value={form.inspEnd} onChange={(e) => set("inspEnd", e.target.value)} className={inp} />
                    </Field>
                  </div>
                </Card>
                <Card title="Auction">
                  <Field label="Auction Date & Time">
                    <input type="datetime-local" value={form.auctionDate} onChange={(e) => set("auctionDate", e.target.value)} className={inp} />
                  </Field>
                </Card>
                <Card title="Sold Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Sold Price">
                      <input type="number" value={form.soldPrice} onChange={(e) => set("soldPrice", e.target.value)} placeholder="e.g. 875000" className={inp} />
                    </Field>
                    <Field label="Sold Date">
                      <input type="date" value={form.soldDate} onChange={(e) => set("soldDate", e.target.value)} className={inp} />
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ── PREV / NEXT (desktop) ── */}
            <div className="hidden lg:flex justify-between items-center pt-4 border-t border-gray-100">
              <button type="button" onClick={goPrev} disabled={sectionIndex === 0}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              {sectionIndex < SECTIONS.length - 1 ? (
                <button type="button" onClick={goNext}
                  className="flex items-center gap-2 text-sm bg-[#004f98] text-white px-5 py-2.5 rounded-xl hover:bg-[#003b75] transition">
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button type="button" onClick={handleSave}
                  className="flex items-center gap-2 text-sm bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition font-medium">
                  Save Listing
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV BAR ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20 safe-area-bottom">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <button type="button" onClick={goPrev} disabled={sectionIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-gray-500 border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed active:bg-gray-50 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {SECTIONS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSection(SECTIONS[i].id)}
                className={`rounded-full transition-all ${
                  i === sectionIndex
                    ? "w-5 h-2 bg-[#004f98]"
                    : "w-2 h-2 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>

          {sectionIndex < SECTIONS.length - 1 ? (
            <button type="button" onClick={goNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm bg-[#004f98] text-white rounded-xl active:bg-[#003b75] transition font-medium">
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button type="button" onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm bg-green-500 text-white rounded-xl active:bg-green-600 transition font-medium">
              Save
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-1">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
      {title && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</p>}
      {children}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}