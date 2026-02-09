import { useState } from "react";
import { MessageIcon, HeartIcon, ShareIcon } from "./ListingIcons";
import { FALLBACK_IMAGE } from "./constants";

export default function ListingCard({ 
  listing, 
  isLightMode = false,
  onPublishToQuikr 
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageSrc = listing.image || FALLBACK_IMAGE;

  // Get Quikr sync status (defaults to draft if not set)
  const quikrStatus = listing.quikr?.status || listing.quikrStatus || "draft";

  // Status badge styling
  const getStatusBadgeClasses = (status) => {
    const baseClasses = "inline-block px-2 py-0.5 text-xs font-medium rounded-full";
    switch (status) {
      case "syncing":
        return `${baseClasses} bg-blue-500/20 text-blue-400`;
      case "published":
        return `${baseClasses} bg-green-500/20 text-green-400`;
      case "failed":
        return `${baseClasses} bg-red-500/20 text-red-400`;
      case "pending":
        return `${baseClasses} bg-yellow-500/20 text-yellow-400`;
      default: // DRAFT
        return `${baseClasses} bg-gray-500/20 text-gray-400`;
    }
  };

  const handlePublish = () => {
    if (onPublishToQuikr) {
      onPublishToQuikr(listing);
    }
  };

  const handleRetry = () => {
    if (onPublishToQuikr) {
      onPublishToQuikr(listing);
    }
  };

  return (
    <article
      className={`group overflow-hidden transition-all duration-300 hover:-translate-y-1 rounded-2xl bg-transparent border border-gray-200/50 shadow-md ${
        isLightMode ? "text-gray-900" : "text-gray-100 border-gray-700/50"
      }`}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-2xl">
        <img
          src={imageSrc}
          alt={listing.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-semibold text-lg truncate flex-1 ${
              isLightMode ? "text-gray-900" : "text-gray-100"
            }`}
          >
            {listing.name}
          </h3>
          <span className={getStatusBadgeClasses(quikrStatus)}>
            {quikrStatus === "pending" ? "PENDING" : quikrStatus.toUpperCase()}
          </span>
        </div>
        <p
          className={`font-bold text-xl mt-1 ${
            isLightMode ? "text-blue-600" : "text-blue-400"
          }`}
        >
          {listing.price}
        </p>
        <p className={`text-sm mt-1 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
          {listing.city}
          {listing.location && `, ${listing.location}`}
        </p>

        <div
          className={`flex gap-4 mt-3 text-sm ${
            isLightMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <span>{listing.bedrooms} Beds</span>
          <span>{listing.bathrooms} Baths</span>
          <span>
            {listing.area ? `${listing.area.toLocaleString()} sqft` : "—"}
          </span>
        </div>

        {/* Quikr Publish/Retry Button */}
        <div className="mt-3">
          {(quikrStatus === "FAILED" || quikrStatus === "failed") ? (
            <button
              type="button"
              onClick={handleRetry}
              className="w-full px-3 py-2 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors"
            >
              Retry Publish
            </button>
          ) : (quikrStatus === "DRAFT" || quikrStatus === "draft" || quikrStatus === "PENDING" || quikrStatus === "pending") ? (
            <button
              type="button"
              onClick={handlePublish}
              className="w-full px-3 py-2 text-sm font-medium rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors"
            >
              Publish to Quikr
            </button>
          ) : null}
        </div>

        <div
          className={`flex items-center gap-3 mt-4 pt-3 ${
            isLightMode ? "border-t border-gray-200" : "border-t border-gray-700"
          }`}
        >
          <button
            type="button"
            className={`p-1 cursor-pointer transition-colors ${
              isLightMode
                ? "text-gray-500 hover:text-blue-600"
                : "text-gray-400 hover:text-blue-400"
            }`}
          >
            <MessageIcon />
          </button>
          <button
            type="button"
            className={`p-1 cursor-pointer transition-colors ${
              isLightMode
                ? "text-gray-500 hover:text-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <HeartIcon filled={isFavorite} />
          </button>
          <button
            type="button"
            className={`p-1 cursor-pointer transition-colors ${
              isLightMode
                ? "text-gray-500 hover:text-blue-600"
                : "text-gray-400 hover:text-blue-400"
            }`}
          >
            <ShareIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
