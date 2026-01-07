import { Loader2 } from 'lucide-react';

interface LoadingModalProps {
  message?: string;
}

export default function LoadingModal({ message = 'Loading...' }: LoadingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in">
      <div className="relative bg-white dark:bg-near-black rounded-2xl p-10 shadow-2xl flex flex-col items-center space-y-6 border border-gray-200 dark:border-gray-800 max-w-sm mx-4">
        {/* Animated background */}
        <div className="absolute inset-0 bg-blue-500/10 rounded-2xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-50 animate-pulse" />
            <Loader2 className="relative h-16 w-16 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{message}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyzing with AI...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
