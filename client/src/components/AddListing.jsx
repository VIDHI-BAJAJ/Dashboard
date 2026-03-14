// import { useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const PROPERTY_STYLES = [
//   "House","Unit","Apartment","Townhouse","Villa","Flat","Studio","Terrace",
//   "Duplex / Semi-detached","Acreage / Semi-rural","Block of Units",
//   "Retirement Living","Serviced Apartment","Warehouse","Other",
// ];
// const LISTING_TYPES = [
//   { value: "residential", label: "Residential Sale" },
//   { value: "rental",      label: "Residential Rental" },
//   { value: "land",        label: "Land" },
//   { value: "rural",       label: "Rural" },
//   { value: "commercial",  label: "Commercial" },
//   { value: "holidayRental", label: "Holiday Rental" },
// ];
// const STATUSES = [
//   { value: "active",     label: "Active / Current" },
//   { value: "withdrawn",  label: "Withdrawn" },
//   { value: "sold",       label: "Sold" },
//   { value: "leased",     label: "Leased" },
//   { value: "offmarket",  label: "Off Market" },
// ];
// const AUTHORITIES = ["exclusive","auction","open","multilist","conjunctional"];
// const STATES_AU = ["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];
// const FURNISHING = ["Unfurnished","Semi-Furnished","Furnished"];
// const LAND_UNITS = [
//   { value: "squareMeter", label: "m²" },
//   { value: "square",      label: "Square" },
//   { value: "acre",        label: "Acre" },
//   { value: "hectare",     label: "Hectare" },
// ];
// const PRICE_PREFIXES = ["From","Offers Over","Contact Agent","Guide"];
// const AUCTION_RESULTS = [
//   { value: "", label: "To be determined" },
//   { value: "soldPrior", label: "Sold Prior to Auction" },
//   { value: "soldAtAuction", label: "Sold at Auction" },
//   { value: "passedIn", label: "Passed In" },
//   { value: "passedInVendorBid", label: "Passed In - Vendor Bid" },
//   { value: "withdrawn", label: "Withdrawn" },
//   { value: "soldAfterAuction", label: "Sold after Auction" },
// ];
// const TOGGLE_FEATURES = [
//   "airConditioning","alarmSystem","vacuumSystem","intercom","poolInGround","poolAboveGround",
//   "spa","tennisCourt","balcony","deck","courtyard","outdoorEnt","shed","fullyFenced",
//   "openFirePlace","broadband","builtInRobes","dishwasher","ductedCooling","ductedHeating",
//   "evaporativeCooling","floorboards","gasHeating","gym","hydronicHeating","payTV",
//   "reverseCycleAirCon","rumpusRoom","splitSystemAirCon","study","workshop","remoteGarage","secureParking",
// ];
// const ECO_FEATURES = ["solarPanels","solarHotWater","waterTank","greyWaterSystem"];
// const VIEW_OPTIONS  = ["city","water","valley","mountain","ocean"];
// const IDEAL_FOR     = ["firstHomeBuyer","investors","downsizing","couples","students","lrgFamilies","retirees"];

// // ─── Section flow matches REA Agent Admin tabs ────────────────────────────────
// const SECTIONS = [
//   { id: "status",      label: "Change Status" },
//   { id: "about",       label: "About the Listing" },
//   { id: "vendor",      label: "Vendor Details" },
//   { id: "address",     label: "Property Address" },
//   { id: "auction",     label: "Auction Outcome" },
//   { id: "property",    label: "About the Property" },
//   { id: "features",    label: "Search Features" },
//   { id: "copy",        label: "Listing Copy" },
//   { id: "images",      label: "Property Images" },
//   { id: "links",       label: "Links" },
//   { id: "inspections", label: "Inspections" },
// ];

// function camelLabel(s) {
//   return s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
// }

// const DEFAULT_FORM = {
//   // Status
//   listingStatus: "active",

//   // About the Listing
//   listingType: "residential",
//   propStyle: "House",
//   newConstruction: "",
//   leadAgentName: "",
//   leadAgentId: "",
//   dualAgentName: "",
//   dualAgentId: "",
//   authority: "exclusive",
//   priceAud: "",
//   priceDisplay: "showActual",   // showActual | showText | contactAgent
//   priceDisplayText: "",
//   underOffer: "no",

//   // Vendor Details
//   vendorName: "",
//   vendorEmail: "",
//   vendorPhone: "",
//   sendCampaignReport: false,

//   // Property Address
//   subNumber: "",
//   lotNumber: "",
//   streetNum: "",
//   street: "",
//   hideStreetAddress: false,
//   hideStreetView: false,
//   suburb: "",
//   state: "",
//   postcode: "",
//   municipality: "",

//   // Auction Outcome
//   auctionResult: "",
//   maximumBid: "",

//   // About the Property
//   bedrooms: "",
//   bathrooms: "",
//   ensuites: "",
//   toilets: "",
//   garages: "",
//   carports: "",
//   openSpaces: "",
//   livingAreas: "",
//   houseSize: "",
//   houseSizeUnit: "square",
//   landArea: "",
//   landUnit: "squareMeter",
//   energyRating: "",

//   // Features
//   toggleFeatures: [],
//   ecoFeatures: [],
//   views: [],
//   idealFor: [],
//   otherFeatures: "",
//   customFeatures: [],

//   // Extra size/build
//   frontage: "",
//   buildArea: "",
//   floorLevel: "",
//   furnishing: "",
//   yearBuilt: "",

//   // Listing Copy
//   headline: "",
//   description: "",

//   // Links
//   videoUrl: "",
//   onlineTour1: "",
//   onlineTour2: "",
//   agencyListingUrl: "",

//   // Inspections
//   inspStart: "",
//   inspEnd: "",
//   auctionDate: "",
//   soldPrice: "",
//   soldDate: "",

//   // IDs
//   agencyId: "32564",
//   agentId: "1614718",
//   agentMobile: "",
//   agentEmail: "",
//   uniqueId: "",
//   domainClientId: "",
// };

// export default function AddListing() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState(DEFAULT_FORM);
//   const [activeSection, setActiveSection] = useState("status");
//   const [photos, setPhotos] = useState([]);
//   const [floorplans, setFloorplans] = useState([]);
//   const [soiFile, setSoiFile] = useState(null);
//   const [frontPageImage, setFrontPageImage] = useState(null);
//   const [featInput, setFeatInput] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const photoRef = useRef(null);
//   const floorplanRef = useRef(null);
//   const soiRef = useRef(null);
//   const frontPageRef = useRef(null);

//   const sectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);

//   const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
//   const toggle = (key) => setForm((p) => ({ ...p, [key]: !p[key] }));
//   const toggleArr = (key, val) =>
//     setForm((p) => ({
//       ...p,
//       [key]: p[key].includes(val) ? p[key].filter((x) => x !== val) : [...p[key], val],
//     }));

//   // Photo handlers
//   const handlePhotoUpload = (e) => {
//     Array.from(e.target.files).forEach((file) => {
//       if (!file.type.startsWith("image/")) return;
//       const reader = new FileReader();
//       reader.onload = (ev) => setPhotos((p) => [...p, ev.target.result]);
//       reader.readAsDataURL(file);
//     });
//   };
//   const removePhoto = (i) => setPhotos((p) => p.filter((_, idx) => idx !== i));
//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     handlePhotoUpload({ target: { files: e.dataTransfer.files } });
//   }, []);

//   // Floorplan handlers
//   const handleFloorplanUpload = (e) => {
//     Array.from(e.target.files).forEach((file) => {
//       if (!file.type.startsWith("image/")) return;
//       const reader = new FileReader();
//       reader.onload = (ev) => setFloorplans((p) => [...p, { src: ev.target.result, name: file.name }]);
//       reader.readAsDataURL(file);
//     });
//   };

//   // SOI handler
//   const handleSoiUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) setSoiFile(file.name);
//   };

//   // Front page image handler
//   const handleFrontPageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file || !file.type.startsWith("image/")) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => setFrontPageImage(ev.target.result);
//     reader.readAsDataURL(file);
//   };

//   const addFeat = () => {
//     const val = featInput.trim();
//     if (!val) return;
//     const newFeats = val.split(",").map((s) => s.trim()).filter((f) => f && !form.customFeatures.includes(f));
//     if (newFeats.length) set("customFeatures", [...form.customFeatures, ...newFeats]);
//     setFeatInput("");
//   };

//   const handleSave = async () => {
//     if (!form.headline && !form.description) {
//       alert("Please enter at least a headline or description before saving.");
//       setActiveSection("copy");
//       return;
//     }

//     const listingPayload = {
//       listingType: form.listingType,
//       status: form.listingStatus,
//       uniqueID: form.uniqueId,
//       property: {
//         category: form.propStyle,
//         newConstruction: form.newConstruction === "yes",
//         address: {
//           subNumber: form.subNumber,
//           streetNumber: form.streetNum,
//           street: form.street,
//           suburb: form.suburb,
//           state: form.state,
//           postcode: form.postcode,
//           country: "AUS",
//           hideStreetAddress: form.hideStreetAddress,
//         },
//         price: form.priceAud,
//         priceView: form.priceDisplay === "showText" ? form.priceDisplayText : form.priceDisplay === "contactAgent" ? "Contact Agent" : form.priceAud,
//         headline: form.headline,
//         description: form.description,
//         features: {
//           bedrooms: form.bedrooms,
//           bathrooms: form.bathrooms,
//           ensuite: form.ensuites,
//           garages: form.garages,
//           carports: form.carports,
//           openSpaces: form.openSpaces,
//           toilets: form.toilets,
//           livingAreas: form.livingAreas,
//         },
//         landDetails: { area: form.landArea, unit: form.landUnit },
//         buildingDetails: { area: form.buildArea, energyRating: form.energyRating },
//         toggleFeatures: form.toggleFeatures,
//         ecoFeatures: form.ecoFeatures,
//         otherFeatures: form.otherFeatures,
//         images: photos,
//       },
//       vendor: {
//         name: form.vendorName,
//         email: form.vendorEmail,
//         phone: form.vendorPhone,
//         sendCampaignReport: form.sendCampaignReport,
//       },
//       agent: {
//         id: form.agentId,
//         name: form.leadAgentName,
//         mobile: form.agentMobile,
//         email: form.agentEmail,
//       },
//       auction: {
//         date: form.auctionDate,
//         result: form.auctionResult,
//         maximumBid: form.maximumBid,
//       },
//       inspection: { start: form.inspStart, end: form.inspEnd },
//       links: {
//         video: form.videoUrl,
//         onlineTour1: form.onlineTour1,
//         onlineTour2: form.onlineTour2,
//         agencyListing: form.agencyListingUrl,
//       },
//     };

//     try {
//       const res = await fetch("/api/listings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(listingPayload),
//       });
//       const result = await res.json();
//       if (!result.success) throw new Error(result.message);
//       navigate("/listing");
//     } catch (err) {
//       console.error("Save listing error:", err);
//       alert("Error saving listing: " + err.message);
//     }
//   };

//   const goNext = () => {
//     if (sectionIndex < SECTIONS.length - 1)
//       setActiveSection(SECTIONS[sectionIndex + 1].id);
//   };
//   const goPrev = () => {
//     if (sectionIndex > 0)
//       setActiveSection(SECTIONS[sectionIndex - 1].id);
//   };

//   const inp = "w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white";

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">

//       {/* ── TOP NAV ── */}
//       <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
//         <div className="flex items-center gap-3 min-w-0">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="lg:hidden flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <button onClick={() => navigate("/listing")} className="hidden sm:flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition text-sm flex-shrink-0">
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//             Back
//           </button>
//           <span className="hidden sm:block text-gray-200">|</span>
//           <div className="min-w-0">
//             <h1 className="text-sm font-semibold text-gray-800 truncate">Add New Listing</h1>
//             <p className="text-xs text-gray-400 hidden sm:block">
//               {SECTIONS[sectionIndex]?.label} — Step {sectionIndex + 1} of {SECTIONS.length}
//             </p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <button onClick={() => navigate("/listing")} className="hidden sm:block text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
//             Cancel
//           </button>
//           <button onClick={handleSave} className="text-sm bg-[#004f98] text-white px-4 py-2 rounded-lg hover:bg-[#003b75] transition font-medium">
//             Save
//           </button>
//         </div>
//       </header>

//       {/* ── PROGRESS BAR (mobile) ── */}
//       <div className="lg:hidden h-1 bg-gray-100">
//         <div className="h-full bg-[#004f98] transition-all duration-300" style={{ width: `${((sectionIndex + 1) / SECTIONS.length) * 100}%` }} />
//       </div>

//       <div className="flex flex-1 overflow-hidden relative">

//         {/* ── SIDEBAR OVERLAY (mobile) ── */}
//         {sidebarOpen && (
//           <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
//         )}

//         {/* ── SIDEBAR ── */}
//         <aside className={`
//           fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 z-50 flex flex-col
//           transform transition-transform duration-300 ease-in-out
//           lg:static lg:w-56 lg:translate-x-0 lg:flex lg:z-auto lg:h-auto lg:flex-shrink-0
//           ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
//         `}>
//           <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-gray-100">
//             <span className="text-sm font-semibold text-gray-800">Sections</span>
//             <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//           <nav className="flex-1 overflow-y-auto py-3">
//             {SECTIONS.map((s, i) => (
//               <button key={s.id} onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
//                 className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition border-l-2 ${
//                   activeSection === s.id
//                     ? "border-[#004f98] bg-blue-50 text-[#004f98] font-medium"
//                     : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//                 }`}>
//                 <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition ${
//                   activeSection === s.id ? "bg-[#004f98] text-white" : "bg-gray-100 text-gray-400"
//                 }`}>{i + 1}</span>
//                 <span className="flex-1 text-left text-xs leading-tight">{s.label}</span>
//               </button>
//             ))}
//           </nav>
//         </aside>

//         {/* ── MAIN FORM CONTENT ── */}
//         <main className="flex-1 overflow-y-auto">
//           <div className="lg:hidden px-4 pt-4 pb-1">
//             <div className="inline-flex items-center gap-2 bg-blue-50 text-[#004f98] text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
//               <span>{SECTIONS[sectionIndex]?.label}</span>
//               <span className="text-blue-300">·</span>
//               <span className="text-blue-400">{sectionIndex + 1}/{SECTIONS.length}</span>
//             </div>
//           </div>

//           <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-2xl mx-auto lg:mx-0 space-y-4 pb-32 lg:pb-8">

//             {/* ══════════════════════════════════════════
//                 1. CHANGE STATUS
//             ══════════════════════════════════════════ */}
//             {activeSection === "status" && (
//               <>
//                 <SectionHeader title="Change Status" subtitle="Set the current status of this listing" />
//                 <Card>
//                   <Field label="Status" required>
//                     <select value={form.listingStatus} onChange={(e) => set("listingStatus", e.target.value)} className={inp}>
//                       {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
//                     </select>
//                   </Field>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 2. ABOUT THE LISTING
//             ══════════════════════════════════════════ */}
//             {activeSection === "about" && (
//               <>
//                 <SectionHeader title="About the Listing" subtitle="Core listing details" />
//                 <Card title="Listing Type">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field label="Listing Type" required>
//                       <select value={form.listingType} onChange={(e) => set("listingType", e.target.value)} className={inp}>
//                         {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
//                       </select>
//                     </Field>
//                     <Field label="Property Type" required>
//                       <select value={form.propStyle} onChange={(e) => set("propStyle", e.target.value)} className={inp}>
//                         {PROPERTY_STYLES.map((s) => <option key={s}>{s}</option>)}
//                       </select>
//                     </Field>
//                   </div>
//                 </Card>

//                 <Card title="New or Established">
//                   <div className="flex gap-4">
//                     <RadioOption
//                       label="Established property"
//                       checked={form.newConstruction !== "yes"}
//                       onChange={() => set("newConstruction", "")}
//                     />
//                     <RadioOption
//                       label="New construction"
//                       checked={form.newConstruction === "yes"}
//                       onChange={() => set("newConstruction", "yes")}
//                     />
//                   </div>
//                 </Card>

//                 <Card title="Agent">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field label="Lead Agent">
//                       <input value={form.leadAgentName} onChange={(e) => set("leadAgentName", e.target.value)}
//                         placeholder="e.g. Mr. John Doe" className={inp} />
//                     </Field>
//                     <Field label="Dual Agent">
//                       <input value={form.dualAgentName} onChange={(e) => set("dualAgentName", e.target.value)}
//                         placeholder="e.g. Ms. Jane Smith" className={inp} />
//                     </Field>
//                     <Field label="Agent Mobile">
//                       <input value={form.agentMobile} onChange={(e) => set("agentMobile", e.target.value)}
//                         placeholder="04XX XXX XXX" className={inp} />
//                     </Field>
//                     <Field label="Agent Email">
//                       <input type="email" value={form.agentEmail} onChange={(e) => set("agentEmail", e.target.value)}
//                         placeholder="agent@agency.com.au" className={inp} />
//                     </Field>
//                   </div>
//                 </Card>

//                 <Card title="Authority">
//                   <Field label="Authority Type">
//                     <select value={form.authority} onChange={(e) => set("authority", e.target.value)} className={inp}>
//                       {AUTHORITIES.map((a) => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
//                     </select>
//                   </Field>
//                 </Card>

//                 <Card title="Price">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field label="Price (AUD)" required>
//                       <div className="relative">
//                         <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
//                         <input type="number" value={form.priceAud} onChange={(e) => set("priceAud", e.target.value)}
//                           placeholder="0" className={`${inp} pl-8`} />
//                       </div>
//                     </Field>
//                     <Field label="Under Offer?">
//                       <select value={form.underOffer} onChange={(e) => set("underOffer", e.target.value)} className={inp}>
//                         <option value="no">No</option>
//                         <option value="yes">Yes</option>
//                       </select>
//                     </Field>
//                   </div>

//                   <div className="mt-4 space-y-3">
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price Display</label>
//                     <div className="space-y-2">
//                       <RadioOption
//                         label="Show Actual price"
//                         checked={form.priceDisplay === "showActual"}
//                         onChange={() => set("priceDisplay", "showActual")}
//                       />
//                       <RadioOption
//                         label="Show text instead of price"
//                         checked={form.priceDisplay === "showText"}
//                         onChange={() => set("priceDisplay", "showText")}
//                       />
//                       {form.priceDisplay === "showText" && (
//                         <input value={form.priceDisplayText} onChange={(e) => set("priceDisplayText", e.target.value)}
//                           placeholder="e.g. Between $400,000 and $600,000"
//                           className={`${inp} ml-6`} />
//                       )}
//                       <RadioOption
//                         label="Hide the price and display 'Contact Agent'"
//                         checked={form.priceDisplay === "contactAgent"}
//                         onChange={() => set("priceDisplay", "contactAgent")}
//                       />
//                     </div>
//                     {form.priceDisplay === "showText" && (
//                       <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
//                         ⚠️ Note: Listing prices need to be within 10% of the search price to display on listings.
//                       </p>
//                     )}
//                   </div>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 3. VENDOR DETAILS
//             ══════════════════════════════════════════ */}
//             {activeSection === "vendor" && (
//               <>
//                 <SectionHeader title="Vendor Details" subtitle="The vendor information is not displayed on the website" />
//                 <Card>
//                   <div className="space-y-3">
//                     <Field label="Name">
//                       <input value={form.vendorName} onChange={(e) => set("vendorName", e.target.value)}
//                         placeholder="Vendor full name" className={inp} />
//                     </Field>
//                     <Field label="Email">
//                       <input type="email" value={form.vendorEmail} onChange={(e) => set("vendorEmail", e.target.value)}
//                         placeholder="vendor@email.com" className={inp} />
//                     </Field>
//                     <Field label="Phone Number">
//                       <input value={form.vendorPhone} onChange={(e) => set("vendorPhone", e.target.value)}
//                         placeholder="04XX XXX XXX" className={inp} />
//                     </Field>
//                   </div>

//                   <div className="mt-4 pt-4 border-t border-gray-100">
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-3">Communication Preferences</label>
//                     <CheckboxOption
//                       label="Send vendor a weekly Campaign Activity Report email"
//                       checked={form.sendCampaignReport}
//                       onChange={() => toggle("sendCampaignReport")}
//                     />
//                   </div>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 4. PROPERTY ADDRESS
//             ══════════════════════════════════════════ */}
//             {activeSection === "address" && (
//               <>
//                 <SectionHeader title="Property Address" subtitle="The suburb selected cannot be changed once you purchase any additional upgrade options for your listing" />
//                 <Card>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field label="Unit / Sub Number">
//                       <input value={form.subNumber} onChange={(e) => set("subNumber", e.target.value)}
//                         placeholder="e.g. 5A" className={inp} />
//                     </Field>
//                     <Field label="Lot Number">
//                       <input value={form.lotNumber} onChange={(e) => set("lotNumber", e.target.value)}
//                         placeholder="e.g. Lot 12" className={inp} />
//                     </Field>
//                     <Field label="Street Number" required>
//                       <input value={form.streetNum} onChange={(e) => set("streetNum", e.target.value)}
//                         placeholder="e.g. 39" className={inp} />
//                     </Field>
//                     <Field label="Street Name" required>
//                       <input value={form.street} onChange={(e) => set("street", e.target.value)}
//                         placeholder="e.g. Main Road" className={inp} />
//                     </Field>
//                   </div>

//                   <div className="mt-3 space-y-2">
//                     <CheckboxOption
//                       label="Hide street address on listing"
//                       checked={form.hideStreetAddress}
//                       onChange={() => toggle("hideStreetAddress")}
//                     />
//                     <CheckboxOption
//                       label="Hide street view"
//                       checked={form.hideStreetView}
//                       onChange={() => toggle("hideStreetView")}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
//                     <Field label="Suburb" required>
//                       <input value={form.suburb} onChange={(e) => set("suburb", e.target.value)}
//                         placeholder="e.g. Richmond" className={inp} />
//                     </Field>
//                     <Field label="State" required>
//                       <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inp}>
//                         <option value="">— Select —</option>
//                         {STATES_AU.map((s) => <option key={s}>{s}</option>)}
//                       </select>
//                     </Field>
//                     <Field label="Postcode" required>
//                       <input value={form.postcode} onChange={(e) => set("postcode", e.target.value)}
//                         placeholder="e.g. 3121" maxLength={4} className={inp} />
//                     </Field>
//                     <Field label="Municipality">
//                       <input value={form.municipality} onChange={(e) => set("municipality", e.target.value)}
//                         placeholder="e.g. Yarra City Council" className={inp} />
//                     </Field>
//                   </div>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 5. AUCTION OUTCOME
//             ══════════════════════════════════════════ */}
//             {activeSection === "auction" && (
//               <>
//                 <SectionHeader title="Auction Outcome" subtitle="Record the result of the auction" />
//                 <Card>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field label="Auction Result">
//                       <select value={form.auctionResult} onChange={(e) => set("auctionResult", e.target.value)} className={inp}>
//                         {AUCTION_RESULTS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
//                       </select>
//                     </Field>
//                     <Field label="Maximum Bid">
//                       <div className="relative">
//                         <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
//                         <input type="number" value={form.maximumBid} onChange={(e) => set("maximumBid", e.target.value)}
//                           placeholder="e.g. 500000" className={`${inp} pl-8`} />
//                       </div>
//                     </Field>
//                     <Field label="Auction Date & Time">
//                       <input type="datetime-local" value={form.auctionDate} onChange={(e) => set("auctionDate", e.target.value)} className={inp} />
//                     </Field>
//                     <Field label="Sold Price">
//                       <div className="relative">
//                         <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
//                         <input type="number" value={form.soldPrice} onChange={(e) => set("soldPrice", e.target.value)}
//                           placeholder="e.g. 875000" className={`${inp} pl-8`} />
//                       </div>
//                     </Field>
//                     <Field label="Sold Date">
//                       <input type="date" value={form.soldDate} onChange={(e) => set("soldDate", e.target.value)} className={inp} />
//                     </Field>
//                   </div>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 6. ABOUT THE PROPERTY
//             ══════════════════════════════════════════ */}
//             {activeSection === "property" && (
//               <>
//                 <SectionHeader title="About the Property" subtitle="Rooms, sizes and property dimensions" />
//                 <Card title="Rooms">
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                     {[
//                       ["Bedrooms","bedrooms",true],
//                       ["Bathrooms","bathrooms",true],
//                       ["Ensuites","ensuites",false],
//                       ["Toilets","toilets",false],
//                       ["Living Areas","livingAreas",false],
//                     ].map(([label, key, required]) => (
//                       <Field key={key} label={label} required={required}>
//                         <Stepper value={form[key]} onChange={(v) => set(key, v)} />
//                       </Field>
//                     ))}
//                   </div>
//                 </Card>

//                 <Card title="Parking">
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                     {[
//                       ["Garage Spaces","garages"],
//                       ["Carport Spaces","carports"],
//                       ["Open Spaces","openSpaces"],
//                     ].map(([label, key]) => (
//                       <Field key={key} label={label}>
//                         <Stepper value={form[key]} onChange={(v) => set(key, v)} />
//                       </Field>
//                     ))}
//                   </div>
//                 </Card>

//                 <Card title="Size">
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                     <Field label="House Size">
//                       <input type="number" value={form.houseSize} onChange={(e) => set("houseSize", e.target.value)}
//                         placeholder="e.g. 40" className={inp} />
//                     </Field>
//                     <Field label="Size Unit">
//                       <select value={form.houseSizeUnit} onChange={(e) => set("houseSizeUnit", e.target.value)} className={inp}>
//                         <option value="square">Squares</option>
//                         <option value="squareMeter">m²</option>
//                       </select>
//                     </Field>
//                     <Field label="Land Size">
//                       <input type="number" value={form.landArea} onChange={(e) => set("landArea", e.target.value)}
//                         placeholder="e.g. 80" className={inp} />
//                     </Field>
//                     <Field label="Land Unit">
//                       <select value={form.landUnit} onChange={(e) => set("landUnit", e.target.value)} className={inp}>
//                         {LAND_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
//                       </select>
//                     </Field>
//                     <Field label="Building Area (m²)">
//                       <input type="number" value={form.buildArea} onChange={(e) => set("buildArea", e.target.value)}
//                         placeholder="e.g. 180" className={inp} />
//                     </Field>
//                     <Field label="Frontage (m)">
//                       <input type="number" value={form.frontage} onChange={(e) => set("frontage", e.target.value)}
//                         placeholder="e.g. 12" className={inp} />
//                     </Field>
//                     <Field label="Year Built">
//                       <input type="number" value={form.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)}
//                         placeholder="e.g. 2010" className={inp} />
//                     </Field>
//                     <Field label="Floor Level">
//                       <input type="number" value={form.floorLevel} onChange={(e) => set("floorLevel", e.target.value)}
//                         placeholder="e.g. 3" className={inp} />
//                     </Field>
//                     <Field label="Furnishing">
//                       <select value={form.furnishing} onChange={(e) => set("furnishing", e.target.value)} className={inp}>
//                         <option value="">Select</option>
//                         {FURNISHING.map((f) => <option key={f}>{f}</option>)}
//                       </select>
//                     </Field>
//                   </div>
//                 </Card>

//                 <Card title="Energy Efficiency Rating">
//                   <Field label="Energy Rating (0–10)">
//                     <input type="number" value={form.energyRating} onChange={(e) => set("energyRating", e.target.value)}
//                       placeholder="e.g. 4.5" step="0.5" min="0" max="10" className={inp} />
//                   </Field>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 7. SEARCH FEATURES
//             ══════════════════════════════════════════ */}
//             {activeSection === "features" && (
//               <>
//                 <SectionHeader title="Search Refinement Options" subtitle="Select applicable features to help website users refine their search" />

//                 <Card title="Outdoor Features">
//                   <FeatureGrid features={[
//                     "balcony","deck","outdoorEnt","remoteGarage","shed","poolInGround",
//                     "courtyard","fullyFenced","spa","secureParking","poolAboveGround","tennisCourt",
//                   ]} selected={form.toggleFeatures} onToggle={(f) => toggleArr("toggleFeatures", f)} color="blue" />
//                 </Card>

//                 <Card title="Indoor Features">
//                   <FeatureGrid features={[
//                     "alarmSystem","broadband","builtInRobes","dishwasher","vacuumSystem",
//                     "floorboards","gym","spa","intercom","payTV","rumpusRoom","study","workshop",
//                   ]} selected={form.toggleFeatures} onToggle={(f) => toggleArr("toggleFeatures", f)} color="blue" />
//                 </Card>

//                 <Card title="Heating / Cooling">
//                   <FeatureGrid features={[
//                     "airConditioning","ductedCooling","ductedHeating","evaporativeCooling",
//                     "gasHeating","hydronicHeating","openFirePlace","reverseCycleAirCon","splitSystemAirCon",
//                   ]} selected={form.toggleFeatures} onToggle={(f) => toggleArr("toggleFeatures", f)} color="orange" />
//                 </Card>

//                 <Card title="Eco Friendly Features">
//                   <FeatureGrid features={ECO_FEATURES} selected={form.ecoFeatures} onToggle={(f) => toggleArr("ecoFeatures", f)} color="green" />
//                 </Card>

//                 <Card title="Views">
//                   <FeatureGrid features={VIEW_OPTIONS} selected={form.views} onToggle={(f) => toggleArr("views", f)} color="sky" />
//                 </Card>

//                 <Card title="Ideal For">
//                   <FeatureGrid features={IDEAL_FOR} selected={form.idealFor} onToggle={(f) => toggleArr("idealFor", f)} color="purple" />
//                 </Card>

//                 <Card title="Other Features">
//                   <Field label="Additional features (free text)">
//                     <input value={form.otherFeatures} onChange={(e) => set("otherFeatures", e.target.value)}
//                       placeholder="e.g. balcony, courtyard, shed" className={inp} />
//                   </Field>

//                   <div className="mt-4">
//                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Custom Features</label>
//                     <div className="flex gap-2 mb-3">
//                       <input value={featInput} onChange={(e) => setFeatInput(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeat())}
//                         placeholder="e.g. Wine Cellar, Rooftop..." className={`${inp} flex-1 min-w-0`} />
//                       <button type="button" onClick={addFeat}
//                         className="px-4 py-2 bg-[#004f98] text-white text-sm rounded-xl hover:bg-[#003b75] transition flex-shrink-0">
//                         Add
//                       </button>
//                     </div>
//                     {form.customFeatures.length > 0 && (
//                       <div className="flex flex-wrap gap-2">
//                         {form.customFeatures.map((f, i) => (
//                           <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-100">
//                             {f}
//                             <button type="button" onClick={() => set("customFeatures", form.customFeatures.filter((_, j) => j !== i))} className="hover:text-blue-900 transition">
//                               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 8. LISTING COPY
//             ══════════════════════════════════════════ */}
//             {activeSection === "copy" && (
//               <>
//                 <SectionHeader title="Listing Copy" subtitle="Agency/Agent name or contact details should not be entered into the headline field" />
//                 <Card>
//                   <Field label="Headline" required>
//                     <input value={form.headline} onChange={(e) => set("headline", e.target.value)}
//                       placeholder="e.g. SHOW STOPPER!!!" className={inp} />
//                   </Field>
//                   <div className="mt-4">
//                     <Field label="Description" required>
//                       <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
//                         placeholder="Don't pass up an opportunity like this! First to inspect will buy!..." rows={7} className={`${inp} resize-none`} />
//                     </Field>
//                   </div>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 9. PROPERTY IMAGES
//             ══════════════════════════════════════════ */}
//             {activeSection === "images" && (
//               <>
//                 <SectionHeader title="Property Images & Files" subtitle="Upload images, floorplans and documents" />

//                 {/* Main Photos */}
//                 <Card title="Property Images">
//                   <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
//                     onClick={() => photoRef.current.click()}
//                     className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition">
//                     <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
//                       <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
//                       </svg>
//                     </div>
//                     <p className="text-sm font-medium text-gray-700">Drop an image in this area or click to upload</p>
//                     <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — up to 30 images</p>
//                     <input ref={photoRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
//                   </div>
//                   {photos.length > 0 && (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
//                       {photos.map((src, i) => (
//                         <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100">
//                           <img src={src} alt={`photo-${i}`} className="w-full h-full object-cover" />
//                           {i === 0 && <span className="absolute top-2 left-2 bg-[#004f98] text-white text-xs px-2 py-0.5 rounded-full">Main Image</span>}
//                           <button type="button" onClick={() => removePhoto(i)}
//                             className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition">
//                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </Card>

//                 {/* Floorplans */}
//                 <Card title="Floorplans">
//                   <div onClick={() => floorplanRef.current.click()}
//                     className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition">
//                     <p className="text-sm text-gray-500">Drop a Floor plan in this area</p>
//                     <p className="text-xs text-blue-500 mt-1 underline">Add a floorplan</p>
//                     <input ref={floorplanRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFloorplanUpload} />
//                   </div>
//                   {floorplans.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-3">
//                       {floorplans.map((f, i) => (
//                         <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700">
//                           <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                           {f.name}
//                           <button type="button" onClick={() => setFloorplans((p) => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">✕</button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </Card>

//                 {/* Statement of Information */}
//                 <Card title="Statement of Information">
//                   <div onClick={() => soiRef.current.click()}
//                     className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition">
//                     <p className="text-sm text-gray-500">Drop the Statement of Information PDF in this area</p>
//                     <p className="text-xs text-blue-500 mt-1 underline">Add the Statement of Information</p>
//                     <input ref={soiRef} type="file" accept="application/pdf" className="hidden" onChange={handleSoiUpload} />
//                   </div>
//                   {soiFile && (
//                     <div className="flex items-center gap-2 mt-3 bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-xs text-green-700">
//                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       {soiFile}
//                       <button type="button" onClick={() => setSoiFile(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
//                     </div>
//                   )}
//                 </Card>

//                 {/* Front Page Image */}
//                 <Card title="Front Page Image">
//                   <p className="text-xs text-gray-400 mb-3">Only applicable to Residential listings with a Front Page.</p>
//                   <div onClick={() => frontPageRef.current.click()}
//                     className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition">
//                     {frontPageImage
//                       ? <img src={frontPageImage} alt="front page" className="w-full max-h-40 object-cover rounded-lg" />
//                       : <>
//                           <p className="text-sm text-gray-500">Drop a Front Page Image in this area</p>
//                           <p className="text-xs text-blue-500 mt-1 underline">Add a Front Page Image</p>
//                         </>
//                     }
//                     <input ref={frontPageRef} type="file" accept="image/*" className="hidden" onChange={handleFrontPageUpload} />
//                   </div>
//                   {frontPageImage && (
//                     <button type="button" onClick={() => setFrontPageImage(null)} className="mt-2 text-xs text-red-400 hover:text-red-600">Remove image</button>
//                   )}
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 10. LINKS
//             ══════════════════════════════════════════ */}
//             {activeSection === "links" && (
//               <>
//                 <SectionHeader title="Links" subtitle="Add video tours and external listing URLs" />
//                 <Card>
//                   <div className="space-y-4">
//                     <Field label="Video URL">
//                       <div className="flex gap-2">
//                         <input value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)}
//                           placeholder="https://www.youtube.com/..." className={`${inp} flex-1`} />
//                         <button type="button" className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl hover:bg-gray-200 transition flex-shrink-0">Check Link</button>
//                       </div>
//                       <p className="text-xs text-gray-400 mt-1">Include a YouTube video to give potential buyers more information about your property.</p>
//                     </Field>

//                     <Field label="Online Tour 1">
//                       <div className="flex gap-2">
//                         <input value={form.onlineTour1} onChange={(e) => set("onlineTour1", e.target.value)}
//                           placeholder="https://www.realestate.com.au/" className={`${inp} flex-1`} />
//                         <button type="button" className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl hover:bg-gray-200 transition flex-shrink-0">Check Link</button>
//                       </div>
//                     </Field>

//                     <Field label="Online Tour 2">
//                       <div className="flex gap-2">
//                         <input value={form.onlineTour2} onChange={(e) => set("onlineTour2", e.target.value)}
//                           placeholder="https://" className={`${inp} flex-1`} />
//                         <button type="button" className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl hover:bg-gray-200 transition flex-shrink-0">Check Link</button>
//                       </div>
//                       <p className="text-xs text-gray-400 mt-1">3D Tours engage buyers locally and internationally. REA makes your 3D tours prominent across devices when provided.</p>
//                     </Field>

//                     <Field label="Agency Listing URL (applicable only on property.com.au)">
//                       <div className="flex gap-2">
//                         <input value={form.agencyListingUrl} onChange={(e) => set("agencyListingUrl", e.target.value)}
//                           placeholder="https://" className={`${inp} flex-1`} />
//                         <button type="button" className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl hover:bg-gray-200 transition flex-shrink-0">Check Link</button>
//                       </div>
//                     </Field>
//                   </div>
//                 </Card>
//               </>
//             )}

//             {/* ══════════════════════════════════════════
//                 11. INSPECTIONS
//             ══════════════════════════════════════════ */}
//             {activeSection === "inspections" && (
//               <>
//                 <SectionHeader title="Create inspection times" subtitle="Add open for inspection times for this listing" />
//                 <Card>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <Field label="Start Date & Time">
//                       <input type="datetime-local" value={form.inspStart} onChange={(e) => set("inspStart", e.target.value)} className={inp} />
//                     </Field>
//                     <Field label="End Date & Time">
//                       <input type="datetime-local" value={form.inspEnd} onChange={(e) => set("inspEnd", e.target.value)} className={inp} />
//                     </Field>
//                   </div>
//                   <button type="button" className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition font-medium">
//                     + Add Inspection Time
//                   </button>
//                 </Card>
//               </>
//             )}

//             {/* ── PREV / NEXT (desktop) ── */}
//             <div className="hidden lg:flex justify-between items-center pt-4 border-t border-gray-100">
//               <button type="button" onClick={goPrev} disabled={sectionIndex === 0}
//                 className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition">
//                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//                 </svg>
//                 Previous
//               </button>
//               {sectionIndex < SECTIONS.length - 1 ? (
//                 <button type="button" onClick={goNext}
//                   className="flex items-center gap-2 text-sm bg-[#004f98] text-white px-5 py-2.5 rounded-xl hover:bg-[#003b75] transition">
//                   Next: {SECTIONS[sectionIndex + 1]?.label}
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               ) : (
//                 <button type="button" onClick={handleSave}
//                   className="flex items-center gap-2 text-sm bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition font-medium">
//                   Save Listing
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                 </button>
//               )}
//             </div>

//           </div>
//         </main>
//       </div>

//       {/* ── MOBILE BOTTOM NAV ── */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20">
//         <div className="flex items-center justify-between px-4 py-3 gap-3">
//           <button type="button" onClick={goPrev} disabled={sectionIndex === 0}
//             className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-gray-500 border border-gray-200 rounded-xl disabled:opacity-30 transition">
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//             Prev
//           </button>
//           <div className="flex items-center gap-1 flex-shrink-0">
//             {SECTIONS.map((_, i) => (
//               <button key={i} type="button" onClick={() => setActiveSection(SECTIONS[i].id)}
//                 className={`rounded-full transition-all ${i === sectionIndex ? "w-5 h-2 bg-[#004f98]" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`} />
//             ))}
//           </div>
//           {sectionIndex < SECTIONS.length - 1 ? (
//             <button type="button" onClick={goNext}
//               className="flex-1 flex items-center justify-center gap-2 py-3 text-sm bg-[#004f98] text-white rounded-xl transition font-medium">
//               Next
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           ) : (
//             <button type="button" onClick={handleSave}
//               className="flex-1 flex items-center justify-center gap-2 py-3 text-sm bg-green-500 text-white rounded-xl transition font-medium">
//               Save
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//               </svg>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function SectionHeader({ title, subtitle }) {
//   return (
//     <div className="mb-1">
//       <h2 className="text-base font-semibold text-gray-800">{title}</h2>
//       {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
//     </div>
//   );
// }

// function Card({ title, children }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
//       {title && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</p>}
//       {children}
//     </div>
//   );
// }

// function Field({ label, required, children }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//         {label}{required && <span className="text-red-400 ml-0.5">*</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

// function RadioOption({ label, checked, onChange }) {
//   return (
//     <label className="flex items-center gap-2.5 cursor-pointer group">
//       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
//         checked ? "border-[#004f98] bg-[#004f98]" : "border-gray-300 group-hover:border-gray-400"
//       }`}>
//         {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
//       </div>
//       <span className="text-sm text-gray-700">{label}</span>
//       <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
//     </label>
//   );
// }

// function CheckboxOption({ label, checked, onChange }) {
//   return (
//     <label className="flex items-center gap-2.5 cursor-pointer group">
//       <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
//         checked ? "border-[#004f98] bg-[#004f98]" : "border-gray-300 group-hover:border-gray-400"
//       }`}>
//         {checked && (
//           <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//           </svg>
//         )}
//       </div>
//       <span className="text-sm text-gray-700">{label}</span>
//       <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
//     </label>
//   );
// }

// function Stepper({ value, onChange }) {
//   const num = parseInt(value) || 0;
//   return (
//     <div className="flex rounded-xl border border-gray-200 overflow-hidden">
//       <button type="button" onClick={() => onChange(Math.max(0, num - 1))}
//         className="w-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 text-xl transition flex-shrink-0 border-r border-gray-200 active:bg-gray-100">−</button>
//       <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
//         className="flex-1 text-center text-sm font-semibold text-gray-800 py-3 focus:outline-none bg-white min-w-0" min="0" />
//       <button type="button" onClick={() => onChange(num + 1)}
//         className="w-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 text-xl transition flex-shrink-0 border-l border-gray-200 active:bg-gray-100">+</button>
//     </div>
//   );
// }

// const COLOR_MAP = {
//   blue:   { active: "bg-blue-50 border-blue-300 text-blue-700",   base: "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700" },
//   green:  { active: "bg-green-50 border-green-300 text-green-700", base: "border-gray-200 text-gray-500 hover:border-gray-300" },
//   orange: { active: "bg-orange-50 border-orange-300 text-orange-700", base: "border-gray-200 text-gray-500 hover:border-gray-300" },
//   sky:    { active: "bg-sky-50 border-sky-300 text-sky-700",       base: "border-gray-200 text-gray-500 hover:border-gray-300" },
//   purple: { active: "bg-purple-50 border-purple-300 text-purple-700", base: "border-gray-200 text-gray-500 hover:border-gray-300" },
// };

// function FeatureGrid({ features, selected, onToggle, color = "blue" }) {
//   const colors = COLOR_MAP[color] || COLOR_MAP.blue;
//   return (
//     <div className="flex flex-wrap gap-2">
//       {features.map((f) => (
//         <button type="button" key={f} onClick={() => onToggle(f)}
//           className={`text-xs px-3 py-2 rounded-full border transition active:scale-95 font-medium ${
//             selected.includes(f) ? colors.active : colors.base
//           }`}>
//           {f.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
//         </button>
//       ))}
//     </div>
//   );
// }

import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────
const PROPERTY_STYLES = [
  "House","Unit","Apartment","Townhouse","Villa","Flat","Studio","Terrace",
  "Duplex / Semi-detached","Acreage / Semi-rural","Block of Units",
  "Retirement Living","Serviced Apartment","Warehouse","Other",
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
const AUCTION_RESULTS = [
  { value: "", label: "To be determined" },
  { value: "soldPrior", label: "Sold Prior to Auction" },
  { value: "soldAtAuction", label: "Sold at Auction" },
  { value: "passedIn", label: "Passed In" },
  { value: "passedInVendorBid", label: "Passed In - Vendor Bid" },
  { value: "withdrawn", label: "Withdrawn" },
  { value: "soldAfterAuction", label: "Sold after Auction" },
];
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

// ─── Section flow matches REA Agent Admin tabs ────────────────────────────────
const SECTIONS = [
  { id: "status",      label: "Change Status" },
  { id: "about",       label: "About the Listing" },
  { id: "vendor",      label: "Vendor Details" },
  { id: "address",     label: "Property Address" },
  { id: "auction",     label: "Auction Outcome" },
  { id: "property",    label: "About the Property" },
  { id: "features",    label: "Search Features" },
  { id: "copy",        label: "Listing Copy" },
  { id: "images",      label: "Property Images" },
  { id: "links",       label: "Links" },
  { id: "inspections", label: "Inspections" },
];

function camelLabel(s) {
  return s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

const DEFAULT_FORM = {
  // Status
  listingStatus: "active",

  // About the Listing
  listingType: "residential",
  propStyle: "House",
  newConstruction: "",
  leadAgentName: "",
  leadAgentId: "",
  dualAgentName: "",
  dualAgentId: "",
  authority: "exclusive",
  priceAud: "",
  priceDisplay: "showActual",   // showActual | showText | contactAgent
  priceDisplayText: "",
  underOffer: "no",

  // Vendor Details
  vendorName: "",
  vendorEmail: "",
  vendorPhone: "",
  sendCampaignReport: false,

  // Property Address
  subNumber: "",
  lotNumber: "",
  streetNum: "",
  street: "",
  hideStreetAddress: false,
  hideStreetView: false,
  suburb: "",
  state: "",
  postcode: "",
  municipality: "",

  // Auction Outcome
  auctionResult: "",
  maximumBid: "",

  // About the Property
  bedrooms: "",
  bathrooms: "",
  ensuites: "",
  toilets: "",
  garages: "",
  carports: "",
  openSpaces: "",
  livingAreas: "",
  houseSize: "",
  houseSizeUnit: "square",
  landArea: "",
  landUnit: "squareMeter",
  energyRating: "",

  // Features
  toggleFeatures: [],
  ecoFeatures: [],
  views: [],
  idealFor: [],
  otherFeatures: "",
  customFeatures: [],

  // Extra size/build
  frontage: "",
  buildArea: "",
  floorLevel: "",
  furnishing: "",
  yearBuilt: "",

  // Listing Copy
  headline: "",
  description: "",

  // Links
  videoUrl: "",
  onlineTour1: "",
  onlineTour2: "",
  agencyListingUrl: "",

  // Inspections
  inspStart: "",
  inspEnd: "",
  auctionDate: "",
  soldPrice: "",
  soldDate: "",

  // IDs
  agencyId: "32564",
  agentId: "1614718",
  agentMobile: "",
  agentEmail: "",
  uniqueId: "",
  domainClientId: "",
};

export default function AddListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [activeSection, setActiveSection] = useState("status");
  // photos: [{ file: File, preview: string }]
  const [photos, setPhotos] = useState([]);
  // floorplans: [{ file: File, name: string }]
  const [floorplans, setFloorplans] = useState([]);
  // soiFile: File | null
  const [soiFile, setSoiFile] = useState(null);
  // frontPageImage: { file: File, preview: string } | null
  const [frontPageImage, setFrontPageImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [featInput, setFeatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const photoRef = useRef(null);
  const floorplanRef = useRef(null);
  const soiRef = useRef(null);
  const frontPageRef = useRef(null);

  const sectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const toggle = (key) => setForm((p) => ({ ...p, [key]: !p[key] }));
  const toggleArr = (key, val) =>
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter((x) => x !== val) : [...p[key], val],
    }));

  // ── Photo handlers — store File objects + blob preview URLs (no base64) ──
  const handlePhotoUpload = (e) => {
    Array.from(e.target.files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      setPhotos((p) => [...p, { file, preview: URL.createObjectURL(file) }]);
    });
  };
  const removePhoto = (i) => {
    setPhotos((p) => {
      URL.revokeObjectURL(p[i]?.preview);
      return p.filter((_, idx) => idx !== i);
    });
  };
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handlePhotoUpload({ target: { files: e.dataTransfer.files } });
  }, []);

  // ── Floorplan handlers ──
  const handleFloorplanUpload = (e) => {
    Array.from(e.target.files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      setFloorplans((p) => [...p, { file, name: file.name }]);
    });
  };

  // ── SOI handler ──
  const handleSoiUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSoiFile(file);
  };

  // ── Front page image handler ──
  const handleFrontPageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (frontPageImage?.preview) URL.revokeObjectURL(frontPageImage.preview);
    setFrontPageImage({ file, preview: URL.createObjectURL(file) });
  };

  // ── Upload files via multipart FormData — avoids 413 Payload Too Large ──
  const uploadFiles = async (fileList, fieldName = "files") => {
    if (!fileList || fileList.length === 0) return [];
    const fd = new FormData();
    fileList.forEach((f) => fd.append(fieldName, f));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      throw new Error(`Upload failed (${res.status}). Check your /api/upload endpoint.`);
    }
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Upload failed");
    return data.urls; // backend must return: { success: true, urls: ["https://..."] }
  };

  const addFeat = () => {
    const val = featInput.trim();
    if (!val) return;
    const newFeats = val.split(",").map((s) => s.trim()).filter((f) => f && !form.customFeatures.includes(f));
    if (newFeats.length) set("customFeatures", [...form.customFeatures, ...newFeats]);
    setFeatInput("");
  };

  const handleSave = async () => {
    if (!form.headline && !form.description) {
      alert("Please enter at least a headline or description before saving.");
      setActiveSection("copy");
      return;
    }

    setSaving(true);
    try {
      // ── Step 1: Upload all files separately via multipart (avoids 413) ──
      const [photoUrls, floorplanUrls, soiUrls, frontPageUrls] = await Promise.all([
        uploadFiles(photos.map((p) => p.file), "photos"),
        uploadFiles(floorplans.map((f) => f.file), "floorplans"),
        soiFile ? uploadFiles([soiFile], "soi") : Promise.resolve([]),
        frontPageImage ? uploadFiles([frontPageImage.file], "frontPage") : Promise.resolve([]),
      ]);

      // ── Step 2: Build lean JSON payload — URLs only, no base64 ──
      const listingPayload = {
        listingType: form.listingType,
        status: form.listingStatus,
        uniqueID: form.uniqueId,
        property: {
          category: form.propStyle,
          newConstruction: form.newConstruction === "yes",
          address: {
            subNumber: form.subNumber,
            streetNumber: form.streetNum,
            street: form.street,
            suburb: form.suburb,
            state: form.state,
            postcode: form.postcode,
            country: "AUS",
            hideStreetAddress: form.hideStreetAddress,
          },
          price: form.priceAud,
          priceView:
            form.priceDisplay === "showText"
              ? form.priceDisplayText
              : form.priceDisplay === "contactAgent"
              ? "Contact Agent"
              : form.priceAud,
          headline: form.headline,
          description: form.description,
          features: {
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            ensuite: form.ensuites,
            garages: form.garages,
            carports: form.carports,
            openSpaces: form.openSpaces,
            toilets: form.toilets,
            livingAreas: form.livingAreas,
          },
          landDetails: { area: form.landArea, unit: form.landUnit },
          buildingDetails: { area: form.buildArea, energyRating: form.energyRating },
          toggleFeatures: form.toggleFeatures,
          ecoFeatures: form.ecoFeatures,
          otherFeatures: form.otherFeatures,
          images: photoUrls,
          floorplans: floorplanUrls,
          statementOfInformation: soiUrls[0] || null,
          frontPageImage: frontPageUrls[0] || null,
        },
        vendor: {
          name: form.vendorName,
          email: form.vendorEmail,
          phone: form.vendorPhone,
          sendCampaignReport: form.sendCampaignReport,
        },
        agent: {
          id: form.agentId,
          name: form.leadAgentName,
          mobile: form.agentMobile,
          email: form.agentEmail,
        },
        auction: {
          date: form.auctionDate,
          result: form.auctionResult,
          maximumBid: form.maximumBid,
        },
        inspection: { start: form.inspStart, end: form.inspEnd },
        links: {
          video: form.videoUrl,
          onlineTour1: form.onlineTour1,
          onlineTour2: form.onlineTour2,
          agencyListing: form.agencyListingUrl,
        },
      };

      // ── Step 3: POST lean JSON listing ──
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingPayload),
      });

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        throw new Error(`Server returned ${res.status} ${res.statusText}. Check your /api/listings endpoint.`);
      }
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Save failed");
      navigate("/listing");

    } catch (err) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        alert("Cannot reach the server. Please check your backend is running.");
      } else {
        console.error("Save listing error:", err);
        alert("Error saving listing: " + err.message);
      }
    } finally {
      setSaving(false);
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
              {SECTIONS[sectionIndex]?.label} — Step {sectionIndex + 1} of {SECTIONS.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => navigate("/listing")} className="hidden sm:block text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="text-sm bg-[#004f98] text-white px-4 py-2 rounded-lg hover:bg-[#003b75] transition font-medium disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* ── PROGRESS BAR (mobile) ── */}
      <div className="lg:hidden h-1 bg-gray-100">
        <div className="h-full bg-[#004f98] transition-all duration-300" style={{ width: `${((sectionIndex + 1) / SECTIONS.length) * 100}%` }} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── SIDEBAR OVERLAY (mobile) ── */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:static lg:w-56 lg:translate-x-0 lg:flex lg:z-auto lg:h-auto lg:flex-shrink-0
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}>
          <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">Sections</span>
            <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-3">
            {SECTIONS.map((s, i) => (
              <button key={s.id} onClick={() => { setActiveSection(s.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition border-l-2 ${
                  activeSection === s.id
                    ? "border-[#004f98] bg-blue-50 text-[#004f98] font-medium"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition ${
                  activeSection === s.id ? "bg-[#004f98] text-white" : "bg-gray-100 text-gray-400"
                }`}>{i + 1}</span>
                <span className="flex-1 text-left text-xs leading-tight">{s.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── MAIN FORM CONTENT ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="lg:hidden px-4 pt-4 pb-1">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#004f98] text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
              <span>{SECTIONS[sectionIndex]?.label}</span>
              <span className="text-blue-300">·</span>
              <span className="text-blue-400">{sectionIndex + 1}/{SECTIONS.length}</span>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-2xl mx-auto lg:mx-0 space-y-4 pb-32 lg:pb-8">

            {/* ══════════════════════════════════════════
                1. CHANGE STATUS
            ══════════════════════════════════════════ */}
            {activeSection === "status" && (
              <>
                <SectionHeader title="Change Status" subtitle="Set the current status of this listing" />
                <Card>
                  <Field label="Status" required>
                    <select value={form.listingStatus} onChange={(e) => set("listingStatus", e.target.value)} className={inp}>
                      {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </Field>
                  <p className="text-xs text-gray-400 mt-3 p-3 bg-gray-50 rounded-xl">
                    💡 If the listing has been sold by another agency, mark the property as <strong>Off Market</strong> if you want to keep a record.
                  </p>
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                2. ABOUT THE LISTING
            ══════════════════════════════════════════ */}
            {activeSection === "about" && (
              <>
                <SectionHeader title="About the Listing" subtitle="Core listing details" />
                <Card title="Listing Type">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Listing Type" required>
                      <select value={form.listingType} onChange={(e) => set("listingType", e.target.value)} className={inp}>
                        {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Property Type" required>
                      <select value={form.propStyle} onChange={(e) => set("propStyle", e.target.value)} className={inp}>
                        {PROPERTY_STYLES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                </Card>

                <Card title="New or Established">
                  <div className="flex gap-4">
                    <RadioOption
                      label="Established property"
                      checked={form.newConstruction !== "yes"}
                      onChange={() => set("newConstruction", "")}
                    />
                    <RadioOption
                      label="New construction"
                      checked={form.newConstruction === "yes"}
                      onChange={() => set("newConstruction", "yes")}
                    />
                  </div>
                </Card>

                <Card title="Agent">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Lead Agent">
                      <input value={form.leadAgentName} onChange={(e) => set("leadAgentName", e.target.value)}
                        placeholder="e.g. Mr. John Doe" className={inp} />
                    </Field>
                    <Field label="Dual Agent">
                      <input value={form.dualAgentName} onChange={(e) => set("dualAgentName", e.target.value)}
                        placeholder="e.g. Ms. Jane Smith" className={inp} />
                    </Field>
                    <Field label="Agent Mobile">
                      <input value={form.agentMobile} onChange={(e) => set("agentMobile", e.target.value)}
                        placeholder="04XX XXX XXX" className={inp} />
                    </Field>
                    <Field label="Agent Email">
                      <input type="email" value={form.agentEmail} onChange={(e) => set("agentEmail", e.target.value)}
                        placeholder="agent@agency.com.au" className={inp} />
                    </Field>
                  </div>
                </Card>

                <Card title="Authority">
                  <Field label="Authority Type">
                    <select value={form.authority} onChange={(e) => set("authority", e.target.value)} className={inp}>
                      {AUTHORITIES.map((a) => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                    </select>
                  </Field>
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
                    <Field label="Under Offer?">
                      <select value={form.underOffer} onChange={(e) => set("underOffer", e.target.value)} className={inp}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4 space-y-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Price Display</label>
                    <div className="space-y-2">
                      <RadioOption
                        label="Show Actual price"
                        checked={form.priceDisplay === "showActual"}
                        onChange={() => set("priceDisplay", "showActual")}
                      />
                      <RadioOption
                        label="Show text instead of price"
                        checked={form.priceDisplay === "showText"}
                        onChange={() => set("priceDisplay", "showText")}
                      />
                      {form.priceDisplay === "showText" && (
                        <input value={form.priceDisplayText} onChange={(e) => set("priceDisplayText", e.target.value)}
                          placeholder="e.g. Between $400,000 and $600,000"
                          className={`${inp} ml-6`} />
                      )}
                      <RadioOption
                        label="Hide the price and display 'Contact Agent'"
                        checked={form.priceDisplay === "contactAgent"}
                        onChange={() => set("priceDisplay", "contactAgent")}
                      />
                    </div>
                    {form.priceDisplay === "showText" && (
                      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                        ⚠️ Note: Listing prices need to be within 10% of the search price to display on listings.
                      </p>
                    )}
                  </div>
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                3. VENDOR DETAILS
            ══════════════════════════════════════════ */}
            {activeSection === "vendor" && (
              <>
                <SectionHeader title="Vendor Details" subtitle="The vendor information is not displayed on the website" />
                <Card>
                  <div className="space-y-3">
                    <Field label="Name">
                      <input value={form.vendorName} onChange={(e) => set("vendorName", e.target.value)}
                        placeholder="Vendor full name" className={inp} />
                    </Field>
                    <Field label="Email">
                      <input type="email" value={form.vendorEmail} onChange={(e) => set("vendorEmail", e.target.value)}
                        placeholder="vendor@email.com" className={inp} />
                    </Field>
                    <Field label="Phone Number">
                      <input value={form.vendorPhone} onChange={(e) => set("vendorPhone", e.target.value)}
                        placeholder="04XX XXX XXX" className={inp} />
                    </Field>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-3">Communication Preferences</label>
                    <CheckboxOption
                      label="Send vendor a weekly Campaign Activity Report email"
                      checked={form.sendCampaignReport}
                      onChange={() => toggle("sendCampaignReport")}
                    />
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-3">
                      ⚠️ Note: From 30th October 2025 the option to send a listing live email will be removed. More insights and listing campaign performance reports are available in <span className="underline cursor-pointer">Ignite</span>.
                    </p>
                  </div>
                </Card>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700 space-y-2">
                  <p className="font-semibold">ℹ️ About vendor communications:</p>
                  <p><strong>Property Live email</strong> — Sent to the vendor informing them that the listing has been published.</p>
                  <p><strong>Campaign Activity Report</strong> — Contains information about the effectiveness of your marketing such as email enquiries and property views. Delivered weekly while the property is for sale.</p>
                </div>
              </>
            )}

            {/* ══════════════════════════════════════════
                4. PROPERTY ADDRESS
            ══════════════════════════════════════════ */}
            {activeSection === "address" && (
              <>
                <SectionHeader title="Property Address" subtitle="The suburb selected cannot be changed once you purchase any additional upgrade options for your listing" />
                <Card>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Unit / Sub Number">
                      <input value={form.subNumber} onChange={(e) => set("subNumber", e.target.value)}
                        placeholder="e.g. 5A" className={inp} />
                    </Field>
                    <Field label="Lot Number">
                      <input value={form.lotNumber} onChange={(e) => set("lotNumber", e.target.value)}
                        placeholder="e.g. Lot 12" className={inp} />
                    </Field>
                    <Field label="Street Number" required>
                      <input value={form.streetNum} onChange={(e) => set("streetNum", e.target.value)}
                        placeholder="e.g. 39" className={inp} />
                    </Field>
                    <Field label="Street Name" required>
                      <input value={form.street} onChange={(e) => set("street", e.target.value)}
                        placeholder="e.g. Main Road" className={inp} />
                    </Field>
                  </div>

                  <div className="mt-3 space-y-2">
                    <CheckboxOption
                      label="Hide street address on listing"
                      checked={form.hideStreetAddress}
                      onChange={() => toggle("hideStreetAddress")}
                    />
                    <CheckboxOption
                      label="Hide street view"
                      checked={form.hideStreetView}
                      onChange={() => toggle("hideStreetView")}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <Field label="Suburb" required>
                      <input value={form.suburb} onChange={(e) => set("suburb", e.target.value)}
                        placeholder="e.g. Richmond" className={inp} />
                    </Field>
                    <Field label="State" required>
                      <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inp}>
                        <option value="">— Select —</option>
                        {STATES_AU.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Postcode" required>
                      <input value={form.postcode} onChange={(e) => set("postcode", e.target.value)}
                        placeholder="e.g. 3121" maxLength={4} className={inp} />
                    </Field>
                    <Field label="Municipality">
                      <input value={form.municipality} onChange={(e) => set("municipality", e.target.value)}
                        placeholder="e.g. Yarra City Council" className={inp} />
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                5. AUCTION OUTCOME
            ══════════════════════════════════════════ */}
            {activeSection === "auction" && (
              <>
                <SectionHeader title="Auction Outcome" subtitle="Record the result of the auction" />
                <Card>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Auction Result">
                      <select value={form.auctionResult} onChange={(e) => set("auctionResult", e.target.value)} className={inp}>
                        {AUCTION_RESULTS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Maximum Bid">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input type="number" value={form.maximumBid} onChange={(e) => set("maximumBid", e.target.value)}
                          placeholder="e.g. 500000" className={`${inp} pl-8`} />
                      </div>
                    </Field>
                    <Field label="Auction Date & Time">
                      <input type="datetime-local" value={form.auctionDate} onChange={(e) => set("auctionDate", e.target.value)} className={inp} />
                    </Field>
                    <Field label="Sold Price">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input type="number" value={form.soldPrice} onChange={(e) => set("soldPrice", e.target.value)}
                          placeholder="e.g. 875000" className={`${inp} pl-8`} />
                      </div>
                    </Field>
                    <Field label="Sold Date">
                      <input type="date" value={form.soldDate} onChange={(e) => set("soldDate", e.target.value)} className={inp} />
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                6. ABOUT THE PROPERTY
            ══════════════════════════════════════════ */}
            {activeSection === "property" && (
              <>
                <SectionHeader title="About the Property" subtitle="Rooms, sizes and property dimensions" />
                <Card title="Rooms">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ["Bedrooms","bedrooms",true],
                      ["Bathrooms","bathrooms",true],
                      ["Ensuites","ensuites",false],
                      ["Toilets","toilets",false],
                      ["Living Areas","livingAreas",false],
                    ].map(([label, key, required]) => (
                      <Field key={key} label={label} required={required}>
                        <Stepper value={form[key]} onChange={(v) => set(key, v)} />
                      </Field>
                    ))}
                  </div>
                </Card>

                <Card title="Parking">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ["Garage Spaces","garages"],
                      ["Carport Spaces","carports"],
                      ["Open Spaces","openSpaces"],
                    ].map(([label, key]) => (
                      <Field key={key} label={label}>
                        <Stepper value={form[key]} onChange={(v) => set(key, v)} />
                      </Field>
                    ))}
                  </div>
                </Card>

                <Card title="Size">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Field label="House Size">
                      <input type="number" value={form.houseSize} onChange={(e) => set("houseSize", e.target.value)}
                        placeholder="e.g. 40" className={inp} />
                    </Field>
                    <Field label="Size Unit">
                      <select value={form.houseSizeUnit} onChange={(e) => set("houseSizeUnit", e.target.value)} className={inp}>
                        <option value="square">Squares</option>
                        <option value="squareMeter">m²</option>
                      </select>
                    </Field>
                    <Field label="Land Size">
                      <input type="number" value={form.landArea} onChange={(e) => set("landArea", e.target.value)}
                        placeholder="e.g. 80" className={inp} />
                    </Field>
                    <Field label="Land Unit">
                      <select value={form.landUnit} onChange={(e) => set("landUnit", e.target.value)} className={inp}>
                        {LAND_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Building Area (m²)">
                      <input type="number" value={form.buildArea} onChange={(e) => set("buildArea", e.target.value)}
                        placeholder="e.g. 180" className={inp} />
                    </Field>
                    <Field label="Frontage (m)">
                      <input type="number" value={form.frontage} onChange={(e) => set("frontage", e.target.value)}
                        placeholder="e.g. 12" className={inp} />
                    </Field>
                    <Field label="Year Built">
                      <input type="number" value={form.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)}
                        placeholder="e.g. 2010" className={inp} />
                    </Field>
                    <Field label="Floor Level">
                      <input type="number" value={form.floorLevel} onChange={(e) => set("floorLevel", e.target.value)}
                        placeholder="e.g. 3" className={inp} />
                    </Field>
                    <Field label="Furnishing">
                      <select value={form.furnishing} onChange={(e) => set("furnishing", e.target.value)} className={inp}>
                        <option value="">Select</option>
                        {FURNISHING.map((f) => <option key={f}>{f}</option>)}
                      </select>
                    </Field>
                  </div>
                </Card>

                <Card title="Energy Efficiency Rating">
                  <Field label="Energy Rating (0–10)">
                    <input type="number" value={form.energyRating} onChange={(e) => set("energyRating", e.target.value)}
                      placeholder="e.g. 4.5" step="0.5" min="0" max="10" className={inp} />
                  </Field>
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                7. SEARCH FEATURES
            ══════════════════════════════════════════ */}
            {activeSection === "features" && (
              <>
                <SectionHeader title="Search Refinement Options" subtitle="Select applicable features to help website users refine their search" />

                <Card title="Outdoor Features">
                  <FeatureGrid features={[
                    "balcony","deck","outdoorEnt","remoteGarage","shed","poolInGround",
                    "courtyard","fullyFenced","spa","secureParking","poolAboveGround","tennisCourt",
                  ]} selected={form.toggleFeatures} onToggle={(f) => toggleArr("toggleFeatures", f)} color="blue" />
                </Card>

                <Card title="Indoor Features">
                  <FeatureGrid features={[
                    "alarmSystem","broadband","builtInRobes","dishwasher","vacuumSystem",
                    "floorboards","gym","spa","intercom","payTV","rumpusRoom","study","workshop",
                  ]} selected={form.toggleFeatures} onToggle={(f) => toggleArr("toggleFeatures", f)} color="blue" />
                </Card>

                <Card title="Heating / Cooling">
                  <FeatureGrid features={[
                    "airConditioning","ductedCooling","ductedHeating","evaporativeCooling",
                    "gasHeating","hydronicHeating","openFirePlace","reverseCycleAirCon","splitSystemAirCon",
                  ]} selected={form.toggleFeatures} onToggle={(f) => toggleArr("toggleFeatures", f)} color="orange" />
                </Card>

                <Card title="Eco Friendly Features">
                  <FeatureGrid features={ECO_FEATURES} selected={form.ecoFeatures} onToggle={(f) => toggleArr("ecoFeatures", f)} color="green" />
                </Card>

                <Card title="Views">
                  <FeatureGrid features={VIEW_OPTIONS} selected={form.views} onToggle={(f) => toggleArr("views", f)} color="sky" />
                </Card>

                <Card title="Ideal For">
                  <FeatureGrid features={IDEAL_FOR} selected={form.idealFor} onToggle={(f) => toggleArr("idealFor", f)} color="purple" />
                </Card>

                <Card title="Other Features">
                  <Field label="Additional features (free text)">
                    <input value={form.otherFeatures} onChange={(e) => set("otherFeatures", e.target.value)}
                      placeholder="e.g. balcony, courtyard, shed" className={inp} />
                  </Field>

                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Custom Features</label>
                    <div className="flex gap-2 mb-3">
                      <input value={featInput} onChange={(e) => setFeatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeat())}
                        placeholder="e.g. Wine Cellar, Rooftop..." className={`${inp} flex-1 min-w-0`} />
                      <button type="button" onClick={addFeat}
                        className="px-4 py-2 bg-[#004f98] text-white text-sm rounded-xl hover:bg-[#003b75] transition flex-shrink-0">
                        Add
                      </button>
                    </div>
                    {form.customFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {form.customFeatures.map((f, i) => (
                          <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-100">
                            {f}
                            <button type="button" onClick={() => set("customFeatures", form.customFeatures.filter((_, j) => j !== i))} className="hover:text-blue-900 transition">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                8. LISTING COPY
            ══════════════════════════════════════════ */}
            {activeSection === "copy" && (
              <>
                <SectionHeader title="Listing Copy" subtitle="Agency/Agent name or contact details should not be entered into the headline field" />
                <Card>
                  <Field label="Headline" required>
                    <input value={form.headline} onChange={(e) => set("headline", e.target.value)}
                      placeholder="e.g. SHOW STOPPER!!!" className={inp} />
                  </Field>
                  <div className="mt-4">
                    <Field label="Description" required>
                      <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                        placeholder="Don't pass up an opportunity like this! First to inspect will buy!..." rows={7} className={`${inp} resize-none`} />
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                9. PROPERTY IMAGES
            ══════════════════════════════════════════ */}
            {activeSection === "images" && (
              <>
                <SectionHeader title="Property Images & Files" subtitle="Upload images, floorplans and documents" />

                {/* Main Photos */}
                <Card title="Property Images">
                  <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                    onClick={() => photoRef.current.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700">Drop an image in this area or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — up to 30 images</p>
                    <input ref={photoRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} />
                  </div>
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {photos.map((photo, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100">
                          <img src={photo.preview} alt={`photo-${i}`} className="w-full h-full object-cover" />
                          {i === 0 && <span className="absolute top-2 left-2 bg-[#004f98] text-white text-xs px-2 py-0.5 rounded-full">Main Image</span>}
                          <button type="button" onClick={() => removePhoto(i)}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Floorplans */}
                <Card title="Floorplans">
                  <div onClick={() => floorplanRef.current.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition">
                    <p className="text-sm text-gray-500">Drop a Floor plan in this area</p>
                    <p className="text-xs text-blue-500 mt-1 underline">Add a floorplan</p>
                    <input ref={floorplanRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFloorplanUpload} />
                  </div>
                  {floorplans.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {floorplans.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {f.name}
                          <button type="button" onClick={() => setFloorplans((p) => p.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Statement of Information */}
                <Card title="Statement of Information">
                  <div onClick={() => soiRef.current.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition">
                    <p className="text-sm text-gray-500">Drop the Statement of Information PDF in this area</p>
                    <p className="text-xs text-blue-500 mt-1 underline">Add the Statement of Information</p>
                    <input ref={soiRef} type="file" accept="application/pdf" className="hidden" onChange={handleSoiUpload} />
                  </div>
                  {soiFile && (
                    <div className="flex items-center gap-2 mt-3 bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-xs text-green-700">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {soiFile.name}
                      <button type="button" onClick={() => setSoiFile(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                    </div>
                  )}
                </Card>

                {/* Front Page Image */}
                <Card title="Front Page Image">
                  <p className="text-xs text-gray-400 mb-3">Only applicable to Residential listings with a Front Page.</p>
                  <div onClick={() => frontPageRef.current.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition">
                    {frontPageImage
                      ? <img src={frontPageImage.preview} alt="front page" className="w-full max-h-40 object-cover rounded-lg" />
                      : <>
                          <p className="text-sm text-gray-500">Drop a Front Page Image in this area</p>
                          <p className="text-xs text-blue-500 mt-1 underline">Add a Front Page Image</p>
                        </>
                    }
                    <input ref={frontPageRef} type="file" accept="image/*" className="hidden" onChange={handleFrontPageUpload} />
                  </div>
                  {frontPageImage && (
                    <button type="button" onClick={() => setFrontPageImage(null)} className="mt-2 text-xs text-red-400 hover:text-red-600">Remove image</button>
                  )}
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                10. LINKS
            ══════════════════════════════════════════ */}
            {activeSection === "links" && (
              <>
                <SectionHeader title="Links" subtitle="Add video tours and external listing URLs" />
                <Card>
                  <div className="space-y-4">
                    <Field label="Video URL">
                      <div className="flex gap-2">
                        <input value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)}
                          placeholder="https://www.youtube.com/..." className={`${inp} flex-1`} />
                        <button type="button" className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl hover:bg-gray-200 transition flex-shrink-0">Check Link</button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Include a YouTube video to give potential buyers more information about your property.</p>
                    </Field>

                    <Field label="Online Tour 1">
                      <div className="flex gap-2">
                        <input value={form.onlineTour1} onChange={(e) => set("onlineTour1", e.target.value)}
                          placeholder="https://www.realestate.com.au/" className={`${inp} flex-1`} />
                        <button type="button" className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl hover:bg-gray-200 transition flex-shrink-0">Check Link</button>
                      </div>
                    </Field>

                    <Field label="Online Tour 2">
                      <div className="flex gap-2">
                        <input value={form.onlineTour2} onChange={(e) => set("onlineTour2", e.target.value)}
                          placeholder="https://" className={`${inp} flex-1`} />
                        <button type="button" className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl hover:bg-gray-200 transition flex-shrink-0">Check Link</button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">3D Tours engage buyers locally and internationally. REA makes your 3D tours prominent across devices when provided.</p>
                    </Field>

                    <Field label="Agency Listing URL (applicable only on property.com.au)">
                      <div className="flex gap-2">
                        <input value={form.agencyListingUrl} onChange={(e) => set("agencyListingUrl", e.target.value)}
                          placeholder="https://" className={`${inp} flex-1`} />
                        <button type="button" className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-xl hover:bg-gray-200 transition flex-shrink-0">Check Link</button>
                      </div>
                    </Field>
                  </div>
                </Card>
              </>
            )}

            {/* ══════════════════════════════════════════
                11. INSPECTIONS
            ══════════════════════════════════════════ */}
            {activeSection === "inspections" && (
              <>
                <SectionHeader title="Create inspection times" subtitle="Add open for inspection times for this listing" />
                <Card>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Start Date & Time">
                      <input type="datetime-local" value={form.inspStart} onChange={(e) => set("inspStart", e.target.value)} className={inp} />
                    </Field>
                    <Field label="End Date & Time">
                      <input type="datetime-local" value={form.inspEnd} onChange={(e) => set("inspEnd", e.target.value)} className={inp} />
                    </Field>
                  </div>
                  <button type="button" className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition font-medium">
                    + Add Inspection Time
                  </button>
                </Card>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700 space-y-2">
                  <p className="font-semibold">📰 Display inspections in Saturday's Herald Sun</p>
                  <p>Weekend Open for Inspections, loaded before 5pm every Monday will automatically appear. There will also be a number of properties selected to be featured with photo and full details. Reach the readers of Australia's biggest-selling newspaper at no cost.</p>
                  <p className="text-blue-500">*Please note: Open for Inspection times will be displayed subject to the availability of advertising space. Herald Sun does not guarantee that all properties will appear in the Weekend Open for Inspection section.</p>
                </div>
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
                  Next: {SECTIONS[sectionIndex + 1]?.label}
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

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <button type="button" onClick={goPrev} disabled={sectionIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-gray-500 border border-gray-200 rounded-xl disabled:opacity-30 transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <div className="flex items-center gap-1 flex-shrink-0">
            {SECTIONS.map((_, i) => (
              <button key={i} type="button" onClick={() => setActiveSection(SECTIONS[i].id)}
                className={`rounded-full transition-all ${i === sectionIndex ? "w-5 h-2 bg-[#004f98]" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`} />
            ))}
          </div>
          {sectionIndex < SECTIONS.length - 1 ? (
            <button type="button" onClick={goNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm bg-[#004f98] text-white rounded-xl transition font-medium">
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button type="button" onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm bg-green-500 text-white rounded-xl transition font-medium">
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

function RadioOption({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
        checked ? "border-[#004f98] bg-[#004f98]" : "border-gray-300 group-hover:border-gray-400"
      }`}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

function CheckboxOption({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
        checked ? "border-[#004f98] bg-[#004f98]" : "border-gray-300 group-hover:border-gray-400"
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

function Stepper({ value, onChange }) {
  const num = parseInt(value) || 0;
  return (
    <div className="flex rounded-xl border border-gray-200 overflow-hidden">
      <button type="button" onClick={() => onChange(Math.max(0, num - 1))}
        className="w-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 text-xl transition flex-shrink-0 border-r border-gray-200 active:bg-gray-100">−</button>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-center text-sm font-semibold text-gray-800 py-3 focus:outline-none bg-white min-w-0" min="0" />
      <button type="button" onClick={() => onChange(num + 1)}
        className="w-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 text-xl transition flex-shrink-0 border-l border-gray-200 active:bg-gray-100">+</button>
    </div>
  );
}

const COLOR_MAP = {
  blue:   { active: "bg-blue-50 border-blue-300 text-blue-700",   base: "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700" },
  green:  { active: "bg-green-50 border-green-300 text-green-700", base: "border-gray-200 text-gray-500 hover:border-gray-300" },
  orange: { active: "bg-orange-50 border-orange-300 text-orange-700", base: "border-gray-200 text-gray-500 hover:border-gray-300" },
  sky:    { active: "bg-sky-50 border-sky-300 text-sky-700",       base: "border-gray-200 text-gray-500 hover:border-gray-300" },
  purple: { active: "bg-purple-50 border-purple-300 text-purple-700", base: "border-gray-200 text-gray-500 hover:border-gray-300" },
};

function FeatureGrid({ features, selected, onToggle, color = "blue" }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div className="flex flex-wrap gap-2">
      {features.map((f) => (
        <button type="button" key={f} onClick={() => onToggle(f)}
          className={`text-xs px-3 py-2 rounded-full border transition active:scale-95 font-medium ${
            selected.includes(f) ? colors.active : colors.base
          }`}>
          {f.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
        </button>
      ))}
    </div>
  );
}