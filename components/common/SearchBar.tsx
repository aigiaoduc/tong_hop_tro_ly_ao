import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (keyword: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Tìm kiếm...', onSearch, className = '' }) => {
  const [keyword, setKeyword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(keyword.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleClear = () => {
    setKeyword('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={17} className="text-stone-400" strokeWidth={1.8} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 border border-stone-200 rounded-xl bg-white text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200"
      />
      {keyword && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600 transition-colors duration-200"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
