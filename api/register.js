import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ANON_KEY
);

export default async function handler(req, res) {
  // --- CORS ---
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
    let username, password;
    try {
      // For some frameworks, req.body might be undefined if bodyParser is disabled
      if (!req.body || typeof req.body === 'string') {
        const body = req.body ? JSON.parse(req.body) : {};
        username = body.username;
        password = body.password;
      } else {
        username = req.body.username;
        password = req.body.password;
      }
    } catch (e) {
      console.error('Error parsing JSON body:', e);
      return res.status(400).json({ message: 'Invalid JSON' });
    }

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase user check error:', checkError);
      return res.status(500).json({ message: 'Server error checking user' });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert new user
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ username, password }])
      .select(); // Return the inserted row for debugging

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return res.status(500).json({ message: 'Error creating user' });
    }

    return res.status(201).json({ message: 'User registered successfully!' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
