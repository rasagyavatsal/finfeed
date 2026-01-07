import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchNews } from '../services/newsService';
import { analyzeSentimentBatch, generateShortHeadlineBatch } from '../services/sentimentService';
import { saveArticlesToFirestore } from '../services/firestoreService';
import SearchBar from '../components/SearchBar';
import NewsCard from '../components/NewsCard';
import LoadingModal from '../components/LoadingModal';
import { Save, Loader2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import type { NewsArticle } from '../types';

export default function Home() {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentCompany, setCurrentCompany] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (companyName: string) => {
    try {
      setLoading(true);
      setArticles([]);
      setCurrentCompany(companyName);
      setPage(1);
      setHasMore(true);

      const newsArticles = await fetchNews(companyName, 10, 1);
      
      if (newsArticles.length === 0) {
        toast.error('No articles found for this company');
        setHasMore(false);
        return;
      }

      // Analyze sentiment and generate short headlines concurrently
      const payload = newsArticles.map(a => ({ title: a.title, description: a.description }));
      const [sentiments, shortTitles] = await Promise.all([
        analyzeSentimentBatch(payload),
        generateShortHeadlineBatch(payload)
      ]);

      const enrichedArticles = newsArticles.map((article, index) => ({
        ...article,
        sentiment: sentiments[index],
        shortTitle: shortTitles[index] || undefined
      }));

      setArticles(enrichedArticles);
      toast.success(`Found ${newsArticles.length} articles`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch news');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreArticles = useCallback(async () => {
    if (!currentCompany || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const newsArticles = await fetchNews(currentCompany, 10, nextPage);

      if (newsArticles.length === 0) {
        setHasMore(false);
        return;
      }

      // Analyze sentiment and generate short headlines
      const payload = newsArticles.map(a => ({ title: a.title, description: a.description }));
      const [sentiments, shortTitles] = await Promise.all([
        analyzeSentimentBatch(payload),
        generateShortHeadlineBatch(payload)
      ]);

      const enrichedArticles = newsArticles.map((article, index) => ({
        ...article,
        sentiment: sentiments[index],
        shortTitle: shortTitles[index] || undefined
      }));

      setArticles(prev => [...prev, ...enrichedArticles]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more articles:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [currentCompany, page, hasMore, loadingMore]);

  // Infinite scroll setup
  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMoreArticles]);

  const handleSaveArticles = async () => {
    if (!currentUser || articles.length === 0) {
      toast.error('No articles to save');
      return;
    }

    try {
      setSaving(true);
      await saveArticlesToFirestore(currentUser.uid, currentCompany, articles);
      toast.success('Articles saved successfully!');
    } catch (error) {
      toast.error('Failed to save articles');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-true-black">
      {loading && <LoadingModal message="Fetching news articles..." />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4 leading-tight">
            AI-Powered Stock News Aggregator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover market-moving news with AI-powered sentiment analysis
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 animate-in">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Save Button */}
        {articles.length > 0 && (
          <div className="mb-8 flex justify-center animate-in">
            <button
              onClick={handleSaveArticles}
              disabled={saving}
              className="group flex items-center space-x-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Save All Articles</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
                    {articles.length}
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results Header */}
        {articles.length > 0 && currentCompany && (
          <div className="mb-6 animate-in">
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-near-black/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentCompany}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {articles.length} articles found
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 animate-in">
              {articles.map((article, index) => (
                <NewsCard
                  key={`${article.url}-${index}`}
                  article={article}
                  onClick={() => handleCardClick(article.url)}
                />
              ))}
            </div>

            {/* Auto Load Sentinel / End Message */}
            <div className="flex justify-center py-8">
              {hasMore && !loadingMore && (
                <button
                  type="button"
                  onClick={loadMoreArticles}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Load More Articles
                </button>
              )}
              {loadingMore && (
                <div className="flex items-center space-x-3 px-6 py-3 bg-white/50 dark:bg-near-black/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Loading more articles...</span>
                </div>
              )}
              {!hasMore && !loadingMore && (
                <p className="text-gray-500 dark:text-gray-500 font-medium">
                  You've reached the end
                </p>
              )}
              <div ref={loadMoreRef} className="h-1" />
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-24 animate-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <TrendingUp className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Start Your Research
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Search for any company to discover the latest news and insights
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Apple', 'Tesla', 'Microsoft', 'Amazon'].map((company) => (
                <button
                  key={company}
                  onClick={() => handleSearch(company)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
                >
                  {company}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
