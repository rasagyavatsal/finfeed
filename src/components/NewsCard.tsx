import { Calendar, ExternalLink, Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
}

export default function NewsCard({ article, onClick }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getSentimentStyles = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish':
        return {
          bg: 'bg-emerald-500 dark:bg-emerald-600',
          text: 'text-white dark:text-white',
          border: 'border-emerald-600',
          icon: TrendingUp
        };
      case 'bearish':
        return {
          bg: 'bg-rose-500 dark:bg-rose-600',
          text: 'text-white dark:text-white',
          border: 'border-rose-600',
          icon: TrendingDown
        };
      case 'neutral':
      default:
        return {
          bg: 'bg-gray-500 dark:bg-gray-600',
          text: 'text-white dark:text-white',
          border: 'border-gray-600',
          icon: Minus
        };
    }
  };

  const getSentimentLabel = (sentiment?: string) => {
    return sentiment ? sentiment.charAt(0).toUpperCase() + sentiment.slice(1) : 'Analyzing...';
  };

  const sentimentStyles = getSentimentStyles(article.sentiment);
  const SentimentIcon = sentimentStyles.icon;

  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-near-black rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-800 card-hover"
    >
      {/* Image */}
      {article.urlToImage ? (
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {article.sentiment && (
            <div className="absolute top-4 right-4">
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border ${sentimentStyles.bg} ${sentimentStyles.text} ${sentimentStyles.border} font-semibold text-sm shadow-lg`}>
                <SentimentIcon className="h-4 w-4" />
                <span>{getSentimentLabel(article.sentiment)}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-52 w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <Building2 className="h-20 w-20 text-gray-300 dark:text-gray-700" />
          {article.sentiment && (
            <div className="absolute top-4 right-4">
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border ${sentimentStyles.bg} ${sentimentStyles.text} ${sentimentStyles.border} font-semibold text-sm shadow-lg`}>
                <SentimentIcon className="h-4 w-4" />
                <span>{getSentimentLabel(article.sentiment)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {article.shortTitle || article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate font-medium">{article.source.name}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {/* Read more indicator */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            Read full article
          </span>
          <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
