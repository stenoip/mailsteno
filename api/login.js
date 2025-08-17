export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  // Simulate login check
  res.status(200).json({ message: 'Login successful!' });
}
