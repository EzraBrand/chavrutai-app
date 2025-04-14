import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">ChavrutAI</Link>
          <span className="ml-2 text-xs bg-indigo-500 px-2 py-1 rounded">Beta</span>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-indigo-200 transition-colors">Home</Link></li>
            <li><Link to="/browse" className="hover:text-indigo-200 transition-colors">Browse Texts</Link></li>
            <li><Link to="/about" className="hover:text-indigo-200 transition-colors">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;