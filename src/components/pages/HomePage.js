import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Featured sections to highlight
  const featuredSections = [
    {
      ref: 'Sanhedrin.90a',
      title: 'Sanhedrin 90a',
      description: 'Discussion of the World to Come and resurrection of the dead.'
    },
    {
      ref: 'Berakhot.2a',
      title: 'Berakhot 2a',
      description: 'The first page of the Talmud, discussing when to recite the evening Shema.'
    },
    {
      ref: 'Bava_Metzia.59b',
      title: 'Bava Metzia 59b',
      description: 'The famous story of the Oven of Akhnai and "not in heaven."'
    },
    {
      ref: 'Gittin.55b',
      title: 'Gittin 55b',
      description: 'The story of Kamtza and Bar Kamtza, leading to the destruction of the Temple.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-xl p-8 mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to ChavrutAI</h1>
        <p className="text-xl mb-6">
          Study Talmud with the assistance of AI-powered insights and analysis
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/browse" 
            className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse Texts
          </Link>
          <Link 
            to="/about" 
            className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      {/* Featured sections */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSections.map((section) => (
            <Link 
              key={section.ref}
              to={`/text/${section.ref}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{section.title}</h3>
              <p className="text-gray-600">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Bilingual Text</h3>
            <p className="text-gray-700">
              Read the Talmud in the original Hebrew/Aramaic with English translation.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
            <p className="text-gray-700">
              Get instant summaries, background information, key concepts, and commentary.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Navigation</h3>
            <p className="text-gray-700">
              Easily navigate between tractates and pages, with a user-friendly interface.
            </p>
          </div>
        </div>
      </div>
      
      {/* Getting started */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ol className="list-decimal list-inside space-y-4 text-gray-700">
            <li>
              <span className="font-semibold">Browse the texts</span> - Explore different tractates and pages of the Talmud
            </li>
            <li>
              <span className="font-semibold">Read the text</span> - Choose to view in Hebrew, English, or both
            </li>
            <li>
              <span className="font-semibold">Analyze with AI</span> - Get AI-assisted insights to deepen your understanding
            </li>
            <li>
              <span className="font-semibold">Study in context</span> - Navigate between pages to follow discussions in context
            </li>
          </ol>
          
          <div className="mt-6">
            <Link 
              to="/text/Sanhedrin.90a" 
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Studying Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;