require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const logger = require("morgan");
const bodyParser = require("body-parser");
// const express = require('express');
const cors = require('cors'); // Import CORS middleware
// const app = express();
const PORT = 5000;

// Apply CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

app.use(express.json()); // Parse JSON bodies

// Example login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);

  // Send response back to frontend
  res.json({ message: 'Login successful' });
});

const server = require("http").createServer(app);

require("./config/database.js");

app.use(logger("dev"));

app.use(bodyParser.json());

app.disable("etag");

app.use("/api/v1/", indexRouter);

const port = 8000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
