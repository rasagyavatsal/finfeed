import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getSavedCompanies,
  deleteSavedCompany,
  deleteAllSavedCompanies,
  saveArticlesToFirestore
} from '../services/firestoreService';
import { fetchNews } from '../services/newsService';
import { analyzeSentimentBatch, generateShortHeadlineBatch } from '../services/sentimentService';
import NewsCard from '../components/NewsCard';
import LoadingModal from '../components/LoadingModal';
import { Trash2, RefreshCw, Calendar, Loader2, BookmarkCheck, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SavedCompany, NewsArticle } from '../types';

export default function SavedArticles() {
  const { currentUser } = useAuth();
  const [savedCompanies, setSavedCompanies] = useState<SavedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadSavedCompanies();
  }, []);

  async function loadSavedCompanies() {
    if (!currentUser) return;

    try {
      setLoading(true);
      const companies = await getSavedCompanies(currentUser.uid);
      setSavedCompanies(companies.sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      ));
    } catch (error) {
      toast.error('Failed to load saved articles');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (expandedCompany) {
      setVisibleCount(9);
    }
  }, [expandedCompany]);

  const loadMoreArticles = useCallback(() => {
    if (!expandedCompany) return;
    const company = savedCompanies.find(c => c.id === expandedCompany);
    if (!company) return;
    if (loadingMore) return;
    if (visibleCount >= company.articles.length) return;
    setLoadingMore(true);
    const next = Math.min(visibleCount + 9, company.articles.length);
    // small timeout to provide smooth UX feedback
    setTimeout(() => {
      setVisibleCount(next);
      setLoadingMore(false);
    }, 100);
  }, [expandedCompany, savedCompanies, visibleCount, loadingMore]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!expandedCompany) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreArticles();
      }
    }, { threshold: 0.1 });

    observerRef.current.observe(loadMoreRef.current);
    return () => {
      observerRef.current?.disconnect();
    };
  }, [expandedCompany, loadMoreArticles]);

  async function handleRefresh(companyId: string, companyName: string) {
    if (!currentUser) return;

    try {
      setRefreshingId(companyId);
      const newsArticles = await fetchNews(companyName, 10, 1);

      if (newsArticles.length === 0) {
        toast.error('No new articles found');
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

      await saveArticlesToFirestore(currentUser.uid, companyName, enrichedArticles);
      await loadSavedCompanies();
      toast.success(`Updated ${companyName} articles`);
    } catch (error) {
      toast.error('Failed to refresh articles');
      console.error('Refresh error:', error);
    } finally {
      setRefreshingId(null);
    }
  }

  async function handleDelete(companyId: string, companyName: string) {
    if (!currentUser) return;

    if (!window.confirm(`Delete all saved articles for ${companyName}?`)) {
      return;
    }

    try {
      await deleteSavedCompany(currentUser.uid, companyId);
      setSavedCompanies(prev => prev.filter(c => c.id !== companyId));
      toast.success('Articles deleted');
    } catch (error) {
      toast.error('Failed to delete articles');
      console.error('Delete error:', error);
    }
  }

  async function handleClearAll() {
    if (!currentUser || savedCompanies.length === 0) return;

    if (!window.confirm('Delete ALL saved companies and articles? This cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteAllSavedCompanies(currentUser.uid);
      setSavedCompanies([]);
      toast.success('All saved articles deleted');
    } catch (error) {
      toast.error('Failed to delete all articles');
      console.error('Clear all error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return <LoadingModal message="Loading saved articles..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-true-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 animate-in">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-xl">
                <BookmarkCheck className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                Saved Articles
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 ml-14">
              {savedCompanies.length} {savedCompanies.length === 1 ? 'company' : 'companies'} in your watchlist
            </p>
          </div>
          {savedCompanies.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Trash2 className="h-5 w-5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Saved Companies */}
        {savedCompanies.length === 0 ? (
          <div className="text-center py-24 animate-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <BookmarkCheck className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Saved Articles Yet
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Search for companies and save articles to build your watchlist
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in">
            {savedCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white dark:bg-near-black rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-all hover:shadow-xl"
              >
                {/* Company Header */}
                <div className="p-6 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {company.companyName}
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(company.lastUpdated)}</span>
                        </div>
                        <div className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow-md">
                          {company.articleCount} articles
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRefresh(company.id, company.companyName)}
                        disabled={refreshingId === company.id}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
                      >
                        {refreshingId === company.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Refresh</span>
                      </button>
                      <button
                        onClick={() => handleDelete(company.id, company.companyName)}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-medium shadow-md hover:shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Toggle Articles */}
                <button
                  onClick={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
                  className="w-full flex items-center justify-center space-x-2 py-4 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-semibold border-t border-gray-200 dark:border-gray-800"
                >
                  <span>{expandedCompany === company.id ? 'Hide Articles' : 'Show Articles'}</span>
                  {expandedCompany === company.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {/* Articles Grid */}
                {expandedCompany === company.id && (
                  <div className="p-6 bg-gray-50 dark:bg-true-black/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {company.articles
                        .slice(0, visibleCount)
                        .map((article: NewsArticle, index: number) => (
                          <NewsCard
                            key={`${article.url}-${index}`}
                            article={article}
                            onClick={() => handleCardClick(article.url)}
                          />
                        ))}
                    </div>
                    <div className="flex justify-center py-6">
                      {visibleCount < company.articles.length ? (
                        loadingMore ? (
                          <div className="flex items-center space-x-3 px-6 py-3 bg-white/50 dark:bg-near-black/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                            <span className="font-medium text-gray-700 dark:text-gray-300">Loading more articles...</span>
                          </div>
                        ) : (
                          <button
                            onClick={loadMoreArticles}
                            className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <span>Load More</span>
                          </button>
                        )
                      ) : (
                        <p className="text-gray-500 dark:text-gray-500 font-medium">You've reached the end</p>
                      )}
                      <div ref={loadMoreRef} className="h-1" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
