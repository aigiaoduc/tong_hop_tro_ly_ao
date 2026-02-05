import React, { useEffect, useState } from 'react';
import { Facebook, Phone, Youtube, ArrowRight, X, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { Config, AdItem } from '../types';
import { Link } from 'react-router-dom';
import EmbedModal from '../components/EmbedModal';

const Home: React.FC = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  
  // States for Ads
  const [ad, setAd] = useState<AdItem | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [viewingAd, setViewingAd] = useState<AdItem | null>(null);

  useEffect(() => {
    // Fetch Config
    api.getConfig()
      .then((res) => {
        if (res.success && res.data) {
          setConfig(res.data);
        }
      })
      .finally(() => setLoading(false));

    // Fetch Ads
    api.getAds()
       .then(res => {
          if (res.success && res.data && res.data.length > 0) {
             // Lấy random 1 quảng cáo nếu có nhiều cái
             const randomAd = res.data[Math.floor(Math.random() * res.data.length)];
             setAd(randomAd);
             // Hiện quảng cáo sau 1.5s để không làm phiền ngay lập tức
             setTimeout(() => setShowAd(true), 1500);
          }
       });
  }, []);

  const handleAdClick = () => {
     if (ad && ad.landingPageUrl) {
        setViewingAd(ad);
     }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Đang tải dữ liệu...</div>;
  if (!config) return <div className="flex justify-center items-center h-screen text-red-500">Không thể tải cấu hình.</div>;

  const features = [
    {
      title: "Kho Ứng Dụng",
      desc: "Các công cụ tiện ích, automation tool giúp tối ưu hiệu suất công việc.",
      imageUrl: "https://res.cloudinary.com/dejnvixvn/image/upload/v1770181393/4_vf8adl.png",
      link: "/apps",
      bg: "bg-gradient-to-br from-indigo-500 to-purple-600"
    },
    {
      title: "Khóa Học Online",
      desc: "Chương trình đào tạo từ cơ bản đến nâng cao về lập trình và tư duy hệ thống.",
      imageUrl: "https://res.cloudinary.com/dejnvixvn/image/upload/v1770181509/Thi%E1%BA%BFt_k%E1%BA%BF_ch%C6%B0a_c%C3%B3_t%C3%AAn_1_udeivy.png",
      link: "/courses",
      bg: "bg-gradient-to-br from-blue-500 to-cyan-600"
    },
    {
      title: "Phần Mềm / Source",
      desc: "Các phần mềm đóng gói, source code mẫu chất lượng cao sẵn sàng sử dụng.",
      imageUrl: "https://res.cloudinary.com/dejnvixvn/image/upload/v1770181394/2_k12zbr.png",
      link: "/software",
      bg: "bg-gradient-to-br from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className="w-full bg-gray-50 pb-20">
      
      {/* --- HERO SECTION LUXURY --- */}
      <div className="relative overflow-hidden bg-slate-900 text-white pb-20 pt-16 lg:pt-24 mb-16">
         {/* Background Decoration */}
         <div className="absolute inset-0 z-0">
             <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-900/40 blur-3xl"></div>
             <div className="absolute top-20 -left-20 w-[400px] h-[400px] rounded-full bg-purple-900/30 blur-3xl"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
         </div>

         <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* 3 Columns Layout: Avatar - Info - Character */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
               
               {/* 1. LEFT: Avatar Area (25%) */}
               <div className="w-full lg:w-1/4 flex justify-center lg:justify-end order-1">
                  <div className="relative group">
                     <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                     <img 
                       src={config.avatarUrl} 
                       alt={config.name} 
                       className="relative w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-slate-800 shadow-2xl"
                     />
                     <div className="absolute bottom-4 right-4 bg-green-500 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-slate-900"></div>
                  </div>
               </div>

               {/* 2. CENTER: Text Area (50%) */}
               <div className="w-full lg:w-2/4 text-center lg:text-left px-4 order-2">
                  <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold mb-4 tracking-wider uppercase">
                     {config.siteName || 'Trợ Lý Ảo Thầy Quân'}
                  </span>
                  
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                     Chào, tôi là{' '}
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        {config.name}
                     </span>
                  </h1>
                  
                  <p className="text-base md:text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light whitespace-pre-line">
                     {config.bio}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                     {/* Social Buttons Styled */}
                     {config.facebookUrl && (
                       <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full transition-all hover:scale-105 text-white">
                          <Facebook size={20} className="text-blue-400" />
                          <span className="font-medium">Facebook</span>
                       </a>
                     )}
                     {config.zaloUrl && (
                       <a href={config.zaloUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full transition-all hover:scale-105 text-white">
                          <Phone size={20} className="text-blue-300" />
                          <span className="font-medium">Zalo</span>
                       </a>
                     )}
                     {config.youtubeUrl && (
                        <a href={config.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full transition-all hover:scale-105 text-white">
                          <Youtube size={20} className="text-red-500" />
                          <span className="font-medium">Youtube</span>
                        </a>
                     )}
                  </div>
               </div>

               {/* 3. RIGHT: Character (25%) - Only visible on large screens */}
               <div className="hidden lg:flex lg:w-1/4 justify-start items-end order-3">
                  <img 
                    src="https://res.cloudinary.com/dejnvixvn/image/upload/v1770181393/1_kfr9et.png" 
                    alt="Assistant Character" 
                    className="w-full max-w-[300px] h-auto object-contain transform -scale-x-100 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
               </div>

            </div>
         </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
               <Link 
                  key={idx} 
                  to={feature.link}
                  className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
               >
                  <div className={`h-40 ${feature.bg} flex items-center justify-center relative`}>
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                     <img 
                        src={feature.imageUrl} 
                        alt={feature.title}
                        className="h-32 w-auto object-contain drop-shadow-md transform group-hover:scale-110 transition-transform duration-500"
                     />
                  </div>
                  <div className="p-8">
                     <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {feature.title}
                     </h3>
                     <p className="text-gray-500 text-sm leading-relaxed mb-6 h-10 line-clamp-2">
                        {feature.desc}
                     </p>
                     <div className="flex items-center text-indigo-600 font-bold text-sm tracking-wide group-hover:translate-x-2 transition-transform">
                        KHÁM PHÁ NGAY <ArrowRight size={16} className="ml-2" />
                     </div>
                  </div>
               </Link>
            ))}
         </div>

         {/* Contact Banner */}
         <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <Phone size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-900">Liên hệ hợp tác công việc?</h3>
                  <p className="text-gray-600 text-sm">Tư vấn giải pháp phần mềm và tự động hóa.</p>
               </div>
            </div>
            <div className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
               {config.phone}
            </div>
         </div>
      </div>

      {/* --- GOOGLE-STYLE ADS COMPONENT --- */}
      {showAd && ad && (
         <div className="fixed bottom-4 right-4 z-40 w-[300px] md:w-[320px] animate-in slide-in-from-right duration-500">
             <div className="bg-white rounded-lg shadow-[0_5px_30px_-5px_rgba(0,0,0,0.3)] border border-gray-200 overflow-hidden relative group">
                {/* Close Button */}
                <button 
                  onClick={() => setShowAd(false)}
                  className="absolute top-1 right-1 bg-gray-200/80 hover:bg-gray-300 rounded-full p-1 text-gray-600 z-10 transition-colors"
                  title="Đóng quảng cáo"
                >
                   <X size={14} />
                </button>
                
                {/* Ad Content Container */}
                <div 
                   onClick={handleAdClick} 
                   className="cursor-pointer"
                >
                   {/* Ad Badge */}
                   <div className="absolute top-0 left-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 z-10 rounded-br-md">
                      Quảng cáo
                   </div>

                   {/* Ad Image */}
                   <div className="w-full h-auto max-h-[250px] overflow-hidden bg-gray-100">
                      <img 
                        src={ad.imageUrl} 
                        alt={ad.title || "Quảng cáo"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                   </div>
                   
                   {/* Optional Title (if exists) */}
                   {ad.title && (
                      <div className="p-3 bg-white border-t border-gray-100 flex justify-between items-center">
                         <span className="text-sm font-semibold text-gray-800 line-clamp-1">{ad.title}</span>
                         <ExternalLink size={14} className="text-indigo-500 shrink-0" />
                      </div>
                   )}
                </div>
             </div>
         </div>
      )}

      {/* Embed Modal for Ads */}
      {viewingAd && (
         <EmbedModal
            title={`Quảng cáo: ${viewingAd.title || 'Thông tin chi tiết'}`}
            url={viewingAd.landingPageUrl}
            onClose={() => setViewingAd(null)}
         />
      )}
    </div>
  );
};

export default Home;