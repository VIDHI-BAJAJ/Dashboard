import { useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=338&fit=crop";

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

// Close icon for modal
const CloseIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors";

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

function AddListingModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    city: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    image: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Property name is required";
    if (!form.price.trim()) err.price = "Price is required";
    if (!form.city.trim()) err.city = "City is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const listing = {
      id: Date.now(),
      name: form.name.trim(),
      price: form.price.trim(),
      city: form.city.trim(),
      location: form.location.trim() || form.city.trim(),
      bedrooms: parseInt(form.bedrooms, 10) || 0,
      bathrooms: parseInt(form.bathrooms, 10) || 0,
      area: parseInt(form.area, 10) || 0,
      image: form.image.trim() || FALLBACK_IMAGE,
    };

    onSave(listing);
    setForm({
      name: "",
      price: "",
      city: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      image: "",
    });
    setErrors({});
    onClose();
  };

  const handleCancel = () => {
    setForm({ name: "", price: "", city: "", location: "", bedrooms: "", bathrooms: "", area: "", image: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-listing-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl transform transition-all duration-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 id="add-listing-title" className="text-xl font-semibold text-gray-900">
            Add Listing
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="property-name" className={labelClass}>
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              id="property-name"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. Modern Villa with Sea View"
              className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className={labelClass}>
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="text"
              value={form.price}
              onChange={handleChange("price")}
              placeholder="e.g. AED 2,450,000"
              className={`${inputClass} ${errors.price ? "border-red-500" : ""}`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={labelClass}>
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={handleChange("city")}
                placeholder="e.g. Dubai"
                className={`${inputClass} ${errors.city ? "border-red-500" : ""}`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={handleChange("location")}
                placeholder="e.g. UAE or Palm Jumeirah"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className={labelClass}>
                Bedrooms
              </label>
              <input
                id="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={handleChange("bedrooms")}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className={labelClass}>
                Bathrooms
              </label>
              <input
                id="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={handleChange("bathrooms")}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="area" className={labelClass}>
                Area (sqft)
              </label>
              <input
                id="area"
                type="number"
                min="0"
                value={form.area}
                onChange={handleChange("area")}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="image-url" className={labelClass}>
              Image URL
            </label>
            <input
              id="image-url"
              type="url"
              value={form.image}
              onChange={handleChange("image")}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-500 transition-colors"
            >
              Save Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ListingCard({ listing }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageSrc = listing.image || FALLBACK_IMAGE;

  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <img
          src={imageSrc}
          alt={listing.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg truncate">
          {listing.name}
        </h3>
        <p className="text-teal-600 font-bold text-xl mt-1">{listing.price}</p>
        <p className="text-gray-500 text-sm mt-0.5">
          {listing.city}
          {listing.location && `, ${listing.location}`}
        </p>

        <div className="flex gap-4 mt-3 text-gray-400 text-sm">
          <span>{listing.bedrooms} Beds</span>
          <span>{listing.bathrooms} Baths</span>
          <span>{listing.area ? `${listing.area.toLocaleString()} sqft` : "—"}</span>
        </div>

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
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const handleSaveListing = (listing) => {
    setListings((prev) => [listing, ...prev]);
  };

  const sortedListings = [...listings].sort((a, b) => {
    if (sortBy === "newest") return (b.id || 0) - (a.id || 0);
    if (sortBy === "oldest") return (a.id || 0) - (b.id || 0);
    const priceA = parseFloat(String(a.price).replace(/[^0-9.]/g, "")) || 0;
    const priceB = parseFloat(String(b.price).replace(/[^0-9.]/g, "")) || 0;
    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Info Banner */}
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

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 mx-4 md:mx-6">
        <h1 className="text-2xl font-bold text-gray-900">All Listings</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors w-fit"
        >
          Add Listing
        </button>
      </div>

      {/* Filter + View Controls */}
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

      {/* Listings Grid or Empty State */}
      <div
        className={`mx-4 md:mx-6 mt-6 pb-12 ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }`}
      >
        {listings.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 rounded-xl bg-white shadow-sm border border-gray-100">
            <p className="text-gray-500 text-center text-lg">
              No listings yet. Click &quot;Add Listing&quot; to create your first property.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Add Listing
            </button>
          </div>
        ) : (
          sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

      <AddListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveListing}
      />
    </div>
  );
}
