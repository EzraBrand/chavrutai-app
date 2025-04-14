import React, { useState, useEffect } from 'react';
import { getTalmudSection } from '../../services/sefariaService';

const TextDisplay = ({ tractate, page, text, translation, onTextLoad }) => {
  const [viewMode, setViewMode] = useState('bilingual'); // 'hebrew', 'english', 'bilingual'
  const [textData, setTextData] = useState({
    text: text || [],
    translation: translation || []
  });
  const [isLoading, setIsLoading] = useState(!text);
  const [error, setError] = useState(null);
  
  // Fetch text data from Sefaria when tractate or page changes
  useEffect(() => {
    const fetchText = async () => {
      if (!tractate || !page) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getTalmudSection(tractate, page);
        setTextData({
          text: data.text || [],
          translation: data.translation || []
        });
        
        // Call the callback function if provided
        if (onTextLoad) {
          onTextLoad(data);
        }
      } catch (err) {
        console.error('Error fetching text:', err);
        setError('Failed to load the text. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // If text is provided as props, use that instead of fetching
    if (text && translation) {
      setTextData({ text, translation });
      setIsLoading(false);
    } else {
      fetchText();
    }
  }, [tractate, page, onTextLoad, text, translation]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500">
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {tractate} {page}
        </h2>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('hebrew')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              viewMode === 'hebrew' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Hebrew
          </button>
          <button
            type="button"
            onClick={() => setViewMode('english')}
            className={`px-4 py-2 text-sm font-medium ${
              viewMode === 'english' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-gray-300`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setViewMode('bilingual')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              viewMode === 'bilingual' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Bilingual
          </button>
        </div>
      </div>
      
      <div className="text-container">
        {(viewMode === 'hebrew' || viewMode === 'bilingual') && (
          <div 
            className={`hebrew-text mb-4 text-right text-lg ${viewMode === 'bilingual' ? 'pb-4 border-b border-gray-200' : ''}`}
            dir="rtl" 
            lang="he"
          >
            {textData.text.map((paragraph, index) => (
              <p key={`hebrew-${index}`} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>
        )}
        
        {(viewMode === 'english' || viewMode === 'bilingual') && (
          <div className="english-text text-left">
            {textData.translation.map((paragraph, index) => (
              <p key={`english-${index}`} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextDisplay;