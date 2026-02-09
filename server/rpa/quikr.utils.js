// rpa/quikr.utils.js - Utility functions for Quikr bot

const mapListing = require('./quikr.mapper');
const { validateProperty } = require('./quikr.mapper');

/**
 * Prepare a property object for the Quikr bot
 * This function ensures all required fields are present with sensible defaults
 * @param {Object} inputProperty - Partial property object from user
 * @returns {Object} Complete property object ready for the bot
 */
function prepareProperty(inputProperty) {
  // Use the mapper to fill in defaults for missing fields
  const preparedProperty = mapListing(inputProperty);
  
  // Validate the prepared property
  const errors = validateProperty(preparedProperty);
  
  if (errors.length > 0) {
    throw new Error(`Property validation failed after preparing defaults: ${errors.join('; ')}`);
  }
  
  return preparedProperty;
}

/**
 * Validate property object and return detailed feedback
 * @param {Object} property - Property object to validate
 * @returns {Object} Validation result with errors and suggestions
 */
function validatePropertyWithSuggestions(property) {
  const errors = [];
  const warnings = [];
  const suggestions = [];
  
  if (!property) {
    errors.push('Property object is required');
    return { isValid: false, errors, warnings, suggestions };
  }
  
  // Required fields validation
  const requiredFields = ['category', 'listingFor', 'propertyType', 'availableFrom', 'city', 'price', 'description', 'furnishing', 'bathrooms', 'ownerType', 'name', 'email', 'mobile'];
  
  requiredFields.forEach(field => {
    const value = property[field];
    if (value === undefined || value === null || value === '') {
      errors.push(`Missing required field: ${field}`);
      suggestions.push(`Add "${field}" to your property object`);
    }
  });
  
  // Images validation
  if (!Array.isArray(property.images) || property.images.length === 0) {
    errors.push('Property must include at least one image in an array');
    suggestions.push('Add "images" as an array of file paths: ["path/to/image1.jpg"]');
  }
  
  // Price validation
  if (isNaN(property.price) || property.price <= 0) {
    errors.push('Property price must be a positive number');
    suggestions.push('Set "price" to a positive number: 5000000');
  }
  
  // Description length
  if (typeof property.description === 'string' && property.description.length < 30) {
    warnings.push('Property description should be at least 30 characters for better visibility');
    suggestions.push('Make description at least 30 characters long');
  }
  
  // Email format
  if (typeof property.email === 'string') {
    const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(property.email)) {
      errors.push('Invalid email format');
      suggestions.push('Use a valid email format: name@domain.com');
    }
  }
  
  // Mobile format
  if (typeof property.mobile === 'string') {
    const mobileRegex = /^\d{10,15}$/;
    if (!mobileRegex.test(property.mobile)) {
      errors.push('Mobile number must be 10-15 digits');
      suggestions.push('Use 10-15 digit mobile number without spaces or dashes');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

/**
 * Transform Airtable/listing data to Quikr property format
 * @param {Object} listingData - Raw listing data from Airtable or other source
 * @returns {Object} Transformed property object for Quikr
 */
function transformListingData(listingData) {
  if (!listingData) {
    return mapListing({});
  }
  
  // Mapping from common field names to Quikr property format
  const transformed = {
    // Basic information
    category: listingData.category || listingData.propertyCategory || 'Residential',
    listingFor: listingData.listingFor || listingData.transactionType || listingData.type || 'Sell',
    propertyType: listingData.propertyType || listingData.typeOfProperty || 'Apartment',
    availableFrom: listingData.availableFrom || listingData.moveInDate || new Date().toISOString().split('T')[0],
    city: listingData.city || listingData.location || listingData.operatingCity || 'Mumbai',
    
    // Images
    images: Array.isArray(listingData.images) ? listingData.images : 
             Array.isArray(listingData.image) ? listingData.image : 
             typeof listingData.image === 'string' ? [listingData.image] : 
             [listingData.image || 'placeholder-image.jpg'],
    
    // Pricing
    price: parseInt(listingData.price) || parseInt(listingData.rent) || parseInt(listingData.expectedPrice) || 100000,
    negotiable: Boolean(listingData.negotiable) || Boolean(listingData.isNegotiable) || false,
    
    // Property details
    description: listingData.description || listingData.propertyDescription || 
                 'Well-maintained property available for sale. Prime location with excellent connectivity and nearby amenities.',
    furnishing: listingData.furnishing || listingData.furnitureStatus || 'Unfurnished',
    bathrooms: listingData.bathrooms || listingData.numberOfBathrooms || listingData.bathroom || '1',
    
    // Owner information
    ownerType: listingData.ownerType || listingData.sellerType || 'Owner',
    name: listingData.name || listingData.ownerName || listingData.contactPerson || 'Default Owner',
    email: listingData.email || listingData.ownerEmail || listingData.contactEmail || 'owner@example.com',
    mobile: listingData.mobile || listingData.phone || listingData.phoneNumber || listingData.contactNumber || '9999999999'
  };
  
  return transformed;
}

/**
 * Print property validation report to console
 * @param {Object} property - Property object to validate
 */
function printValidationReport(property) {
  const result = validatePropertyWithSuggestions(property);
  
  console.log('\n📋 Property Validation Report');
  console.log('=============================');
  console.log(`Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}\n`);
  
  if (result.errors.length > 0) {
    console.log('❌ ERRORS:');
    result.errors.forEach(error => console.log(`  • ${error}`));
    console.log('');
  }
  
  if (result.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    result.warnings.forEach(warning => console.log(`  • ${warning}`));
    console.log('');
  }
  
  if (result.suggestions.length > 0) {
    console.log('💡 SUGGESTIONS:');
    result.suggestions.forEach(suggestion => console.log(`  • ${suggestion}`));
    console.log('');
  }
  
  return result;
}

module.exports = {
  prepareProperty,
  validatePropertyWithSuggestions,
  transformListingData,
  printValidationReport
};

// Example usage when running directly
if (require.main === module) {
  console.log('Quikr Utils - Property Validation Examples\n');
  
  // Example 1: Valid property
  console.log('Example 1: Valid property');
  const validProperty = {
    category: 'Residential',
    listingFor: 'Sell',
    propertyType: 'Apartment',
    availableFrom: '2024-12-01',
    city: 'Mumbai',
    images: ['image1.jpg'],
    price: 5000000,
    negotiable: true,
    description: 'Spacious 2 BHK apartment in a secure gated community with modern amenities.',
    furnishing: 'Semi-Furnished',
    bathrooms: '2',
    ownerType: 'Owner',
    name: 'John Smith',
    email: 'john@example.com',
    mobile: '9876543210'
  };
  
  printValidationReport(validProperty);
  
  // Example 2: Incomplete property
  console.log('\nExample 2: Incomplete property');
  const incompleteProperty = {
    category: 'Residential',
    propertyType: 'Apartment',
    price: 5000000,
    images: ['image.jpg']
    // Missing many required fields
  };
  
  printValidationReport(incompleteProperty);
  
  // Example 3: Transform raw listing data
  console.log('\nExample 3: Transform raw listing data');
  const rawListing = {
    propertyCategory: 'Commercial',
    transactionType: 'Rent',
    typeOfProperty: 'Office Space',
    moveInDate: '2024-11-15',
    location: 'Bangalore',
    rent: 25000,
    propertyDescription: 'Modern office space in central business district.',
    numberOfBathrooms: '2',
    sellerType: 'Agent',
    contactPerson: 'Raj Properties',
    contactEmail: 'contact@rajproperties.com',
    contactNumber: '9876543211'
  };
  
  const transformed = transformListingData(rawListing);
  console.log('Transformed property:');
  console.log(JSON.stringify(transformed, null, 2));
}