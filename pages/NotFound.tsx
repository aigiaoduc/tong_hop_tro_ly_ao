import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/common/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-20">
      <SEO title="Trang không tồn tại" description="Trang bạn đang tìm kiếm không tồn tại." />

      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-8xl md:text-9xl font-extrabold text-teal-600/20 dark:text-teal-500/20 select-none">
          404
        </span>

        <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100 -mt-6 mb-4">
          Trang không tồn tại
        </h1>

        <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
          Có vẻ như bạn đã lạc vào một ngõ cụt. Trang này không còn tồn tại hoặc đã bị di chuyển.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-all duration-200 active:scale-[0.98] shadow-[0_2px_10px_-2px_rgba(13,148,136,0.4)]"
          >
            <Home size={16} />
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-700 transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
