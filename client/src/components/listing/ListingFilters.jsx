import { GridViewIcon, ListViewIcon } from "./ListingIcons";
import { glassBase, glassLight, glassDark } from "./constants";

export default function ListingFilters({
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  isLightMode = false,
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 mx-4 md:mx-6 ${glassBase} ${
        isLightMode ? glassLight : glassDark
      } p-4 rounded-xl`}
    >
      <div className="flex items-center gap-2">
        <label
          htmlFor="sort-select"
          className={`text-sm font-medium ${
            isLightMode ? "text-gray-700" : "text-gray-300"
          }`}
        >
          Sort by
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`rounded-xl px-4 py-2 text-sm ${
            isLightMode
              ? "bg-white/50 border border-white/30 text-gray-900 focus:ring-blue-500"
              : "bg-white/10 border border-white/20 text-gray-100 focus:ring-blue-500"
          } focus:outline-none focus:ring-2`}
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
          className={`p-2 rounded-xl transition-colors ${
            isLightMode ? "hover:bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <GridViewIcon active={viewMode === "grid"} />
        </button>
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className={`p-2 rounded-xl transition-colors ${
            isLightMode ? "hover:bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <ListViewIcon active={viewMode === "list"} />
        </button>
      </div>
    </div>
  );
}
