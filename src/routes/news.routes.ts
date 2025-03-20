import express from 'express';
import { getNewsWithAuthors } from '../controllers/newsController';

const newsRouter = express.Router();

newsRouter.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const data = await getNewsWithAuthors(page, 10);
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Error al obtener las noticias' });
  }
});

export default newsRouter;
