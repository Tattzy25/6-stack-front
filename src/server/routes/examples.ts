import express from 'express';
import {
  getRandomExamples,
  getFeaturedExamples,
  getExamples,
  incrementExampleView
} from '../handlers/examples.js';

const router = express.Router();

// Example routes
router.get('/api/examples/random', getRandomExamples);
router.get('/api/examples/featured', getFeaturedExamples);
router.get('/api/examples', getExamples);
router.post('/api/examples/:id/view', incrementExampleView);

export default router;
