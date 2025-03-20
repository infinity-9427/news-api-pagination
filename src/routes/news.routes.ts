import express from 'express';
import { searchEverything } from '../controllers/newsController.js';

const newsRouter = express.Router();

newsRouter.get('/search', async (req, res) => {
  try {
    const query = (req.query.query as string) || 'bitcoin';
    const page = Number(req.query.page) || 1;
    const apiKey = req.query.apiKey as string | undefined; // optional API key override
    const data = await searchEverything(query, page, 10, apiKey);
    res.json(data);
  } catch (error) {
    console.error('Error searching news:', error);
    res.status(500).json({ error: 'Error searching news' });
  }
});

export default newsRouter;

