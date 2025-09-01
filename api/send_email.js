import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
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
    const { sender, recipient, subject, body } = req.body;
    if (!sender || !recipient || !subject || !body) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    try {
      await pool.query(
        'INSERT INTO emails (sender, recipient, subject, body) VALUES ($1, $2, $3, $4)',
        [sender, recipient, subject, body]
      );
      return res.status(201).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error sending email' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
