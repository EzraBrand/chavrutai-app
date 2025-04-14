/**
 * Utility functions for working with Talmud texts
 */

/**
 * Parse a Talmud reference
 * @param {string} ref - Reference string (e.g., "Sanhedrin.90a", "Berakhot.7b")
 * @returns {Object} - Object with tractate and daf properties
 */
export const parseRef = (ref) => {
    // Basic format: Tractate.Page
    const parts = ref.split('.');
    if (parts.length < 2) {
      throw new Error(`Invalid Talmud reference format: ${ref}`);
    }
    
    return {
      tractate: parts[0],
      daf: parts[1]
    };
  };
  
  /**
   * Format a Talmud reference from tractate and daf
   * @param {string} tractate - Tractate name
   * @param {string} daf - Daf/page reference
   * @returns {string} - Formatted reference
   */
  export const formatRef = (tractate, daf) => {
    return `${tractate}.${daf}`;
  };
  
  /**
   * Parse a daf (page) reference
   * @param {string} daf - Daf reference (e.g., "90a", "7b")
   * @returns {Object} - Object with page number and side
   */
  export const parseDaf = (daf) => {
    // Format is typically a number followed by 'a' or 'b'
    const match = daf.match(/^(\d+)([ab])$/);
    if (!match) {
      throw new Error(`Invalid daf format: ${daf}`);
    }
    
    return {
      page: parseInt(match[1], 10),
      side: match[2]
    };
  };
  
  /**
   * Get the next daf in sequence
   * @param {string} daf - Current daf reference
   * @returns {string} - Next daf reference
   */
  export const getNextDaf = (daf) => {
    const { page, side } = parseDaf(daf);
    
    if (side === 'a') {
      // If we're on side 'a', next is side 'b' of same page
      return `${page}b`;
    } else {
      // If we're on side 'b', next is side 'a' of next page
      return `${page + 1}a`;
    }
  };
  
  /**
   * Get the previous daf in sequence
   * @param {string} daf - Current daf reference
   * @returns {string} - Previous daf reference
   */
  export const getPrevDaf = (daf) => {
    const { page, side } = parseDaf(daf);
    
    if (side === 'b') {
      // If we're on side 'b', previous is side 'a' of same page
      return `${page}a`;
    } else if (page > 1) {
      // If we're on side 'a' and not the first page, previous is side 'b' of previous page
      return `${page - 1}b`;
    } else {
      // If we're on the first page, side 'a', there is no previous daf
      return null;
    }
  };
  
  /**
   * Clean HTML from text
   * @param {string} text - Text that might contain HTML tags
   * @returns {string} - Clean text without HTML
   */
  export const cleanHtml = (text) => {
    if (!text) return '';
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  };
  
  export default {
    parseRef,
    formatRef,
    parseDaf,
    getNextDaf,
    getPrevDaf,
    cleanHtml
  };