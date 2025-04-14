import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About ChavrutAI</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-lg text-gray-700 mb-4">
            ChavrutAI brings the traditional Jewish learning partnership ("chavruta") into the digital age by combining ancient texts with modern AI technology.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Our mission is to make Talmud study more accessible, engaging, and insightful by providing AI-assisted tools that complement traditional learning methods.
          </p>
          <p className="text-lg text-gray-700">
            We believe that technology can enhance the study of ancient texts, making them more approachable while preserving their depth and complexity.
          </p>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">What is a Chavruta?</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-lg text-gray-700 mb-4">
            In traditional Jewish learning, a "chavruta" (חַבְרוּתָא) is a study partnership where two people analyze, discuss, and debate a shared text together.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            This method encourages active engagement, critical thinking, and various perspectives on the text. Each partner challenges the other's understanding and helps identify nuances that might be missed when studying alone.
          </p>
          <p className="text-lg text-gray-700">
            ChavrutAI aims to provide some of the benefits of this partnership through AI-assisted analysis, helping you engage more deeply with the text.
          </p>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">How ChavrutAI Works</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ol className="list-decimal list-inside space-y-3 text-lg text-gray-700">
            <li>We source original Talmud texts and translations from Sefaria, a digital library of Jewish texts.</li>
            <li>Our AI tools analyze these texts to generate summaries, background information, key concepts, and commentary.</li>
            <li>You can interact with both the original text and the AI analysis side by side, similar to studying with a chavruta partner.</li>
            <li>As you navigate through different sections, both the text and analysis update to provide a seamless learning experience.</li>
          </ol>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Technology</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-lg text-gray-700 mb-4">
            ChavrutAI is built using modern web technologies:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-4">
            <li>React.js for the frontend interface</li>
            <li>Tailwind CSS for styling</li>
            <li>Integration with Sefaria's API for text content</li>
            <li>AI-powered analysis using advanced language models</li>
          </ul>
          <p className="text-lg text-gray-700">
            All code is open-source and available for community contributions.
          </p>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/browse" 
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto text-center"
          >
            Browse Texts
          </Link>
          <Link 
            to="/text/Sanhedrin.90a" 
            className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors w-full sm:w-auto text-center"
          >
            Try an Example
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;