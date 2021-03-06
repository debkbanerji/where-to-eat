// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');

// Get our API routes
const api = require(path.join(__dirname, 'api', 'api.js'));

const app = express();

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);
console.log("Node server running on port " + port);

// Add headers
// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Pass to next layer of middleware
//     next();
// });

const frontendFolder = path.join(__dirname, 'static', 'where-to-eat', 'dist', 'where-to-eat');
// Point static path to frontend folder
app.use(express.static(frontendFolder));
console.log("Serving static from " + frontendFolder);

console.log("Using error logging");

// Set our api routes
app.use('/api', api);

console.log("Setting api routes");

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendFolder, 'index.html'));
});

console.log("Catching all other routes and returning the index file");

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

console.log("Created Server");
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Server running on port: ${port}`));
