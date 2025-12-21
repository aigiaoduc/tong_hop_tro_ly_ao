
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  User as UserIcon,
  X,
  Sparkles,
  LogOut,
  Calendar,
  ChevronDown,
  CreditCard,
  Key,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Lock,
  RefreshCw,
  Zap,
  Home as HomeIcon
} from 'lucide-react';
import Home from './pages/Home';
import AppsList from './pages/AppsList';
import Membership from './pages/Membership';
import { AppType } from './types';

const SHEET_TSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGgDvp6kYl7uef4Nbo0U9Xdl76cXWreeIKjRb1vfJTufk54holXhK9UPT2DY5I6SmB_b8Aa7y5j5jz/pub?output=tsv';
const DEFAULT_AVATAR = "https://res.cloudinary.com/dejnvixvn/image/upload/v1766268410/Gemini_Generated_Image_xpxv1cxpxv1cxpxv_bwp4n8.png";

interface UserData {
  key: string;
  name: string;
  expiryDate: string;
  role: 'VIP' | 'FREE';
}

export const parseVNBrandDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const s = dateStr.trim().toLowerCase();
  if (s === 'vĩnh viễn' || s === 'vô hạn' || s === 'vinh vien' || s === 'vo han') {
    return new Date(2099, 11, 31);
  }
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
};

export const getDaysUntilExpiry = (dateStr: string): number => {
  const expiry = parseVNBrandDate(dateStr);
  if (!expiry) return 9999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const ForcedExpiredModal: React.FC<{ isOpen: boolean; onLogout: () => void }> = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-[2.5rem] p-8 border border-rose-500/30 shadow-[0_0_100px_rgba(244,63,94,0.2)] text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20 shadow-2xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Tài khoản hết hạn</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed px-4">Gói hội viên VIP của bạn đã kết thúc. Vui lòng gia hạn để tiếp tục sử dụng các ứng dụng đặc quyền từ Thầy Quân.</p>
        <div className="space-y-3">
          <Link to="/membership" onClick={onLogout} className="w-full flex items-center justify-center gap-3 bg-indigo-600 py-4 rounded-2xl text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95">Gia hạn ngay</Link>
          <button onClick={onLogout} className="w-full py-3 text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Đăng xuất</button>
        </div>
      </div>
    </div>
  );
};

const AppViewerModal: React.FC<{ url: string | null; name: string | null; onClose: () => void }> = ({ url, name, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (url) {
      setIsLoading(true);
      setIframeKey(prev => prev + 1);
    }
  }, [url]);

  if (!url) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950 animate-in fade-in zoom-in duration-300">
      <div className="h-16 border-b border-white/10 glass px-6 flex items-center justify-between shrink-0 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20"><ShieldCheck className="w-5 h-5 text-white" /></div>
          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-tighter leading-none flex items-center gap-2"><span>{name}</span><span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded border border-emerald-500/30 font-black">SECURE</span></h4>
            <div className="flex items-center gap-1 mt-1"><Lock className="w-2.5 h-2.5 text-gray-500" /><p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Mã hóa kết nối</p></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIframeKey(k => k + 1)} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /></button>
          <div className="h-6 w-[1px] bg-white/10 mx-0.5" />
          <button onClick={onClose} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg"><X className="w-4 h-4" /> <span>Đóng</span></button>
        </div>
      </div>
      <div className="flex-1 relative bg-slate-900 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#020617]">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" /></div>
            </div>
            <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-1.5">Đang kết nối App an toàn</p>
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Vui lòng chờ...</p>
          </div>
        )}
        <iframe 
          key={iframeKey} 
          src={url} 
          className="w-full h-full border-none bg-white" 
          onLoad={() => setIsLoading(false)} 
          title={name || 'AI App'} 
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin allow-downloads" 
          allow="clipboard-read; clipboard-write; display-capture; autoplay" 
        />
      </div>
    </div>
  );
};

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAccessKey('');
      setIsSuccess(false);
      setErrorMessage('');
      setSuccessName('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const verifyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = accessKey.trim().toUpperCase();
    if (!cleanKey) {
      setErrorMessage('Vui lòng nhập mã!');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${SHEET_TSV_URL}&t=${Date.now()}`);
      const tsvText = await response.text();
      const rows = tsvText.split('\n').map(row => row.replace(/"/g, '').split('\t'));
      const userData = rows.find(row => row[0]?.trim().toUpperCase() === cleanKey);
      if (userData) {
        const [key, name, expiry, status] = userData;
        if (status?.trim().toLowerCase() === 'block' || status?.trim().toLowerCase() === 'khóa') {
          setErrorMessage('Mã này đã bị khóa!');
          setIsLoading(false);
          return;
        }
        if (expiry && getDaysUntilExpiry(expiry) < 0) {
          setErrorMessage(`Mã đã hết hạn vào ngày ${expiry}!`);
          setIsLoading(false);
          return;
        }
        const userObj = { key: key.trim(), name: name?.trim() || 'Hội viên VIP', expiryDate: expiry?.trim() || 'Vô thời hạn', role: 'VIP' };
        localStorage.setItem('thay_quan_ai_user', JSON.stringify(userObj));
        setSuccessName(userObj.name);
        setIsSuccess(true);
        window.dispatchEvent(new Event('user-logged-in'));
        setTimeout(() => onClose(), 1500);
      } else {
        setErrorMessage('Mã không chính xác hoặc chưa tồn tại!');
      }
    } catch (err) {
      setErrorMessage('Lỗi hệ hệ thống! Thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => !isLoading && !isSuccess && onClose()} />
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-[3rem] p-10 border border-white/10 shadow-2xl animate-in zoom-in duration-300">
        {!isLoading && !isSuccess && <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>}
        {isSuccess ? (
          <div className="text-center py-8 space-y-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20"><CheckCircle2 className="w-12 h-12" /></div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Chào {successName}!</h3>
          </div>
        ) : (
          <>
            <div className="text-center mb-10 space-y-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl"><Key className="w-8 h-8 text-white" /></div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">Xác thực VIP</h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Nhập mã hội viên để mở khóa</p>
            </div>
            <form onSubmit={verifyAccess} className="space-y-6">
              <input type="text" value={accessKey} onChange={(e) => setAccessKey(e.target.value)} placeholder="MÃ KÍCH HOẠT" className={`w-full bg-[#1e293b] border ${errorMessage ? 'border-rose-500 animate-shake' : 'border-white/10 focus:border-indigo-500'} rounded-2xl px-6 py-6 text-white text-center font-black tracking-[0.3em] uppercase focus:outline-none transition-all text-xl shadow-inner`} autoFocus />
              {errorMessage && <p className="text-rose-500 text-[10px] font-black text-center uppercase tracking-widest">{errorMessage}</p>}
              <button disabled={isLoading} className="w-full bg-indigo-600 py-6 rounded-2xl text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl active:scale-95 flex items-center justify-center">{isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Kích hoạt ngay'}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const Navbar: React.FC<{ onOpenLogin: () => void }> = ({ onOpenLogin }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const checkLogin = () => {
      const savedUser = localStorage.getItem('thay_quan_ai_user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    checkLogin();
    window.addEventListener('user-logged-in', checkLogin);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('user-logged-in', checkLogin);
    };
  }, []);

  const navLinks = [
    { label: 'Trang chủ', path: '/', icon: HomeIcon },
    { label: 'Miễn phí', path: '/free', icon: Sparkles },
    { label: 'Trả phí', path: '/paid', icon: Package },
    { label: 'Hội viên', path: '/membership', icon: Users },
  ];

  const handleLogout = () => {
    localStorage.removeItem('thay_quan_ai_user');
    setUser(null);
    setShowUserMenu(false);
    window.dispatchEvent(new Event('user-logged-in'));
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 pointer-events-none">
      <nav className={`max-w-7xl mx-auto h-16 md:h-24 glass pointer-events-auto rounded-full md:rounded-[3rem] border transition-all duration-500 flex items-center justify-between px-4 md:px-12 shadow-2xl ${
        isScrolled ? 'border-indigo-500/30 bg-slate-950/90' : 'border-white/10 bg-slate-950/70'
      }`}>
        <Link to="/" className="shrink-0 group">
          <img src="https://res.cloudinary.com/dejnvixvn/image/upload/v1766268000/Thi%E1%BA%BFt_k%E1%BA%BF_ch%C6%B0a_c%C3%B3_t%C3%AAn_no_background_r0sa9a.png" 
            className="h-12 md:h-20 w-auto object-contain transition-all group-hover:scale-110" alt="Logo" />
        </Link>

        <div className="hidden lg:flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/5">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`relative px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}>
              {location.pathname === link.path && <div className="absolute inset-0 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/30 z-0 animate-in fade-in zoom-in" />}
              <span className="relative z-10 flex items-center gap-3">
                <link.icon className={`w-4 h-4 ${location.pathname === link.path ? 'text-white' : 'text-indigo-400/60'}`} />
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 md:gap-4 relative shrink-0">
          <button onClick={user ? () => setShowUserMenu(!showUserMenu) : onOpenLogin} 
            className={`flex items-center gap-4 transition-all duration-300 ${
              user 
                ? 'p-1 md:p-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 pr-6' 
                : 'px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl border border-indigo-500/30 bg-indigo-600/10 hover:bg-indigo-600/20 hover:border-indigo-500/60 shadow-lg shadow-indigo-600/5 group/login'
            }`}>
            {user ? (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-indigo-500/50 shadow-lg">
                <img src={DEFAULT_AVATAR} className="w-full h-full object-cover" alt="Avatar" />
              </div>
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20 group-hover/login:scale-110 transition-transform">
                <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
              </div>
            )}
            <div className="text-left">
              <p className="text-white text-xs md:text-sm font-black uppercase tracking-tight leading-none">
                {user ? user.name : 'Khách'}
              </p>
              {user ? (
                <div className="flex items-center gap-1 mt-1.5">
                   <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em]">HỘI VIÊN VIP</p>
                   <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </div>
              ) : (
                <p className="text-[9px] text-indigo-400/60 font-black uppercase tracking-[0.2em] mt-1.5 group-hover/login:text-indigo-400 transition-colors">Đăng nhập ngay</p>
              )}
            </div>
          </button>

          {user && showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute top-full right-0 mt-4 w-72 bg-[#0f172a] rounded-[2rem] p-6 shadow-2xl z-20 border border-white/10 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-4 pb-5 border-b border-white/5">
                  <img src={DEFAULT_AVATAR} className="w-12 h-12 rounded-full border border-indigo-500/30" alt="Avatar" />
                  <div className="overflow-hidden">
                    <p className="text-white font-black text-sm truncate uppercase">{user.name}</p>
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-1">VIP Member</p>
                  </div>
                </div>
                <div className="py-4 space-y-3">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                    <span className="text-[9px] text-gray-500 font-black uppercase">Hết hạn:</span>
                    <span className="text-[11px] text-white font-black">{user.expiryDate}</span>
                  </div>
                  <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-rose-500/10 text-rose-500 text-[11px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 flex items-center justify-center gap-3">
                    <LogOut className="w-5 h-5" /> Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeApp, setActiveApp] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    const handleOpenLogin = () => setIsLoginOpen(true);
    const handleOpenApp = (e: any) => setActiveApp(e.detail);
    window.addEventListener('trigger-login-modal', handleOpenLogin);
    window.addEventListener('trigger-app-viewer', handleOpenApp as EventListener);
    return () => {
      window.removeEventListener('trigger-login-modal', handleOpenLogin);
      window.removeEventListener('trigger-app-viewer', handleOpenApp as EventListener);
    };
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen pt-24 md:pt-40 pb-10">
        <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
        <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <AppViewerModal url={activeApp?.url || null} name={activeApp?.name || null} onClose={() => setActiveApp(null)} />
        <main className="max-w-7xl mx-auto px-4 md:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/free" element={<AppsList title="Miễn phí" type={AppType.FREE} />} />
            <Route path="/paid" element={<AppsList title="Trả phí" type={AppType.PAID} />} />
            <Route path="/membership" element={<Membership />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
