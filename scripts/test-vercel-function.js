import fetch from 'node-fetch';

async function testVercelFunction() {
  const VERCEL_URL = 'https://talmud-viewer.vercel.app';
  
  console.log('Testing Vercel Function Integration');
  console.log('==================================');
  
  // Test 1: Basic Health Check
  try {
    console.log('\n1. Testing API health endpoint...');
    const healthResponse = await fetch(`${VERCEL_URL}/api/health`);
    console.log('Status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Response:', healthData);
  } catch (error) {
    console.error('Health check failed:', error.message);
  }

  // Test 2: Direct Text Route
  try {
    console.log('\n2. Testing direct text route...');
    const textResponse = await fetch(`${VERCEL_URL}/text/Berakhot.2a`);
    console.log('Status:', textResponse.status);
    const textData = await textResponse.json();
    console.log('Text route working:', textData && (textData.he || textData.text) ? 'Yes' : 'No');
    if (textData.error) console.log('Error:', textData.error);
  } catch (error) {
    console.error('Text route test failed:', error.message);
  }

  // Test 3: API Fetch Endpoint with POST
  try {
    console.log('\n3. Testing /api/fetch endpoint...');
    const fetchResponse = await fetch(`${VERCEL_URL}/api/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_method: 'dropdown',
        tractate: 'Berakhot',
        page: '2a',
        section: null
      })
    });
    
    console.log('Status:', fetchResponse.status);
    const fetchData = await fetchResponse.json();
    console.log('Fetch endpoint working:', fetchData && !fetchData.error ? 'Yes' : 'No');
    if (fetchData.error) console.log('Error:', fetchData.error);
    
    // Check response structure
    if (fetchData) {
      console.log('\nResponse contains:');
      console.log('- Hebrew text:', !!fetchData.he);
      console.log('- English text:', !!fetchData.text);
      console.log('- Reference:', fetchData.ref);
    }
  } catch (error) {
    console.error('Fetch endpoint test failed:', error.message);
  }

  // Test 4: CORS Headers
  try {
    console.log('\n4. Testing CORS headers...');
    const corsResponse = await fetch(`${VERCEL_URL}/api/fetch`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('Status:', corsResponse.status);
    console.log('CORS Headers:');
    console.log('- Allow-Origin:', corsResponse.headers.get('Access-Control-Allow-Origin'));
    console.log('- Allow-Methods:', corsResponse.headers.get('Access-Control-Allow-Methods'));
    console.log('- Allow-Headers:', corsResponse.headers.get('Access-Control-Allow-Headers'));
  } catch (error) {
    console.error('CORS test failed:', error.message);
  }
}

// Run the tests
testVercelFunction();