const axios = require('axios');

async function testConnection() {
  try {
    console.log('Testing direct connection to backend...');
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
    
    console.log('Direct connection successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Direct connection failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }

  try {
    console.log('\nTesting proxy connection...');
    const response = await axios.post('http://localhost:5175/api/integrations/quikr/publish', {
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
    
    console.log('Proxy connection successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Proxy connection failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testConnection();