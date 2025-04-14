import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import BrowsePage from './components/pages/BrowsePage';
import TalmudPage from './components/pages/TalmudPage';
import AboutPage from './components/pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        
        <Route path="/browse" element={
          <Layout>
            <BrowsePage />
          </Layout>
        } />
        
        <Route path="/text/:ref" element={
          <Layout>
            <TalmudPage />
          </Layout>
        } />
        
        <Route path="/about" element={
          <Layout>
            <AboutPage />
          </Layout>
        } />
        
        {/* Default route redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;