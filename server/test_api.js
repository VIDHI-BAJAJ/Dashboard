const axios = require('axios');

async function testApi() {
  try {
    console.log('Testing API endpoint...');
    const response = await axios.post('http://localhost:5000/api/integrations/quikr/publish', {
      listingId: '1',
      listing: {
        id: '1',
        name: 'Test Listing'
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testApi();