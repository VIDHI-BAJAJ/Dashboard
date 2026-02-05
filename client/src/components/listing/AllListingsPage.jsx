import ListingBanner from "./ListingBanner";
import ListingFilters from "./ListingFilters";
import ListingCard from "./ListingCard";
import { glassBase, glassLight, glassDark } from "./constants";

export default function AllListingsPage({
  listings,
  sortedListings,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  onNavigateToAdd,
  onSetupSync,
  showPublish = false,
  onPublish,
  isLightMode = false,
}) {
  return (
    <>
      <ListingBanner isLightMode={isLightMode} onSetupSync={onSetupSync} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 mx-4 md:mx-6">
        <h1
          className={`text-2xl font-bold ${
            isLightMode ? "text-gray-900" : "text-gray-100"
          }`}
        >
          All Listings
        </h1>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          {showPublish && (
            <button
              type="button"
              onClick={onPublish}
              className={`font-medium px-5 py-2.5 rounded-xl transition-colors w-fit ${
                isLightMode
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              Publish
            </button>
          )}
          <button
            type="button"
            onClick={onNavigateToAdd}
            className={`font-medium px-5 py-2.5 rounded-xl transition-colors w-fit ${
              isLightMode
                ? "bg-purple-900 text-white hover:bg-purple-500"
                : "bg-purple-900 text-white hover:bg-purple-500"
            }`}
          >
            Add Listing
          </button>
        </div>
      </div>

      <ListingFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isLightMode={isLightMode}
        className = {'text-black'}
      />

      <div
        className={`mx-4 md:mx-6 mt-6 pb-12 ${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }`}
      >
        {listings.length === 0 ? (
          <div
            className={`col-span-full flex flex-col items-center justify-center py-16 px-6 rounded-2xl ${glassBase} ${
              isLightMode ? glassLight : glassDark
            }`}
          >
            <p
              className={`text-center text-lg ${
                isLightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              No listings yet. Click &quot;Add Listing&quot; to create your first
              property.
            </p>
            <button
              type="button"
              onClick={onNavigateToAdd}
              className={`mt-4 font-medium px-5 py-2.5 rounded-xl transition-colors ${
                isLightMode
                  ? "bg-purple-900 text-white hover:bg-purple-500"
                  : "bg-purple-900 text-white hover:bg-purple-500"
              }`}
            >
              Add Listing
            </button>
          </div>
        ) : (
          sortedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isLightMode={isLightMode}
            />
          ))
        )}
      </div>
    </>
  );
}
