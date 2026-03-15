// import { useState, useEffect } from "react";
// import realestatelogo from "../images/realestate.png";
// import domainlogo from "../images/domainlogo.jpg";
// import { useSyncStatus } from "./useSyncStatus";

// export default function SyncModal({ onClose, listings, onEditListing, initialPortalStatus = "none", onStatusChange, startAtStep = 0 }) {
//   const [step, setStep] = useState(startAtStep);  // ← uses startAtStep so "Publish Listings" opens Step 2 directly
//   const [activePortal, setActivePortal] = useState(startAtStep === 2 ? "realestate" : null); // ← pre-set portal if jumping to step 2
//   const [instructionsExpanded, setInstructionsExpanded] = useState(false);
//   const [selectedListings, setSelectedListings] = useState([]);
//   const [publishingListings, setPublishingListings] = useState(false);
//   const [publishedSuccess, setPublishedSuccess] = useState(false);
//   const [activationLoading, setActivationLoading] = useState(false);
//   const [pollActive, setPollActive] = useState(initialPortalStatus === "pending");

//   const { status: liveStatus, ticketNumber } = useSyncStatus(pollActive);
//   const portalStatus = pollActive ? liveStatus : initialPortalStatus;

//   const API_URL = import.meta.env.VITE_API_URL;
//   // ── Notify Listing.jsx when status changes — updates banner button live ──
//   useEffect(() => {
//     if (liveStatus === "pending")   onStatusChange?.("pending");
//     if (liveStatus === "connected") onStatusChange?.("connected");
//   }, [liveStatus]);

//   const portals = [
//     { id: "realestate", label: "Realestate AU", logo: realestatelogo },
//     { id: "domain", label: "Domain AU", logo: domainlogo },
//   ];
//   const activePortalData = portals.find((p) => p.id === activePortal);

//   const toggleListing = (id) =>
//     setSelectedListings((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);

//   const selectAll = () =>
//     setSelectedListings(selectedListings.length === listings.length ? [] : listings.map((l) => l.id));

//   const handlePortalActivation = async () => {
//     if (activePortal === "realestate") {
//       setActivationLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_URL}/api/portal/setup-sync`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (data.success) {
//           setPollActive(true);
//           onStatusChange?.("pending");
//         } else {
//           alert("Failed to start sync. Please try again.");
//         }
//       } catch (err) {
//         console.error("Activation error:", err);
//         alert("Server error. Please try again.");
//       } finally {
//         setActivationLoading(false);
//       }
//     } else {
//       const res = await fetch(`${API_URL}/api/portal/activate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ portal: activePortal }),
//       });
//       const data = await res.json();
//       if (data.success) alert("Portal Activated Successfully");
//     }
//   };

//   const handleRetry = async () => {
//     setActivationLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       await fetch(`${API_URL}/api/portal/retry`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
//       setPollActive(true);
//       onStatusChange?.("pending");
//     } catch (err) {
//       console.error("Retry error:", err);
//     } finally {
//       setActivationLoading(false);
//     }
//   };

//   const handlePublishListings = async () => {
//     if (selectedListings.length === 0) { alert("Please select at least one listing."); return; }
//     setPublishingListings(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`${API_URL}/api/listings/publish`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ listingIds: selectedListings, portal: "realestate" }),
//       });
//       const data = await res.json();
//       if (data.success) setPublishedSuccess(true);
//       else alert("Publish failed. Please try again.");
//     } catch (err) {
//       console.error("Publish error:", err);
//     } finally {
//       setPublishingListings(false);
//     }
//   };

//   const renderREAActionButton = () => {
//     if (portalStatus === "connected") {
//       return (
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
//             <span className="text-green-500">✅</span>
//             <div>
//               <p className="text-sm text-green-700 font-semibold">REA Portal Connected!</p>
//               <p className="text-xs text-green-600">{ticketNumber ? `Ticket #${ticketNumber} confirmed` : "Confirmation email received"}</p>
//             </div>
//           </div>
//           <button onClick={() => setStep(2)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
//             🚀 Publish to Realestate AU
//           </button>
//         </div>
//       );
//     }
//     if (portalStatus === "pending") {
//       return (
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
//             <svg className="animate-spin w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
//             </svg>
//             <div>
//               <p className="text-sm text-blue-700 font-semibold">Watching inbox for REA email...</p>
//             </div>
//           </div>
//           <button disabled className="bg-gray-200 text-gray-400 cursor-not-allowed px-5 py-2 rounded-lg text-sm">
//             ⏳ Awaiting REA Confirmation...
//           </button>
//         </div>
//       );
//     }
//     if (portalStatus === "timeout") {
//       return (
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
//             <span className="text-orange-500">⚠️</span>
//             <div>
//               <p className="text-sm text-orange-700 font-semibold">No response from REA in 72 hours</p>
//               <p className="text-xs text-orange-500">Contact REA support or retry</p>
//             </div>
//           </div>
//           <button onClick={handleRetry} disabled={activationLoading}
//             className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg text-sm transition">
//             {activationLoading ? "Retrying..." : "🔄 Retry Setup"}
//           </button>
//         </div>
//       );
//     }
//     return (
//       <button onClick={handlePortalActivation} disabled={activationLoading}
//         className="bg-[#004f98] hover:bg-[#003b75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm transition flex items-center gap-2">
//         {activationLoading ? (
//           <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
//           </svg>Starting...</>
//         ) : `Confirm ${activePortalData?.label}'s Activation`}
//       </button>
//     );
//   };

//   const renderInstructions = () => {
//     if (activePortal === "realestate") {
//       return (
//         <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
//           <ol className="divide-y divide-gray-100">
//             {["Log into Agent Admin","Go to XML Uploads","Click Change My Uploader","Select Listings API","Choose AI Evoked","Submit"].map((item, i) => (
//               <li key={i} className="flex items-center gap-4 px-5 py-3">
//                 <span className="w-6 h-6 rounded-full bg-[#004f98] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</span>
//                 <span className="text-sm text-gray-600">{item}</span>
//               </li>
//             ))}
//           </ol>
//         </div>
//       );
//     }
//     if (activePortal === "domain") {
//       return (
//         <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
//           <div className="flex items-start gap-4 px-5 py-4">
//             <span className="w-5 h-5 rounded-full bg-[#004f98] flex items-center justify-center flex-shrink-0 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-white"></span></span>
//             <p className="text-sm text-gray-600">Notify <a href="mailto:api@domain.com.au" className="text-[#004f98] hover:underline">api@domain.com.au</a> with the client ID you wish to use to upload listings.</p>
//           </div>
//           <div className="flex items-start gap-4 px-5 py-4">
//             <span className="w-5 h-5 rounded-full bg-[#004f98] flex items-center justify-center flex-shrink-0 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-white"></span></span>
//             <p className="text-sm text-gray-600">Send an email to the agency's principal, cc'ing <a href="mailto:api@domain.com.au" className="text-[#004f98] hover:underline">api@domain.com.au</a> for approval to upload listings on their behalf.</p>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-[750px] rounded-2xl shadow-2xl overflow-hidden">

//         {/* STEP 0 — MANAGE PORTALS */}
//         {step === 0 && (
//           <div className="p-10">
//             <h2 className="text-xl font-semibold text-gray-800 mb-8">Manage Portals</h2>
//             <div className="flex justify-center gap-10">
//               {portals.map((portal) => (
//                 <div key={portal.id} className="w-[280px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
//                   <div className="h-36 flex items-center justify-center bg-gray-50">
//                     <img src={portal.logo} alt={portal.label} className="h-12 object-contain" />
//                   </div>
//                   <div className="p-5">
//                     <div className="flex justify-between items-center mb-4">
//                       <span className="font-medium text-gray-800">{portal.label}</span>
//                       <span className={`text-xs px-3 py-1 rounded-full text-white ${portal.id === "realestate" && portalStatus === "connected" ? "bg-green-500" : "bg-[#004f98]"}`}>
//                         {portal.id === "realestate" && portalStatus === "connected" ? "Connected" : "Inactive"}
//                       </span>
//                     </div>
//                     <button
//                       onClick={() => { setActivePortal(portal.id); setStep(1); }}
//                       className="w-full bg-[#004f98] text-white py-2 rounded-xl hover:bg-[#003b75] transition">
//                       {portal.id === "realestate" && portalStatus === "connected" ? "Manage Portal" : "Activate Portal"}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-10 text-center">
//               <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
//             </div>
//           </div>
//         )}

//         {/* STEP 1 — ACTIVATION */}
//         {step === 1 && (
//           <div>
//             <div className="flex border-b border-gray-200">
//               {portals.map((portal) => (
//                 <button key={portal.id} onClick={() => { setActivePortal(portal.id); setInstructionsExpanded(false); }}
//                   className={`flex-1 py-4 text-sm font-medium transition-colors ${activePortal === portal.id ? "border-b-2 border-gray-800 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
//                   Integrate with {portal.label}
//                 </button>
//               ))}
//             </div>
//             <div className="p-8">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-base font-semibold text-gray-800">Steps to integrate with {activePortalData?.label}</h2>
//                 {activePortalData && <img src={activePortalData.logo} alt={activePortalData.label} className="h-8 object-contain" />}
//               </div>
//               <div className="space-y-7">
//                 <div className="flex items-start gap-4">
//                   <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
//                   <div className="w-full">
//                     <p className="text-sm text-gray-400 mb-3">
//                       {activePortal === "realestate" ? "Follow the steps below to activate the listings feed on Realestate AU." : "Follow the steps below to get approval and activate listings on Domain AU."}
//                     </p>
//                     <button onClick={() => setInstructionsExpanded(!instructionsExpanded)}
//                       className="w-full flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition">
//                       <span>{activePortal === "realestate" ? "Steps to activate on Realestate AU Agent Admin" : "Steps to get Domain AU approval"}</span>
//                       <svg className={`w-4 h-4 transition-transform ${instructionsExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </button>
//                     {instructionsExpanded && renderInstructions()}
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
//                   <div className="w-full">
//                     <p className="text-sm text-gray-400 mb-3">
//                       {activePortal === "realestate" ? (
//                         portalStatus === "none"      ? "Once you have completed the steps above, please confirm by clicking the button below." :
//                         portalStatus === "pending"   ? "Your request has been submitted. Waiting for REA to confirm via email..." :
//                         portalStatus === "connected" ? "Portal is connected! Click Publish to select listings and go live." :
//                         "No response from REA. Please retry or contact REA support."
//                       ) : "Once you have completed the steps above, please confirm by clicking the button below."}
//                     </p>
//                     {activePortal === "realestate" ? renderREAActionButton() : (
//                       <button onClick={handlePortalActivation} className="bg-[#004f98] hover:bg-[#003b75] text-white px-5 py-2 rounded-lg text-sm transition">
//                         Confirm {activePortalData?.label}'s Activation
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-10 flex justify-between items-center">
//                 <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* STEP 2 — SELECT LISTINGS (only after portal connected) */}
//         {step === 2 && (
//           <div className="p-8">
//             {publishedSuccess ? (
//               <div className="text-center py-10">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-3xl">✅</span>
//                 </div>
//                 <h2 className="text-lg font-semibold text-gray-800 mb-2">Listings Published!</h2>
//                 <p className="text-sm text-gray-500 mb-6">{selectedListings.length} listing{selectedListings.length !== 1 ? "s" : ""} sent to Realestate AU</p>
//                 <button onClick={onClose} className="bg-[#004f98] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#003b75] transition">Done</button>
//               </div>
//             ) : (
//               <>
//                 <div className="flex justify-between items-center mb-6">
//                   <div>
//                     <h2 className="text-base font-semibold text-gray-800">Select Listings to Publish</h2>
//                     <p className="text-xs text-gray-400 mt-1">Choose which listings to send to Realestate AU</p>
//                   </div>
//                   <img src={realestatelogo} alt="Realestate AU" className="h-7 object-contain" />
//                 </div>
//                 <div className="flex items-center justify-between mb-4">
//                   <button onClick={selectAll} className="text-sm text-[#004f98] hover:underline">
//                     {selectedListings.length === listings.length ? "Deselect All" : "Select All"}
//                   </button>
//                   <span className="text-xs text-gray-400">{selectedListings.length} of {listings.length} selected</span>
//                 </div>
//                 <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
//                   {listings.length === 0 ? (
//                     <p className="text-sm text-gray-400 text-center py-8">No listings available</p>
//                   ) : listings.map((listing) => (
//                     <div key={listing.id} onClick={() => toggleListing(listing.id)}
//                       className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition ${selectedListings.includes(listing.id) ? "border-[#004f98] bg-blue-50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}>
//                       <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition ${selectedListings.includes(listing.id) ? "bg-[#004f98] border-[#004f98]" : "border-gray-300"}`}>
//                         {selectedListings.includes(listing.id) && (
//                           <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                           </svg>
//                         )}
//                       </div>
//                       {listing.image ? (
//                         <img src={listing.image} alt={listing.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
//                       ) : (
//                         <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
//                       )}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-gray-800 truncate">{listing.title}</p>
//                         <p className="text-xs text-gray-400 truncate">{listing.location}</p>
//                       </div>
//                       <p className="text-sm font-semibold text-[#004f98] flex-shrink-0">{listing.price}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//                   <button onClick={() => setStep(0)} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
//                   <button onClick={handlePublishListings} disabled={selectedListings.length === 0 || publishingListings}
//                     className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
//                     {publishingListings ? (
//                       <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
//                       </svg>Publishing...</>
//                     ) : `Publish ${selectedListings.length > 0 ? `(${selectedListings.length})` : ""} to REA`}
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import realestatelogo from "../images/realestate.png";
import domainlogo from "../images/domainlogo.jpg";
import { useSyncStatus } from "./useSyncStatus";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function SyncModal({
  onClose,
  listings = [],
  onEditListing,
  initialPortalStatus = "none",
  onStatusChange,
  startAtStep = 0,
}) {
  const [step, setStep] = useState(startAtStep);
  const [activePortal, setActivePortal] = useState(startAtStep === 2 ? "realestate" : null);
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);
  const [selectedListings, setSelectedListings] = useState([]);
  const [publishingListings, setPublishingListings] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const [pollActive, setPollActive] = useState(initialPortalStatus === "pending");

  // ── Credentials form state ──
  const [agentId, setAgentId]           = useState("");
  const [clientId, setClientId]         = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showSecret, setShowSecret]     = useState(false);
  const [credError, setCredError]       = useState("");

  const { status: liveStatus, ticketNumber } = useSyncStatus(pollActive);
  const portalStatus = pollActive ? liveStatus : initialPortalStatus;

  useEffect(() => {
    if (liveStatus === "pending")   onStatusChange?.("pending");
    if (liveStatus === "connected") onStatusChange?.("connected");
  }, [liveStatus]);

  const portals = [
    { id: "realestate", label: "Realestate AU", logo: realestatelogo },
    { id: "domain",     label: "Domain AU",     logo: domainlogo },
  ];
  const activePortalData = portals.find((p) => p.id === activePortal);

  const toggleListing = (id) =>
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );

  const selectAll = () =>
    setSelectedListings(
      selectedListings.length === listings.length ? [] : listings.map((l) => l.id)
    );

  // ─────────────────────────────────────────────────
  // CONFIRM ACTIVATION
  // Sends agentId + clientId + clientSecret to backend
  // ─────────────────────────────────────────────────
  const handlePortalActivation = async () => {
    if (activePortal === "realestate") {
      // Validate credentials
      if (!agentId.trim() || !clientId.trim() || !clientSecret.trim()) {
        setCredError("All 3 fields are required before confirming.");
        return;
      }
      setCredError("");
      setActivationLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/portal/setup-sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            agentId:      agentId.trim(),
            clientId:     clientId.trim(),
            clientSecret: clientSecret.trim(),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setPollActive(true);
          onStatusChange?.("pending");
        } else {
          setCredError(data.message || "Failed to start sync. Please try again.");
        }
      } catch (err) {
        console.error("Activation error:", err);
        setCredError("Server error. Please try again.");
      } finally {
        setActivationLoading(false);
      }
    } else {
      // Domain AU — original flow
      const res = await fetch(`${API_URL}/api/portal/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal: activePortal }),
      });
      const data = await res.json();
      if (data.success) alert("Portal Activated Successfully");
    }
  };

  const handleRetry = async () => {
    setActivationLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/portal/retry`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPollActive(true);
      onStatusChange?.("pending");
    } catch (err) {
      console.error("Retry error:", err);
    } finally {
      setActivationLoading(false);
    }
  };

  // ─────────────────────────────────────────────────
  // PUBLISH LISTINGS
  // Calls /api/portal/publish with selected listing IDs
  // ─────────────────────────────────────────────────
  const handlePublishListings = async () => {
    if (selectedListings.length === 0) {
      alert("Please select at least one listing.");
      return;
    }
    setPublishingListings(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/portal/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingIds: selectedListings }),
      });
      const data = await res.json();
      if (data.success) {
        setPublishedSuccess(true);
      } else {
        // Show partial failures if any
        const failedCount = data.failed?.length || 0;
        if (failedCount > 0) {
          alert(`${data.published?.length} published, ${failedCount} failed. Check console for details.`);
          console.error("Failed listings:", data.failed);
        } else {
          alert(data.message || "Publish failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Server error. Please try again.");
    } finally {
      setPublishingListings(false);
    }
  };

  // ─────────────────────────────────────────────────
  // CREDENTIALS FORM (shown before Confirm button)
  // ─────────────────────────────────────────────────
  const renderCredentialsForm = () => {
    // Already connected — show summary, not form
    if (portalStatus === "connected" || portalStatus === "pending") return null;

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-4">
          Enter your REA credentials
          <span className="ml-2 text-xs font-normal text-gray-400">
            Find these in your REA Partner Portal
          </span>
        </p>

        {/* Agent ID */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            REA Agent ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="e.g. XNWTEL"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004f98]/30 focus:border-[#004f98]"
          />
        </div>

        {/* Client ID */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Client ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="e.g. 3539d925-bb88-48c1-9ecc-..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#004f98]/30 focus:border-[#004f98]"
          />
        </div>

        {/* Client Secret */}
        <div className="mb-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Client Secret <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="e.g. 89a599d9-7006-4a7b-..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#004f98]/30 focus:border-[#004f98]"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSecret ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {credError && (
          <p className="text-xs text-red-500 mt-2">{credError}</p>
        )}

        <p className="text-xs text-gray-400 mt-3">
          🔒 Credentials are encrypted and stored securely. Never shared.
        </p>
      </div>
    );
  };

  const renderREAActionButton = () => {
    if (portalStatus === "connected") {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <span className="text-green-500">✅</span>
            <div>
              <p className="text-sm text-green-700 font-semibold">REA Portal Connected!</p>
              <p className="text-xs text-green-600">
                {ticketNumber ? `Ticket #${ticketNumber} confirmed` : "Confirmation email received"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            🚀 Publish to Realestate AU
          </button>
        </div>
      );
    }
    if (portalStatus === "pending") {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <svg className="animate-spin w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <div>
              <p className="text-sm text-blue-700 font-semibold">Watching inbox for REA email...</p>
              <p className="text-xs text-blue-500">Page updates automatically when confirmed</p>
            </div>
          </div>
          <button disabled className="bg-gray-200 text-gray-400 cursor-not-allowed px-5 py-2 rounded-lg text-sm">
            ⏳ Awaiting REA Confirmation...
          </button>
        </div>
      );
    }
    if (portalStatus === "timeout") {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <span className="text-orange-500">⚠️</span>
            <div>
              <p className="text-sm text-orange-700 font-semibold">No response from REA in 72 hours</p>
              <p className="text-xs text-orange-500">Contact REA support or retry</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            disabled={activationLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg text-sm transition"
          >
            {activationLoading ? "Retrying..." : "🔄 Retry Setup"}
          </button>
        </div>
      );
    }

    // Default — none state — show credentials form + confirm button
    return (
      <div className="flex flex-col gap-3">
        {renderCredentialsForm()}
        <button
          onClick={handlePortalActivation}
          disabled={activationLoading}
          className="bg-[#004f98] hover:bg-[#003b75] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm transition flex items-center gap-2"
        >
          {activationLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving & Starting...
            </>
          ) : `Confirm ${activePortalData?.label}'s Activation`}
        </button>
      </div>
    );
  };

  const renderInstructions = () => {
    if (activePortal === "realestate") {
      return (
        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
          <ol className="divide-y divide-gray-100">
            {["Log into Agent Admin","Go to XML Uploads","Click Change My Uploader","Select Listings API","Choose AI Evoked","Submit"].map((item, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3">
                <span className="w-6 h-6 rounded-full bg-[#004f98] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <span className="text-sm text-gray-600">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    }
    if (activePortal === "domain") {
      return (
        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
          <div className="flex items-start gap-4 px-5 py-4">
            <span className="w-5 h-5 rounded-full bg-[#004f98] flex items-center justify-center flex-shrink-0 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-white"></span></span>
            <p className="text-sm text-gray-600">Notify <a href="mailto:api@domain.com.au" className="text-[#004f98] hover:underline">api@domain.com.au</a> with the client ID you wish to use.</p>
          </div>
          <div className="flex items-start gap-4 px-5 py-4">
            <span className="w-5 h-5 rounded-full bg-[#004f98] flex items-center justify-center flex-shrink-0 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-white"></span></span>
            <p className="text-sm text-gray-600">Send an email to the agency's principal, cc'ing <a href="mailto:api@domain.com.au" className="text-[#004f98] hover:underline">api@domain.com.au</a> for approval.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[750px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

        {/* STEP 0 — MANAGE PORTALS */}
        {step === 0 && (
          <div className="p-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-8">Manage Portals</h2>
            <div className="flex justify-center gap-10">
              {portals.map((portal) => (
                <div key={portal.id} className="w-[280px] bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="h-36 flex items-center justify-center bg-gray-50">
                    <img src={portal.logo} alt={portal.label} className="h-12 object-contain" />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-gray-800">{portal.label}</span>
                      <span className={`text-xs px-3 py-1 rounded-full text-white ${portal.id === "realestate" && portalStatus === "connected" ? "bg-green-500" : "bg-[#004f98]"}`}>
                        {portal.id === "realestate" && portalStatus === "connected" ? "Connected" : "Inactive"}
                      </span>
                    </div>
                    <button
                      onClick={() => { setActivePortal(portal.id); setStep(1); }}
                      className="w-full bg-[#004f98] text-white py-2 rounded-xl hover:bg-[#003b75] transition"
                    >
                      {portal.id === "realestate" && portalStatus === "connected" ? "Manage Portal" : "Activate Portal"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
            </div>
          </div>
        )}

        {/* STEP 1 — ACTIVATION */}
        {step === 1 && (
          <div>
            <div className="flex border-b border-gray-200">
              {portals.map((portal) => (
                <button
                  key={portal.id}
                  onClick={() => { setActivePortal(portal.id); setInstructionsExpanded(false); }}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${activePortal === portal.id ? "border-b-2 border-gray-800 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Integrate with {portal.label}
                </button>
              ))}
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-base font-semibold text-gray-800">Steps to integrate with {activePortalData?.label}</h2>
                {activePortalData && <img src={activePortalData.logo} alt={activePortalData.label} className="h-8 object-contain" />}
              </div>
              <div className="space-y-7">
                {/* Instructions */}
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                  <div className="w-full">
                    <p className="text-sm text-gray-400 mb-3">
                      {activePortal === "realestate"
                        ? "Follow the steps below to activate the listings feed on Realestate AU."
                        : "Follow the steps below to get approval and activate listings on Domain AU."}
                    </p>
                    <button
                      onClick={() => setInstructionsExpanded(!instructionsExpanded)}
                      className="w-full flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition"
                    >
                      <span>{activePortal === "realestate" ? "Steps to activate on Realestate AU Agent Admin" : "Steps to get Domain AU approval"}</span>
                      <svg className={`w-4 h-4 transition-transform ${instructionsExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {instructionsExpanded && renderInstructions()}
                  </div>
                </div>

                {/* Credentials + Action */}
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                  <div className="w-full">
                    <p className="text-sm text-gray-400 mb-3">
                      {activePortal === "realestate" ? (
                        portalStatus === "none"      ? "Enter your REA credentials and confirm activation below." :
                        portalStatus === "pending"   ? "Credentials saved. Waiting for REA to confirm via email..." :
                        portalStatus === "connected" ? "Portal connected! Click Publish to go live." :
                        "No response from REA. Please retry."
                      ) : "Once you have completed the steps above, please confirm by clicking the button below."}
                    </p>
                    {activePortal === "realestate"
                      ? renderREAActionButton()
                      : (
                        <button
                          onClick={handlePortalActivation}
                          className="bg-[#004f98] hover:bg-[#003b75] text-white px-5 py-2 rounded-lg text-sm transition"
                        >
                          Confirm {activePortalData?.label}'s Activation
                        </button>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-between items-center">
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — SELECT LISTINGS */}
        {step === 2 && (
          <div className="p-8">
            {publishedSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✅</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Listings Published!</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {selectedListings.length} listing{selectedListings.length !== 1 ? "s" : ""} sent to Realestate AU
                </p>
                <button onClick={onClose} className="bg-[#004f98] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#003b75] transition">Done</button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">Select Listings to Publish</h2>
                    <p className="text-xs text-gray-400 mt-1">Choose which listings to send to Realestate AU</p>
                  </div>
                  <img src={realestatelogo} alt="Realestate AU" className="h-7 object-contain" />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={selectAll} className="text-sm text-[#004f98] hover:underline">
                    {selectedListings.length === listings.length ? "Deselect All" : "Select All"}
                  </button>
                  <span className="text-xs text-gray-400">{selectedListings.length} of {listings.length} selected</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
                  {listings.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No listings available</p>
                  ) : listings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => toggleListing(listing.id)}
                      className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition ${selectedListings.includes(listing.id) ? "border-[#004f98] bg-blue-50" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition ${selectedListings.includes(listing.id) ? "bg-[#004f98] border-[#004f98]" : "border-gray-300"}`}>
                        {selectedListings.includes(listing.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {listing.image
                        ? <img src={listing.image} alt={listing.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        : <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{listing.title}</p>
                        <p className="text-xs text-gray-400 truncate">{listing.location}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#004f98] flex-shrink-0">{listing.price}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button onClick={() => setStep(0)} className="text-gray-400 hover:text-gray-600 text-sm">← Back</button>
                  <button
                    onClick={handlePublishListings}
                    disabled={selectedListings.length === 0 || publishingListings}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    {publishingListings ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Publishing...
                      </>
                    ) : `Publish ${selectedListings.length > 0 ? `(${selectedListings.length})` : ""} to REA`}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}