import React, { useState, useEffect } from 'react';
import { getTalmudSection } from '../../services/sefariaService';

const AnalysisPanel = ({ tractate, page, isLoading: parentLoading }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState({});
  
  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'background', label: 'Background' },
    { id: 'key-concepts', label: 'Key Concepts' },
    { id: 'commentary', label: 'Commentary' },
  ];

  // Load text data when tractate/page changes
  useEffect(() => {
    const loadText = async () => {
      if (!tractate || !page) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getTalmudSection(`${tractate}.${page}`);
        
        if (!data || (!data.text && !data.he)) {
          throw new Error('No text content returned from API');
        }

        // Use functional update to avoid dependency on analysisData
        setAnalysisData(prevData => ({
          ...prevData,
          [activeTab]: Array.isArray(data.text) ? data.text : [data.text]
        }));
      } catch (error) {
        console.error('Error loading text:', error);
        setError('Failed to load the text. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadText();
  }, [tractate, page, activeTab]);

  // Generate new analysis (placeholder for AI analysis integration)
  const handleGenerateAnalysis = async (type) => {
    if (!tractate || !page) {
      setError('Missing tractate or page reference');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getTalmudSection(`${tractate}.${page}`);
      
      // Just use the text data for now - this will be replaced with actual AI analysis
      setAnalysisData(prev => ({
        ...prev,
        [type]: [`Loading ${type} analysis...`, 
                 `Text loaded successfully. AI analysis will be implemented soon.`]
      }));
    } catch (error) {
      console.error('Error generating analysis:', error);
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6">
        {(loading || parentLoading) ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : analysisData && analysisData[activeTab] ? (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <div>
              {analysisData[activeTab].map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-gray-500 mb-4">No analysis available for this section yet.</p>
            <button
              onClick={() => handleGenerateAnalysis(activeTab)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Generate {tabs.find(tab => tab.id === activeTab)?.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;