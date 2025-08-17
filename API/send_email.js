export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { recipient, subject, body, password } = req.body;

  // Simulate sending email
  res.status(200).json({ message: 'Email sent successfully!' });
}
