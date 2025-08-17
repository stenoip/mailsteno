export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  // Simulate user storage (in-memory or file-based)
  res.status(200).json({ message: 'User registered successfully!' });
}
