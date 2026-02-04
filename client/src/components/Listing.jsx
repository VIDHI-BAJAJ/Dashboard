import { useState, useRef } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=338&fit=crop";

const glassBase =
  "rounded-2xl backdrop-blur-xl border transition-all duration-300";
const glassLight =
  "bg-white/30 border-white/50 text-gray-900 shadow-xl";
const glassDark =
  "bg-white/5 border-white/10 text-gray-100 shadow-xl";

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

const getInputClass = (isLightMode, hasError = false) =>
  `w-full rounded-xl px-4 py-3 transition-all duration-300 ${
    isLightMode 
      ? `bg-white/50 border ${hasError ? "border-red-300 focus:ring-red-500" : "border-white/30 focus:ring-blue-500"} text-gray-900 placeholder-gray-500 focus:bg-white/70` 
      : `bg-white/10 border ${hasError ? "border-red-500/50 focus:ring-red-500" : "border-white/20 focus:ring-blue-500"} text-gray-100 placeholder-gray-400 focus:bg-white/20`
  } focus:outline-none focus:ring-2`;

const getLabelClass = (isLightMode) =>
  `block text-sm font-medium ${isLightMode ? "text-gray-900" : "text-gray-100"} mb-2`;

function AddListingForm({ onSave, isLightMode = false, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    city: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    image: "",
    imageFile: null,
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: "File size must be less than 5MB" }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({ ...prev, image: event.target.result, imageFile: file }));
        if (errors.image) setErrors(prev => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      image: form.image || FALLBACK_IMAGE,
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
      imageFile: null,
    });
    setErrors({});
  };

  const handleCancel = () => {
    setForm({ name: "", price: "", city: "", location: "", bedrooms: "", bathrooms: "", area: "", image: "", imageFile: null });
    setErrors({});
    onCancel();
  };

  return (
    <div className={`w-full ${glassBase} ${isLightMode ? glassLight : glassDark}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
            Add New Listing
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className={`p-2 rounded-xl transition-all duration-300 ${isLightMode ? "text-gray-500 hover:text-gray-700 hover:bg-white/20" : "text-gray-400 hover:text-gray-200 hover:bg-white/10"}`}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="property-name" className={getLabelClass(isLightMode)}>
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              id="property-name"
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. Modern Villa with Sea View"
              className={getInputClass(isLightMode, errors.name)}
            />
            {errors.name && (
              <p className={`mt-1 text-sm ${isLightMode ? "text-red-600" : "text-red-400"}`}>{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className={getLabelClass(isLightMode)}>
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="text"
              value={form.price}
              onChange={handleChange("price")}
              placeholder="e.g. AED 2,450,000"
              className={getInputClass(isLightMode, errors.price)}
            />
            {errors.price && (
              <p className={`mt-1 text-sm ${isLightMode ? "text-red-600" : "text-red-400"}`}>{errors.price}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={getLabelClass(isLightMode)}>
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={handleChange("city")}
                placeholder="e.g. Dubai"
                className={getInputClass(isLightMode, errors.city)}
              />
              {errors.city && (
                <p className={`mt-1 text-sm ${isLightMode ? "text-red-600" : "text-red-400"}`}>{errors.city}</p>
              )}
            </div>
            <div>
              <label htmlFor="location" className={getLabelClass(isLightMode)}>
                Location
              </label>
              <input
                id="location"
                type="text"
                value={form.location}
                onChange={handleChange("location")}
                placeholder="e.g. UAE or Palm Jumeirah"
                className={getInputClass(isLightMode)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className={getLabelClass(isLightMode)}>
                Bedrooms
              </label>
              <input
                id="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={handleChange("bedrooms")}
                placeholder="0"
                className={getInputClass(isLightMode)}
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className={getLabelClass(isLightMode)}>
                Bathrooms
              </label>
              <input
                id="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={handleChange("bathrooms")}
                placeholder="0"
                className={getInputClass(isLightMode)}
              />
            </div>
            <div>
              <label htmlFor="area" className={getLabelClass(isLightMode)}>
                Area (sqft)
              </label>
              <input
                id="area"
                type="number"
                min="0"
                value={form.area}
                onChange={handleChange("area")}
                placeholder="0"
                className={getInputClass(isLightMode)}
              />
            </div>
          </div>

          <div>
            <label className={getLabelClass(isLightMode)}>
              Property Image
            </label>
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${isLightMode ? "border-gray-300 hover:border-blue-500" : "border-gray-600 hover:border-blue-400"}`}
              onClick={triggerFileInput}
            >
              {form.image ? (
                <img src={form.image} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
              ) : (
                <p className={isLightMode ? "text-gray-500" : "text-gray-400"}>Click to upload image</p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.image && (
              <p className={isLightMode ? "text-red-600" : "text-red-400"}>{errors.image}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className={`flex-1 px-4 py-3 rounded-xl font-medium ${isLightMode ? "bg-white/20 text-gray-700 hover:bg-white/30" : "bg-white/10 text-gray-200 hover:bg-white/20"}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-medium ${isLightMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-500"}`}
            >
              Save Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ListingCard({ listing, isLightMode = false }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageSrc = listing.image || FALLBACK_IMAGE;

  return (
    <article className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${glassBase} ${isLightMode ? glassLight : glassDark}`}>
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
        <h3 className={`font-semibold text-lg truncate ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
          {listing.name}
        </h3>
        <p className={`font-bold text-xl mt-1 ${isLightMode ? "text-blue-600" : "text-blue-400"}`}>{listing.price}</p>
        <p className={`text-sm mt-1 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
          {listing.city}
          {listing.location && `, ${listing.location}`}
        </p>

        <div className={`flex gap-4 mt-3 text-sm ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
          <span>{listing.bedrooms} Beds</span>
          <span>{listing.bathrooms} Baths</span>
          <span>{listing.area ? `${listing.area.toLocaleString()} sqft` : "—"}</span>
        </div>

        <div className={`flex items-center gap-3 mt-4 pt-3 ${isLightMode ? "border-t border-gray-200" : "border-t border-gray-700"}`}>
          <button type="button" className={`p-1 cursor-pointer ${isLightMode ? "text-gray-500 hover:text-blue-600" : "text-gray-400 hover:text-blue-400"} transition-colors`}>
            <MessageIcon />
          </button>
          <button
            type="button"
            className={`p-1 cursor-pointer transition-colors ${isLightMode ? "text-gray-500 hover:text-red-500" : "text-gray-400 hover:text-red-400"}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <HeartIcon filled={isFavorite} />
          </button>
          <button type="button" className={`p-1 cursor-pointer ${isLightMode ? "text-gray-500 hover:text-blue-600" : "text-gray-400 hover:text-blue-400"} transition-colors`}>
            <ShareIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Listing({ isLightMode = false }) {
  const [listings, setListings] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const handleSaveListing = (listing) => {
    setListings((prev) => [listing, ...prev]);
    setIsAdding(false);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
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
    <div className={`min-h-screen transition-all duration-500 ${isLightMode ? "bg-gradient-to-br from-rose-200 via-purple-200 to-blue-200" : "bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"}`}>
      {/* Top Info Banner */}
      <div className={`rounded-2xl shadow-lg mx-4 mt-4 md:mx-6 md:mt-6 p-6 ${glassBase} ${isLightMode ? glassLight : glassDark} flex flex-col md:flex-row md:items-center md:justify-between gap-6`}>
        <div className="flex items-start gap-4">
          <PlatformIcon />
          <div>
            <h2 className={`font-semibold text-lg ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
              One Platform, Multiple Portals.
            </h2>
            <p className={`text-sm mt-1 ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
              Sync effortlessly with Bayut, Dubizzle, and Property Finder in a few simple steps.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            className={`font-medium text-sm transition-colors ${isLightMode ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-gray-200"}`}
          >
            Dismiss
          </button>
          <button
            type="button"
            className={`font-medium px-5 py-2.5 rounded-xl transition-colors ${isLightMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-500"}`}
          >
            Setup Automatic Sync
          </button>
        </div>
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 mx-4 md:mx-6">
        <h1 className={`text-2xl font-bold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>All Listings</h1>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className={`font-medium px-5 py-2.5 rounded-xl transition-colors w-fit ${isLightMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-500"}`}
          >
            Add Listing
          </button>
        )}
      </div>

      {/* Filter + View Controls */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 mx-4 md:mx-6 ${glassBase} ${isLightMode ? glassLight : glassDark} p-4 rounded-xl`}>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className={`text-sm font-medium ${isLightMode ? "text-gray-700" : "text-gray-300"}`}>
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`rounded-xl px-4 py-2 text-sm ${isLightMode ? "bg-white/50 border border-white/30 text-gray-900 focus:ring-blue-500" : "bg-white/10 border border-white/20 text-gray-100 focus:ring-blue-500"} focus:outline-none focus:ring-2`}
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
            className={`p-2 rounded-xl transition-colors ${isLightMode ? "hover:bg-white/20" : "hover:bg-white/10"}`}
          >
            <GridViewIcon active={viewMode === "grid"} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-xl transition-colors ${isLightMode ? "hover:bg-white/20" : "hover:bg-white/10"}`}
          >
            <ListViewIcon active={viewMode === "list"} />
          </button>
        </div>
      </div>

      {/* Add Listing Form */}
      {isAdding && (
        <div className="mx-4 md:mx-6 mt-6">
          <AddListingForm onSave={handleSaveListing} isLightMode={isLightMode} onCancel={handleCancelAdd} />
        </div>
      )}

      {/* Listings Grid or Empty State */}
      <div
        className={`mx-4 md:mx-6 mt-6 pb-12 ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }`}
      >
        {listings.length === 0 && !isAdding ? (
          <div className={`col-span-full flex flex-col items-center justify-center py-16 px-6 rounded-2xl ${glassBase} ${isLightMode ? glassLight : glassDark}`}>
            <p className={`text-center text-lg ${isLightMode ? "text-gray-600" : "text-gray-400"}`}>
              No listings yet. Click &quot;Add Listing&quot; to create your first property.
            </p>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className={`mt-4 font-medium px-5 py-2.5 rounded-xl transition-colors ${isLightMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-500"}`}
            >
              Add Listing
            </button>
          </div>
        ) : (
          sortedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} isLightMode={isLightMode} />
          ))
        )}
      </div>

    </div>
  );
}
