const express = require('express');
const fs = require('fs');
const app = express();
const storageFile = './licenses.json';

function loadData() {
  if (fs.existsSync(storageFile)) {
    return JSON.parse(fs.readFileSync(storageFile));
  }
  return {};
}

function saveData(data) {
  fs.writeFileSync(storageFile, JSON.stringify(data));
}

app.get('/license', (req, res) => {
  const id = req.query.id;
  if (!id) return res.json({ valid: false, error: 'missing id' });

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  let data = loadData();

  if (!data[id]) data[id] = [];

  if (data[id].includes(ip)) {
    return res.json({ valid: true, ip, count: data[id].length });
  }

  if (data[id].length >= 3) {
    return res.json({ valid: false, error: 'limit reached', ips: data[id] });
  }

  data[id].push(ip);
  saveData(data);
  res.json({ valid: true, ip, count: data[id].length });
});

app.listen(3000, () => console.log('License server running on port 3000'));

