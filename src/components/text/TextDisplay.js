import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getTalmudSection, 
  extractPageRef,
  buildTextReference
} from '../../services/sefariaService';

const TextDisplay = () => {
  const { reference } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevNextRefs, setPrevNextRefs] = useState({ prev: null, next: null });

  // Parse the reference into parts
  const getParsedReference = () => {
    if (!reference) return { tractate: null, page: null, section: null };
    
    const parts = reference.split('.');
    return {
      tractate: parts[0] || null,
      page: parts[1] || null,
      section: parts.length > 2 ? parts[2] : null,
      full: reference
    };
  };

  const parsed = getParsedReference();

  // Calculate previous and next page references
  const calculatePrevNext = (currentPage) => {
    // Simple implementation for basic pagination
    if (!currentPage || !parsed.tractate) return { prev: null, next: null };
    
    // Parse the page (e.g., "2b")
    const match = currentPage.match(/^(\d+)([ab])$/);
    if (!match) return { prev: null, next: null };
    
    const pageNum = parseInt(match[1], 10);
    const pageSide = match[2];
    
    let prevPage = null;
    let nextPage = null;
    
    // Calculate previous page
    if (pageSide === 'b') {
      // If on 'b' side, previous is the 'a' side of same number
      prevPage = `${pageNum}a`;
    } else if (pageNum > 2) {
      // If on 'a' side and not the first page, previous is the 'b' side of previous number
      prevPage = `${pageNum - 1}b`;
    }
    
    // Calculate next page
    if (pageSide === 'a') {
      // If on 'a' side, next is the 'b' side of same number
      nextPage = `${pageNum}b`;
    } else {
      // If on 'b' side, next is the 'a' side of next number
      nextPage = `${pageNum + 1}a`;
    }
    
    return {
      prev: prevPage ? `${parsed.tractate}.${prevPage}` : null,
      next: nextPage ? `${parsed.tractate}.${nextPage}` : null
    };
  };

  // Load text when reference changes
  useEffect(() => {
    if (!reference) return;
    
    const loadText = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Loading text for reference: ${reference}`);
        const data = await getTalmudSection(reference);
        
        if (!data) {
          throw new Error('No data returned from API');
        }
        
        console.log('Text data:', data);
        setText(data);
        
        // Set prev/next based on API response if available, or calculate
        if (data.prev || data.next) {
          setPrevNextRefs({
            prev: data.prev,
            next: data.next
          });
        } else {
          // Calculate based on page number
          setPrevNextRefs(calculatePrevNext(parsed.page));
        }
      } catch (error) {
        console.error('Error loading text:', error);
        setError(`Failed to load the text. Please try again later.`);
        
        // Still calculate prev/next for navigation even on error
        setPrevNextRefs(calculatePrevNext(parsed.page));
      } finally {
        setLoading(false);
      }
    };
    
    loadText();
  }, [reference]);

  // Handle retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getTalmudSection(reference)
      .then(data => {
        setText(data);
        if (data.prev || data.next) {
          setPrevNextRefs({
            prev: data.prev,
            next: data.next
          });
        }
      })
      .catch(err => {
        console.error('Error on retry:', err);
        setError(`Failed to load the text. Please try again later.`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Render Hebrew text with proper styling
  const renderHebrewText = (heText) => {
    if (!heText || (Array.isArray(heText) && heText.length === 0)) {
      return <p className="text-gray-500">Hebrew text not available</p>;
    }
    
    if (Array.isArray(heText)) {
      return heText.map((segment, index) => (
        <div 
          key={index} 
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: segment }}
        />
      ));
    }
    
    return <div dangerouslySetInnerHTML={{ __html: heText }} />;
  };

  // Render English text with proper styling
  const renderEnglishText = (enText) => {
    if (!enText || (Array.isArray(enText) && enText.length === 0)) {
      return <p className="text-gray-500">English text not available</p>;
    }
    
    if (Array.isArray(enText)) {
      return enText.map((segment, index) => (
        <div 
          key={index} 
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: segment }}
        />
      ));
    }
    
    return <div dangerouslySetInnerHTML={{ __html: enText }} />;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <Link 
          to="/browse" 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Previous Page
        </Link>
        
        <h1 className="text-2xl font-bold">
          {parsed.tractate} {parsed.page}
          {parsed.section && <span className="text-gray-500">:{parsed.section}</span>}
        </h1>
        
        <div className="invisible">Spacer</div> {/* For centering the title */}
      </div>
      
      {/* Navigation buttons */}
      <div className="mb-6 flex justify-center gap-4">
        {prevNextRefs.prev && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(`/text/${prevNextRefs.prev}`)}
          >
            Previous
          </button>
        )}
        
        {prevNextRefs.next && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(`/text/${prevNextRefs.next}`)}
          >
            Next
          </button>
        )}
      </div>
      
      {/* Talmud text content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Talmud Text</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded">
            <h3 className="text-red-500 font-bold">Error</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleRetry}
            >
              Try Again
            </button>
          </div>
        ) : text ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hebrew column */}
            <div className="rtl">
              <h3 className="text-lg font-semibold mb-3 text-right">עברית</h3>
              {renderHebrewText(text.he)}
            </div>
            
            {/* English column */}
            <div>
              <h3 className="text-lg font-semibold mb-3">English</h3>
              {renderEnglishText(text.text)}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No text available for this reference</p>
          </div>
        )}
      </div>
      
      {/* Debug information for development */}
      {process.env.NODE_ENV === 'development' && !loading && text && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <details>
            <summary className="cursor-pointer text-blue-500">Debug Information</summary>
            <div className="mt-2">
              <p><strong>Reference:</strong> {text.ref || reference}</p>
              <p><strong>API Prev:</strong> {text.prev || 'Not provided'}</p>
              <p><strong>API Next:</strong> {text.next || 'Not provided'}</p>
              <p><strong>Calculated Prev:</strong> {calculatePrevNext(parsed.page).prev}</p>
              <p><strong>Calculated Next:</strong> {calculatePrevNext(parsed.page).next}</p>
              <p><strong>Has He Text:</strong> {text.he ? 'Yes' : 'No'}</p>
              <p><strong>Has English Text:</strong> {text.text ? 'Yes' : 'No'}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default TextDisplay;
