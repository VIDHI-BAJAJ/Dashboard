import AddListingForm from "./AddListingForm";
import ListingBanner from "./ListingBanner";

export default function AddListingPage({
  onSave,
  onBack,
  onSetupSync,
  isLightMode = false,
}) {
  return (
    <>
      <ListingBanner isLightMode={isLightMode} onSetupSync={onSetupSync} />

      <div className="mx-4 md:mx-6 mt-8">
        <AddListingForm
          onSave={onSave}
          onCancel={onBack}
          isLightMode={isLightMode}
        />
      </div>
    </>
  );
}
