// src/services/sefariaService.js

/**
 * Service for interacting with Sefaria API through Vercel proxy
 */

// Handle both Codespace and local development
const getBaseUrl = () => {
  if (process.env.GITHUB_CODESPACES && process.env.CODESPACE_NAME) {
    return `https://${process.env.CODESPACE_NAME}-3000.app.github.dev`;
  }
  return 'http://localhost:3000';
};

const API_BASE_URL = '/api';

// List of tractates for reference
const tractates = ["Berakhot", "Shabbat", "Eruvin", "Pesachim", "Shekalim", "Yoma", "Sukkah", "Beitzah",
  "Rosh Hashanah", "Taanit", "Megillah", "Moed Katan", "Chagigah", "Yevamot", "Ketubot",
  "Nedarim", "Nazir", "Sotah", "Gittin", "Kiddushin", "Bava Kamma", "Bava Metzia",
  "Bava Batra", "Sanhedrin", "Makkot", "Shevuot", "Avodah Zarah", "Horayot"];

/**
 * Helper function to make requests through the proxy
 */
const fetchFromProxy = async (tractate, page, section = null) => {
  try {
    // Use relative URL to work with the proxy
    const response = await fetch(`${API_BASE_URL}/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        input_method: 'dropdown',
        tractate,
        page,
        section
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Proxy error response:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Error fetching from proxy:', error);
    throw error;
  }
};

/**
 * Get text for a specific reference
 */
export const fetchText = async (reference) => {
  try {
    // Parse reference into parts
    const parts = reference.split('.');
    const tractate = parts[0];
    const page = parts[1];
    const section = parts.length > 2 ? parseInt(parts[2]) : null;

    const data = await fetchFromProxy(tractate, page, section);
    
    // Transform the response to match expected format
    return {
      text: data.sections.map(section => section.english).flat(),
      he: data.sections.map(section => section.hebrew).flat(),
      ref: data.span
    };
  } catch (error) {
    console.error(`Error fetching text for ${reference}:`, error);
    throw error;
  }
};

/**
 * Get structure information for a specific tractate
 */
export const fetchTractateStructure = async (tractateSlug) => {
  try {
    // First fetch the first page to verify the tractate exists
    await fetchFromProxy(tractateSlug, '2a');

    // If successful, return standard page structure
    return {
      title: tractateSlug,
      schema: {
        refs: generatePageRefs(64).map(page => `${tractateSlug}.${page}`)
      }
    };
  } catch (error) {
    console.error(`Error fetching structure for ${tractateSlug}:`, error);
    throw error;
  }
};

// Helper functions
export const generatePageRefs = (maxDaf = 180) => {
  const pages = [];
  for (let daf = 2; daf <= maxDaf; daf++) {
    pages.push(`${daf}a`);
    pages.push(`${daf}b`);
  }
  return pages;
};

// Compatibility functions
export const getPredefinedTractates = () => {
  return [...tractates];
};

export const getTalmudTractates = async () => {
  return tractates.map(title => ({ title }));
};

export const getTractateStructure = async (tractateSlug) => {
  return await fetchTractateStructure(tractateSlug);
};

export const getTalmudSection = async (reference) => {
  return await fetchText(reference);
};