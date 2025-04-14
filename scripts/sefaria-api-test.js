// Simple script to test the Sefaria API endpoints

// Function to fetch all tractates
async function fetchAllTractates() {
  try {
    const response = await fetch('https://www.sefaria.org/api/index/Bavli');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.contents;
  } catch (error) {
    console.error('Error fetching tractates:', error);
    throw error;
  }
}

// Function to fetch a specific tractate's structure
async function fetchTractateStructure(tractateSlug) {
  try {
    const response = await fetch(`https://www.sefaria.org/api/v2/index/${tractateSlug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching structure for ${tractateSlug}:`, error);
    throw error;
  }
}

// Function to fetch text for a specific reference
async function fetchText(reference) {
  try {
    const response = await fetch(`https://www.sefaria.org/api/texts/${reference}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching text for ${reference}:`, error);
    throw error;
  }
}

// Run the tests
async function runTests() {
  console.log('===== Testing Sefaria API =====');
  
  try {
    // Test 1: Fetch all tractates
    console.log('\n--- Test 1: Fetching all tractates ---');
    const tractates = await fetchAllTractates();
    console.log(`Successfully fetched ${tractates.length} tractates`);
    console.log('First 3 tractates:');
    tractates.slice(0, 3).forEach(tractate => {
      console.log(`- ${tractate.title} (${tractate.heTitle})`);
    });
    
    // Test 2: Fetch structure for Sanhedrin
    console.log('\n--- Test 2: Fetching Sanhedrin structure ---');
    const tractateSlug = 'Bavli_Sanhedrin';
    const structure = await fetchTractateStructure(tractateSlug);
    console.log('Structure fetched successfully');
    console.log('Title:', structure.title);
    console.log('Schema type:', structure.schema.nodeType);
    
    // Test 3: Fetch specific text
    console.log('\n--- Test 3: Fetching specific text ---');
    const reference = 'Sanhedrin.90a.1-5';
    const text = await fetchText(reference);
    console.log('Text fetched successfully');
    console.log('Text info:', {
      ref: text.ref,
      heRef: text.heRef,
      sections: text.sections,
      textLength: text.text.length,
      heTextLength: text.he.length
    });
    
    console.log('\n===== All tests completed successfully =====');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Execute tests
runTests();
