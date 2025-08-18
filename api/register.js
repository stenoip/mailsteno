// pages/api/register.js
export default function handler(req, res) {
  // --- CORS headers ---
  const allowedOrigins = [
    'https://mailsteno.vercel.app',
    'https://mailsteno-git-main-stenoip-companys-projects.vercel.app',
    'https://mailsteno-kh7g3au58-stenoip-companys-projects.vercel.app',
    'https://stenoip.github.io'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- Handle preflight ---
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- POST: Register user ---
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // TODO: store user in a real database
    console.log(`Registering user: ${username}`);

    return res.status(201).json({ message: 'Registered successfully' });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
