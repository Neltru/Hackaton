const PROXY_CONFIG = [
  {
    context: [
      "/api"
    ],
    target: "https://49ac-189-177-229-123.ngrok-free.app",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: function(proxyReq, req, res) {
      proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
    }
  }
];

module.exports = PROXY_CONFIG;
