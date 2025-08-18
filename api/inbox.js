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

  if (req.method === 'GET') {
    // Replace with logged-in user's username/email in production
    const recipient = 'no-reply@mailsteno.com';

    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('recipient', recipient)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching inbox' });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
