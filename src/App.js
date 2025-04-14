import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">ChavrutAI</h1>
        <p className="text-sm">Interactive Talmud Study with AI-Assisted Tools</p>
      </header>
      
      <main className="container mx-auto p-4 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to ChavrutAI</h2>
          <p>
            ChavrutAI brings the traditional Jewish learning partnership 
            ("chavruta") into the digital age by combining ancient texts 
            with modern AI technology.
          </p>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <p className="text-center">© 2025 ChavrutAI</p>
      </footer>
    </div>
  );
}

export default App;