// api/send.js
import sgMail from '@sendgrid/mail';

const ALLOWED_ORIGIN = 'https://stenoip.github.io'; // GitHub Pages origin

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { to, subject, text, replyTo } = req.body || {};
    if (!to || !subject || !text) return res.status(400).json({ error: 'Missing required fields' });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: { email: 'no-reply@yourdomain.com', name: 'MailSteno' }, // change to your verified domain
      subject,
      text,
      ...(replyTo ? { replyTo } : {})
    };

    const [response] = await sgMail.send(msg);
    return res.status(200).json({ ok: true, messageId: response.headers['x-message-id'] || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
}
