import fs from 'fs';
import path from 'path';

const emailsFile = path.resolve('./api/emails.json');

function readEmails() {
  if (!fs.existsSync(emailsFile)) return [];
  return JSON.parse(fs.readFileSync(emailsFile, 'utf-8'));
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const recipient = req.query.recipient;
    if (!recipient) {
      return res.status(400).json({ message: 'Recipient required' });
    }
    let emails = readEmails();
    const userEmails = emails.filter(email => email.recipient === recipient)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return res.status(200).json(userEmails);
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
