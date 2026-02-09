import { useState, useEffect, useRef } from "react";
import AllListingsPage from "./listing/AllListingsPage";
import AddListingPage from "./listing/AddListingPage";
import { QuikrPublishModal } from "./listing/PortalSyncModals";

export default function Listing({ isLightMode = false }) {
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState("list");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Quikr publish modal state
  const [quikrModalListing, setQuikrModalListing] = useState(null);

  // Ref for scrolling to listings when "Setup Automatic Sync" is clicked
  const listingsSectionRef = useRef(null);

  // Load listings from backend on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings');
        if (response.ok) {
          const data = await response.json();
          setListings(data);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    
    fetchListings();
  }, []);

  const handleSaveListing = (listing) => {
    // Add new listing to the beginning of the list
    setListings((prev) => [listing, ...prev]);
    setCurrentPage("list");
  };

  const handleBack = () => {
    setCurrentPage("list");
  };

  const handleSetupSync = () => {
    // Scroll to listings so user can use "Publish to Quikr" on each card
    listingsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePublishToQuikr = (listing) => {
    setQuikrModalListing(listing);
  };

  const handleQuikrPublishSuccess = (data) => {
    // Update listing status to SYNCING
    if (quikrModalListing) {
      setListings((prev) =>
        prev.map((l) =>
          l._id === quikrModalListing._id || l.id === quikrModalListing.id
            ? { ...l, quikr: { ...l.quikr, status: "syncing" } }
            : l
        )
      );
    }
    setQuikrModalListing(null);
  };

  // Poll for listing status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/listings');
        if (response.ok) {
          const data = await response.json();
          setListings(data);
        }
      } catch (error) {
        console.error('Error fetching updated listings:', error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

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
    <div>
      {currentPage === "list" ? (
        <AllListingsPage
          ref={listingsSectionRef}
          listings={listings}
          sortedListings={sortedListings}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onNavigateToAdd={() => setCurrentPage("add")}
          onSetupSync={handleSetupSync}
          onPublishToQuikr={handlePublishToQuikr}
          isLightMode={isLightMode}
        />
      ) : (
        <AddListingPage
          onSave={handleSaveListing}
          onBack={handleBack}
          onSetupSync={handleSetupSync}
          isLightMode={isLightMode}
        />
      )}

      {/* Quikr Publish Modal */}
      {quikrModalListing && (
        <QuikrPublishModal
          listing={quikrModalListing}
          onClose={() => setQuikrModalListing(null)}
          onPublish={handleQuikrPublishSuccess}
          isLightMode={isLightMode}
        />
      )}
    </div>
  );
}
