// services/rpa.service.js
const runQuikrBot = require("../rpa/quikr.bot");
const mapListing = require("../rpa/quikr.mapper");
const { processImagePaths, cleanupTempImages } = require('./image.util');

/**
 * Map frontend listing object to Quikr bot format
 * @param {Object} listing - Frontend listing object
 * @returns {Object} Quikr bot compatible property object
 */
function mapToFrontendFormat(listing) {
  // Log incoming listing data for debugging
  console.log('Incoming listing data:', JSON.stringify(listing, null, 2));
  
  // Map field names from both MongoDB schema and React form to Quikr bot format
  const mapped = {
    // Basic information
    category: listing.propertyCategory || listing.category || 'Residential',
    listingFor: listing.transactionType || listing.listingFor || 'Sell',  // 'Sell' or 'Rent'
    propertyType: listing.propertyType || 'Apartment',
    availableFrom: listing.possessionDate || listing.ageOfProperty || listing.availableFrom || new Date().toISOString().split('T')[0],
    city: listing.city || 'Mumbai',
    location: listing.location || listing.locality || 'Default Locality', // Handle both schema variations
    
    // Property configuration
    unitType: listing.unitType || '1 BHK',
    builtUpArea: listing.builtUpArea || 500,
    carpetArea: listing.carpetArea || null,
    
    // Images - handle both schema formats
    images: listing.images || listing.image || listing.photos || ['placeholder-image.jpg'],
    
    // Pricing
    price: parseInt(listing.propertyPrice) || parseInt(listing.price) || 100000,
    negotiable: listing.negotiable || listing.negotiable || false,
    
    // Property details
    description: listing.propertyDescription || listing.description || listing.aboutProperty || 'Well-maintained property available for sale. Prime location with excellent connectivity and nearby amenities.',
    furnishing: listing.furnishingStatus || listing.furnishing || 'Unfurnished',
    bathrooms: listing.bathrooms ? listing.bathrooms.toString() : '1',
    
    // Additional details
    balconies: listing.balconies || '0',
    societyAmenities: listing.societyAmenities || [],
    direction: listing.direction || 'NA',
    parking: listing.parking || 'NA',
    
    // Owner information
    ownerType: listing.ownerType || listing.userType || 'Owner',
    name: listing.agentName || listing.name || listing.fullName || 'Default Owner',
    email: listing.agentEmail || listing.email || listing.emailAddress || 'owner@example.com',
    mobile: listing.agentMobile || listing.mobile || listing.mobileNumber || '9999999999',
    
    // Ensure unitType is properly formatted
    unitType: listing.unitType || listing.bhk || '1 BHK',
    // Ensure builtUpArea is a number
    builtUpArea: parseInt(listing.builtUpArea) || parseInt(listing.area) || 500,
    // Ensure bathrooms is a string
    bathrooms: (listing.bathrooms || listing.noOfBathrooms || 1).toString(),
    
    // Optional services (handle both formats)
    services: {
      painting: listing.services?.painting || listing.needPaintingService || false,
      cleaning: listing.services?.cleaning || listing.needHomeCleaningService || false,
      pestControl: listing.services?.pestControl || listing.needPestControlService || false
    },
    
    // Project name (if available)
    projectName: listing.projectName || ''
  };
  
  // Ensure images is an array
  if (typeof mapped.images === 'string') {
    mapped.images = [mapped.images];
  } else if (!Array.isArray(mapped.images)) {
    mapped.images = ['placeholder-image.jpg'];
  }
  
  // Log the mapped data for debugging
  console.log('Mapped property data:', JSON.stringify(mapped, null, 2));
  
  return mapped;
}

/**
 * Run Quikr RPA for a single listing (plain object from in-memory store).
 * No database; listing is passed from the controller.
 */
module.exports = async function runQuikrRPA(listing) {
  // Note: Validation is now handled in the controller
  // We receive a fully validated listing object
  
  try {
    // Map the listing to Quikr bot format
    // Check if listing is already in bot format or needs mapping
    console.log('Checking if listing is already in bot format...');
    console.log('Has category?', !!listing.category);
    console.log('Has description?', !!listing.description);
    console.log('Has price?', !!listing.price);
    console.log('Has city?', !!listing.city);
    console.log('Has mobile?', !!listing.mobile);
    console.log('Has email?', !!listing.email);
    
    const property = listing.category && listing.description ? 
      listing : // Already in bot format
      mapToFrontendFormat(listing); // Need to map from frontend format
    
    console.log('Final property object:', JSON.stringify(property, null, 2));
    
    // Process images - convert URLs to local files if needed
    let processedImages = [];
    let needsCleanup = false;
    
    console.log('Original property images:', property.images);
    
    if (!property.images || (Array.isArray(property.images) && property.images.length === 0)) {
      console.log('No images provided, setting default placeholder');
      property.images = ['placeholder-image.jpg'];
    } else if (typeof property.images === 'string') {
      // If images is a single string, convert to array
      property.images = [property.images];
    } else if (!Array.isArray(property.images)) {
      // If images is not an array, try to make it one
      property.images = [property.images];
    }
    
    console.log('Property images after normalization:', property.images);
    
    if (Array.isArray(property.images) && property.images.length > 0) {
      try {
        processedImages = await processImagePaths(property.images);
        needsCleanup = processedImages.some(path => path.includes('temp_image_'));
        
        // Update the property with processed image paths
        property.images = processedImages;
        
        console.log('Processed images:', processedImages);
      } catch (imageError) {
        console.error('Error processing images:', imageError.message);
        // Use original images if processing fails
        property.images = Array.isArray(property.images) ? property.images : [property.images];
      }
    } else {
      // If no images after processing, use a placeholder
      property.images = ['placeholder-image.jpg'];
      console.log('Using placeholder image');
    }
    
    // Use the mapper to ensure all required fields are present with defaults
    console.log('About to map property with mapListing:', JSON.stringify(property, null, 2));
    const completeProperty = mapListing(property);
    console.log('After mapping with mapListing:', JSON.stringify(completeProperty, null, 2));
    
    console.log('Running Quikr bot with property...');
    await runQuikrBot(completeProperty);
    console.log('Quikr bot completed successfully');
    
  } catch (botError) {
    console.error('Quikr bot failed:', botError.message);
    console.error('Bot error stack:', botError.stack);
    throw botError;
  } finally {
    // Clean up temporary image files if needed
    if (needsCleanup && processedImages.length > 0) {
      cleanupTempImages(processedImages);
      console.log('Cleaned up temporary image files');
    } else {
      console.log('No temporary files to clean up');
    }
  }
};
