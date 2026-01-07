import axios from 'axios';
import { NEWS_API_KEY, NEWS_API_BASE_URL } from '../config/api';
import type { NewsArticle } from '../types';

interface ERSource {
  uri: string;
  dataType: string;
  title: string;
}

interface ERArticle {
  title: string;
  body?: string;
  url: string;
  image?: string;
  source: ERSource;
  dateTimePub?: string;
}

interface EventRegistryResponse {
  articles?: {
    results: ERArticle[];
    totalResults: number;
    page: number;
    count: number;
    pages: number;
  };
}

export async function fetchNews(
  companyName: string,
  pageSize: number = 10,
  page: number = 1
): Promise<NewsArticle[]> {
  try {
    const response = await axios.post<EventRegistryResponse>(
      `${NEWS_API_BASE_URL}/article/getArticles`,
      {
        apiKey: NEWS_API_KEY,
        keyword: companyName,
        keywordLoc: 'title',
        categoryUri: 'news/Business',
        resultType: 'articles',
        lang: 'eng',
        articlesSortBy: 'date',
        articlesPage: page,
        articlesCount: pageSize
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const results = response.data?.articles?.results ?? [];
    return results.map((article) => ({
      title: article.title,
      description: article.body || '',
      url: article.url,
      urlToImage: article.image || '',
      source: {
        id: article.source?.uri || null,
        name: article.source?.title || ''
      },
      publishedAt: article.dateTimePub || ''
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch news articles');
    }
    throw error;
  }
}

