import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Đang tải...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-teal-100 dark:border-teal-900 border-t-teal-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-teal-400 rounded-full animate-spin-slow"></div>
      </div>
      <p className="text-stone-500 dark:text-stone-400 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
