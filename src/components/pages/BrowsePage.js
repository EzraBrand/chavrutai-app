// src/components/pages/BrowsePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getTalmudTractates, 
  getTractateStructure,
  getPredefinedTractates,
  generatePageRefs
} from '../../services/sefariaService';

const BrowsePage = () => {
  const [tractates, setTractates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTractate, setSelectedTractate] = useState(null);
  const [tractateStructure, setTractateStructure] = useState(null);
  const [loadingStructure, setLoadingStructure] = useState(false);
  const [structureError, setStructureError] = useState(null);

  // Load tractates on component mount
  useEffect(() => {
    loadTractates();
  }, []);

  // Function to load tractates with detailed error handling
  const loadTractates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching tractates from API...');
      const data = await getTalmudTractates();
      
      console.log('Tractates API response:', data);
      
      if (!data || !Array.isArray(data)) {
        console.error('Invalid data format received:', data);
        throw new Error('Invalid data format received from API');
      }
      
      if (data.length === 0) {
        console.warn('Empty tractates array received');
        throw new Error('No tractates found');
      }
      
      setTractates(data);
      console.log('Successfully loaded', data.length, 'tractates');
    } catch (error) {
      console.error('Error loading tractates:', error);
      setError(`Failed to load tractates: ${error.message}`);
      
      // Try to use the predefined list as a fallback
      console.log('Using predefined tractate list as fallback');
      const predefinedList = getPredefinedTractates();
      if (predefinedList && predefinedList.length > 0) {
        setTractates(predefinedList.map(title => ({ title })));
        setError('Using local tractate list due to API error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle tractate selection
  const handleTractateSelect = async (tractate) => {
    const tractateTitle = tractate.title || tractate;
    console.log(`Selected tractate title: ${tractateTitle}`); // Debug log
    setSelectedTractate(tractateTitle);
    setLoadingStructure(true);
    setStructureError(null);
    setTractateStructure(null);
    
    try {
      console.log(`Loading structure for tractate: ${tractateTitle}`);
      const data = await getTractateStructure(tractateTitle);
      
      console.log('Tractate structure response:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setTractateStructure(data);
    } catch (error) {
      console.error('Error loading tractate structure:', error);
      setStructureError(`Failed to load structure: ${error.message}`);
      
      // Create a fallback structure if needed
      const fallbackPages = generatePageRefs(50); // First 50 pages
      setTractateStructure({
        title: tractateTitle,
        isFallback: true,
        fallbackPages
      });
    } finally {
      setLoadingStructure(false);
    }
  };

  // Render function for tractate list
  const renderTractateList = () => (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold p-4 border-b">Tractates</h2>
      <ul className="divide-y max-h-[70vh] overflow-y-auto">
        {tractates.map((tractate, index) => (
          <li 
            key={index}
            className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedTractate === (tractate.title || tractate) ? 'bg-blue-50' : ''}`}
            onClick={() => handleTractateSelect(tractate)}
          >
            {tractate.title || tractate}
            {tractate.heTitle && <span className="text-gray-500 ml-2">({tractate.heTitle})</span>}
          </li>
        ))}
      </ul>
    </div>
  );

  // Render function for tractate structure with fallback handling
  const renderTractateStructure = () => {
    if (!selectedTractate) {
      return (
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600">Select a tractate from the list to view details</p>
        </div>
      );
    }

    if (loadingStructure) {
      return (
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-center py-8">Loading structure for {selectedTractate}...</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">
          {selectedTractate}
          {structureError && (
            <span className="text-sm font-normal text-yellow-600 ml-2">
              (Limited information available)
            </span>
          )}
        </h2>
        
        {structureError && (
          <div className="mb-4 text-yellow-600 text-sm">
            {structureError}
          </div>
        )}
        
        {tractateStructure && (
          <>
            {/* Standard schema.nodes structure */}
            {tractateStructure.schema?.nodes && (
              <div>
                <h3 className="font-semibold mb-2">Chapters</h3>
                <div className="space-y-4">
                  {tractateStructure.schema.nodes.map((chapter, chIndex) => (
                    <div key={chIndex}>
                      <h4 className="font-medium">Chapter {chIndex + 1}</h4>
                      {chapter.refs && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                          {chapter.refs.map((ref, refIndex) => {
                            const pagePart = ref.split('.')[1] || '';
                            return (
                              <Link 
                                to={`/text/${ref}`}
                                key={refIndex}
                                className="bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-center text-blue-700"
                              >
                                {pagePart}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Alternative schema.refs structure */}
            {!tractateStructure.schema?.nodes && tractateStructure.schema?.refs && (
              <div>
                <h3 className="font-semibold mb-2">Pages</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {tractateStructure.schema.refs.map((ref, refIndex) => {
                    const pagePart = ref.split('.')[1] || '';
                    return (
                      <Link 
                        to={`/text/${ref}`}
                        key={refIndex}
                        className="bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-center text-blue-700"
                      >
                        {pagePart}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Fallback structure when schema is not available */}
            {tractateStructure.isFallback && tractateStructure.fallbackPages && (
              <div>
                <h3 className="font-semibold mb-2">Pages (Basic Navigation)</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {tractateStructure.fallbackPages.map((page, index) => (
                    <Link 
                      to={`/text/${selectedTractate}.${page}`}
                      key={index}
                      className="bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-center text-blue-700"
                    >
                      {page}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* If no schema structure is available at all */}
            {!tractateStructure.schema?.nodes && 
             !tractateStructure.schema?.refs && 
             !tractateStructure.isFallback && (
              <div>
                <p className="text-yellow-700">
                  Structure format not recognized. Debug information:
                </p>
                <details>
                  <summary className="cursor-pointer text-sm text-blue-500">Structure Data</summary>
                  <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                    {JSON.stringify(tractateStructure, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Browse Talmud</h1>
      
      {/* Error message */}
      {error && error !== 'Using local tractate list due to API error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={loadTractates}
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Loading state for initial tractate list */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-lg">Loading tractates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tractate list */}
          <div className="md:col-span-4">
            {renderTractateList()}
          </div>
          
          {/* Tractate details */}
          <div className="md:col-span-8">
            {renderTractateStructure()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowsePage;