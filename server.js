const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load codes from CSV
function loadCodes() {
  const csvPath = path.join(__dirname, 'data', 'codes.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  const codes = {};
  
  for (const line of lines) {
    const [url, email] = line.split(',');
    if (email && email !== 'UNASSIGNED') {
      codes[email.toLowerCase().trim()] = url.trim();
    }
  }
  return codes;
}

let codes = loadCodes();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.get('/api/lookup', (req, res) => {
  const email = (req.query.email || '').toLowerCase().trim();
  
  if (!email) {
    return res.json({ success: false, error: 'No email provided' });
  }
  
  const url = codes[email];
  
  if (url) {
    return res.json({ success: true, url });
  } else {
    return res.json({ success: false, error: 'Email not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Loaded ${Object.keys(codes).length} codes`);
});
