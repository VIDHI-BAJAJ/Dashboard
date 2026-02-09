// rpa/quikr.preparation.example.js - How to properly prepare property data for Quikr bot

const { prepareProperty, transformListingData, printValidationReport } = require('./quikr.utils');
const runQuikrBot = require('./quikr.bot');

/**
 * Example 1: Prepare an incomplete property object with defaults
 */
console.log('=== Example 1: Preparing Incomplete Property ===\n');

// This is what might come from Airtable with missing fields
const incompleteAirtableData = {
  propertyType: 'Apartment',
  city: 'Mumbai',
  price: 7500000,
  images: ['path/to/apartment1.jpg', 'path/to/apartment2.jpg']
  // Missing many required fields
};

console.log('Original incomplete data:');
console.log(JSON.stringify(incompleteAirtableData, null, 2));

try {
  // Use transformListingData to convert and fill defaults
  const transformedProperty = transformListingData(incompleteAirtableData);
  
  console.log('\nAfter transformation with defaults:');
  console.log(JSON.stringify(transformedProperty, null, 2));
  
  // Validate the transformed property
  printValidationReport(transformedProperty);
  
} catch (error) {
  console.error('Transformation error:', error.message);
}

/**
 * Example 2: Manually prepare a property with all required fields
 */
console.log('\n=== Example 2: Complete Property Preparation ===\n');

const baseListing = {
  // Core property information
  category: 'Residential',
  listingFor: 'Sell',           // 'Sell' or 'Rent'
  propertyType: 'Apartment',    // 'Apartment', 'House', 'Villa', etc.
  availableFrom: '2024-12-01',  // YYYY-MM-DD format
  city: 'Mumbai',               // Target city
  
  // Images (at least one required)
  images: [
    'C:/path/to/property/exterior.jpg',
    'C:/path/to/property/living-room.jpg',
    'C:/path/to/property/kitchen.jpg',
    'C:/path/to/property/bathroom.jpg'
  ],
  
  // Pricing
  price: 8500000,               // Numeric value
  negotiable: true,             // Boolean
  
  // Property details
  description: 'Beautiful 2 BHK apartment in prime location with excellent connectivity. Well-maintained with modern amenities, 24/7 security, gym, swimming pool, and kids play area. Close to schools, hospitals, and shopping malls.',
  furnishing: 'Semi-Furnished', // 'Furnished', 'Semi-Furnished', 'Unfurnished'
  bathrooms: '2',               // Number of bathrooms (as string)
  
  // Owner information
  ownerType: 'Owner',           // 'Owner', 'Agent', 'Builder'
  name: 'John Smith',
  email: 'john.smith@example.com',  // Valid email format
  mobile: '9876543210'          // 10-15 digits
};

console.log('Base listing with all required fields:');
printValidationReport(baseListing);

/**
 * Example 3: Using prepareProperty to ensure completeness
 */
console.log('\n=== Example 3: Using prepareProperty ===\n');

try {
  const completeProperty = prepareProperty(baseListing);
  console.log('Property successfully prepared for Quikr bot!');
  console.log('Final property object:');
  console.log(JSON.stringify(completeProperty, null, 2));
  
} catch (error) {
  console.error('Preparation error:', error.message);
}

/**
 * Example 4: Real-world scenario - processing data from Airtable
 */
console.log('\n=== Example 4: Real-world Airtable Processing ===\n');

// Simulated Airtable record (might have different field names)
const airtableRecord = {
  id: 'rec123456789',
  fields: {
    'Property Title': 'Luxury 3BHK Apartment',
    'Property Type': 'Apartment',
    'Transaction Type': 'Sale',
    'City': 'Delhi',
    'Price (INR)': 12000000,
    'Furnished Status': 'Fully Furnished',
    'Number of Bedrooms': 3,
    'Number of Bathrooms': 3,
    'Description': 'Stunning luxury apartment with premium finishes...',
    'Owner Type': 'Builder',
    'Contact Name': 'ABC Developers',
    'Contact Email': 'contact@abcdevelopers.com',
    'Contact Phone': '9998887776',
    'Images': [
      { url: 'https://example.com/img1.jpg' },
      { url: 'https://example.com/img2.jpg' }
    ]
  }
};

// Extract and transform Airtable data
const airtableData = {
  propertyType: airtableRecord.fields['Property Type'],
  listingFor: airtableRecord.fields['Transaction Type'].toLowerCase() === 'sale' ? 'Sell' : airtableRecord.fields['Transaction Type'],
  city: airtableRecord.fields['City'],
  price: airtableRecord.fields['Price (INR)'],
  furnishing: airtableRecord.fields['Furnished Status'],
  bathrooms: airtableRecord.fields['Number of Bathrooms'].toString(),
  description: airtableRecord.fields['Description'],
  ownerType: airtableRecord.fields['Owner Type'],
  name: airtableRecord.fields['Contact Name'],
  email: airtableRecord.fields['Contact Email'],
  mobile: airtableRecord.fields['Contact Phone'],
  images: airtableRecord.fields['Images'] ? airtableRecord.fields['Images'].map(img => img.url) : []
};

console.log('Processed Airtable data:');
console.log(JSON.stringify(airtableData, null, 2));

const processedProperty = transformListingData(airtableData);
console.log('\nAfter transformation:');
printValidationReport(processedProperty);

/**
 * Example 5: How to run the bot with properly prepared data
 */
console.log('\n=== Example 5: Running the Bot ===\n');

// Once your property is validated and complete, run the bot:
/*
async function runQuikrAutomation() {
  try {
    // Prepare your property data
    const property = prepareProperty(yourRawData);
    
    // Validate before running
    const validationResult = printValidationReport(property);
    if (!validationResult.isValid) {
      throw new Error('Property validation failed');
    }
    
    // Run the bot
    await runQuikrBot(property);
    console.log('Successfully posted to Quikr!');
    
  } catch (error) {
    console.error('Bot execution failed:', error.message);
  }
}
*/

console.log('✅ All examples completed!');
console.log('\n💡 Tips for avoiding "Missing required property fields" error:');
console.log('1. Always ensure these fields exist: category, listingFor, availableFrom, description, furnishing, ownerType, email, mobile');
console.log('2. Use transformListingData() to convert from different data sources');
console.log('3. Use prepareProperty() to fill defaults for missing fields');
console.log('4. Use printValidationReport() to check your data before running the bot');
console.log('5. Make sure images is an array with at least one image path');
console.log('6. Ensure email is in valid format (name@domain.com)');
console.log('7. Ensure mobile is 10-15 digits without spaces or dashes');