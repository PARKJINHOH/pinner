const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = app => {
    app.use('/api',
        createProxyMiddleware(
            {
                target: 'http://localhost:8080',
                changeOrigin: false,
            }
        )
    ),
    app.use('/login',
        createProxyMiddleware(
            {
                target: 'http://localhost:8080',
                changeOrigin: false,
            }
        )
    ),
    app.use('/oauth2',
        createProxyMiddleware(
            {
                target: 'http://localhost:8080',
                changeOrigin: false,
            }
        )
    )
}