/**
 * Validation helper for Quikr Homes listing data
 */

/**
 * Validates required fields for Quikr Homes listing
 * @param {Object} listing - The listing object to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
function validateQuikrListing(listing) {
  const errors = [];

  // Check if listing object exists
  if (!listing) {
    errors.push('Listing object is required');
    return { isValid: false, errors };
  }

  // Required fields validation
  console.log('Validating category:', listing.category);
  if (!listing.category || !listing.category.trim()) {
    errors.push('category is required');
  }
  
  console.log('Validating description:', listing.description);
  if (!listing.description || !listing.description.trim()) {
    errors.push('description is required');
  } else if (listing.description.trim().length < 30) {
    errors.push('description must be at least 30 characters long (current length: ' + listing.description.trim().length + ')');
  }
  
  console.log('Validating furnishing:', listing.furnishing);
  if (!listing.furnishing || !listing.furnishing.trim()) {
    errors.push('furnishing is required');
  }
  
  console.log('Validating mobile:', listing.mobile);
  if (!listing.mobile || !listing.mobile.trim()) {
    errors.push('mobile is required');
  } else {
    // Validate mobile format (10-15 digits)
    const mobileRegex = /^\d{10,15}$/;
    if (!mobileRegex.test(listing.mobile.toString())) {
      errors.push('mobile must be 10-15 digits');
    }
  }
  
  console.log('Validating email:', listing.email);
  if (!listing.email || !listing.email.trim()) {
    errors.push('email is required');
  } else {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(listing.email)) {
      errors.push('email format is invalid');
    }
  }
  
  console.log('Validating price:', listing.price);
  if (!listing.price || listing.price <= 0) {
    errors.push('price is required and must be a positive number');
  }
  
  console.log('Validating city:', listing.city);
  if (!listing.city || !listing.city.trim()) {
    errors.push('city is required');
  }
  
  console.log('Validating location:', listing.location);
  if (!listing.location || !listing.location.trim()) {
    errors.push('location (locality) is required');
  }

  // Check if images exist and are valid
  if (!listing.images || (Array.isArray(listing.images) && listing.images.length === 0)) {
    // Add a placeholder if no images provided
    console.warn('Warning: No images provided for listing, using placeholder');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateQuikrListing
};