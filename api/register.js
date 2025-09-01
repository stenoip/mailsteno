import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  // --- CORS ---
  const allowedOrigins = [
    'https://mailsteno.vercel.app',
    'https://stenoip.github.io'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    try {
      // Check if user exists
      const check = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
      if (check.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // Insert user
      await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
      return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error during registration' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
