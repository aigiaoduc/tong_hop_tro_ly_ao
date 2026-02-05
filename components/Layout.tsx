import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, Code, BookOpen, Monitor, MessageSquare, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Config } from '../types';
import { api } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    api.getConfig().then(res => {
      if (res.success) setConfig(res.data);
    });
  }, []);

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: <Home size={18} /> },
    { label: 'Ứng dụng', path: '/apps', icon: <Code size={18} /> },
    { label: 'Khóa học', path: '/courses', icon: <BookOpen size={18} /> },
    { label: 'Phần mềm', path: '/software', icon: <Monitor size={18} /> },
    { label: 'Liên hệ', path: '/feedback', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <img 
                  src="https://res.cloudinary.com/dejnvixvn/image/upload/v1770181393/1_kfr9et.png" 
                  alt="Logo" 
                  className="w-10 h-10 object-contain drop-shadow-sm" 
                />
                <span className="font-bold text-xl text-indigo-700">
                  {config?.siteName || 'Trợ Lý Ảo Thầy Quân'}
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="ml-4 flex items-center border-l pl-4 border-gray-200">
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                        {user.fullName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{user.username}</span>
                    </button>
                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right border border-gray-100 z-50">
                      {/* Admin Link */}
                      {user.username === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-indigo-600 font-bold hover:bg-indigo-50 border-b border-gray-100">
                          <div className="flex items-center">
                            <Settings size={16} className="mr-2" />
                            Trang quản trị
                          </div>
                        </Link>
                      )}
                      
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Tài khoản của tôi
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                  >
                    <User size={16} />
                    <span>Đăng nhập</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-3">
                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {user.fullName.charAt(0)}
                      </div>
                      <span className="text-gray-800 font-medium">{user.fullName}</span>
                    </div>

                    {user.username === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-3 py-2 rounded-md text-base font-bold text-indigo-600 hover:bg-indigo-50"
                        >
                          Trang quản trị
                        </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Tài khoản
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
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
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer Compact */}
      <footer className="bg-gray-900 text-gray-300 py-6 border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-3 md:mb-0 text-center md:text-left">
            <p className="font-medium text-white">{config?.footerText || '© 2026 Bản quyền thuộc về tác giả.'}</p>
          </div>
          <div className="flex space-x-6">
            {config?.facebookUrl && (
              <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
                Facebook
              </a>
            )}
            {config?.zaloUrl && (
              <a href={config.zaloUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
                Zalo
              </a>
            )}
            {config?.youtubeUrl && (
              <a href={config.youtubeUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
                YouTube
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;