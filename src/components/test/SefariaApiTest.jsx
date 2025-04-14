// src/components/test/SefariaApiTest.jsx
import React, { useState, useEffect } from 'react';
import {
  fetchAllTractates,
  fetchTractateStructure,
  fetchText,
  getPredefinedTractates,
  generatePageRefs,
  buildTextReference
} from '../../services/sefariaService';

const SefariaApiTest = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tractates, setTractates] = useState([]);
  const [predefinedTractates] = useState(getPredefinedTractates());
  const [pages] = useState(generatePageRefs(50)); // First 50 pages for dropdown
  const [selectedTractate, setSelectedTractate] = useState(null);
  const [selectedPage, setSelectedPage] = useState('2a');
  const [selectedSection, setSelectedSection] = useState(null);
  const [tractateStructure, setTractateStructure] = useState(null);
  const [textContent, setTextContent] = useState(null);

  // Handler for tractate selection from predefined list
  const handlePredefinedTractateSelect = (event) => {
    const tractateIndex = event.target.selectedIndex;
    if (tractateIndex > 0) { // Skip the "Select tractate" option
      const tractate = predefinedTractates[tractateIndex - 1];
      loadTractateStructure(tractate);
    }
  };

  // Handler for page selection
  const handlePageSelect = (event) => {
    setSelectedPage(event.target.value);
  };

  // Handler for section selection
  const handleSectionSelect = (event) => {
    setSelectedSection(event.target.value === 'null' ? null : parseInt(event.target.value));
  };

  // Load tractate structure when selected
  const loadTractateStructure = async (tractate) => {
    setLoading(true);
    setError(null);
    setSelectedTractate(tractate);
    try {
      const data = await fetchTractateStructure(tractate);
      setTractateStructure(data);
    } catch (error) {
      console.error(`Error loading structure for ${tractate}:`, error);
      setError(`Failed to fetch tractate structure: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load tractates from API or use predefined list
  const loadTractatesFromApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllTractates();
      setTractates(data);
    } catch (error) {
      console.error('Error loading tractates:', error);
      setError(`Failed to fetch tractates: ${error.message}`);
      // Fallback to predefined list
      console.log('Using predefined tractate list as fallback');
      setTractates(predefinedTractates.map(title => ({ title })));
    } finally {
      setLoading(false);
    }
  };

  // Fetch text based on selections
  const handleFetchText = async () => {
    if (!selectedTractate) {
      setError('Please select a tractate first');
      return;
    }

    setLoading(true);
    setError(null);
    setTextContent(null);

    try {
      const reference = buildTextReference(selectedTractate, selectedPage, selectedSection);
      console.log(`Fetching text for: ${reference}`);
      const data = await fetchText(reference);
      setTextContent(data);
    } catch (error) {
      console.error('Error fetching text:', error);
      setError(`Failed to fetch text: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sefaria API Test</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      {/* Tractate Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Tractate</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">From predefined list:</label>
          <select 
            className="block w-full p-2 border rounded"
            onChange={handlePredefinedTractateSelect}
          >
            <option value="">Select a tractate</option>
            {predefinedTractates.map((tractate) => (
              <option key={tractate} value={tractate}>
                {tractate}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={loadTractatesFromApi}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch All Tractates from API'}
          </button>

          {tractates.length > 0 && (
            <div className="mt-4">
              <p className="mb-2">Found {tractates.length} tractates from API:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {tractates.slice(0, 12).map((tractate, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-sm"
                    onClick={() => loadTractateStructure(tractate.title || tractate)}
                  >
                    {tractate.title || tractate}
                  </button>
                ))}
                {tractates.length > 12 && <p>... and {tractates.length - 12} more</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page and Section Selection */}
      {selectedTractate && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Select Page and Section for {selectedTractate}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Page:</label>
              <select 
                className="block w-full p-2 border rounded"
                value={selectedPage}
                onChange={handlePageSelect}
              >
                {pages.map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Section (optional):</label>
              <select 
                className="block w-full p-2 border rounded"
                value={selectedSection === null ? 'null' : selectedSection}
                onChange={handleSectionSelect}
              >
                <option value="null">All sections</option>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleFetchText}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Text'}
          </button>
        </div>
      )}

      {/* Tractate Structure Info */}
      {selectedTractate && tractateStructure && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Structure Info for {selectedTractate}
          </h2>
          
          <div className="bg-gray-50 p-4 rounded">
            <p><strong>Title:</strong> {tractateStructure.title || 'Unknown'}</p>
            {tractateStructure.heTitle && (
              <p><strong>Hebrew Title:</strong> {tractateStructure.heTitle}</p>
            )}
            
            <div className="mt-2">
              <p><strong>Available Properties:</strong> {Object.keys(tractateStructure).join(', ')}</p>
              
              {tractateStructure.schema && (
                <div className="mt-2">
                  <p><strong>Schema Type:</strong> {tractateStructure.schema.nodeType || 'Unknown'}</p>
                  
                  {/* Show some pages/refs if available */}
                  {tractateStructure.schema.refs && (
                    <div className="mt-2">
                      <p><strong>Available References (sample):</strong></p>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-1">
                        {tractateStructure.schema.refs.slice(0, 8).map((ref, index) => (
                          <button 
                            key={index}
                            className="bg-blue-100 hover:bg-blue-200 p-1 rounded text-sm"
                            onClick={() => {
                              // Extract page and section from reference
                              const parts = ref.split('.');
                              if (parts.length >= 2) {
                                setSelectedPage(parts[1]);
                                setSelectedSection(parts.length >= 3 ? parseInt(parts[2]) : null);
                                handleFetchText();
                              }
                            }}
                          >
                            {ref.split('.').slice(1).join('.')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Text Content Display */}
      {textContent && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Text Content for {textContent.ref || buildTextReference(selectedTractate, selectedPage, selectedSection)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hebrew text */}
            <div className="bg-gray-50 p-4 rounded rtl">
              <h3 className="font-medium mb-2">Hebrew</h3>
              {Array.isArray(textContent.he) ? (
                textContent.he.map((segment, index) => (
                  <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: segment }} />
                ))
              ) : (
                <p>Hebrew text not available or not in expected format</p>
              )}
            </div>
            
            {/* English text */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">English</h3>
              {Array.isArray(textContent.text) ? (
                textContent.text.map((segment, index) => (
                  <div key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: segment }} />
                ))
              ) : (
                <p>English text not available or not in expected format</p>
              )}
            </div>
          </div>
          
          {/* API Response Debug Info */}
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-medium mb-2">API Response Debug Info</h3>
            <p><strong>Response Properties:</strong> {Object.keys(textContent).join(', ')}</p>
            <p><strong>Reference:</strong> {textContent.ref || 'Not provided'}</p>
            <p><strong>Hebrew Reference:</strong> {textContent.heRef || 'Not provided'}</p>
            <p><strong>Next:</strong> {textContent.next || 'Not provided'}</p>
            <p><strong>Prev:</strong> {textContent.prev || 'Not provided'}</p>
            <details>
              <summary className="cursor-pointer text-blue-500">View Full Response</summary>
              <pre className="mt-2 p-2 bg-gray-800 text-white text-xs overflow-auto max-h-80">
                {JSON.stringify(textContent, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg">Loading data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SefariaApiTest;