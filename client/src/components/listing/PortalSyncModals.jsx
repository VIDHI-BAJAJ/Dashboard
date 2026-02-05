import { useState } from "react";
import { CloseIcon } from "./ListingIcons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Base modal wrapper - dark theme glass style
 */
function ModalBase({ children, onClose, isLightMode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
          isLightMode
            ? "bg-white/95 border border-white/50"
            : "bg-slate-900/95 border border-white/10"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose, isLightMode }) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-white/10">
      <h3
        className={`text-lg font-semibold ${
          isLightMode ? "text-gray-900" : "text-gray-100"
        }`}
      >
        {title}
      </h3>
      <button
        type="button"
        onClick={onClose}
        className={`p-2 rounded-lg transition-colors ${
          isLightMode
            ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            : "text-gray-400 hover:text-gray-200 hover:bg-white/10"
        }`}
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

/**
 * Modal 1 — Manage Portals
 */
export function ManagePortalsModal({
  onClose,
  onActivateMagicbricks,
  portalConnection,
  isLightMode,
}) {
  const isMagicbricksConnected = portalConnection?.portal === "magicbricks";
  const statusLabel = !portalConnection
    ? "Inactive"
    : portalConnection.status === "PENDING"
    ? "Connected (Verification Pending)"
    : "Connected";
  const statusClasses =
    !portalConnection || !isMagicbricksConnected
      ? "bg-amber-500/20 text-amber-600"
      : "bg-blue-500/20 text-blue-400";

  return (
    <ModalBase onClose={onClose} isLightMode={isLightMode}>
      <ModalHeader title="Manage Portals" onClose={onClose} isLightMode={isLightMode} />
      <div className="p-6 space-y-4">
        <div
          className={`flex items-center justify-between p-4 rounded-xl ${
            isLightMode ? "bg-gray-50" : "bg-white/5"
          }`}
        >
          <div>
            <p className={`font-medium ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
              Magicbricks
            </p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusClasses}`}>
              {statusLabel}
            </span>
          </div>
          {!isMagicbricksConnected && (
            <button
              type="button"
              onClick={onActivateMagicbricks}
              className="px-4 py-2 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors"
            >
              Activate Portal
            </button>
          )}
        </div>
      </div>
    </ModalBase>
  );
}

/**
 * Project Required modal — shown when no listing has projectId
 */
export function ProjectRequiredModal({
  onClose,
  onAttachProject,
  isLightMode,
}) {
  return (
    <ModalBase onClose={onClose} isLightMode={isLightMode}>
      <ModalHeader title="Project Required to Sync" onClose={onClose} isLightMode={isLightMode} />
      <div className="p-6 space-y-4">
        <p className={isLightMode ? "text-gray-700" : "text-gray-300"}>
          To connect Magicbricks, at least one listing must be linked to a project.
        </p>
        <p className={`text-sm ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
        Magicbricks requires listings to belong to a project before activation.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-medium border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAttachProject}
            className="flex-1 px-4 py-3 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors"
          >
            Attach Project to Listing
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

/**
 * Step 1 — Prerequisite confirmation
 */
export function IntegrationStep1Modal({
  onClose,
  onContinue,
  isLightMode,
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <ModalBase onClose={onClose} isLightMode={isLightMode}>
      <ModalHeader title="Integrate with Magicbricks" onClose={onClose} isLightMode={isLightMode} />
      <div className="p-6 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 rounded border-gray-400 text-purple-600 focus:ring-purple-500"
          />
          <span className={isLightMode ? "text-gray-700" : "text-gray-300"}>
            I confirm that I have an active Magicbricks account that supports property
            listings.
          </span>
        </label>
        <p className={`text-sm ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
          Your listings will be published to your existing Magicbricks profile.
        </p>
        <button
          type="button"
          onClick={onContinue}
          disabled={!confirmed}
          className={`w-full px-4 py-3 rounded-xl font-medium transition-colors ${
            confirmed
              ? "bg-purple-600 text-white hover:bg-purple-500"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </ModalBase>
  );
}

/**
 * Step 2 — Client ID + Select listings from existing (no form)
 */
export function IntegrationStep2Modal({
  onClose,
  onBack,
  onConnect,
  eligibleListings = [],
  isLightMode,
}) {
  const [selectedIds, setSelectedIds] = useState(() =>
    new Set(eligibleListings.map((l) => l.id))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionInfo, setConnectionInfo] = useState(null);

  const toggleListing = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerateFeed = async () => {
    if (selectedIds.size === 0) {
      setError("Select at least one listing to connect.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/portal/magicbricks/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // In a real app, brokerId would come from auth / org context
          brokerId: "demo-broker",
          listingIds: Array.from(selectedIds),
          // Send full listing payloads so backend can generate XML without a DB
          listings: eligibleListings.filter((l) => selectedIds.has(l.id)),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate XML feed");
      const data = await res.json();
      setConnectionInfo(data);
    } catch (err) {
      setError(err.message || "Failed to generate XML feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmailSent = () => {
    if (!connectionInfo) return;
    onConnect(connectionInfo);
  };

  const emailTemplate = connectionInfo
    ? `To: support@magicbricks.com
Cc: support@aievoveked.com
Subject: Request to activate XML feed for my broker account

Dear Magicbricks Team,

Please enable XML feed integration for my broker/company account.

Feed URL: ${connectionInfo.xmlFeedUrl}
Portal: Magicbricks

This feed contains only the listings I have approved for sync from my dashboard.

Regards,
[Your Name]
[Company Name]
[Registered Mobile / Email on Magicbricks]`
    : "";

  return (
    <ModalBase onClose={onClose} isLightMode={isLightMode}>
      <ModalHeader
        title="Select Listings for Magicbricks"
        onClose={onClose}
        isLightMode={isLightMode}
      />
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <p className={`text-sm font-medium mb-2 ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
            Select listings to connect
          </p>
          <div className={`rounded-xl border ${
            isLightMode ? "border-gray-200" : "border-white/10"
          } divide-y divide-white/5 max-h-48 overflow-y-auto`}>
            {eligibleListings.length === 0 ? (
              <p className={`p-4 text-sm ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
                No listings with a project. Attach a project to a listing first.
              </p>
            ) : (
              eligibleListings.map((listing) => (
                <label
                  key={listing.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 ${
                    isLightMode ? "hover:bg-gray-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(listing.id)}
                    onChange={() => toggleListing(listing.id)}
                    className="rounded border-gray-400 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                      {listing.name}
                    </p>
                    <p className={`text-sm truncate ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
                      {listing.city}
                      {listing.location ? `, ${listing.location}` : ""} · {listing.price}
                    </p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {connectionInfo && (
          <div className="space-y-3 mt-2">
            <div>
              <p
                className={`text-sm font-medium mb-1 ${
                  isLightMode ? "text-gray-900" : "text-gray-100"
                }`}
              >
                Your Magicbricks XML feed URL
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={connectionInfo.xmlFeedUrl}
                  className={`flex-1 rounded-xl px-3 py-2 text-xs break-all ${
                    isLightMode
                      ? "bg-gray-50 border border-gray-200 text-gray-900"
                      : "bg-white/10 border border-white/20 text-gray-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(connectionInfo.xmlFeedUrl)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <p
                className={`text-sm font-medium mb-1 ${
                  isLightMode ? "text-gray-900" : "text-gray-100"
                }`}
              >
                Email to Magicbricks (send from your registered email)
              </p>
              <textarea
                readOnly
                value={emailTemplate}
                rows={8}
                className={`w-full rounded-xl px-3 py-2 text-xs font-mono ${
                  isLightMode
                    ? "bg-gray-50 border border-gray-200 text-gray-900"
                    : "bg-white/10 border border-white/20 text-gray-100"
                }`}
              />
            </div>

              <p className={`text-xs ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
                Copy this draft into your email client, send it to Magicbricks with our support in CC, then confirm below.
              </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-3 rounded-xl font-medium border border-white/20 text-gray-300 hover:bg-white/5 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={connectionInfo ? handleConfirmEmailSent : handleGenerateFeed}
            disabled={loading || eligibleListings.length === 0}
            className="flex-1 px-4 py-3 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
          >
            {connectionInfo
              ? "Confirm I have sent the email"
              : loading
              ? "Generating feed…"
              : "Generate feed & email draft"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

/**
 * Step 3 — Connection status
 */
export function IntegrationStep3Modal({ onClose, isLightMode }) {
  return (
    <ModalBase onClose={onClose} isLightMode={isLightMode}>
      <div className="p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className={`text-lg font-semibold mb-1 ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
          Connected (Verification Pending)
        </h3>
        <p className={`text-sm mb-4 ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
          Magicbricks will review and activate your XML feed.
        </p>
        <p className={`text-sm mb-6 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
          Once activated, any listing you&apos;ve approved for Magicbricks will sync automatically from this dashboard.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-3 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors"
        >
          Done
        </button>
      </div>
    </ModalBase>
  );
}
