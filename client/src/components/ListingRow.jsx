import { MoreVertical } from "lucide-react";

export default function ListingRow({ listing }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition flex justify-between items-center">

      {/* Left Section */}
      <div className="flex gap-5 items-center">
        <img
          src={listing.image}
          alt="property"
          className="w-24 h-20 rounded-xl object-cover"
        />

        <div>
          <h3 className="text-md font-semibold text-gray-800">
            {listing.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {listing.location}
          </p>

          <p className="text-sm text-gray-600 mt-2">
            {listing.bedrooms} Beds • {listing.bathrooms} Baths • {listing.area} sqft
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        <StatusBadge status={listing.status} />

        <p className="text-md font-semibold text-gray-800">
          ${listing.price}
        </p>

        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical size={18} />
        </button>

      </div>
    </div>
  );
}