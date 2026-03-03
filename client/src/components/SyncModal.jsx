import { useState } from "react";
import realestatelogo from "../images/realestate.png";
import domainlogo from "../images/domainlogo.jpg";

export default function SyncModal({
  onClose,
  listings = [],
  onEditListing,
  onConfirmSelection,
  loadingListings = false,
}) {
  const [step, setStep] = useState(0);
  const [activePortal, setActivePortal] = useState(null);
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);
  const [selectedListings, setSelectedListings] = useState([]);

  const portals = [
    { id: "realestate", label: "Realestate AU", logo: realestatelogo },
    { id: "domain", label: "Domain AU", logo: domainlogo },
  ];

  const activePortalData = portals.find((p) => p.id === activePortal);

  const toggleListing = (id) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedListings.length === listings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(listings.map((l) => l.id));
    }
  };

  const handleConfirmSelection = () => {
    if (onConfirmSelection) {
      onConfirmSelection(selectedListings, activePortal);
    }
    setStep(1);
  };

  // Portal-specific instructions
  const renderInstructions = () => {
    if (activePortal === "realestate") {
      return (
        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
          <ol className="divide-y divide-gray-100">
            {[
              "Log into Agent Admin",
              "Go to XML Uploads",
              "Click Change My Uploader",
              "Select Listings API",
              "Choose AI Evoked",
              "Submit",
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3">
                <span className="w-6 h-6 rounded-full bg-[#004f98] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600">{step}</span>
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
            <span className="w-5 h-5 rounded-full bg-[#004f98] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004f98]"></span>
            </span>
            <p className="text-sm text-gray-600">
              Notify{" "}
              <a href="mailto:api@domain.com.au" className="text-[#004f98] hover:underline">
                api@domain.com.au
              </a>{" "}
              with the client ID you wish to use to upload listings.
            </p>
          </div>
          <div className="flex items-start gap-4 px-5 py-4">
            <span className="w-5 h-5 rounded-full bg-[#004f98] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004f98]"></span>
            </span>
            <p className="text-sm text-gray-600">
              Send an email to the agency's principal, cc'ing{" "}
              <a href="mailto:api@domain.com.au" className="text-[#004f98] hover:underline">
                api@domain.com.au
              </a>{" "}
              for approval to upload listings on their behalf. If the agency currently uses different sources for e.g. residential and commercial listings, please be specific.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[750px] rounded-2xl shadow-2xl overflow-hidden">

        {/* ================= STEP 0 : MANAGE PORTALS ================= */}
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
                      <span className="text-xs px-3 py-1 rounded-full bg-[#004f98] text-white">Inactive</span>
                    </div>
                    <button
                      onClick={() => { setActivePortal(portal.id); setStep(1); }}
                      className="w-full bg-[#004f98] text-white py-2 rounded-xl hover:bg-[#003b75] transition"
                    >
                      Activate Portal
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

        {/* ================= STEP 1 : TIMELINE INTEGRATION ================= */}
        {step === 1 && (
          <div>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {portals.map((portal) => (
                <button
                  key={portal.id}
                  onClick={() => { setActivePortal(portal.id); setInstructionsExpanded(false); }}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activePortal === portal.id
                      ? "border-b-2 border-gray-800 text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Integrate with {portal.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-base font-semibold text-gray-800">
                  Steps to integrate with {activePortalData?.label}
                </h2>
                {activePortalData && (
                  <img src={activePortalData.logo} alt={activePortalData.label} className="h-8 object-contain" />
                )}
              </div>

              <div className="space-y-7">

                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#004f98] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Add at least one listing on the platform</p>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#004f98]"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-3">
                      Select one or more listings you would want to integrate and sync with {activePortalData?.label}
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      className="bg-[#004f98] text-white px-5 py-2 rounded-lg text-sm hover:bg-[#004f98] transition"
                    >
                      Select Listings to Sync with {activePortalData?.label}
                    </button>
                  </div>
                </div>

                {/* Step 3 — Portal-specific instructions */}
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
                  <div className="w-full">
                    <p className="text-sm text-gray-400 mb-3">
                      {activePortal === "realestate"
                        ? "Follow the steps below to activate the listings feed on Realestate AU."
                        : "Follow the steps below to get approval and activate listings on Domain AU."}
                    </p>

                    {/* Accordion Toggle */}
                    <button
                      onClick={() => setInstructionsExpanded(!instructionsExpanded)}
                      className="w-full flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500 hover:bg-gray-50 transition"
                    >
                      <span>
                        {activePortal === "realestate"
                          ? "Steps to activate on Realestate AU Agent Admin"
                          : "Steps to get Domain AU approval"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${instructionsExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {instructionsExpanded && renderInstructions()}
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 bg-white"></div>
                  <div>
                    <p className="text-sm text-gray-400 mb-3">
                      Once you have completed the steps above, please confirm by clicking the button below.
                    </p>
                    <button className="bg-[#004f98] hover:bg-[#004f98] text-white px-5 py-2 rounded-lg text-sm transition">
                      Confirm {activePortalData?.label}'s Activation
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center">
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm transition">
                  Confirm Activation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2 : LISTING SELECTION ================= */}
        {step === 2 && (
          <div className="flex flex-col max-h-[85vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-800 transition">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-base font-semibold text-gray-800">
                  Select the listings you want to add to {activePortalData?.label}
                </h2>
              </div>

              {!loadingListings && listings.length > 0 && (
                <button
                  onClick={selectAll}
                  className="flex items-center gap-1.5 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  {selectedListings.length === listings.length ? "Deselect All" : "Select All +"}
                </button>
              )}
            </div>

            {/* Listings Body */}
            <div className="overflow-y-auto flex-1 px-8 py-4">

              {loadingListings && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <svg className="w-8 h-8 animate-spin mb-3 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-sm">Loading your listings...</p>
                </div>
              )}

              {!loadingListings && listings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <p className="text-sm font-medium text-gray-500 mb-1">No listings found</p>
                  <p className="text-xs text-gray-400">Add a listing to your platform first to sync it here.</p>
                </div>
              )}

              {!loadingListings && listings.length > 0 && (
                <div className="space-y-3">
                  {listings.map((listing) => {
                    const isSelected = selectedListings.includes(listing.id);
                    return (
                      <div
                        key={listing.id}
                        className={`flex items-center gap-5 rounded-xl border p-4 transition ${
                          isSelected ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-[140px] h-[95px] object-cover rounded-lg flex-shrink-0 bg-gray-100"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm">{listing.title}</span>
                            {listing.pendingFields && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium whitespace-nowrap">
                                Pending Fields
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span>{listing.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{listing.price?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span>{listing.bedrooms} Bedrooms · {listing.bathrooms} Full Baths · {listing.sqft?.toLocaleString()} SQ.FT.</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleListing(listing.id)}
                            className={`flex items-center gap-1.5 border rounded-lg px-4 py-1.5 text-sm transition ${
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : "Select +"}
                          </button>

                          {listing.pendingFields && onEditListing && (
                            <button
                              onClick={() => onEditListing(listing.id)}
                              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition"
                            >
                              Edit Listing
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {selectedListings.length} listing{selectedListings.length !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={handleConfirmSelection}
                disabled={selectedListings.length === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Selection
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}