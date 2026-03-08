const express = require("express");
const app = express();
const http = require("http");
const cors = require('cors');
const connectDB = require('./src/config/database.js');
const routes = require('./src/routes/index.js');
const port = 2000
const server = http.createServer(app);

// CORS configuration - allow all origins during development / demo
app.use(cors());

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get("/", (req, res) => {
    res.send("Hello World! Project is running");
});

connectDB();
routes(app);


server.listen(port, async () => {
    console.log(`Access your API at: https://localhost:${port}`)
});