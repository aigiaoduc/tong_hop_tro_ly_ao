import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../components/common/ToastContext';
import SEO from '../components/common/SEO';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.mode === 'register') {
        setIsLogin(false);
      }
      if (location.state.message) {
        setNotification(location.state.message);
      }
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotification('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.login({ username: formData.username, password: formData.password });
        if (res.success && res.data) {
          login(res.data);
          navigate('/');
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] p-8 border border-stone-100">
        <h2 className="text-2xl font-bold text-center text-stone-900 mb-7 tracking-tight">
          {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
        </h2>

        {notification && (
          <div className="bg-amber-50 text-amber-700 p-3 rounded-xl mb-5 text-sm text-center border border-amber-200">
            {notification}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white text-stone-900"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email liên hệ</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white text-stone-900"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white text-stone-900"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white text-stone-900"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all duration-200 active:scale-[0.98] shadow-[0_2px_10px_-2px_rgba(13,148,136,0.4)] ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setNotification(''); }}
            className="text-stone-500 hover:text-teal-600 text-sm font-medium transition-colors duration-200"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
