import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, Code, BookOpen, Monitor, MessageSquare, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Config } from '../types';
import { api } from '../services/api';
import BackToTop from './common/BackToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    api.getConfig().then(res => {
      if (res.success) setConfig(res.data);
    });
  }, []);

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: <Home size={17} strokeWidth={1.8} /> },
    { label: 'Ứng dụng', path: '/apps', icon: <Code size={17} strokeWidth={1.8} /> },
    { label: 'Khóa học', path: '/courses', icon: <BookOpen size={17} strokeWidth={1.8} /> },
    { label: 'Phần mềm', path: '/software', icon: <Monitor size={17} strokeWidth={1.8} /> },
    { label: 'Liên hệ', path: '/feedback', icon: <MessageSquare size={17} strokeWidth={1.8} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 font-sans transition-colors duration-300">
      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-xl focus:text-sm focus:font-medium"
      >
        Chuyển đến nội dung chính
      </a>

      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl sticky top-3 z-50 mx-3 sm:mx-6 mt-3 rounded-2xl shadow-[0_1px_20px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_20px_-4px_rgba(0,0,0,0.3)] border border-stone-200/50 dark:border-stone-800/50 max-w-[1400px] lg:mx-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2.5" aria-label="Về trang chủ">
                <img
                  src="https://res.cloudinary.com/dejnvixvn/image/upload/v1770181393/1_kfr9et.png"
                  alt="Logo"
                  className="w-9 h-9 rounded-xl object-cover"
                />
                <span className="font-bold text-base md:text-lg text-stone-900 dark:text-stone-100 tracking-tight hidden md:block">
                  Thầy Quân
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100/70 dark:hover:bg-stone-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
                className="ml-2 p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <div className="ml-1 flex items-center border-l border-stone-200/60 dark:border-stone-700/60 pl-2">
                {user ? (
                  <div className="relative group">
                    <button
                      className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors duration-200"
                      aria-label="Menu tài khoản"
                    >
                      <div className="w-8 h-8 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center text-teal-700 dark:text-teal-300 font-semibold text-sm">
                        {user.fullName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium hidden lg:block">{user.username}</span>
                    </button>
                    <div className="absolute right-0 w-48 mt-2 py-1.5 bg-white dark:bg-stone-800 rounded-xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right border border-stone-100 dark:border-stone-700 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
                        Tài khoản của tôi
                      </Link>
                      <div className="border-t border-stone-100 dark:border-stone-700 my-1"></div>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1.5 text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(13,148,136,0.4)]"
                  >
                    <User size={15} />
                    <span>Đăng nhập</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile right section */}
            <div className="flex items-center md:hidden space-x-1">
              <button
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
                className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200"
                aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-b-2xl border-t border-stone-100 dark:border-stone-800">
            <div className="px-3 pt-3 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="border-t border-stone-100 dark:border-stone-800 pt-3 mt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 flex items-center space-x-3">
                      <div className="w-9 h-9 bg-teal-100 dark:bg-teal-800 rounded-full flex items-center justify-center text-teal-700 dark:text-teal-300 font-semibold text-sm">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-stone-900 dark:text-stone-100 font-medium text-sm block">{user.fullName}</span>
                        <span className="text-stone-400 dark:text-stone-500 text-xs">@{user.username}</span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-sm font-medium text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      Tài khoản
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors"
                  >
                    Đăng nhập / Đăng ký
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main id="main-content" className="flex-grow w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 dark:bg-stone-950 mt-16 border-t border-stone-800 dark:border-stone-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto py-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://res.cloudinary.com/dejnvixvn/image/upload/v1770181393/1_kfr9et.png"
                  alt="Logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="font-bold text-white text-base">
                  {config?.siteName || 'Trợ Lý Ảo Thầy Quân'}
                </span>
              </div>
              <p className="text-stone-400 text-sm max-w-xs leading-relaxed">
                {config?.footerText || 'Chia sẻ cảm hứng về thiết kế, công nghệ và những tạo phẩm chất lượng.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-stone-500 text-xs font-medium uppercase tracking-wider">Liên kết</span>
                <div className="flex space-x-5">
                  {config?.facebookUrl && (
                    <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-teal-400 transition-colors text-sm">
                      Facebook
                    </a>
                  )}
                  {config?.zaloUrl && (
                    <a href={config.zaloUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-teal-400 transition-colors text-sm">
                      Zalo
                    </a>
                  )}
                  {config?.youtubeUrl && (
                    <a href={config.youtubeUrl} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-teal-400 transition-colors text-sm">
                      YouTube
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-stone-500 text-xs font-medium uppercase tracking-wider">Pháp lý</span>
                <div className="flex space-x-5">
                  <span className="text-stone-500 text-sm cursor-default">Chính sách bảo mật</span>
                  <span className="text-stone-500 text-sm cursor-default">Điều khoản</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-stone-500 text-xs">
              © {new Date().getFullYear()} {config?.siteName || 'Trợ Lý Ảo Thầy Quân'}. Bảo lưu mọi quyền.
            </p>
            <p className="text-stone-600 text-xs">
              Được tạo với sự tỉ mỉ
            </p>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
};

export default Layout;
