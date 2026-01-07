import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config/api';
import type { SentimentType } from '../types';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function analyzeSentiment(
  title: string,
  description: string
): Promise<SentimentType> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `Analyze the sentiment of this news article for stock trading. 
    
Title: ${title}
Description: ${description}

Respond with ONLY ONE WORD: bullish, bearish, or neutral.

- bullish: positive news that could increase stock value
- bearish: negative news that could decrease stock value  
- neutral: news with no clear impact on stock value

Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().toLowerCase().trim();

    // Extract the sentiment from the response
    if (text.includes('bullish')) return 'bullish';
    if (text.includes('bearish')) return 'bearish';
    return 'neutral';
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    // Return neutral as fallback
    return 'neutral';
  }
}

// Batch sentiment analysis for multiple articles
export async function analyzeSentimentBatch(
  articles: Array<{ title: string; description: string }>
): Promise<SentimentType[]> {
  const sentimentPromises = articles.map(article =>
    analyzeSentiment(article.title, article.description)
  );

  try {
    return await Promise.all(sentimentPromises);
  } catch (error) {
    console.error('Batch sentiment analysis error:', error);
    // Return neutral for all as fallback
    return articles.map(() => 'neutral');
  }
}

// Generate concise short headlines using Gemini
export async function generateShortHeadline(
  title: string,
  description: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `Rewrite a concise, factual headline for the following article.

Constraints:
- Max 8 words
- Prefer <= 60 characters
- No quotes, emojis, or punctuation at start/end
- Avoid clickbait; keep key company/ticker if helpful

Original Title: ${title}
Description: ${description}

Output ONLY the rewritten headline:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    // Clean surrounding punctuation/quotes and keep first line only
    text = text.split('\n')[0].replace(/^["'\-–—\s]+|["'\-–—\s]+$/g, '');

    return text;
  } catch (error) {
    console.error('Headline generation error:', error);
    return '';
  }
}

// Batch generation of short headlines
export async function generateShortHeadlineBatch(
  articles: Array<{ title: string; description: string }>
): Promise<string[]> {
  const promises = articles.map(a => generateShortHeadline(a.title, a.description));
  try {
    return await Promise.all(promises);
  } catch (error) {
    console.error('Batch headline generation error:', error);
    return articles.map(() => '');
  }
}
