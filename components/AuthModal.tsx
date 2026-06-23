import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useToast } from './common/ToastContext';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register';
  message?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'login', message = '' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login({ username: formData.username, password: formData.password });
        if (res.success && res.data) {
          login(res.data);
          onClose();
        } else {
          setError(res.message || 'Đăng nhập thất bại');
        }
      } else {
        const res = await api.register(formData);
        if (res.success) {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          setIsLogin(true);
        } else {
          setError(res.message || 'Đăng ký thất bại');
        }
      }
    } catch (err) {
      setError('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-stone-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full relative border border-stone-100 dark:border-stone-800">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors duration-200"
          >
            <X size={22} />
          </button>

          <div className="px-8 py-8">
            <h2 className="text-2xl font-bold center text-stone-900 dark:text-stone-100 mb-2 tracking-tight">
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
            </h2>

            {message && (
                <p className="text-center text-stone-500 dark:text-stone-400 text-sm mb-6 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-100 dark:border-stone-700">
                    {message}
                </p>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center border border-red-100 dark:border-red-900">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      autoComplete="email"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Tên đăng nhập</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  autoComplete="username"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Mật khẩu</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 pr-10"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all duration-200 active:scale-[0.98] shadow-[0_2px_10px_-2px_rgba(13,148,136,0.4)] ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? 'Đang xử lý...' : (isLogin ? 'Tiếp tục' : 'Đăng ký')}
              </button>
            </form>

            <div className="mt-6 text-center pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-stone-500 dark:text-stone-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-colors duration-200"
              >
                {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

