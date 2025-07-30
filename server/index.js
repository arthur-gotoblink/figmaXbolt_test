import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; 

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = 'https://api.staging.blinksystems.com.au/v3';

// Log in with auth0
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

// List all bookings
app.get('/api/bookings', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const blinkRes = await fetch(`${BASE_URL}/job/booking/search?limit=20&offset=0&sort_by=collect_after&order=desc`, {
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

// ✅ Get all booking's details
app.get('/api/bookings/:id/details', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const blinkRes = await fetch(`${BASE_URL}/job/booking/read?id=${id}`, {
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

// ✅ Get booking's comments
app.get('/api/bookings/:id/comments', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.params;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const blinkRes = await fetch(`${BASE_URL}/job/comment/search?booking_id=${id}&sort_by=created_at&order=desc`, {
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

// ✅ Add new comments
app.post('/api/bookings/:id/comments', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { id: booking_id } = req.params;
  const { comment } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  if (!comment) {
    return res.status(400).json({ error: 'Missing comment text' });
  }

  try {
    const blinkRes = await fetch(`${BASE_URL}/job/comment/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        booking_id,
        comment,
        external: false,
      }),
    });

    const data = await blinkRes.json();
    res.status(blinkRes.status).json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Internal proxy error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
app.post('/api/bookings/create', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const body = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const response = await fetch(`${BASE_URL}/job/booking/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    return res.status(response.status).json(responseData);
  } catch (err) {
    console.error('Booking creation failed:', err);
    return res.status(500).json({ error: 'Internal proxy error', message: err.message });
  }
});

// ✅ Get all the team member
app.get('/api/drivers', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const blinkRes = await fetch(`${BASE_URL}/user/team/search?limit=20&offset=0`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await blinkRes.json();
    res.status(blinkRes.status).json(data);
  } catch (error) {
    console.error('[API /api/drivers] Error:', error);
    res.status(500).json({ error: 'Internal proxy error', message: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});