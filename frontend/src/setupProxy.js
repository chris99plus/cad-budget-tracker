const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api/v1/transactions',
        createProxyMiddleware({
            target: 'http://localhost:4003',
            changeOrigin: true,
        })
    );
    app.use(
        '/api/v1/tenants',
        createProxyMiddleware({
            target: 'http://localhost:4002',
            changeOrigin: true,
        })
    );
    app.use(
        '/api/v1/auth',
        createProxyMiddleware({
            target: 'http://localhost:4001',
            changeOrigin: true,
        })
    );
};
