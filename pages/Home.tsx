import React, { useEffect, useState } from 'react';
import { Phone, ArrowRight, X, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { Config, AdItem } from '../types';
import { Link } from 'react-router-dom';
import EmbedModal from '../components/EmbedModal';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useInView } from '../hooks/useInView';

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Home: React.FC = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  const [ad, setAd] = useState<AdItem | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [viewingAd, setViewingAd] = useState<AdItem | null>(null);

  useEffect(() => {
    api.getConfig()
      .then((res) => {
        if (res.success && res.data) {
          setConfig(res.data);
        }
      })
      .finally(() => setLoading(false));

    api.getAds()
       .then(res => {
          if (res.success && res.data && res.data.length > 0) {
             const randomAd = res.data[Math.floor(Math.random() * res.data.length)];
             setAd(randomAd);
             setTimeout(() => setShowAd(true), 1500);
          }
       });
  }, []);

  const handleAdClick = () => {
     if (ad && ad.landingPageUrl) {
        setViewingAd(ad);
     }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <LoadingSpinner message="Đang tải dữ liệu..." />
    </div>
  );
  if (!config) return <div className="flex justify-center items-center h-[60vh] text-red-400 dark:text-red-400 text-sm">Không thể tải cấu hình.</div>;

  return (
    <div className="w-full pb-20">
      <SEO title="Trang chủ" description="Kho ứng dụng, khóa học và phần mềm chất lượng cao. Trợ lý ảo hỗ trợ tối ưu hiệu suất công việc." />

      {/* --- HERO --- */}
      <RevealSection>
        <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 md:pt-10 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">

            {/* Left: Text content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="inline-block py-1 px-3 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 text-stone-500 dark:text-stone-400 text-[11px] font-semibold tracking-widest uppercase mb-5 w-fit">
                {config.siteName || 'Trợ Lý Ảo Thầy Quân'}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.08] mb-5" style={{ textWrap: 'balance' }}>
                Xin chào, tôi là{' '}
                <span className="text-teal-600 dark:text-teal-400">
                  {config.name}
                </span>
              </h1>

              <p className="text-base md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed max-w-[50ch] mb-8">
                {config.bio}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {config.facebookUrl && (
                  <a href={config.facebookUrl} target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-200 active:scale-[0.98] shadow-[0_2px_10px_-2px_rgba(13,148,136,0.4)]">
                    Facebook
                  </a>
                )}
                {config.zaloUrl && (
                  <a href={config.zaloUrl} target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-200 active:scale-[0.98]">
                    Zalo
                  </a>
                )}
                {config.youtubeUrl && (
                  <a href={config.youtubeUrl} target="_blank" rel="noreferrer"
                     className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600 transition-all duration-200 active:scale-[0.98]">
                    Youtube
                  </a>
                )}
              </div>
            </div>

            {/* Right: Character Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-100/60 dark:bg-teal-900/30 rounded-[1.75rem] rotate-2 scale-95"></div>
                <img
                  src={config.avatarUrl || "https://res.cloudinary.com/dejnvixvn/image/upload/v1770181393/1_kfr9et.png"}
                  alt={config.name}
                  className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] rounded-[1.75rem] object-cover border border-stone-200/50 dark:border-stone-700/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* --- FEATURES: Asymmetric Bento Grid --- */}
      <RevealSection delay={100}>
        <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* Large card: Apps */}
            <Link
              to="/apps"
              className="group md:col-span-7 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div className="h-48 md:h-56 bg-gradient-to-br from-teal-50 via-stone-50 to-stone-100 dark:from-teal-950/40 dark:via-stone-900 dark:to-stone-800 flex items-center justify-center relative overflow-hidden">
                 <img
                    src="https://res.cloudinary.com/dejnvixvn/image/upload/v1770181393/4_vf8adl.png"
                    alt="Kho Ứng Dụng"
                    className="h-36 md:h-44 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-stone-950/60 to-transparent"></div>
              </div>
              <div className="p-6 md:p-7">
                 <h3 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">
                    Kho Ứng Dụng
                 </h3>
                 <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-5 max-w-[45ch]">
                    Các công cụ tiện ích, automation tool giúp tối ưu hiệu suất công việc.
                 </p>
                 <span className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                    Khám phá <ArrowRight size={15} strokeWidth={2} />
                 </span>
              </div>
            </Link>

            {/* Small card: Courses */}
            <Link
              to="/courses"
              className="group md:col-span-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div className="h-48 md:h-56 bg-gradient-to-br from-stone-100 to-stone-50 dark:from-stone-800 dark:to-stone-900 flex items-center justify-center relative overflow-hidden">
                 <img
                    src="https://res.cloudinary.com/dejnvixvn/image/upload/v1770181509/Thi%E1%BA%BFt_k%E1%BA%BF_ch%C6%B0a_c%C3%B3_t%C3%AAn_1_udeivy.png"
                    alt="Khóa Học Online"
                    className="h-36 md:h-44 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-stone-950/60 to-transparent"></div>
              </div>
              <div className="p-6 md:p-7">
                 <h3 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">
                    Khóa Học Online
                 </h3>
                 <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-5 max-w-[45ch]">
                    Chương trình đào tạo từ cơ bản đến nâng cao về lập trình và tư duy hệ thống.
                 </p>
                 <span className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                    Khám phá <ArrowRight size={15} strokeWidth={2} />
                 </span>
              </div>
            </Link>

            {/* Medium card: Software */}
            <Link
              to="/software"
              className="group md:col-span-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div className="h-48 md:h-56 bg-gradient-to-br from-teal-50/60 via-stone-50 to-stone-100 dark:from-teal-950/30 dark:via-stone-900 dark:to-stone-800 flex items-center justify-center relative overflow-hidden">
                 <img
                    src="https://res.cloudinary.com/dejnvixvn/image/upload/v1770181394/2_k12zbr.png"
                    alt="Phần Mềm Source"
                    className="h-36 md:h-44 object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-stone-950/60 to-transparent"></div>
              </div>
              <div className="p-6 md:p-7">
                 <h3 className="text-xl md:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2 tracking-tight">
                    Phần Mềm / Source
                 </h3>
                 <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-5 max-w-[45ch]">
                    Các phần mềm đóng gói, source code mẫu chất lượng cao sẵn sàng sử dụng.
                 </p>
                 <span className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold text-sm group-hover:gap-3 transition-all duration-200">
                    Khám phá <ArrowRight size={15} strokeWidth={2} />
                 </span>
              </div>
            </Link>

            {/* Wide card: Contact */}
            <div className="md:col-span-7 bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-800 rounded-2xl p-6 md:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Phone size={22} strokeWidth={1.5} />
                 </div>
                 <div>
                    <h3 className="text-base font-bold mb-0.5">Liên hệ hợp tác?</h3>
                    <p className="text-teal-100 text-sm">Tư vấn giải pháp phần mềm và tự động hóa.</p>
                 </div>
              </div>
              <div className="text-lg md:text-xl font-bold tracking-tight bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl">
                 {config.phone}
              </div>
            </div>

          </div>
        </section>
      </RevealSection>

      {/* --- ADS --- */}
      {showAd && ad && (
         <div className="fixed bottom-4 right-4 z-40 w-[300px] md:w-[320px]">
             <div className="bg-white dark:bg-stone-900 rounded-xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] border border-stone-200/60 dark:border-stone-700/60 overflow-hidden relative group">
                <button
                  onClick={() => setShowAd(false)}
                  className="absolute top-2 right-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full p-1 text-stone-500 dark:text-stone-400 z-10 transition-colors"
                  title="Đóng quảng cáo"
                >
                   <X size={14} />
                </button>

                <div onClick={handleAdClick} className="cursor-pointer">
                   <div className="absolute top-0 left-0 bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200 text-[10px] font-bold px-1.5 py-0.5 z-10 rounded-br-md">
                      Quảng cáo
                   </div>
                   <div className="w-full h-auto max-h-[250px] overflow-hidden bg-stone-100 dark:bg-stone-800">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title || "Quảng cáo"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                   </div>
                   {ad.title && (
                      <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                         <span className="text-sm font-medium text-stone-800 dark:text-stone-200 line-clamp-1">{ad.title}</span>
                         <ExternalLink size={14} className="text-stone-400 shrink-0" />
                      </div>
                   )}
                </div>
             </div>
         </div>
      )}

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
