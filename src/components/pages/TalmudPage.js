import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextDisplay from '../text/TextDisplay';
import AnalysisPanel from '../ai/AnalysisPanel';
import { parseRef } from '../../utils/textUtils';

const TalmudPage = () => {
  const { ref } = useParams();
  const navigate = useNavigate();
  
  // Default to Sanhedrin 90a if no ref is provided
  const defaultRef = 'Sanhedrin.90a';
  
  // Parse the ref to get tractate and daf
  const { tractate, daf } = ref ? parseRef(ref) : parseRef(defaultRef);
  
  const [textData, setTextData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  
  // Navigate to a different page
  const handlePageNavigation = (newRef) => {
    if (newRef) {
      navigate(`/text/${newRef}`);
    }
  };
  
  // Handle text loading
  const handleTextLoad = (data) => {
    setTextData(data);
    
    // Navigate to next/prev page
    if (data.nextSection) {
      document.getElementById('next-btn').disabled = false;
    }
    
    if (data.prevSection) {
      document.getElementById('prev-btn').disabled = false;
    }
  };
  
  // Effect to reset analysis when text changes
  useEffect(() => {
    // Reset analysis data when text changes
    setAnalysisData(null);
  }, [ref]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation buttons */}
      <div className="flex justify-between mb-6">
        <button
          id="prev-btn"
          onClick={() => textData?.prevSection && handlePageNavigation(textData.prevSection)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!textData?.prevSection}
        >
          Previous Page
        </button>
        
        <button
          id="next-btn"
          onClick={() => textData?.nextSection && handlePageNavigation(textData.nextSection)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!textData?.nextSection}
        >
          Next Page
        </button>
      </div>
      
      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-4">Talmud Text</h1>
          <TextDisplay 
            tractate={tractate}
            page={daf}
            onTextLoad={handleTextLoad}
          />
        </div>
        
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-4">AI Analysis</h1>
          <AnalysisPanel 
            tractate={tractate}
            page={daf}
            isLoading={isLoadingAnalysis}
            analysisData={analysisData}
          />
        </div>
      </div>
    </div>
  );
};

export default TalmudPage;