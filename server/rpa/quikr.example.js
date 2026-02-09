// rpa/quikr.example.js - Example usage of the complete Quikr bot

const runQuikrBot = require('./quikr.bot');

/**
 * Example property listing object
 * This demonstrates all the required fields for the Quikr bot
 */
const exampleProperty = {
  // Basic property information
  category: 'Residential',
  listingFor: 'Sell',        // or 'Rent'
  propertyType: 'Apartment', // or 'House', 'Villa', etc.
  availableFrom: '2024-12-01',
  city: 'Mumbai',
  
  // Images - array of file paths
  images: [
    'C:/path/to/property/image1.jpg',
    'C:/path/to/property/image2.jpg',
    'C:/path/to/property/image3.jpg'
  ],
  
  // Pricing information
  price: 7500000,           // Numeric value
  negotiable: true,         // Boolean
  
  // Property details
  description: 'Beautiful 2 BHK apartment in prime location. Well maintained with modern amenities. Close to metro station and shopping complex. Perfect for family living.',
  furnishing: 'Furnished',  // or 'Semi-Furnished', 'Unfurnished'
  bathrooms: '2',           // String value matching pill button text
  
  // Owner information
  ownerType: 'Owner',       // or 'Agent', 'Builder'
  name: 'John Smith',
  email: 'john.smith@example.com',
  mobile: '9876543210'
};

/**
 * Run the complete Quikr automation
 */
async function runExample() {
  try {
    console.log('=== Quikr Property Listing Automation Example ===\n');
    
    // Run the complete automation
    await runQuikrBot(exampleProperty);
    
    console.log('\n=== Automation completed successfully ===');
    
  } catch (error) {
    console.error('\n=== Automation failed ===');
    console.error('Error:', error.message);
    console.error('=== End of error ===');
  }
}

/**
 * Example with different property types
 */
const rentPropertyExample = {
  category: 'Residential',
  listingFor: 'Rent',
  propertyType: 'House',
  availableFrom: '2024-11-15',
  city: 'Delhi',
  images: [
    'C:/path/to/rental/house1.jpg',
    'C:/path/to/rental/house2.jpg'
  ],
  price: 25000,
  negotiable: false,
  description: 'Independent house for rent. Fully furnished with 3 bedrooms, 2 bathrooms. Located in a peaceful residential area with good connectivity.',
  furnishing: 'Furnished',
  bathrooms: '2',
  ownerType: 'Owner',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@example.com',
  mobile: '9876543211'
};

/**
 * Run rental property example
 */
async function runRentalExample() {
  try {
    console.log('=== Quikr Rental Property Listing Example ===\n');
    await runQuikrBot(rentPropertyExample);
    console.log('\n=== Rental listing completed ===');
  } catch (error) {
    console.error('Rental example failed:', error.message);
  }
}

// Export examples for use in other modules
module.exports = {
  exampleProperty,
  rentPropertyExample,
  runExample,
  runRentalExample
};

// Uncomment one of these lines to run the example:
// runExample();        // Run the sale property example
// runRentalExample();  // Run the rental property example