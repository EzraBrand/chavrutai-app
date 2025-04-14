// src/services/sefariaService.js

/**
 * Service for interacting with the Sefaria API
 * Includes compatibility with existing component functions and CORS handling
 */

// List of tractates for reference and testing
const tractates = ["Berakhot", "Shabbat", "Eruvin", "Pesachim", "Shekalim", "Yoma", "Sukkah", "Beitzah",
  "Rosh Hashanah", "Taanit", "Megillah", "Moed Katan", "Chagigah", "Yevamot", "Ketubot",
  "Nedarim", "Nazir", "Sotah", "Gittin", "Kiddushin", "Bava Kamma", "Bava Metzia",
  "Bava Batra", "Sanhedrin", "Makkot", "Shevuot", "Avodah Zarah", "Horayot",
  "Zevachim", "Menachot", "Chullin", "Bekhorot", "Arakhin", "Temurah", "Keritot",
  "Meilah", "Kinnim", "Tamid", "Middot", "Niddah"];

// Base URLs
const API_BASE = 'https://www.sefaria.org/api';
const API_V2_BASE = 'https://www.sefaria.org/api/v2';

// Apply CORS proxy to URL if needed
const applyCorsProxy = (url) => {
// Only use CORS proxy in development
if (process.env.NODE_ENV === 'development') {
  return `https://corsproxy.io/?${encodeURIComponent(url)}`;
}
return url;
};

/**
* Enhanced fetch function with CORS handling
* @param {string} url - URL to fetch
* @param {Object} options - Fetch options
* @returns {Promise} - Fetch response
*/
const enhancedFetch = async (url, options = {}) => {
const proxiedUrl = applyCorsProxy(url);
console.log(`Fetching from: ${proxiedUrl}`);
return fetch(proxiedUrl, options);
};

/**
* Fetch all Talmud tractates from Sefaria
* @returns {Promise<Array>} Array of tractate objects
*/
export const fetchAllTractates = async () => {
try {
  console.log('Attempting to fetch tractates from Sefaria API');
  
  // First try with the Bavli index
  let response = await enhancedFetch(`${API_BASE}/index/Bavli`);
  
  if (!response.ok) {
    console.log('Initial tractate fetch attempt failed, trying alternative endpoint...');
    
    // Try alternative endpoint if the first one fails
    response = await enhancedFetch(`${API_BASE}/indexes/titles`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Filter the results to just Talmud tractates
    const allTexts = await response.json();
    console.log(`Filtered API response to find Talmud tractates among ${allTexts.length} texts`);
    
    // Filter to known tractates
    const filteredTractates = allTexts.filter(item => 
      tractates.some(t => item.title.includes(t))
    );
    
    return filteredTractates;
  }
  
  // Process successful response from first attempt
  const data = await response.json();
  
  if (!data || !data.contents) {
    console.error('Unexpected API response format:', data);
    throw new Error('Unexpected API response format - missing contents array');
  }
  
  console.log(`Successfully fetched ${data.contents.length} tractates`);
  return data.contents;
} catch (error) {
  console.error('Error fetching tractates:', error);
  throw error;
}
};

/**
* Fetch structure information for a specific tractate
* @param {string} tractateSlug - The tractate identifier (e.g., 'Sanhedrin')
* @returns {Promise<Object>} Tractate structure data
*/
export const fetchTractateStructure = async (tractateSlug) => {
try {
  // Format the tractate slug properly
  const formattedSlug = formatTractateSlug(tractateSlug);
  console.log(`Fetching structure for tractate: ${formattedSlug}`);
  
  // Try multiple variations of the endpoint
  const endpointsToTry = [
    `${API_V2_BASE}/index/Bavli_${formattedSlug}`,
    `${API_BASE}/index/Bavli_${formattedSlug}`,
    `${API_V2_BASE}/index/${formattedSlug}`,
    `${API_BASE}/index/${formattedSlug}`
  ];
  
  let data = null;
  let responseOk = false;
  let lastError = null;
  
  // Try each endpoint until one works
  for (const endpoint of endpointsToTry) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      const response = await enhancedFetch(endpoint);
      
      if (response.ok) {
        data = await response.json();
        responseOk = true;
        console.log(`Successful response from: ${endpoint}`);
        break;
      } else {
        console.log(`Endpoint ${endpoint} returned status: ${response.status}`);
        // Try to read the error response
        try {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          lastError = new Error(errorData.error || `HTTP status ${response.status}`);
        } catch (e) {
          lastError = new Error(`HTTP status ${response.status}`);
        }
      }
    } catch (endpointError) {
      console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
      lastError = endpointError;
    }
  }
  
  if (!responseOk || !data) {
    // If all endpoints failed, try manual construction of a basic structure
    console.log(`All endpoints failed for ${tractateSlug}, creating fallback structure`);
    
    // Return a fallback structure for debugging
    return {
      title: tractateSlug,
      heTitle: "",
      error: lastError ? lastError.message : "Unknown error",
      // Create a basic schema with some generic page references
      schema: {
        nodes: [
          {
            titles: [{ lang: "en", text: "Chapter 1" }],
            refs: generateChapterRefs(tractateSlug, 1, 20) // Generate 20 pages for Chapter 1
          },
          {
            titles: [{ lang: "en", text: "Chapter 2" }],
            refs: generateChapterRefs(tractateSlug, 21, 40) // Generate 20 pages for Chapter 2
          }
        ]
      }
    };
  }
  
  return data;
} catch (error) {
  console.error(`Error fetching structure for ${tractateSlug}:`, error);
  throw error;
}
};

/**
* Helper function to generate fallback chapter references
* @param {string} tractate - Tractate name
* @param {number} startPage - Starting page number
* @param {number} endPage - Ending page number
* @returns {Array<string>} List of page references
*/
function generateChapterRefs(tractate, startPage, endPage) {
const refs = [];
for (let page = startPage; page <= endPage; page++) {
  const suffix = page % 2 === 0 ? 'a' : 'b';
  const pageNum = Math.ceil(page / 2);
  refs.push(`${tractate}.${pageNum}${suffix}`);
}
return refs;
}

/**
* Fetch text for a specific reference
* @param {string} reference - The text reference (e.g., 'Sanhedrin.90a.1-5')
* @returns {Promise<Object>} Text data including Hebrew and English
*/
export const fetchText = async (reference) => {
try {
  // Try multiple variations of the reference
  const endpointsToTry = [
    `${API_BASE}/texts/${reference}`,
    `${API_BASE}/texts/Bavli ${reference}`
  ];
  
  let data = null;
  let responseOk = false;
  
  // Try each endpoint until one works
  for (const endpoint of endpointsToTry) {
    try {
      console.log(`Trying text endpoint: ${endpoint}`);
      const response = await enhancedFetch(endpoint);
      if (response.ok) {
        data = await response.json();
        responseOk = true;
        console.log(`Successful text response from: ${endpoint}`);
        break;
      }
    } catch (endpointError) {
      console.log(`Text endpoint ${endpoint} failed:`, endpointError.message);
    }
  }
  
  if (!responseOk || !data) {
    throw new Error(`Failed to fetch text for ${reference} from any endpoint`);
  }
  
  return data;
} catch (error) {
  console.error(`Error fetching text for ${reference}:`, error);
  throw error;
}
};

/**
* Search the Talmud for a specific query
* @param {string} query - The search query
* @returns {Promise<Object>} Search results
*/
export const searchTalmud = async (query) => {
try {
  const endpoint = `${API_BASE}/search-wrapper?query=${encodeURIComponent(query)}&filters=Talmud`;
  const response = await enhancedFetch(endpoint);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
} catch (error) {
  console.error(`Error searching for '${query}':`, error);
  throw error;
}
};

/**
* Helper function to extract a readable page reference from a full reference
* @param {string} fullRef - The full reference (e.g., 'Bavli_Sanhedrin.90a.1')
* @returns {string} The readable page reference (e.g., '90a')
*/
export const extractPageRef = (fullRef) => {
const parts = fullRef.split('.');
if (parts.length >= 2) {
  return parts[1]; // The page reference is usually the second part
}
return fullRef;
};

/**
* Helper function to format a tractate slug for API calls
* @param {string} tractateTitle - The tractate title (e.g., 'Sanhedrin')
* @returns {string} Formatted slug (e.g., 'Sanhedrin')
*/
export const formatTractateSlug = (tractateTitle) => {
return tractateTitle.replace(/ /g, '_');
};

/**
* Get a list of predefined Talmud tractates
* @returns {Array<string>} List of tractate names
*/
export const getPredefinedTractates = () => {
return [...tractates];
};

/**
* Generate a list of page references (e.g., ['2a', '2b', '3a', ...])
* @param {number} maxDaf - Maximum page number (default: 180)
* @returns {Array<string>} List of page references
*/
export const generatePageRefs = (maxDaf = 180) => {
const pages = [];
for (let daf = 2; daf <= maxDaf; daf++) {
  pages.push(`${daf}a`);
  pages.push(`${daf}b`);
}
return pages;
};

/**
* Build a full text reference
* @param {string} tractate - Tractate name (e.g., 'Sanhedrin')
* @param {string} page - Page reference (e.g., '90a')
* @param {number|null} section - Optional section number
* @returns {string} Full reference (e.g., 'Sanhedrin.90a.1')
*/
export const buildTextReference = (tractate, page, section = null) => {
let reference = `${tractate}.${page}`;
if (section !== null) {
  reference += `.${section}`;
}
return reference;
};

// ---------- COMPATIBILITY FUNCTIONS ----------
// These functions maintain compatibility with existing component imports

/**
* Get all Talmud tractates (Compatibility function)
* @returns {Promise<Array>} Array of tractate objects
*/
export const getTalmudTractates = async () => {
try {
  return await fetchAllTractates();
} catch (error) {
  console.error('Error in getTalmudTractates:', error);
  // Return the predefined list as a fallback
  return tractates.map(title => ({ title }));
}
};

/**
* Get tractate structure (Compatibility function)
* @param {string} tractateSlug - The tractate identifier
* @returns {Promise<Object>} Tractate structure data
*/
export const getTractateStructure = async (tractateSlug) => {
return await fetchTractateStructure(tractateSlug);
};

/**
* Get a specific section of the Talmud (Compatibility function)
* @param {string} reference - The text reference
* @returns {Promise<Object>} Text data
*/
export const getTalmudSection = async (reference) => {
return await fetchText(reference);
};

/**
* Get text for a specific tractate, page, and optional section (Compatibility function)
* @param {string} tractate - Tractate name
* @param {string} page - Page reference
* @param {number|null} section - Optional section number
* @returns {Promise<Object>} Text data
*/
export const fetchTractateText = async (tractate, page, section = null) => {
const reference = buildTextReference(tractate, page, section);
return await fetchText(reference);
};