const sessions = {};

app.get('/license', (req, res) => {
  const id = req.query.id;
  const ip = req.socket.remoteAddress;

  if (!id) return res.json({ valid: false, error: 'missing id' });

  // Se já existe sessão ativa para esse ID e não é o mesmo IP
  if (sessions[id] && sessions[id] !== ip) {
    return res.json({ valid: false, error: 'already in use' });
  }

  // Registrar sessão
  sessions[id] = ip;

  res.json({ valid: true, ip, message: 'license active' });
});
