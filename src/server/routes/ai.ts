import express from 'express';
const router = express.Router();

// TODO: AI streaming routes
router.post('/api/ai/stream', async (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.post('/api/groq/chat', async (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

export default router;
