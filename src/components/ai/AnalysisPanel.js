import React, { useState } from 'react';

const AnalysisPanel = ({ tractate, page, isLoading, analysisData }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'background', label: 'Background' },
    { id: 'key-concepts', label: 'Key Concepts' },
    { id: 'commentary', label: 'Commentary' },
  ];

  // Function to simulate generating new analysis
  const handleGenerateAnalysis = (type) => {
    // In real implementation, this would call your AI service
    console.log(`Generating ${type} for ${tractate} ${page}`);
    // You would set loading state and make API call here
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
        {isLoading ? (
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