const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Serve all static files (HTML, JSON, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Parse JSON bodies for POST requests
app.use(express.json());

// Homepage (exam page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Leaderboard page
app.get("/leaderboard", (req, res) => {
  res.sendFile(path.join(__dirname, "leaderboard.html"));
});

// Save a student's result
app.post("/save-result", (req, res) => {
  const { name, score, total } = req.body;
  const filePath = path.join(__dirname, "results.json");
  let results = [];

  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      results = JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading results file:", err);
  }

  results.push({
    name,
    score,
    total,
    date: new Date().toLocaleString(),
  });

  try {
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error("Error writing results file:", err);
  }

  res.json({ success: true });
});

// Fetch all results (for leaderboard)
app.get("/results", (req, res) => {
  const filePath = path.join(__dirname, "results.json");
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    res.send(data);
  } else {
    res.json([]);
  }
});

// Health check route
app.get("/ping", (req, res) => {
  res.send("Server is alive and serving files correctly!");
});

// Start the server (Render requires 0.0.0.0 + process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
