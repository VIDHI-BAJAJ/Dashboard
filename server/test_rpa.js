const runQuikrRPA = require('./services/rpa.service');

async function testRPA() {
  try {
    console.log('Testing RPA service...');
    const testListing = {
      id: 'test-1',
      name: 'Test Property',
      propertyCategory: 'Residential',
      propertyType: 'Apartment',
      transactionType: 'Sale',
      city: 'Mumbai',
      propertyPrice: '5000000',
      propertyDescription: 'Test property description with more than 30 characters to meet the minimum requirement.',
      furnishingStatus: 'Unfurnished',
      bathrooms: '2',
      agentName: 'Test Agent',
      agentEmail: 'test@example.com',
      agentMobile: '9999999999',
      image: 'placeholder-image.jpg'
    };

    console.log('Calling RPA service with test listing...');
    await runQuikrRPA(testListing);
    console.log('RPA service completed successfully!');
  } catch (error) {
    console.error('RPA service failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testRPA();