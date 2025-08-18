// pages/api/login.js
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

  // --- POST: Login user ---
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // TODO: check user credentials in your database
    console.log(`Logging in user: ${username}`);

    // For now, we'll just fake success
    return res.status(200).json({ message: 'Login successful' });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
