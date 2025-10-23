// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // serve all static files
app.use(express.json()); // to handle JSON POST

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Save student results to JSON file
app.post('/save-result', (req, res) => {
  const { name, score, total } = req.body;

  const filePath = path.join(__dirname, 'results.json');
  let results = [];

  // Read existing file if it exists
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    results = JSON.parse(data);
  }

  // Add new result
  results.push({
    name,
    score,
    total,
    date: new Date().toLocaleString()
  });

  // Save back to file
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));

  res.json({ success: true });
});

// Get leaderboard
app.get('/results', (req, res) => {
  const filePath = path.join(__dirname, 'results.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    res.send(data);
  } else {
    res.json([]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
