import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient({
  log: ['query', 'error', 'info', 'warn'],
});
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

export const refreshNewsData = async () => {
  try {
    console.log('Starting news refresh...');
    const desiredRecords = 500;
    const pageSize = 100; // Maximum allowed pageSize for NewsAPI
    const totalPages = Math.ceil(desiredRecords / pageSize);
    let allArticles: any[] = [];

    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(`${BASE_NEWS_API_URL}&page=${page}&pageSize=${pageSize}`);
      if (response.data.articles && response.data.articles.length > 0) {
        console.log(`Page ${page}: fetched ${response.data.articles.length} articles`);
        allArticles = allArticles.concat(response.data.articles);
      } else {
        console.log(`Page ${page}: no articles found, breaking out of loop`);
        break;
      }
    }
    console.log(`Fetched a total of ${allArticles.length} articles.`);

    allArticles = allArticles.slice(0, desiredRecords);

    if (allArticles.length === 0) {
      console.error('No articles fetched.');
      return;
    }

    const randomUserResponse = await axios.get(`https://randomuser.me/api/?results=${allArticles.length}`);
    if (!randomUserResponse.data.results) {
      console.error('No results received from RandomUser API');
      return;
    }
    const randomUsers = randomUserResponse.data.results;
    console.log(`Fetched ${randomUsers.length} random users.`);

    await prisma.post.deleteMany({});
    console.log('Deleted old posts.');

    for (let i = 0; i < allArticles.length; i++) {
      const article = allArticles[i];
      const randomUser = randomUsers[i];

      const authorData = {
        name: `${randomUser.name.first} ${randomUser.name.last}`,
        email: randomUser.email,
        avatar: randomUser.picture.thumbnail,
      };

      const dbAuthor = await prisma.author.upsert({
        where: { email: authorData.email },
        update: {},
        create: authorData,
      });
      console.log(`Upserted author: ${authorData.email}`);

      await prisma.post.create({
        data: {
          title: article.title,
          description: article.description,
          url: article.url,
          imageUrl: article.urlToImage,
          publishedAt: new Date(article.publishedAt),
          authorId: dbAuthor.id,
        },
      });
      console.log(`Created post: ${article.title}`);
    }

    console.log("News refreshed successfully");
  } catch (error: any) {
    console.error("Error refreshing news:", error.message);
    if (error.response) {
      console.error("Response error data:", error.response.data);
    }
  }
};

cron.schedule('0 0 * * *', () => {
  console.log('Cron job running: refreshing news data...');
  refreshNewsData();
});
