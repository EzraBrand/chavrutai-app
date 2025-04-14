import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} ChavrutAI. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Talmud texts provided by Sefaria.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/yourusername/chavrutai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              GitHub
            </a>
            <a 
              href="/terms"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Terms
            </a>
            <a 
              href="/privacy"
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;