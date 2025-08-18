import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ANON_KEY
);

export default async function handler(req, res) {
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

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Check if user exists and password matches
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error during login' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful!' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
