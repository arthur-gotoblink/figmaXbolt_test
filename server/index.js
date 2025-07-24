import express from 'express';
import cors from 'cors';

// import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const auth0Res = await fetch('https://relief.au.auth0.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'password',
        username: email,
        password: password,
        audience: 'https://relief.au.auth0.com/api/v2/',
        scope: 'openid profile email',
        client_id: '3mXWy3DqYV5cnYpn0E1ToyyBBp8muiWD',
      }),
    });

    const data = await auth0Res.json();
    if (!auth0Res.ok) return res.status(401).json(data);

    res.json({ access_token: data.access_token });
  } catch (err) {
    res.status(500).json({ error: 'Erreur interne', message: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('[Server] Received request to /api/bookings with token:', token);


  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const blinkRes = await fetch('https://api.staging.blinksystems.com.au/v3/job/booking/search?limit=20&offset=0&sort_by=collect_after&order=desc', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await blinkRes.json();
    res.status(blinkRes.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal proxy error', message: error.message });
  }
});



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
