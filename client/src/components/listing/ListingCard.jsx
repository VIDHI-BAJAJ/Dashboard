import { useState } from "react";
import { MessageIcon, HeartIcon, ShareIcon } from "./ListingIcons";
import { FALLBACK_IMAGE } from "./constants";

export default function ListingCard({ listing, isLightMode = false }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageSrc = listing.image || FALLBACK_IMAGE;

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
        <h3
          className={`font-semibold text-lg truncate ${
            isLightMode ? "text-gray-900" : "text-gray-100"
          }`}
        >
          {listing.name}
        </h3>
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
