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
    const { recipient, subject, body, sender } = req.body;

    if (!recipient || !subject || !body || !sender) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const timestamp = new Date().toISOString();

    const { error } = await supabase
      .from('emails')
      .insert([{ sender, recipient, subject, body, timestamp }]);

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error sending email' });
    }

    return res.status(201).json({ message: 'Email sent successfully!' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
