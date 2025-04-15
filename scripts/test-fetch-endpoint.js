import fetch from 'node-fetch';

async function testFetchEndpoint() {
  const VERCEL_URL = 'https://talmud-viewer.vercel.app';
  
  console.log('Testing /api/fetch endpoint');
  console.log('==========================');
  
  try {
    console.log('Sending request to:', `${VERCEL_URL}/api/fetch`);
    console.log('Request payload:', {
      input_method: 'dropdown',
      tractate: 'Berakhot',
      page: '2a',
      section: null
    });

    const response = await fetch(`${VERCEL_URL}/api/fetch`, {
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
    
    console.log('\nResponse status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text(); // Get raw text first
    console.log('\nRaw response:', data);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('\nParsed JSON data:', jsonData);
    } catch (e) {
      console.log('Failed to parse response as JSON:', e.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testFetchEndpoint();