import express from 'express';
import { searchEverything } from '../controllers/newsController';

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



// import express from 'express';
// import { getNewsWithAuthors } from '../controllers/newsController';

// const newsRouter = express.Router();

// newsRouter.get('/', async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const data = await getNewsWithAuthors(page, 10);
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching news:', error);
//     res.status(500).json({ error: 'Error al obtener las noticias' });
//   }
// });

// export default newsRouter;




// import express from 'express';
// import { getStoredNews } from '../controllers/newsController';
// import { refreshNewsData } from '../controllers/newsService';

// const newsRouter = express.Router();

// newsRouter.get('/', async (req, res) => {
//   try {
//     const page = Number(req.query.page) || 1;
//     const data = await getStoredNews(page, 10);
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching news:', error);
//     res.status(500).json({ error: 'Error al obtener las noticias' });
//   }
// });

// newsRouter.post('/refresh', async (req, res) => {
//   try {
//     await refreshNewsData();
//     res.status(200).json({ message: 'News data refreshed successfully' });
//   } catch (error) {
//     console.error('Error refreshing news:', error);
//     res.status(500).json({ error: 'Failed to refresh news' });
//   }
// });


// newsRouter.post('/refresh', async (req, res) => {
//   try {
//     await refreshNewsData();
//     res.status(200).json({ message: 'News data refreshed successfully' });
//   } catch (error) {
//     console.error('Error refreshing news:', error);
//     res.status(500).json({ error: 'Failed to refresh news' });
//   }
// });


// export default newsRouter;
