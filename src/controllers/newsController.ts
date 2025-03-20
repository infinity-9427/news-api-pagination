import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

export const getNewsWithAuthors = async (page: number = 1, limit: number = 10) => {
  const newsResponse = await axios.get(NEWS_API_URL);
  const articles = newsResponse.data.articles;
  
  const paginatedArticles = articles.slice((page - 1) * limit, page * limit);
  
  const randomUserResponse = await axios.get(`https://randomuser.me/api/?results=${paginatedArticles.length}`);
  const randomUsers = randomUserResponse.data.results;

  const articlesWithAuthor = await Promise.all(
    paginatedArticles.map(async (article: any, index: number) => {
      const randomUser = randomUsers[index];

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

      return {
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        author: dbAuthor,
      };
    })
  );

  return {
    page,
    perPage: limit,
    articles: articlesWithAuthor,
  };
};
