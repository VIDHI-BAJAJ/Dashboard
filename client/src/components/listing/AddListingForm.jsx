import { useState } from "react";
import { CloseIcon } from "./ListingIcons";
import { glassBase, glassLight, glassDark } from "./constants";

// Reusable Input Components
const InputField = ({ label, required = false, children, error, isLightMode }) => (
  <div className="mb-4">
    <label className={`block text-sm font-medium mb-2 ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className={`mt-1 text-sm ${isLightMode ? "text-red-600" : "text-red-400"}`}>
        {error}
      </p>
    )}
  </div>
);

const RadioGroup = ({ label, required = false, name, options, value, onChange, isLightMode, error }) => (
  <InputField label={label} required={required} error={error} isLightMode={isLightMode}>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
            value === option.value
              ? isLightMode
                ? "border-blue-500 bg-blue-50"
                : "border-blue-400 bg-blue-900/20"
              : isLightMode
              ? "border-gray-200 hover:border-gray-300"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span className={`text-sm font-medium ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </InputField>
);

const ButtonSelect = ({ label, required = false, options, value, onChange, isLightMode, error }) => (
  <InputField label={label} required={required} error={error} isLightMode={isLightMode}>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            value === option.value
              ? isLightMode
                ? "bg-blue-500 text-white"
                : "bg-blue-600 text-white"
              : isLightMode
              ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              : "bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </InputField>
);

const Dropdown = ({ label, required = false, options, value, onChange, placeholder, isLightMode, error }) => (
  <InputField label={label} required={required} error={error} isLightMode={isLightMode}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg px-4 py-3 transition-all ${
        isLightMode
          ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
          : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </InputField>
);

const TextArea = ({ label, required = false, value, onChange, placeholder, rows = 4, isLightMode, error }) => (
  <InputField label={label} required={required} error={error} isLightMode={isLightMode}>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`w-full rounded-lg px-4 py-3 transition-all ${
        isLightMode
          ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
          : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
      }`}
    />
  </InputField>
);

const NumberInput = ({ label, required = false, value, onChange, placeholder, unit, isLightMode, error }) => (
  <InputField label={label} required={required} error={error} isLightMode={isLightMode}>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg px-4 py-3 pr-16 transition-all ${
          isLightMode
            ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
            : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
        }`}
      />
      {unit && (
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm ${
          isLightMode ? "text-gray-500" : "text-gray-400"
        }`}>
          {unit}
        </span>
      )}
    </div>
  </InputField>
);

const Checkbox = ({ label, checked, onChange, isLightMode }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded"
    />
    <span className={isLightMode ? "text-gray-700" : "text-gray-300"}>{label}</span>
  </label>
);

const MultiSelect = ({ label, options, selected, onChange, isLightMode }) => (
  <InputField label={label} isLightMode={isLightMode}>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => {
            const newSelected = selected.includes(option.value)
              ? selected.filter(v => v !== option.value)
              : [...selected, option.value];
            onChange(newSelected);
          }}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            selected.includes(option.value)
              ? isLightMode
                ? "bg-blue-500 text-white"
                : "bg-blue-600 text-white"
              : isLightMode
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </InputField>
);

// Form Data Structure
const initialFormState = {
  // Category 1: Tell Us About Your Property
  category: "",
  listingFor: "",
  propertyType: "",
  possessionDate: "",
  
  // Category 2: Property Details
  city: "",
  locality: "",
  projectName: "",
  unitType: "",
  builtUpArea: "",
  carpetArea: "",
  
  // Category 3: Photos
  photos: [],
  
  // Category 4: Property Price
  salePrice: "",
  priceNegotiable: false,
  
  // Category 5: More Information
  aboutProperty: "",
  furnishing: "",
  bathrooms: "",
  
  // Category 6: Additional Details
  balconies: "",
  societyAmenities: [],
  direction: "",
  parking: "",
  
  // Category 7: Your Details
  userType: "",
  fullName: "",
  emailAddress: "",
  mobileNumber: "",
  otpVerified: false,
  
  // Category 8: Optional Services
  needPaintingService: false,
  needHomeCleaningService: false,
  needPestControlService: false,
  
  // Category 9: Submit
  termsAccepted: false
};

// Validation Rules
const validateForm = (form) => {
  const errors = {};
  
  // Required fields validation
  if (!form.category) errors.category = "Category is required";
  if (!form.listingFor) errors.listingFor = "Listing type is required";
  if (!form.propertyType) errors.propertyType = "Property type is required";
  if (!form.possessionDate) errors.possessionDate = "Possession date is required";
  if (!form.city) errors.city = "City is required";
  if (!form.locality) errors.locality = "Locality is required";
  if (!form.unitType) errors.unitType = "Unit type is required";
  if (!form.builtUpArea) errors.builtUpArea = "Built-up area is required";
  if (!form.salePrice) errors.salePrice = "Sale price is required";
  if (!form.aboutProperty) errors.aboutProperty = "Property description is required";
  if (form.aboutProperty && form.aboutProperty.length < 30) errors.aboutProperty = "Description must be at least 30 characters";
  if (!form.furnishing) errors.furnishing = "Furnishing status is required";
  if (!form.bathrooms) errors.bathrooms = "Number of bathrooms is required";
  if (!form.userType) errors.userType = "User type is required";
  if (!form.fullName) errors.fullName = "Full name is required";
  if (!form.emailAddress) errors.emailAddress = "Email is required";
  if (!form.mobileNumber) errors.mobileNumber = "Mobile number is required";
  if (!form.termsAccepted) errors.termsAccepted = "Please accept terms and privacy policy";
  
  // Email validation
  if (form.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) {
    errors.emailAddress = "Please enter a valid email address";
  }
  
  // Mobile validation
  if (form.mobileNumber && !/^\d{10}$/.test(form.mobileNumber)) {
    errors.mobileNumber = "Please enter a valid 10-digit mobile number";
  }
  
  // Price validation
  if (form.salePrice && (isNaN(form.salePrice) || Number(form.salePrice) <= 0)) {
    errors.salePrice = "Please enter a valid price";
  }
  
  // Area validation
  if (form.builtUpArea && (isNaN(form.builtUpArea) || Number(form.builtUpArea) <= 0)) {
    errors.builtUpArea = "Please enter a valid area";
  }
  
  return errors;
};

export default function AddListingForm({ onSave, isLightMode = false, onCancel }) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState(1);

  // Handle form field changes
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Find first section with errors
      const errorFields = Object.keys(validationErrors);
      if (errorFields.some(field => ['category', 'listingFor', 'propertyType', 'possessionDate'].includes(field))) {
        setActiveSection(1);
      } else if (errorFields.some(field => ['city', 'locality', 'unitType', 'builtUpArea'].includes(field))) {
        setActiveSection(2);
      } else if (errorFields.some(field => ['salePrice'].includes(field))) {
        setActiveSection(4);
      } else if (errorFields.some(field => ['aboutProperty', 'furnishing', 'bathrooms'].includes(field))) {
        setActiveSection(5);
      } else if (errorFields.some(field => ['userType', 'fullName', 'emailAddress', 'mobileNumber'].includes(field))) {
        setActiveSection(7);
      }
      return;
    }

    // Prepare listing data to send to backend
    const listingData = {
      category: form.category,
      listingFor: form.listingFor,
      propertyType: form.propertyType,
      availableFrom: form.possessionDate,
      city: form.city,
      location: form.locality,
      projectName: form.projectName || null,
      unitType: form.unitType,
      builtUpArea: parseInt(form.builtUpArea) || 0,
      carpetArea: parseInt(form.carpetArea) || 0,
      images: form.photos.length > 0 ? form.photos : ['placeholder-image.jpg'],
      price: parseInt(form.salePrice) || 0,
      negotiable: form.priceNegotiable,
      description: form.aboutProperty,
      furnishing: form.furnishing,
      bathrooms: form.bathrooms,
      balconies: form.balconies || '0',
      societyAmenities: form.societyAmenities,
      direction: form.direction || 'NA',
      parking: form.parking || 'NA',
      ownerType: form.userType,
      name: form.fullName,
      email: form.emailAddress,
      mobile: form.mobileNumber,
      services: {
        painting: form.needPaintingService,
        cleaning: form.needHomeCleaningService,
        pestControl: form.needPestControlService
      }
    };

    try {
      // Save listing to MongoDB
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save listing');
      }

      const savedListing = await response.json();
      
      // Call onSave with the saved listing
      onSave(savedListing);
      setForm(initialFormState);
      setErrors({});
      setActiveSection(1);
    } catch (error) {
      console.error('Error saving listing:', error);
      setErrors({ submit: error.message });
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setErrors({});
    onCancel();
  };

  // Section navigation
  const nextSection = () => {
    if (activeSection < 9) setActiveSection(prev => prev + 1);
  };

  const prevSection = () => {
    if (activeSection > 1) setActiveSection(prev => prev - 1);
  };

  // Section titles and progress
  const sections = [
    { id: 1, title: "Tell Us About Your Property" },
    { id: 2, title: "Property Details" },
    { id: 3, title: "Photos" },
    { id: 4, title: "Property Price" },
    { id: 5, title: "More Information" },
    { id: 6, title: "Additional Details" },
    { id: 7, title: "Your Details" },
    { id: 8, title: "Optional Services" },
    { id: 9, title: "Submit" }
  ];

  return (
    <div className={`w-full rounded-2xl ${glassBase} ${isLightMode ? glassLight : glassDark}`}>
      <div className="p-6 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-inherit py-2 -mx-2 px-2 z-10">
          <h2 className={`text-xl font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
            Add New Property Listing
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className={`p-2 rounded-xl transition-all ${
              isLightMode ? "text-gray-500 hover:text-gray-700 hover:bg-white/20" : "text-gray-400 hover:text-gray-200 hover:bg-white/10"
            }`}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {sections.map((section, index) => (
              <div key={section.id} className="flex-1 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mx-auto ${
                  activeSection >= section.id
                    ? isLightMode ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
                    : isLightMode ? "bg-gray-200 text-gray-500" : "bg-gray-700 text-gray-400"
                }`}>
                  {section.id}
                </div>
                <div className={`text-xs mt-1 ${activeSection >= section.id ? (isLightMode ? "text-gray-900" : "text-gray-100") : (isLightMode ? "text-gray-500" : "text-gray-500")}`}>
                  {section.title.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(activeSection / 9) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Tell Us About Your Property */}
          {activeSection === 1 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                1. Tell Us About Your Property
              </h3>
              
              <RadioGroup
                label="Category"
                required
                name="category"
                options={[
                  { value: "Residential", label: "Residential" },
                  { value: "Commercial", label: "Commercial" },
                  { value: "Agricultural", label: "Agricultural" }
                ]}
                value={form.category}
                onChange={(value) => handleChange("category", value)}
                isLightMode={isLightMode}
                error={errors.category}
              />
              
              <RadioGroup
                label="List Property For"
                required
                name="listingFor"
                options={[
                  { value: "Sell", label: "Sell" },
                  { value: "Rent", label: "Rent" },
                  { value: "PG", label: "PG" },
                  { value: "Flatmate", label: "Flatmate" }
                ]}
                value={form.listingFor}
                onChange={(value) => handleChange("listingFor", value)}
                isLightMode={isLightMode}
                error={errors.listingFor}
              />
              
              <RadioGroup
                label="Property Type"
                required
                name="propertyType"
                options={[
                  { value: "Apartment", label: "Apartment" },
                  { value: "Villa", label: "Villa" },
                  { value: "Builder Floor", label: "Builder Floor" },
                  { value: "Plot", label: "Plot" },
                  { value: "Studio Apartment", label: "Studio Apartment" },
                  { value: "Farm House", label: "Farm House" }
                ]}
                value={form.propertyType}
                onChange={(value) => handleChange("propertyType", value)}
                isLightMode={isLightMode}
                error={errors.propertyType}
              />
              
              <InputField label="Possession Date" required error={errors.possessionDate} isLightMode={isLightMode}>
                <input
                  type="date"
                  value={form.possessionDate}
                  onChange={(e) => handleChange("possessionDate", e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 transition-all ${
                    isLightMode
                      ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
                  }`}
                />
              </InputField>
            </div>
          )}

          {/* Section 2: Property Details */}
          {activeSection === 2 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                2. Property Details
              </h3>
              
              <InputField label="City" required error={errors.city} isLightMode={isLightMode}>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Enter city name"
                  className={`w-full rounded-lg px-4 py-3 transition-all ${
                    isLightMode
                      ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
                  }`}
                />
              </InputField>
              
              <InputField label="Locality" required error={errors.locality} isLightMode={isLightMode}>
                <input
                  type="text"
                  value={form.locality}
                  onChange={(e) => handleChange("locality", e.target.value)}
                  placeholder="Enter locality/area"
                  className={`w-full rounded-lg px-4 py-3 transition-all ${
                    isLightMode
                      ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
                  }`}
                />
              </InputField>
              
              <InputField label="Project Name" isLightMode={isLightMode}>
                <input
                  type="text"
                  value={form.projectName}
                  onChange={(e) => handleChange("projectName", e.target.value)}
                  placeholder="Enter project name (optional)"
                  className={`w-full rounded-lg px-4 py-3 transition-all ${
                    isLightMode
                      ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
                  }`}
                />
              </InputField>
              
              <ButtonSelect
                label="Unit Type"
                required
                options={[
                  { value: "1 RK", label: "1 RK" },
                  { value: "1 BHK", label: "1 BHK" },
                  { value: "2 BHK", label: "2 BHK" },
                  { value: "3 BHK", label: "3 BHK" },
                  { value: "4+ BHK", label: "4+ BHK" }
                ]}
                value={form.unitType}
                onChange={(value) => handleChange("unitType", value)}
                isLightMode={isLightMode}
                error={errors.unitType}
              />
              
              <NumberInput
                label="Built-up Area"
                required
                value={form.builtUpArea}
                onChange={(value) => handleChange("builtUpArea", value)}
                placeholder="Enter area"
                unit="Sq.ft"
                isLightMode={isLightMode}
                error={errors.builtUpArea}
              />
              
              <NumberInput
                label="Carpet Area"
                value={form.carpetArea}
                onChange={(value) => handleChange("carpetArea", value)}
                placeholder="Enter area (optional)"
                unit="Sq.ft"
                isLightMode={isLightMode}
              />
            </div>
          )}

          {/* Section 3: Photos */}
          {activeSection === 3 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                3. Photos
              </h3>
              
              <div className="border-2 border-dashed rounded-xl p-8 text-center relative">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 15) {
                      alert("Maximum 15 photos allowed");
                      return;
                    }
                    
                    const photoUrls = files.map(file => URL.createObjectURL(file));
                    handleChange("photos", photoUrls);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <p className={isLightMode ? "text-gray-500 mb-4" : "text-gray-400 mb-4"}>
                  Upload Property Photos (Min 5 recommended, Max 15)
                </p>
                <p className={`text-sm ${isLightMode ? "text-gray-400" : "text-gray-500"}`}>
                  Accept: JPG / PNG
                </p>
                <button
                  type="button"
                  className={`mt-4 px-6 py-2 rounded-lg font-medium ${
                    isLightMode
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {form.photos.length > 0 ? "Add More Photos" : "Upload Photos"}
                </button>
                
                {/* Preview uploaded photos */}
                {form.photos.length > 0 && (
                  <div className="mt-6">
                    <p className={`mb-3 text-sm ${isLightMode ? "text-green-600" : "text-green-400"}`}>
                      {form.photos.length} photo(s) uploaded
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                      {form.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Property ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // Clean up the URL object
                              URL.revokeObjectURL(photo);
                              const newPhotos = form.photos.filter((_, i) => i !== index);
                              handleChange("photos", newPhotos);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 4: Property Price */}
          {activeSection === 4 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                4. Property Price
              </h3>
              
              <NumberInput
                label="Sale Price"
                required
                value={form.salePrice}
                onChange={(value) => handleChange("salePrice", value)}
                placeholder="Enter price"
                isLightMode={isLightMode}
                error={errors.salePrice}
              />
              
              <Checkbox
                label="Price Negotiable"
                checked={form.priceNegotiable}
                onChange={(checked) => handleChange("priceNegotiable", checked)}
                isLightMode={isLightMode}
              />
            </div>
          )}

          {/* Section 5: More Information */}
          {activeSection === 5 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                5. More Information
              </h3>
              
              <TextArea
                label="About Property"
                required
                value={form.aboutProperty}
                onChange={(value) => handleChange("aboutProperty", value)}
                placeholder="Describe your property in detail (minimum 30 characters)"
                rows={4}
                isLightMode={isLightMode}
                error={errors.aboutProperty}
              />
              
              <RadioGroup
                label="Furnishing"
                required
                name="furnishing"
                options={[
                  { value: "Unfurnished", label: "Unfurnished" },
                  { value: "Semi Furnished", label: "Semi Furnished" },
                  { value: "Fully Furnished", label: "Fully Furnished" }
                ]}
                value={form.furnishing}
                onChange={(value) => handleChange("furnishing", value)}
                isLightMode={isLightMode}
                error={errors.furnishing}
              />
              
              <ButtonSelect
                label="Number of Bathrooms"
                required
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4", label: "4" },
                  { value: "4+", label: "4+" }
                ]}
                value={form.bathrooms}
                onChange={(value) => handleChange("bathrooms", value)}
                isLightMode={isLightMode}
                error={errors.bathrooms}
              />
            </div>
          )}

          {/* Section 6: Additional Details */}
          {activeSection === 6 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                6. Additional Details
              </h3>
              
              <Dropdown
                label="Number of Balconies"
                options={[
                  { value: "0", label: "0" },
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                  { value: "4+", label: "4+" }
                ]}
                value={form.balconies}
                onChange={(value) => handleChange("balconies", value)}
                placeholder="Select number of balconies"
                isLightMode={isLightMode}
              />
              
              <MultiSelect
                label="Society Amenities"
                options={[
                  { value: "Gym", label: "Gym" },
                  { value: "Swimming Pool", label: "Swimming Pool" },
                  { value: "Parking", label: "Parking" },
                  { value: "Security", label: "Security" },
                  { value: "Power Backup", label: "Power Backup" },
                  { value: "Lift", label: "Lift" },
                  { value: "Club House", label: "Club House" },
                  { value: "Garden", label: "Garden" }
                ]}
                selected={form.societyAmenities}
                onChange={(selected) => handleChange("societyAmenities", selected)}
                isLightMode={isLightMode}
              />
              
              <Dropdown
                label="Direction"
                options={[
                  { value: "North", label: "North" },
                  { value: "South", label: "South" },
                  { value: "East", label: "East" },
                  { value: "West", label: "West" },
                  { value: "North-East", label: "North-East" },
                  { value: "North-West", label: "North-West" },
                  { value: "South-East", label: "South-East" },
                  { value: "South-West", label: "South-West" }
                ]}
                value={form.direction}
                onChange={(value) => handleChange("direction", value)}
                placeholder="Select direction"
                isLightMode={isLightMode}
              />
              
              <Dropdown
                label="Parking"
                options={[
                  { value: "Car", label: "Car" },
                  { value: "Bike", label: "Bike" },
                  { value: "Both", label: "Both" },
                  { value: "None", label: "None" }
                ]}
                value={form.parking}
                onChange={(value) => handleChange("parking", value)}
                placeholder="Select parking type"
                isLightMode={isLightMode}
              />
            </div>
          )}

          {/* Section 7: Your Details */}
          {activeSection === 7 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                7. Your Details
              </h3>
              
              <RadioGroup
                label="You Are"
                required
                name="userType"
                options={[
                  { value: "Owner", label: "Owner" },
                  { value: "Agent", label: "Agent" },
                  { value: "Builder", label: "Builder" }
                ]}
                value={form.userType}
                onChange={(value) => handleChange("userType", value)}
                isLightMode={isLightMode}
                error={errors.userType}
              />
              
              <InputField label="Full Name" required error={errors.fullName} isLightMode={isLightMode}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full rounded-lg px-4 py-3 transition-all ${
                    isLightMode
                      ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
                  }`}
                />
              </InputField>
              
              <InputField label="Email Address" required error={errors.emailAddress} isLightMode={isLightMode}>
                <input
                  type="email"
                  value={form.emailAddress}
                  onChange={(e) => handleChange("emailAddress", e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full rounded-lg px-4 py-3 transition-all ${
                    isLightMode
                      ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
                  }`}
                />
              </InputField>
              
              <InputField label="Mobile Number" required error={errors.mobileNumber} isLightMode={isLightMode}>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
                    +91
                  </span>
                  <input
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(e) => handleChange("mobileNumber", e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className={`w-full rounded-lg px-4 py-3 pl-12 transition-all ${
                      isLightMode
                        ? "bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-800 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-400"
                    }`}
                  />
                </div>
              </InputField>
            </div>
          )}

          {/* Section 8: Optional Services */}
          {activeSection === 8 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                8. Optional Services
              </h3>
              
              <div className="space-y-3">
                <Checkbox
                  label="Need Painting Service"
                  checked={form.needPaintingService}
                  onChange={(checked) => handleChange("needPaintingService", checked)}
                  isLightMode={isLightMode}
                />
                <Checkbox
                  label="Need Home Cleaning Service"
                  checked={form.needHomeCleaningService}
                  onChange={(checked) => handleChange("needHomeCleaningService", checked)}
                  isLightMode={isLightMode}
                />
                <Checkbox
                  label="Need Pest Control Service"
                  checked={form.needPestControlService}
                  onChange={(checked) => handleChange("needPestControlService", checked)}
                  isLightMode={isLightMode}
                />
              </div>
            </div>
          )}

          {/* Section 9: Submit */}
          {activeSection === 9 && (
            <div className="space-y-6">
              <h3 className={`text-lg font-semibold ${isLightMode ? "text-gray-900" : "text-gray-100"}`}>
                9. Submit
              </h3>
              
              <div className={`p-4 rounded-lg ${isLightMode ? "bg-blue-50 border border-blue-200" : "bg-blue-900/20 border border-blue-800"}`}>
                <h4 className={`font-medium mb-2 ${isLightMode ? "text-blue-900" : "text-blue-100"}`}>
                  Review Your Listing
                </h4>
                <ul className={`text-sm space-y-1 ${isLightMode ? "text-blue-800" : "text-blue-200"}`}>
                  <li>• Category: {form.category || "Not selected"}</li>
                  <li>• Property Type: {form.propertyType || "Not selected"}</li>
                  <li>• Location: {form.city}, {form.locality}</li>
                  <li>• Price: ₹{form.salePrice || "0"}</li>
                  <li>• Area: {form.builtUpArea || "0"} Sq.ft</li>
                </ul>
              </div>
              
              <Checkbox
                label="I accept the Terms & Privacy Policy"
                checked={form.termsAccepted}
                onChange={(checked) => handleChange("termsAccepted", checked)}
                isLightMode={isLightMode}
              />
              {errors.termsAccepted && (
                <p className={`text-sm ${isLightMode ? "text-red-600" : "text-red-400"}`}>
                  {errors.termsAccepted}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6 sticky bottom-0 bg-inherit py-4 -mx-2 px-2">
            {activeSection > 1 && (
              <button
                type="button"
                onClick={prevSection}
                className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                  isLightMode
                    ? "bg-white/20 text-gray-700 hover:bg-white/30"
                    : "bg-white/10 text-gray-200 hover:bg-white/20"
                }`}
              >
                Previous
              </button>
            )}
            
            {activeSection < 9 ? (
              <button
                type="button"
                onClick={nextSection}
                className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                  isLightMode
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                  isLightMode
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-green-600 text-white hover:bg-green-500"
                }`}
              >
                Post Ad Now
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}