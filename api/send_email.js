import fs from 'fs';
import path from 'path';

const emailsFile = path.resolve('./api/emails.json');

function readEmails() {
  if (!fs.existsSync(emailsFile)) return [];
  return JSON.parse(fs.readFileSync(emailsFile, 'utf-8'));
}

function writeEmails(emails) {
  fs.writeFileSync(emailsFile, JSON.stringify(emails, null, 2));
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
    const { recipient, subject, body, sender } = req.body;
    if (!recipient || !subject || !body || !sender) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    let emails = readEmails();
    const timestamp = new Date().toISOString();
    emails.push({ sender, recipient, subject, body, timestamp });
    writeEmails(emails);
    return res.status(201).json({ message: 'Email sent successfully!' });
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
