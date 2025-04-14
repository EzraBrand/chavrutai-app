import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTalmudTractates, getTractateStructure } from '../../services/sefariaService';

const BrowsePage = () => {
  const [tractates, setTractates] = useState([]);
  const [selectedTractate, setSelectedTractate] = useState(null);
  const [tractatePages, setTractatePages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch the list of tractates
  useEffect(() => {
    const fetchTractates = async () => {
      try {
        setIsLoading(true);
        const data = await getTalmudTractates();
        setTractates(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching tractates:', err);
        setError('Failed to load tractates. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchTractates();
  }, []);
  
  // Fetch the structure of a selected tractate
  const handleTractateSelect = async (tractate) => {
    setSelectedTractate(tractate);
    
    try {
      setIsLoading(true);
      const structure = await getTractateStructure(tractate.title);
      
      // Process the pages - this might need adjustment based on the actual API response
      let pages = [];
      
      // Sefaria's API returns different structures for different texts
      // This is a simplified approach
      if (structure.lengths && structure.lengths[0]) {
        const pageCount = structure.lengths[0];
        
        // Generate 'a' and 'b' sides for each page
        for (let i = 1; i <= pageCount; i++) {
          pages.push(`${i}a`);
          pages.push(`${i}b`);
        }
      } else if (structure.schema && structure.schema.nodes) {
        // Alternative structure format
        pages = structure.schema.nodes
          .filter(node => node.nodeType === 'JaggedArrayNode')
          .flatMap(node => {
            const count = node.depth === 1 ? node.lengths[0] : 0;
            return Array.from({ length: count * 2 }, (_, i) => 
              `${Math.floor(i/2) + 1}${i % 2 === 0 ? 'a' : 'b'}`
            );
          });
      }
      
      setTractatePages(pages);
      setIsLoading(false);
    } catch (err) {
      console.error(`Error fetching structure for ${tractate.title}:`, err);
      setError(`Failed to load pages for ${tractate.title}. Please try again later.`);
      setIsLoading(false);
    }
  };
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Browse Talmud</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Talmud</h1>
      
      {/* Tractate selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tractates.map((tractate) => (
          <div 
            key={tractate.title}
            onClick={() => handleTractateSelect(tractate)}
            className={`p-4 border rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors ${
              selectedTractate?.title === tractate.title ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-gray-200'
            }`}
          >
            <h3 className="text-lg font-semibold">{tractate.title}</h3>
            <p className="text-right font-hebrew" dir="rtl">{tractate.heTitle}</p>
          </div>
        ))}
      </div>
      
      {/* Page listing */}
      {selectedTractate && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedTractate.title} Pages
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {tractatePages.map((page) => (
                <Link 
                  key={page}
                  to={`/text/${selectedTractate.title}.${page}`}
                  className="p-3 text-center border border-gray-200 rounded-md hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  {page}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;