const PROXY_CONFIG = [
  {
    context: [
      "/api"
    ],
    target: "https://07be-189-178-119-50.ngrok-free.app",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    onProxyReq: function (proxyReq, req, res) {
      proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
    }
  }
];

module.exports = PROXY_CONFIG;
