
import React, { useState, useEffect } from 'react';
import { AppMetadata, AppType, AppStatus } from '../types';
// Add missing CreditCard icon import
import { ExternalLink, Users, Brain, TrendingUp, Framer, Zap, Lock, Play, AlertCircle, Sparkles, CreditCard } from 'lucide-react';
import { getDaysUntilExpiry } from '../App';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Framer: <Framer className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />
};

const statusConfig = {
  [AppStatus.ACTIVE]: {
    label: 'ĐANG HOẠT ĐỘNG',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500'
  },
  [AppStatus.MAINTENANCE]: {
    label: 'ĐANG BẢO TRÌ',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500'
  },
  [AppStatus.INACTIVE]: {
    label: 'NGƯNG HOẠT ĐỘNG',
    classes: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500'
  }
};

const AppCard: React.FC<{ app: AppMetadata }> = ({ app }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkStatus = () => {
      const savedUser = localStorage.getItem('thay_quan_ai_user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };
    checkStatus();
    window.addEventListener('user-logged-in', checkStatus);
    return () => window.removeEventListener('user-logged-in', checkStatus);
  }, []);

  const isExpired = user ? getDaysUntilExpiry(user.expiryDate) < 0 : false;
  const isLoggedIn = !!user;

  const handleOpenApp = () => {
    if (app.status !== AppStatus.ACTIVE) {
      alert(`Ứng dụng "${app.name}" hiện đang ${statusConfig[app.status].label.toLowerCase()}. Vui lòng quay lại sau!`);
      return;
    }

    if (app.type === AppType.FREE) {
      window.dispatchEvent(new CustomEvent('trigger-app-viewer', { 
        detail: { url: app.link, name: app.name } 
      }));
      return;
    }

    if (isLoggedIn) {
      if (isExpired) {
        window.location.hash = "/membership";
        return;
      }
      window.dispatchEvent(new CustomEvent('trigger-app-viewer', { 
        detail: { url: app.link, name: app.name } 
      }));
    } else {
      window.dispatchEvent(new Event('trigger-membership-prompt'));
    }
  };

  const getButtonLabel = () => {
    if (app.status !== AppStatus.ACTIVE) return 'Tạm ngưng';
    if (app.type === AppType.FREE) return 'Mở ngay';
    if (isLoggedIn) {
      return isExpired ? 'Gia hạn ngay' : 'Mở ngay';
    }
    return 'Kích hoạt';
  };

  const currentStatus = statusConfig[app.status];

  return (
    <div className={`group relative glass rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col h-full ${app.status !== AppStatus.ACTIVE ? 'opacity-75' : ''}`}>
      <div className="h-36 overflow-hidden relative flex-shrink-0">
        <img src={app.previewUrl} alt={app.name} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${app.status !== AppStatus.ACTIVE ? 'grayscale' : ''}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-3 right-3 flex gap-2">
          {app.type === AppType.PAID && (
            <div className={`border backdrop-blur-md px-1.5 py-0.5 rounded-lg shadow-lg ${isExpired && isLoggedIn ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
              <Lock className="w-3 h-3" />
            </div>
          )}
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black backdrop-blur-md border tracking-wider shadow-lg ${
            app.type === AppType.FREE ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
            (isExpired && isLoggedIn ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30')
          }`}>
            {app.type === AppType.FREE ? 'MIỄN PHÍ' : 'PREMIUM'}
          </span>
        </div>

        <div className="absolute top-3 left-3">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border backdrop-blur-md shadow-lg transition-all duration-300 ${currentStatus.classes}`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${currentStatus.dot}`} />
            <span className="text-[7px] font-black uppercase tracking-widest">{currentStatus.label}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start gap-3 mb-2 h-[4.2rem]">
          <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-300 flex-shrink-0 mt-0.5 ${app.status === AppStatus.ACTIVE ? 'text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white' : 'text-gray-600'}`}>
            {iconMap[app.icon] || <Zap className="w-5 h-5" />}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className={`text-[14px] font-black tracking-tight leading-tight line-clamp-3 uppercase transition-colors ${app.status === AppStatus.ACTIVE ? 'text-white group-hover:text-indigo-400' : 'text-gray-500'}`}>
              {app.name}
            </h4>
          </div>
        </div>
        <p className="text-gray-400 text-[11px] line-clamp-3 mb-4 h-[3.75rem] font-normal leading-relaxed overflow-hidden">{app.description}</p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>{app.downloads >= 1000 ? `${(app.downloads / 1000).toFixed(1)}k` : app.downloads} lượt dùng</span>
          </div>
          <button 
            onClick={handleOpenApp} 
            disabled={app.status !== AppStatus.ACTIVE}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              app.status === AppStatus.ACTIVE 
                ? (isExpired && isLoggedIn && app.type === AppType.PAID ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-indigo-600 text-white hover:bg-indigo-500')
                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {getButtonLabel()} 
            {app.status === AppStatus.ACTIVE ? (
              getButtonLabel() === 'Gia hạn ngay' ? <CreditCard className="w-3 h-3" /> :
              getButtonLabel() === 'Mở ngay' ? <Play className="w-3 h-3 fill-current" /> : <ExternalLink className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
