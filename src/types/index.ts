export interface NewsArticle {
  title: string;
  shortTitle?: string;
  description: string;
  url: string;
  urlToImage: string;
  source: {
    id: string | null;
    name: string;
  };
  publishedAt: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

export interface SavedCompany {
  id: string;
  companyName: string;
  articles: NewsArticle[];
  lastUpdated: string;
  articleCount: number;
}

export interface User {
  uid: string;
  email: string | null;
}

export type SentimentType = 'bullish' | 'bearish' | 'neutral';
