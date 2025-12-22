
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Cloud,
  Cpu,
  Database,
  Sparkles,
  Zap,
  Activity,
  Users
} from 'lucide-react';
import { APPS_DATA } from '../constants';
import StatCard from '../components/StatCard';
import AppCard from '../components/AppCard';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { AppMetadata, AppType } from '../types';

const Home: React.FC = () => {
  const [featuredApps, setFeaturedApps] = useState<AppMetadata[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  
  const chartData = [
    { name: 'T2', visits: 8500 },
    { name: 'T3', visits: 9200 },
    { name: 'T4', visits: 8800 },
    { name: 'T5', visits: 11400 },
    { name: 'T6', visits: 12200 },
    { name: 'T7', visits: 15800 },
    { name: 'CN', visits: 18100 },
  ];

  const dynamicStats = [
    { label: 'Lượng truy cập', value: '105.2k', change: '+8.4%', isPositive: true },
    { label: 'Yêu cầu xử lý', value: '215k+', change: '+14.1%', isPositive: true },
    { label: 'Tốc độ phản hồi', value: '0.6s', change: '-0.1s', isPositive: true },
    { label: 'Độ chính xác', value: '99.5%', change: '+0.2%', isPositive: true },
  ];

  useEffect(() => {
    const freeAppsOnly = APPS_DATA.filter(app => app.type === AppType.FREE);
    const shuffled = [...freeAppsOnly].sort(() => 0.5 - Math.random());
    setFeaturedApps(shuffled.slice(0, 2));
    setOnlineCount(Math.floor(Math.random() * (180 - 100 + 1)) + 100);
  }, []);

  return (
    <div className="space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <section className="relative p-6 md:p-16 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl bg-[#030712]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-transparent z-0" />
        <div className="absolute -top-32 -right-32 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-purple-600/5 blur-[70px] md:blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[8px] md:text-[10px] font-black mb-4 md:mb-8 backdrop-blur-xl uppercase tracking-[0.2em] font-inter">
              <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-indigo-400" />
              <span>Học tập thông minh cùng AI</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-[1.1] md:leading-[1] mb-4 md:mb-8 tracking-tighter">
              Kho Trợ lý AI <br />
              <span className="gradient-text">Thầy Quân</span>
            </h1>
            
            <p className="text-gray-400 text-sm md:text-xl mb-6 md:mb-10 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              Cánh cửa dẫn vào thế giới trí tuệ nhân tạo. Những công cụ được thiết kế để giải phóng sức sáng tạo của bạn.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-5">
              <div className="flex items-center gap-2 md:gap-3 px-3.5 py-1.5 md:px-5 md:py-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl md:rounded-2xl">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-emerald-500 text-[8px] md:text-xs font-bold tracking-widest uppercase font-inter">Trực tuyến</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 px-3.5 py-1.5 md:px-5 md:py-2.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-gray-400">
                <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-[8px] md:text-xs font-bold font-inter tracking-wider uppercase">Ổn định: 99.9%</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[460px] glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-white/5 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 md:mb-8">
              <div>
                <h3 className="text-white font-black text-xs md:text-base flex items-center gap-2 tracking-tight uppercase">
                  <ArrowUpRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-indigo-400" />
                  Hiệu năng
                </h3>
                <p className="text-gray-500 text-[7px] md:text-[10px] font-bold font-inter uppercase tracking-widest">Cập nhật tự động</p>
              </div>
              <div className="text-emerald-400 text-[7px] md:text-[10px] font-black bg-emerald-500/10 px-2 py-1 md:px-2.5 md:py-1.5 rounded-lg md:rounded-xl border border-emerald-500/20 font-inter tracking-tighter">
                LIVE
              </div>
            </div>
            
            <div className="w-full h-32 md:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    cursor={{ stroke: '#818cf8', strokeWidth: 1.5 }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(2, 6, 23, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '12px', 
                      backdropFilter: 'blur(10px)',
                      color: '#fff',
                      fontSize: '10px',
                      fontFamily: 'Inter',
                      fontWeight: 'bold'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorVisits)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
                <p className="text-gray-500 text-[7px] md:text-[9px] mb-1 uppercase font-black tracking-widest flex items-center gap-1.5 font-inter">
                  <Users className="w-2 md:w-2.5 h-2 md:h-2.5 text-indigo-500" /> Online
                </p>
                <p className="text-white font-black text-lg md:text-2xl tracking-tighter">{onlineCount}</p>
              </div>
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
                <p className="text-gray-500 text-[7px] md:text-[9px] mb-1 uppercase font-black tracking-widest flex items-center gap-1.5 font-inter">
                  <Zap className="w-2 md:w-2.5 h-2 md:h-2.5 text-fuchsia-500" /> AI Requests
                </p>
                <p className="text-white font-black text-lg md:text-2xl tracking-tighter">28k+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 px-1">
        {dynamicStats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 pt-4">
        <div className="lg:col-span-2 space-y-6 md:space-y-10">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl md:text-4xl font-black text-white flex items-center gap-3 md:gap-4 tracking-tighter uppercase">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                <Zap className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              AI Nổi bật
            </h2>
            <Link to="/free" className="text-indigo-400 font-black hover:text-indigo-300 transition-colors text-[8px] md:text-xs underline underline-offset-4 md:underline-offset-8 decoration-indigo-500/30 font-inter tracking-[0.1em] md:tracking-[0.2em]">
              XEM TẤT CẢ &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {featuredApps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>

        <div className="space-y-6 md:space-y-10">
          <h2 className="text-xl md:text-4xl font-black text-white flex items-center gap-3 md:gap-4 tracking-tighter uppercase">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-2xl bg-fuchsia-600 flex items-center justify-center shadow-lg shrink-0">
              <Cpu className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            Server
          </h2>
          
          <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-white/5 space-y-6 md:space-y-10 relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500 border border-fuchsia-500/10 shrink-0">
                <Cloud className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-2">
                  <span className="text-[7px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest font-inter">MEMORY</span>
                  <span className="text-[7px] md:text-[10px] font-black text-white font-inter">42%</span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-fuchsia-600 to-indigo-500 w-[42%] rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10 shrink-0">
                <Database className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-2">
                  <span className="text-[7px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest font-inter">TRAFFIC</span>
                  <span className="text-[7px] md:text-[10px] font-black text-white font-inter">18%</span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-400 w-[18%] rounded-full" />
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 rounded-xl md:rounded-[2rem] bg-indigo-500/5 border border-white/5 space-y-2 md:space-y-4">
              <div className="flex items-center justify-between text-[7px] md:text-[10px] font-inter">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Khu vực:</span>
                <span className="text-white font-black uppercase">Vietnam Node</span>
              </div>
              <div className="flex items-center justify-between text-[7px] md:text-[10px] font-inter">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Bảo mật:</span>
                <span className="text-emerald-500 font-black uppercase">ACTIVE</span>
              </div>
            </div>

            <div className="pt-4 md:pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[7px] md:text-[10px] font-black text-emerald-500 tracking-[0.2em] md:tracking-[0.25em] uppercase font-inter">
              <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-ping" />
              Sẵn sàng phục vụ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
