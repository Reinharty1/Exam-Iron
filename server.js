// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// 1️⃣ Serve all static files (HTML, CSS, JS, JSON)
app.use(express.static(path.join(__dirname)));

// 2️⃣ Parse JSON for POST
app.use(express.json());

// 3️⃣ Always send index.html for the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 4️⃣ Save results
app.post("/save-result", (req, res) => {
  const { name, score, total } = req.body;
  const filePath = path.join(__dirname, "results.json");
  let results = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    results = JSON.parse(data);
  }

  results.push({
    name,
    score,
    total,
    date: new Date().toLocaleString(),
  });

  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  res.json({ success: true });
});

// 5️⃣ Get leaderboard data
app.get("/results", (req, res) => {
  const filePath = path.join(__dirname, "results.json");
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    res.send(data);
  } else {
    res.json([]);
  }
});

// 6️⃣ Serve the leaderboard page
app.get("/leaderboard", (req, res) => {
  res.sendFile(path.join(__dirname, "leaderboard.html"));
});

// 7️⃣ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

