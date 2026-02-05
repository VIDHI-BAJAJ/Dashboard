import { useState, useRef } from "react";
import { CloseIcon } from "./ListingIcons";
import { glassBase, glassLight, glassDark } from "./constants";

const getInputClass = (isLightMode, hasError = false) =>
  `w-full rounded-xl px-4 py-3 transition-all duration-300 text-black ${
    isLightMode
      ? "bg-white/50 border border-white/30 placeholder-gray-500 focus:bg-white/70"
      : "bg-white/90 border border-white/30 placeholder-gray-500 focus:bg-white focus:bg-white/95"
  } focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasError ? "border-red-500" : ""}`;

const getSelectClass = (isLightMode) =>
  `w-full rounded-xl px-4 py-3 text-black ${
    isLightMode
      ? "bg-white/50 border border-white/30"
      : "bg-white/90 border border-white/30"
  } focus:outline-none focus:ring-2 focus:ring-blue-500`;

const getLabelClass = (isLightMode) =>
  `block text-sm font-medium ${isLightMode ? "text-gray-900" : "text-gray-100"} mb-2`;

const SectionTitle = ({ children, isLightMode }) => (
  <h3
    className={`text-sm font-semibold uppercase tracking-wide mt-6 mb-3 first:mt-0 ${
      isLightMode ? "text-gray-700" : "text-gray-300"
    }`}
  >
    {children}
  </h3>
);

export default function AddListingForm({
  onSave,
  isLightMode = false,
  onCancel,
}) {
  const [form, setForm] = useState({
    // 1. Property Basics
    propertyCategory: "",
    propertyType: "",
    transactionType: "",
    propertyTitle: "",
    propertyDescription: "",
    projectName: "",
    projectId: null,
    // 2. Location
    city: "",
    localityArea: "",
    address: "",
    // 3. Property Configuration
    bhkType: "",
    bathrooms: "",
    superBuiltUpArea: "",
    areaUnit: "sq.ft",
    floorNumber: "",
    totalFloors: "",
    furnishingStatus: "",
    // 4. Pricing & Availability
    propertyPrice: "",
    priceType: "total",
    availabilityStatus: "",
    possessionDate: "",
    ageOfProperty: "",
    // 5. Project & Legal
    builderDeveloperName: "",
    projectStatus: "",
    reraNumber: "",
    // 6. Media
    image: "",
    imageFile: null,
    // 7. Agent
    agentName: "",
    agentMobile: "",
    agentEmail: "",
    operatingCity: "",
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
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "File size must be less than 5MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm((prev) => ({
          ...prev,
          image: event.target.result,
          imageFile: file,
        }));
        if (errors.image) setErrors((prev) => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const validate = () => {
    const err = {};
    if (!form.propertyTitle?.trim()) err.propertyTitle = "Property title is required";
    if (!form.propertyCategory) err.propertyCategory = "Property category is required";
    if (!form.propertyType) err.propertyType = "Property type is required";
    if (!form.transactionType) err.transactionType = "Transaction type is required";
    if (!form.city?.trim()) err.city = "City is required";
    if (!form.localityArea?.trim()) err.localityArea = "Locality / Area is required";
    if (!form.address?.trim()) err.address = "Address is required";
    if (!form.bhkType) err.bhkType = "BHK type is required";
    if (!form.bathrooms?.trim()) err.bathrooms = "Number of bathrooms is required";
    if (!form.superBuiltUpArea?.trim()) err.superBuiltUpArea = "Super built-up area is required";
    if (!form.propertyPrice?.trim()) err.propertyPrice = "Property price is required";
    if (!form.priceType) err.priceType = "Price type is required";
    if (!form.availabilityStatus) err.availabilityStatus = "Availability status is required";
    if (!form.furnishingStatus) err.furnishingStatus = "Furnishing status is required";
    if (!form.image) err.image = "At least one property image is required";
    if (!form.agentName?.trim()) err.agentName = "Agent name is required";
    if (!form.agentMobile?.trim()) err.agentMobile = "Agent mobile is required";
    if (!form.agentEmail?.trim()) err.agentEmail = "Agent email is required";
    if (!form.operatingCity?.trim()) err.operatingCity = "Operating city is required";

    const isApartment = form.propertyType === "Apartment";
    if (isApartment && !form.floorNumber?.trim()) err.floorNumber = "Floor number is required for apartments";
    if (isApartment && !form.totalFloors?.trim()) err.totalFloors = "Total floors is required for apartments";

    const isUnderConstruction = form.availabilityStatus === "Under Construction";
    if (isUnderConstruction && !form.possessionDate?.trim()) err.possessionDate = "Possession date is required for under construction";

    const isReadyToMove = form.availabilityStatus === "Ready to Move";
    if (isReadyToMove && !form.ageOfProperty?.trim()) err.ageOfProperty = "Age of property is required for resale";

    const hasProject = form.projectName?.trim() || form.projectId;
    if (hasProject) {
      if (!form.builderDeveloperName?.trim()) err.builderDeveloperName = "Builder/Developer name is required for projects";
      if (!form.projectStatus) err.projectStatus = "Project status is required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const getEmptyForm = () => ({
    propertyCategory: "", propertyType: "", transactionType: "", propertyTitle: "", propertyDescription: "",
    projectName: "", projectId: null, city: "", localityArea: "", address: "", bhkType: "", bathrooms: "",
    superBuiltUpArea: "", areaUnit: "sq.ft", floorNumber: "", totalFloors: "", furnishingStatus: "",
    propertyPrice: "", priceType: "total", availabilityStatus: "", possessionDate: "", ageOfProperty: "",
    builderDeveloperName: "", projectStatus: "", reraNumber: "", image: "", imageFile: null,
    agentName: "", agentMobile: "", agentEmail: "", operatingCity: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const listing = {
      id: Date.now(),
      // Map to card display fields
      name: form.propertyTitle.trim(),
      price: form.propertyPrice.trim(),
      city: form.city.trim(),
      location: form.localityArea.trim(),
      bedrooms: parseInt(form.bhkType, 10) || 0,
      bathrooms: parseInt(form.bathrooms, 10) || 0,
      area: parseInt(form.superBuiltUpArea, 10) || 0,
      image: form.image || null,
      projectId: form.projectId || (form.projectName?.trim() ? "proj-custom" : null),
      // Full data for Magicbricks
      propertyCategory: form.propertyCategory,
      propertyType: form.propertyType,
      transactionType: form.transactionType,
      propertyDescription: form.propertyDescription?.trim() || null,
      projectName: form.projectName?.trim() || null,
      address: form.address?.trim() || null,
      areaUnit: form.areaUnit,
      floorNumber: form.floorNumber || null,
      totalFloors: form.totalFloors || null,
      furnishingStatus: form.furnishingStatus,
      priceType: form.priceType,
      availabilityStatus: form.availabilityStatus,
      possessionDate: form.possessionDate || null,
      ageOfProperty: form.ageOfProperty || null,
      builderDeveloperName: form.builderDeveloperName?.trim() || null,
      projectStatus: form.projectStatus || null,
      reraNumber: form.reraNumber?.trim() || null,
      agentName: form.agentName?.trim() || null,
      agentMobile: form.agentMobile?.trim() || null,
      agentEmail: form.agentEmail?.trim() || null,
      operatingCity: form.operatingCity?.trim() || null,
    };

    onSave(listing);
    setForm(getEmptyForm());
    setErrors({});
  };

  const handleCancel = () => {
    setForm(getEmptyForm());
    setErrors({});
    onCancel();
  };

  const Err = ({ field }) =>
    errors[field] ? (
      <p className={`mt-1 text-sm ${isLightMode ? "text-red-600" : "text-red-400"}`}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className={`w-full rounded-2xl ${glassBase} ${isLightMode ? glassLight : glassDark}`}>
      <div className="p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-inherit py-2 -mx-2 px-2 z-10">
          <h2 className={`text-xl font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
            Add New Listing
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className={`p-2 rounded-xl transition-all duration-300 ${
              isLightMode ? "text-gray-500 hover:text-gray-700 hover:bg-white/20" : "text-gray-400 hover:text-gray-200 hover:bg-white/10"
            }`}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Property Basics */}
          <SectionTitle isLightMode={isLightMode}>1. Property Basics (Required)</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={getLabelClass(isLightMode)}>Property Category *</label>
              <select value={form.propertyCategory} onChange={handleChange("propertyCategory")} className={getSelectClass(isLightMode)}>
                <option value="">Select</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
              <Err field="propertyCategory" />
            </div>
            <div>
              <label className={getLabelClass(isLightMode)}>Property Type *</label>
              <select value={form.propertyType} onChange={handleChange("propertyType")} className={getSelectClass(isLightMode)}>
                <option value="">Select</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Builder Floor">Builder Floor</option>
                <option value="Plot">Plot</option>
                <option value="Office">Office</option>
                <option value="Shop">Shop</option>
              </select>
              <Err field="propertyType" />
            </div>
          </div>
          <div>
            <label className={getLabelClass(isLightMode)}>Transaction Type *</label>
            <select value={form.transactionType} onChange={handleChange("transactionType")} className={getSelectClass(isLightMode)}>
              <option value="">Select</option>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
            </select>
            <Err field="transactionType" />
          </div>
          <div>
            <label className={getLabelClass(isLightMode)}>Property Title *</label>
            <input type="text" value={form.propertyTitle} onChange={handleChange("propertyTitle")} placeholder="e.g. 3BHK Luxury Apartment" className={getInputClass(isLightMode, errors.propertyTitle)} />
            <Err field="propertyTitle" />
          </div>
          <div>
            <label className={getLabelClass(isLightMode)}>Property Description</label>
            <textarea value={form.propertyDescription} onChange={handleChange("propertyDescription")} rows={3} placeholder="Describe the property" className={getInputClass(isLightMode)} />
          </div>
          <div>
            <label className={getLabelClass(isLightMode)}>Project Name (mandatory if property belongs to a project)</label>
            <input type="text" value={form.projectName} onChange={handleChange("projectName")} placeholder="e.g. Skyline Towers" className={getInputClass(isLightMode)} />
            <div className="mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.projectId} onChange={(e) => setForm((p) => ({ ...p, projectId: e.target.checked ? "proj-1" : null }))} className="rounded" />
                <span className={isLightMode ? "text-gray-700" : "text-gray-300"}>Link to project (for portal sync)</span>
              </label>
            </div>
          </div>

          {/* 2. Location Details */}
          <SectionTitle isLightMode={isLightMode}>2. Location Details (Required)</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={getLabelClass(isLightMode)}>City *</label>
              <input type="text" value={form.city} onChange={handleChange("city")} placeholder="e.g. Mumbai" className={getInputClass(isLightMode, errors.city)} />
              <Err field="city" />
            </div>
            <div>
              <label className={getLabelClass(isLightMode)}>Locality / Area *</label>
              <input type="text" value={form.localityArea} onChange={handleChange("localityArea")} placeholder="e.g. Andheri West" className={getInputClass(isLightMode, errors.localityArea)} />
              <Err field="localityArea" />
            </div>
          </div>
          <div>
            <label className={getLabelClass(isLightMode)}>Address *</label>
            <input type="text" value={form.address} onChange={handleChange("address")} placeholder="Partial address is sufficient" className={getInputClass(isLightMode, errors.address)} />
            <Err field="address" />
          </div>

          {/* 3. Property Configuration */}
          <SectionTitle isLightMode={isLightMode}>3. Property Configuration (Required)</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={getLabelClass(isLightMode)}>BHK Type *</label>
              <select value={form.bhkType} onChange={handleChange("bhkType")} className={getSelectClass(isLightMode)}>
                <option value="">Select</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK</option>
              </select>
              <Err field="bhkType" />
            </div>
            <div>
              <label className={getLabelClass(isLightMode)}>Bathrooms *</label>
              <input type="number" min="0" value={form.bathrooms} onChange={handleChange("bathrooms")} placeholder="0" className={getInputClass(isLightMode, errors.bathrooms)} />
              <Err field="bathrooms" />
            </div>
            <div>
              <label className={getLabelClass(isLightMode)}>Super Built-up Area *</label>
              <input type="number" min="0" value={form.superBuiltUpArea} onChange={handleChange("superBuiltUpArea")} placeholder="e.g. 1200" className={getInputClass(isLightMode, errors.superBuiltUpArea)} />
              <Err field="superBuiltUpArea" />
            </div>
            <div>
              <label className={getLabelClass(isLightMode)}>Area Unit</label>
              <select value={form.areaUnit} onChange={handleChange("areaUnit")} className={getSelectClass(isLightMode)}>
                <option value="sq.ft">sq.ft</option>
                <option value="sq.m">sq.m</option>
              </select>
            </div>
          </div>
          {form.propertyType === "Apartment" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={getLabelClass(isLightMode)}>Floor Number *</label>
                <input type="text" value={form.floorNumber} onChange={handleChange("floorNumber")} placeholder="e.g. 5" className={getInputClass(isLightMode, errors.floorNumber)} />
                <Err field="floorNumber" />
              </div>
              <div>
                <label className={getLabelClass(isLightMode)}>Total Floors *</label>
                <input type="text" value={form.totalFloors} onChange={handleChange("totalFloors")} placeholder="e.g. 20" className={getInputClass(isLightMode, errors.totalFloors)} />
                <Err field="totalFloors" />
              </div>
            </div>
          )}
          <div>
            <label className={getLabelClass(isLightMode)}>Furnishing Status *</label>
            <select value={form.furnishingStatus} onChange={handleChange("furnishingStatus")} className={getSelectClass(isLightMode)}>
              <option value="">Select</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Fully-Furnished">Fully-Furnished</option>
            </select>
            <Err field="furnishingStatus" />
          </div>

          {/* 4. Pricing & Availability */}
          <SectionTitle isLightMode={isLightMode}>4. Pricing & Availability (Required)</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={getLabelClass(isLightMode)}>Property Price *</label>
              <input type="text" value={form.propertyPrice} onChange={handleChange("propertyPrice")} placeholder="e.g. ₹ 2,50,00,000" className={getInputClass(isLightMode, errors.propertyPrice)} />
              <Err field="propertyPrice" />
            </div>
            <div>
              <label className={getLabelClass(isLightMode)}>Price Type *</label>
              <select value={form.priceType} onChange={handleChange("priceType")} className={getSelectClass(isLightMode)}>
                <option value="total">Total price</option>
                <option value="per_sqft">Price per sq.ft</option>
              </select>
            </div>
          </div>
          <div>
            <label className={getLabelClass(isLightMode)}>Availability Status *</label>
            <select value={form.availabilityStatus} onChange={handleChange("availabilityStatus")} className={getSelectClass(isLightMode)}>
              <option value="">Select</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Under Construction">Under Construction</option>
            </select>
            <Err field="availabilityStatus" />
          </div>
          {form.availabilityStatus === "Under Construction" && (
            <div>
              <label className={getLabelClass(isLightMode)}>Possession Date *</label>
              <input type="date" value={form.possessionDate} onChange={handleChange("possessionDate")} className={getInputClass(isLightMode, errors.possessionDate)} />
              <Err field="possessionDate" />
            </div>
          )}
          {form.availabilityStatus === "Ready to Move" && (
            <div>
              <label className={getLabelClass(isLightMode)}>Age of Property (years) *</label>
              <input type="text" value={form.ageOfProperty} onChange={handleChange("ageOfProperty")} placeholder="e.g. 2" className={getInputClass(isLightMode, errors.ageOfProperty)} />
              <Err field="ageOfProperty" />
            </div>
          )}

          {/* 5. Project & Legal (if project) */}
          {(form.projectName?.trim() || form.projectId) && (
            <>
              <SectionTitle isLightMode={isLightMode}>5. Project & Legal Details (Required for Projects)</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={getLabelClass(isLightMode)}>Builder / Developer Name *</label>
                  <input type="text" value={form.builderDeveloperName} onChange={handleChange("builderDeveloperName")} placeholder="e.g. DLF" className={getInputClass(isLightMode, errors.builderDeveloperName)} />
                  <Err field="builderDeveloperName" />
                </div>
                <div>
                  <label className={getLabelClass(isLightMode)}>Project Status *</label>
                  <select value={form.projectStatus} onChange={handleChange("projectStatus")} className={getSelectClass(isLightMode)}>
                    <option value="">Select</option>
                    <option value="New Launch">New Launch</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Ready">Ready</option>
                  </select>
                  <Err field="projectStatus" />
                </div>
              </div>
              <div>
                <label className={getLabelClass(isLightMode)}>RERA Number (where applicable)</label>
                <input type="text" value={form.reraNumber} onChange={handleChange("reraNumber")} placeholder="e.g. P52100012345" className={getInputClass(isLightMode)} />
              </div>
            </>
          )}

          {/* 6. Media */}
          <SectionTitle isLightMode={isLightMode}>6. Media (Required)</SectionTitle>
          <div>
            <label className={getLabelClass(isLightMode)}>At least one property image *</label>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
                isLightMode ? "border-gray-300 hover:border-blue-500" : "border-gray-600 hover:border-blue-400"
              }`}
              onClick={triggerFileInput}
            >
              {form.image ? (
                <img src={form.image} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
              ) : (
                <p className={isLightMode ? "text-gray-500" : "text-gray-400"}>Click to upload image</p>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <Err field="image" />
          </div>

          {/* 7. Agent / Contact */}
          <SectionTitle isLightMode={isLightMode}>7. Agent / Contact Details (Required)</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={getLabelClass(isLightMode)}>Agent Name *</label>
              <input type="text" value={form.agentName} onChange={handleChange("agentName")} placeholder="e.g. John Doe" className={getInputClass(isLightMode, errors.agentName)} />
              <Err field="agentName" />
            </div>
            <div>
              <label className={getLabelClass(isLightMode)}>Agent Mobile Number *</label>
              <input type="tel" value={form.agentMobile} onChange={handleChange("agentMobile")} placeholder="e.g. 9876543210" className={getInputClass(isLightMode, errors.agentMobile)} />
              <Err field="agentMobile" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={getLabelClass(isLightMode)}>Agent Email ID *</label>
              <input type="email" value={form.agentEmail} onChange={handleChange("agentEmail")} placeholder="e.g. agent@example.com" className={getInputClass(isLightMode, errors.agentEmail)} />
              <Err field="agentEmail" />
            </div>
            <div>
              <label className={getLabelClass(isLightMode)}>Operating City *</label>
              <input type="text" value={form.operatingCity} onChange={handleChange("operatingCity")} placeholder="e.g. Mumbai" className={getInputClass(isLightMode, errors.operatingCity)} />
              <Err field="operatingCity" />
            </div>
          </div>

          <div className="flex gap-3 pt-6 sticky bottom-0 bg-inherit py-4 -mx-2 px-2">
            <button
              type="button"
              onClick={handleCancel}
              className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                isLightMode ? "bg-white/20 text-gray-700 hover:bg-white/30" : "bg-white/10 text-gray-200 hover:bg-white/20"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                isLightMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              Save Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
