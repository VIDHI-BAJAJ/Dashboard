import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SyncModal from "../components/SyncModal";

const STATUS_COLORS = {
  active:    "bg-green-100 text-green-700",
  withdrawn: "bg-gray-100 text-gray-600",
  sold:      "bg-red-100 text-red-700",
  leased:    "bg-blue-100 text-blue-700",
  offmarket: "bg-yellow-100 text-yellow-700",
};

const STATUS_LABELS = {
  active:    "Active",
  withdrawn: "Withdrawn",
  sold:      "Sold",
  leased:    "Leased",
  offmarket: "Off Market",
};

const TYPE_LABELS = {
  residential:   "Residential Sale",
  rental:        "Rental",
  land:          "Land",
  rural:         "Rural",
  commercial:    "Commercial",
  holidayRental: "Holiday Rental",
};

export default function Listings() {
  const [openSync, setOpenSync] = useState(false);
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setListings(result.data);
      })
      .catch((err) => console.error("Failed to fetch listings:", err));
  }, []);

  const deleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setListings((prev) => prev.filter((l) => l._id !== id));
      }
    } catch (err) {
      console.error("Delete listing error:", err);
    }
  };

  // Transform stored listings into the shape SyncModal expects
  const syncModalListings = listings.map((l) => ({
    id:           l._id,
    title:        l.title || l.headline || "Untitled Listing",
    location:     [l.streetNum, l.street, l.suburb, l.state].filter(Boolean).join(" ") || "Address not provided",
    price:        l.priceView
                    || (l.priceFrom ? `$${Number(l.priceFrom).toLocaleString()}` : "")
                    || (l.priceAud  ? `$${Number(l.priceAud).toLocaleString()}`  : "POA"),
    bedrooms:     Number(l.bedrooms)  || 0,
    bathrooms:    Number(l.bathrooms) || 0,
    sqft:         Number(l.sqft)      || 0,
    image:        l.photos?.[0] || "",
    // Flag as pending if any key display fields are missing
    pendingFields: !l.streetNum || !l.suburb || !l.state
                   || (!l.priceView && !l.priceFrom && !l.priceAud),
  }));

  const filtered = listings.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      l.title?.toLowerCase().includes(q) ||
      l.suburb?.toLowerCase().includes(q) ||
      l.street?.toLowerCase().includes(q) ||
      l.headline?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || l.listingStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="relative">

      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">One Platform, Multiple Portals</h2>
          <p className="text-sm text-gray-500 mt-1">Sync your listings with external portals in a few simple steps</p>
        </div>
        <button
          onClick={() => setOpenSync(true)}
          className="bg-[#004f98] text-white font-medium px-5 py-2 rounded-xl hover:bg-[#003b75] transition"
        >
          Setup Sync
        </button>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">All Listings</h1>
          {listings.length > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/listings/add")}
          className="bg-[#004f98] text-white px-4 py-2 rounded-xl shadow-sm hover:bg-[#003b75] transition flex items-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Listing
        </button>
      </div>

      {/* Filters */}
      {listings.length > 0 && (
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, suburb or street..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="leased">Leased</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="offmarket">Off Market</option>
          </select>
        </div>
      )}

      {/* Empty State */}
      {listings.length === 0 && (
        <div className="bg-white p-16 rounded-xl shadow-sm text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-1">No listings yet</p>
          <p className="text-gray-400 text-sm mb-5">Create your first listing to get started</p>
          <button
            onClick={() => navigate("/listings/add")}
            className="bg-[#004f98] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#003b75] transition font-medium"
          >
            Add First Listing
          </button>
        </div>
      )}

      {/* No search results */}
      {listings.length > 0 && filtered.length === 0 && (
        <div className="bg-white p-10 rounded-xl shadow-sm text-center text-gray-400 text-sm">
          No listings match your search.
        </div>
      )}

      {/* Listings Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onDelete={() => deleteListing(listing._id)}
            />
          ))}
        </div>
      )}

      {/* SyncModal — receives listings read from localStorage */}
      {openSync && (
        <SyncModal
          onClose={() => setOpenSync(false)}
          listings={syncModalListings}
          onEditListing={(id) => navigate(`/listings/edit/${id}`)}
          onConfirmSelection={(selectedIds, portal) => {
            console.log("Syncing to", portal, selectedIds);
            // TODO: wire up your sync API here
          }}
        />
      )}
    </div>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ listing, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const address = [listing.streetNum, listing.street, listing.suburb, listing.state]
    .filter(Boolean).join(" ") || "Address not provided";

  const price =
    listing.priceView ||
    (listing.priceFrom ? `$${Number(listing.priceFrom).toLocaleString()}` : "") ||
    (listing.priceAud  ? `$${Number(listing.priceAud).toLocaleString()}`  : "POA");

  const coverPhoto  = listing.photos?.[0];
  const statusLabel = STATUS_LABELS[listing.listingStatus] || "Active";
  const statusColor = STATUS_COLORS[listing.listingStatus] || STATUS_COLORS.active;
  const typeLabel   = TYPE_LABELS[listing.listingType]     || "";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">

      {/* Photo */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs text-gray-300">No photo</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor}`}>
            {statusLabel}
          </span>
          {listing.underOffer === "yes" && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
              Under Offer
            </span>
          )}
        </div>
        {listing.photos?.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {listing.photos.length} photos
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">
          {listing.title || listing.headline || "Untitled Listing"}
        </h3>
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{address}</span>
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {listing.bedrooms  ? <span className="flex items-center gap-1"><BedIcon />  {listing.bedrooms} bd</span>  : null}
          {listing.bathrooms ? <span className="flex items-center gap-1"><BathIcon /> {listing.bathrooms} ba</span> : null}
          {listing.garages   ? <span className="flex items-center gap-1"><CarIcon />  {listing.garages} gr</span>   : null}
          {listing.sqft      ? <span className="ml-auto">{Number(listing.sqft).toLocaleString()} sqft</span>        : null}
        </div>

        <p className="text-base font-bold text-[#004f98] mb-3">{price}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{typeLabel}</span>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Sure?</span>
              <button onClick={onDelete} className="text-xs text-red-600 font-semibold px-2 py-1 rounded hover:bg-red-50 transition">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-50 transition">No</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const BedIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10M21 7v10M3 12h18M7 12V7m10 5V7M7 7h10" />
  </svg>
);
const BathIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8M5 19h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
  </svg>
);
const CarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4 0v4m0 0H8m4 0h4" />
  </svg>
);