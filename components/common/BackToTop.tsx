import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className="fixed bottom-6 left-6 z-50 w-11 h-11 flex items-center justify-center rounded-xl bg-teal-600 text-white shadow-[0_4px_16px_-4px_rgba(13,148,136,0.5)] hover:bg-teal-700 active:scale-90 transition-all duration-200"
    >
      <ArrowUp size={19} strokeWidth={2.5} />
    </button>
  );
};

export default BackToTop;
