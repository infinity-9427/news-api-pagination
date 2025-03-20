import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchEverything = async (
  query: string = 'bitcoin',
  page: number = 1,
  limit: number = 10,
  apiKeyOverride?: string
) => {
  const NEWS_API_KEY = apiKeyOverride || process.env.NEWS_API_KEY;
  if (!NEWS_API_KEY) {
    throw new Error('No API key provided');
  }

  const newsResponse = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      q: query,
      apiKey: NEWS_API_KEY,
      page,
      pageSize: limit,
    },
  });

  const { articles, totalResults } = newsResponse.data;
  const maxPages = Math.ceil(totalResults / limit);

  if (!articles || articles.length === 0) {
    return { query, page, perPage: limit, totalResults, maxPages, articles: [] };
  }

  const randomUserResponse = await axios.get('https://randomuser.me/api/', {
    params: { results: articles.length },
  });
  const randomUsers = randomUserResponse.data.results;

  const articlesWithAuthor = await Promise.all(
    articles.map(async (article: any, index: number) => {
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

  return { query, page, perPage: limit, totalResults, maxPages, articles: articlesWithAuthor };
};
