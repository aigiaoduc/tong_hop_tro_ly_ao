
import React, { useMemo, useState } from 'react';
import { AppType } from '../types';
import { APPS_DATA } from '../constants';
import AppCard from '../components/AppCard';
import { Search, Sparkles, Package } from 'lucide-react';

interface AppsListProps {
  title: string;
  type: AppType;
}

const AppsList: React.FC<AppsListProps> = ({ title, type }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = useMemo(() => 
    APPS_DATA.filter(app => 
      app.type === type && 
      (app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       app.category.toLowerCase().includes(searchTerm.toLowerCase()))
    ), 
    [type, searchTerm]
  );

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 px-1">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg ${type === AppType.FREE ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                {type === AppType.FREE ? <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />}
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">{title}</h1>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="glass px-4 md:px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 border border-white/10 group focus-within:border-indigo-500 transition-all flex-grow">
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 group-focus-within:text-indigo-400" />
            <input 
              type="text" 
              placeholder="Tìm tên trợ lý..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] md:text-sm text-white placeholder:text-gray-600 font-medium w-full min-w-0"
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap">
            <Search className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Tìm kiếm
          </button>
        </div>
      </div>

      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center glass rounded-[2rem] md:rounded-[4rem] border border-white/5 mx-1">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center text-gray-600 mb-6 border border-white/10">
            <Search className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Không tìm thấy</h3>
          <p className="text-gray-500 mt-2 font-medium text-xs md:text-sm px-4">Thử từ khóa khác hoặc quay lại sau nhé.</p>
        </div>
      )}
    </div>
  );
};

export default AppsList;
