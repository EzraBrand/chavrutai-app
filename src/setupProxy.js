const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Helper to get the current GitHub Codespace URL
  const getCodespaceUrl = () => {
    if (process.env.GITHUB_CODESPACES && process.env.CODESPACE_NAME) {
      return `https://${process.env.CODESPACE_NAME}-3000.app.github.dev`;
    }
    return 'http://localhost:3000';
  };

  const proxyConfig = {
    target: 'https://talmud-viewer.vercel.app',
    changeOrigin: true,
    ws: true,
    onProxyReq: (proxyReq, req) => {
      // Add headers that Vercel expects
      proxyReq.setHeader('Origin', 'https://talmud-viewer.vercel.app');
      if (req.method === 'OPTIONS') {
        proxyReq.setHeader('Access-Control-Request-Method', 'POST');
        proxyReq.setHeader('Access-Control-Request-Headers', 'content-type');
      }
    },
    onProxyRes: (proxyRes) => {
      // Ensure CORS headers are set
      proxyRes.headers['Access-Control-Allow-Origin'] = getCodespaceUrl();
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
  };

  // Proxy API requests
  app.use(
    ['/api', '/text'],
    createProxyMiddleware(proxyConfig)
  );
};