export default function ListingCard({ listing }) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex gap-6">
        <img
          src={listing.image}
          alt="property"
          className="w-40 h-28 object-cover rounded-md"
        />
  
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{listing.title}</h2>
          <p className="text-gray-500">{listing.location}</p>
          <p className="font-bold mt-2">${listing.price}</p>
          <p className="text-sm text-gray-600">
            {listing.bedrooms} Beds • {listing.bathrooms} Baths • {listing.area} sqft
          </p>
        </div>
  
        <button className="text-blue-600">Edit</button>
      </div>
    );
  }