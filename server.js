// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(__dirname)); // serve index.html, json, etc.
app.use(express.json());

// serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// save exam results
app.post('/save-result', (req, res) => {
  const { name, score, total } = req.body;
  const filePath = path.join(__dirname, 'results.json');
  let results = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    results = JSON.parse(data);
  }

  results.push({
    name,
    score,
    total,
    date: new Date().toLocaleString()
  });

  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  res.json({ success: true });
});

// return results list
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
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
