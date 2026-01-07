import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Home, BookmarkCheck, LogOut, Moon, Sun, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navigation() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logout();
      toast.success('See you soon! 👋');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                finfeed
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {currentUser && (
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive('/')
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Home className="h-5 w-5" />
                <span className="hidden md:inline">Home</span>
              </Link>

              <Link
                to="/saved"
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive('/saved')
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <BookmarkCheck className="h-5 w-5" />
                <span className="hidden md:inline">Saved</span>
              </Link>

              <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

              <button
                onClick={(e) => toggleTheme(e)}
                className="p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-600" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
