export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;

  // Simulate inbox retrieval
  const emails = [
    {
      sender: 'admin@mailsteno.com',
      subject: 'Welcome!',
      body: 'Thanks for signing up.',
      timestamp: Date.now()
    }
  ];

  res.status(200).json(emails);
}
