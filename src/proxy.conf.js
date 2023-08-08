module.exports = {
    "/*": {
        target: "http://localhost:8080",
        bypass: (req, res,proxyRes) => {
            res.headers["Cross-Origin-Opener-Policy"] = "same-origin";
            res.headers["Cross-Origin-Embedder-Policy"] = "require-corp";
        }
        
    }
}