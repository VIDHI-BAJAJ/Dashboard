import { useState } from "react";

// Platform icon SVG
const PlatformIcon = () => (
  <svg
    className="h-8 w-8 flex-shrink-0 text-teal-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

// Grid view icon
const GridViewIcon = ({ active }) => (
  <svg
    className={`h-5 w-5 ${active ? "text-teal-600" : "text-gray-400 hover:text-gray-600"}`}
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

// List view icon
const ListViewIcon = ({ active }) => (
  <svg
    className={`h-5 w-5 ${active ? "text-teal-600" : "text-gray-400 hover:text-gray-600"}`}
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);

// Message icon
const MessageIcon = () => (
  <svg
    className="h-4 w-4 text-gray-500 hover:text-teal-600 transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

// Heart icon
const HeartIcon = ({ filled }) => (
  <svg
    className={`h-4 w-4 ${filled ? "text-red-500" : "text-gray-500 hover:text-red-500"} transition-colors`}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

// Share icon
const ShareIcon = () => (
  <svg
    className="h-4 w-4 text-gray-500 hover:text-teal-600 transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

const MOCK_LISTINGS = [
  {
    id: 1,
    name: "Modern Villa with Sea View",
    price: "AED 2,450,000",
    city: "Dubai",
    country: "UAE",
    bedrooms: 4,
    bathrooms: 5,
    area: 3200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=338&fit=crop",
  },
  {
    id: 2,
    name: "Luxury Apartment in Downtown",
    price: "AED 1,890,000",
    city: "Dubai",
    country: "UAE",
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=338&fit=crop",
  },
  {
    id: 3,
    name: "Spacious Family Home",
    price: "AED 3,200,000",
    city: "Abu Dhabi",
    country: "UAE",
    bedrooms: 5,
    bathrooms: 6,
    area: 4200,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=338&fit=crop",
  },
  {
    id: 4,
    name: "Contemporary Penthouse",
    price: "AED 4,500,000",
    city: "Dubai",
    country: "UAE",
    bedrooms: 4,
    bathrooms: 4,
    area: 2800,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=338&fit=crop",
  },
  {
    id: 5,
    name: "Beachfront Apartment",
    price: "AED 1,650,000",
    city: "Dubai",
    country: "UAE",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=338&fit=crop",
  },
  {
    id: 6,
    name: "Garden Villa",
    price: "AED 2,800,000",
    city: "Sharjah",
    country: "UAE",
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=338&fit=crop",
  },
];

function ListingCard({ listing }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image container - 16:9 aspect ratio */}
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <img
          src={listing.image}
          alt={listing.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg truncate">{listing.name}</h3>
        <p className="text-teal-600 font-bold text-xl mt-1">{listing.price}</p>
        <p className="text-gray-500 text-sm mt-0.5">
          {listing.city}, {listing.country}
        </p>

        {/* Metadata row */}
        <div className="flex gap-4 mt-3 text-gray-400 text-sm">
          <span>{listing.bedrooms} Beds</span>
          <span>{listing.bathrooms} Baths</span>
          <span>{listing.area.toLocaleString()} sqft</span>
        </div>

        {/* Bottom icon row */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
          <button type="button" className="p-1 cursor-pointer">
            <MessageIcon />
          </button>
          <button
            type="button"
            className="p-1 cursor-pointer"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <HeartIcon filled={isFavorite} />
          </button>
          <button type="button" className="p-1 cursor-pointer">
            <ShareIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Listing() {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Top Info Banner */}
      <div className="bg-teal-800 rounded-xl shadow-lg mx-4 mt-4 md:mx-6 md:mt-6 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <PlatformIcon />
          <div>
            <h2 className="text-white font-semibold text-lg">
              One Platform, Multiple Portals.
            </h2>
            <p className="text-teal-200 text-sm mt-1">
              Sync effortlessly with Bayut, Dubizzle, and Property Finder in a few simple steps.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            className="text-teal-200 hover:text-white font-medium text-sm transition-colors"
          >
            Dismiss
          </button>
          <button
            type="button"
            className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Setup Automatic Sync
          </button>
        </div>
      </div>

      {/* 2. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 mx-4 md:mx-6">
        <h1 className="text-2xl font-bold text-gray-900">All Listings</h1>
        <button
          type="button"
          className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors w-fit"
        >
          Add Listing
        </button>
      </div>

      {/* 3. Filter + View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 mx-4 md:mx-6">
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-gray-600 text-sm font-medium">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <GridViewIcon active={viewMode === "grid"} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ListViewIcon active={viewMode === "list"} />
          </button>
        </div>
      </div>

      {/* 4. Listings Grid */}
      <div
        className={`mx-4 md:mx-6 mt-6 pb-12 ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }`}
      >
        {MOCK_LISTINGS.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
