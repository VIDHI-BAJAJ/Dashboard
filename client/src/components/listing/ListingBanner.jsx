import { PlatformIcon } from "./ListingIcons";
import { glassBase, glassLight, glassDark } from "./constants";

export default function ListingBanner({ isLightMode = false, onSetupSync }) {
  return (
    <div
      className={`rounded-2xl shadow-lg mx-4 mt-4 md:mx-6 md:mt-6 p-6 ${glassBase} ${
        isLightMode ? glassLight : glassDark
      } flex flex-col md:flex-row md:items-center md:justify-between gap-6`}
    >
      <div className="flex items-start gap-4">
        <PlatformIcon />
        <div>
          <h2
            className={`font-semibold text-lg ${
              isLightMode ? "text-gray-900" : "text-gray-100"
            }`}
          >
            One Platform, Multiple Portals.
          </h2>
          <p
            className={`text-sm mt-1 ${
              isLightMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Sync effortlessly with Magicbricks in a few
            simple steps.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          className={`font-medium text-sm transition-colors ${
            isLightMode
              ? "text-gray-600 hover:text-gray-900"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Dismiss
        </button>
        <button
          type="button"
          onClick={onSetupSync}
          className={`font-medium px-5 py-2.5 rounded-xl transition-colors ${
            isLightMode
              ? "bg-purple-900 text-white hover:bg-purple-500"
              : "bg-purple-900 text-white hover:bg-purple-500"
          }`}
        >
          Setup Automatic Sync
        </button>
      </div>
    </div>
  );
}
