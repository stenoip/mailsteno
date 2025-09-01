import fs from 'fs';
import path from 'path';

const usersFile = path.resolve('./api/users.json');

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
}

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
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    let users = readUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    return res.status(200).json({ message: 'Login successful!' });
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
