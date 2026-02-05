import { useState } from "react";
import AllListingsPage from "./listing/AllListingsPage";
import AddListingPage from "./listing/AddListingPage";
import {
  ManagePortalsModal,
  ProjectRequiredModal,
  IntegrationStep1Modal,
  IntegrationStep2Modal,
  IntegrationStep3Modal,
} from "./listing/PortalSyncModals";

export default function Listing({ isLightMode = false }) {
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState("list");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Portal sync flow state
  const [portalModal, setPortalModal] = useState(null);
  const [portalConnection, setPortalConnection] = useState(null);

  const handleSaveListing = (listing) => {
    setListings((prev) => [listing, ...prev]);
    setCurrentPage("list");
  };

  const handleBack = () => {
    setCurrentPage("list");
  };

  const handleSetupSync = () => {
    setPortalModal("manage");
  };

  const handleActivateMagicbricks = () => {
    const eligibleListings = listings.filter((l) => l.projectId != null);
    if (eligibleListings.length > 0) {
      setPortalModal("step1");
    } else {
      setPortalModal("projectRequired");
    }
  };

  const handleAttachProject = () => {
    setPortalModal(null);
    setCurrentPage("add");
  };

  const eligibleListings = listings.filter((l) => l.projectId != null);

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
          listings={listings}
          sortedListings={sortedListings}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onNavigateToAdd={() => setCurrentPage("add")}
          onSetupSync={handleSetupSync}
          showPublish={portalConnection?.portal === "magicbricks"}
          onPublish={handleSetupSync}
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

      {/* Portal Sync Modals */}
      {portalModal === "manage" && (
        <ManagePortalsModal
          onClose={() => setPortalModal(null)}
          onActivateMagicbricks={handleActivateMagicbricks}
          portalConnection={portalConnection}
          isLightMode={isLightMode}
        />
      )}

      {portalModal === "projectRequired" && (
        <ProjectRequiredModal
          onClose={() => setPortalModal(null)}
          onAttachProject={handleAttachProject}
          isLightMode={isLightMode}
        />
      )}

      {portalModal === "step1" && (
        <IntegrationStep1Modal
          onClose={() => setPortalModal(null)}
          onContinue={() => setPortalModal("step2")}
          isLightMode={isLightMode}
        />
      )}

      {portalModal === "step2" && (
        <IntegrationStep2Modal
          onClose={() => setPortalModal(null)}
          onBack={() => setPortalModal("step1")}
          onConnect={(data) => {
            setPortalConnection(data);
            setPortalModal("step3");
          }}
          eligibleListings={eligibleListings}
          isLightMode={isLightMode}
        />
      )}

      {portalModal === "step3" && (
        <IntegrationStep3Modal
          onClose={() => setPortalModal(null)}
          isLightMode={isLightMode}
        />
      )}
    </div>
  );
}
