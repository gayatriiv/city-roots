export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL
  });
}

