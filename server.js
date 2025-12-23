const express = require('express');
const app = express();

// Sessões ativas em memória
const activeSessions = {};

app.get('/license', (req, res) => {
  const id = req.query.id;
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

  if (!id) {
    return res.json({ valid: false, error: 'missing id' });
  }

  // Se já existe sessão ativa para esse ID e não é o mesmo IP
  if (activeSessions[id] && activeSessions[id] !== ip) {
    return res.json({ valid: false, error: 'already in use', ip: activeSessions[id] });
  }

  // Registrar ou atualizar sessão
  activeSessions[id] = ip;

  res.json({ valid: true, ip, message: 'license active' });
});

app.listen(3000, () => console.log('License server running on port 3000'));
