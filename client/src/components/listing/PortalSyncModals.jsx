import { useState } from "react";
import { CloseIcon } from "./ListingIcons";

const API_URL = import.meta.env.VITE_API_URL || "";

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
 * Quikr Homes Publish Modal
 * Allows user to publish a single listing to Quikr Homes via automation
 */
export function QuikrPublishModal({
  listing,
  onClose,
  onPublish,
  isLightMode,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePublish = async () => {
    if (!listing?._id) {
      setError("Invalid listing");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Use the listing ID to publish from MongoDB
      const res = await fetch(`${API_URL}/api/integrations/quikr/publish/${listing._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to publish listing");
      }

      const data = await res.json();
      onPublish(data);
    } catch (err) {
      setError(err.message || "Failed to publish listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase onClose={onClose} isLightMode={isLightMode}>
      <ModalHeader
        title="Publish to Quikr Homes"
        onClose={onClose}
        isLightMode={isLightMode}
      />
      <div className="p-6 space-y-4">
        {listing && (
          <div
            className={`p-4 rounded-xl ${
              isLightMode ? "bg-gray-50" : "bg-white/5"
            }`}
          >
            <p
              className={`font-medium ${isLightMode ? "text-gray-900" : "text-gray-100"}`}
            >
              {listing.name}
            </p>
            <p className={`text-sm mt-1 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
              {listing.city}
              {listing.location ? `, ${listing.location}` : ""} · {listing.price}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className={`text-sm ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
            This will publish the selected listing to Quikr Homes using automation.
          </p>
          <p className={`text-xs ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
            OTP / CAPTCHA may be required during the automation process.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl font-medium border border-white/20 text-gray-300 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={loading || !listing?._id}
            className="flex-1 px-4 py-3 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
