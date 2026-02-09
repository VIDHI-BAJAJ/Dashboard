// rpa/quikr.mapper.js
// Legacy mapper for backward compatibility

/**
 * Map listing object to Quikr property format
 * @param {Object} listing - Original listing object
 * @returns {Object} Mapped property object for Quikr bot
 */
module.exports = function mapListing(listing) {
  if (!listing) {
    listing = {};
  }
  
  return {
    // Basic information
    category: listing.category || listing.propertyCategory || 'Residential',
    listingFor: listing.listingFor || listing.transactionType || 'Sell',
    propertyType: listing.propertyType || 'Apartment',
    availableFrom: listing.availableFrom || listing.possessionDate || listing.ageOfProperty || new Date().toISOString().split('T')[0],
    city: listing.city || 'Mumbai',
    
    // Images - ensure at least one placeholder if empty
    images: listing.images ? 
      (Array.isArray(listing.images) ? 
        (listing.images.length > 0 ? listing.images : ['placeholder-image.jpg']) : 
        [listing.images]) 
      : ['placeholder-image.jpg'],
    
    // Pricing
    price: listing.price || 100000, // Default to 1 lakh if not provided
    negotiable: listing.negotiable || false,
    
    // Property details
    description: listing.description || listing.propertyDescription || 'Well-maintained property available for sale. Prime location with excellent connectivity and nearby amenities.',
    furnishing: listing.furnishing || listing.furnishingStatus || 'Unfurnished',
    bathrooms: listing.bathrooms ? listing.bathrooms.toString() : '1',
    
    // Owner information
    ownerType: listing.ownerType || 'Owner',
    name: listing.ownerName || listing.agentName || listing.name || 'Default Owner',
    email: listing.ownerEmail || listing.agentEmail || listing.email || 'owner@example.com',
    mobile: listing.ownerMobile || listing.agentMobile || listing.mobile || '9999999999'
  };
};

/**
 * Validate property object for Quikr bot requirements
 * @param {Object} property - Property object to validate
 * @returns {Array} Array of validation errors
 */
function validateProperty(property) {
  const errors = [];
  
  if (!property) {
    errors.push('Property object is required');
    return errors;
  }
  
  // Required fields
  const requiredFields = ['category', 'listingFor', 'propertyType', 'availableFrom', 'city', 'price', 'description', 'furnishing', 'bathrooms', 'ownerType', 'name', 'email', 'mobile'];
  
  const missingFields = requiredFields.filter(field => {
    const value = property[field];
    // Check if field exists and has a truthy value (excluding empty strings)
    return value === undefined || value === null || value === '';
  });
  
  if (missingFields.length > 0) {
    errors.push(`Missing required property fields: ${missingFields.join(', ')}`);
  }
  
  // Check for valid images array
  if (!Array.isArray(property.images) || property.images.length === 0) {
    errors.push('Property must include at least one image in an array');
  }
  
  // Validate price is a number
  if (isNaN(property.price) || property.price <= 0) {
    errors.push('Property price must be a positive number');
  }
  
  // Validate description length
  if (typeof property.description === 'string' && property.description.length < 30) {
    errors.push('Property description must be at least 30 characters long');
  }
  
  // Validate email format
  const emailRegex = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$/;
  if (typeof property.email === 'string' && !emailRegex.test(property.email)) {
    errors.push('Invalid email format');
  }
  
  // Validate mobile format (basic check for 10 digits)
  const mobileRegex = /^\d{10,15}$/;
  if (typeof property.mobile === 'string' && !mobileRegex.test(property.mobile)) {
    errors.push('Mobile number must be 10-15 digits');
  }
  
  return errors;
}

module.exports.validateProperty = validateProperty;
  