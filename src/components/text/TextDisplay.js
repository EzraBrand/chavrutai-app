import React, { useState } from 'react';

const TextDisplay = ({ tractate, page, text, translation }) => {
  const [viewMode, setViewMode] = useState('bilingual'); // 'hebrew', 'english', 'bilingual'
  
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
            {text.map((paragraph, index) => (
              <p key={`hebrew-${index}`} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>
        )}
        
        {(viewMode === 'english' || viewMode === 'bilingual') && (
          <div className="english-text text-left">
            {translation.map((paragraph, index) => (
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