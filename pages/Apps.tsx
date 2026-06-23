import React, { useEffect, useState, useMemo } from 'react';
import { Info, Play, X, Users, Link as LinkIcon, Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AppItem } from '../types';
import EmbedModal from '../components/EmbedModal';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import SEO from '../components/common/SEO';

const ITEMS_PER_PAGE = 12;

const Apps: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [runningApp, setRunningApp] = useState<AppItem | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.getApps()
      .then(res => {
        if (res.success && res.data) {
          setApps(res.data);
          if (id) {
            const app = res.data.find((a: AppItem) => a.id === id);
            if (app) {
              if (app.mode === 'EMBED') {
                setRunningApp(app);
              } else {
                setSelectedApp(app);
              }
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filteredApps = useMemo(() => {
    if (!searchKeyword) return apps;
    return apps.filter(a =>
      a.title.toLowerCase().includes(searchKeyword) ||
      a.shortDesc.toLowerCase().includes(searchKeyword)
    );
  }, [apps, searchKeyword]);

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const currentApps = filteredApps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  const handleUseApp = (app: AppItem) => {
    navigate(`/apps/${app.id}`);
    if (app.mode === 'EMBED') {
      setRunningApp(app);
    } else {
      window.open(app.link, '_blank');
    }
  };

  const handleShowDetails = (app: AppItem) => {
    navigate(`/apps/${app.id}`);
    setSelectedApp(app);
  };

  const handleCloseModals = () => {
    setSelectedApp(null);
    setRunningApp(null);
    navigate('/apps');
  };

  const handleCopyLink = (appId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/apps/${appId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyingId(appId);
      setTimeout(() => setCopyingId(null), 2000);
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-3">
              <div className="skeleton h-40 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-3 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <SEO title="Kho Ứng Dụng" description="Tổng hợp các ứng dụng, công cụ tiện ích giúp tối ưu hiệu suất công việc." />

      <div className="flex items-center mb-6 border-l-4 border-teal-600 pl-4">
        <h1 className="text-2xl font-bold text-stone-900">Kho Ứng Dụng</h1>
      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Tìm kiếm ứng dụng theo tên hoặc mô tả..."
          onSearch={handleSearch}
        />
      </div>

      {filteredApps.length === 0 && searchKeyword && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg">Không tìm thấy ứng dụng nào phù hợp.</p>
          <p className="text-sm mt-2">Thử từ khóa khác.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentApps.map(app => (
          <div key={app.id} className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full border border-stone-100">
            <div className="relative h-44 overflow-hidden rounded-t-2xl group">
                <img src={app.imageUrl} alt={app.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                <button
                  onClick={() => handleCopyLink(app.id)}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md text-stone-600 hover:text-teal-600 hover:scale-110 transition-all z-10"
                  title="Sao chép liên kết trực tiếp"
                >
                  {copyingId === app.id ? <Check size={15} className="text-teal-600" /> : <LinkIcon size={15} />}
                </button>

                {app.usageCount && app.usageCount > 0 && (
                   <div className="absolute bottom-2 left-2 bg-stone-900/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                     <Users size={11} className="mr-1" />
                     {new Intl.NumberFormat('vi-VN').format(app.usageCount)} lượt dùng
                   </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-base font-bold text-stone-900 mb-1.5 line-clamp-1">{app.title}</h3>
              <p className="text-stone-500 text-sm mb-5 flex-grow line-clamp-3 leading-relaxed">{app.shortDesc}</p>

              <div className="grid grid-cols-2 gap-2.5 mt-auto">
                <button
                  onClick={() => handleShowDetails(app)}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-stone-100 text-stone-700 font-medium rounded-xl hover:bg-stone-200 transition text-sm"
                >
                  <Info size={15} />
                  <span>Chi tiết</span>
                </button>
                <button
                  onClick={() => handleUseApp(app)}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition text-sm shadow-[0_2px_8px_-2px_rgba(13,148,136,0.4)]"
                >
                  <Play size={15} />
                  <span>Sử dụng</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {/* Modal Details */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
             <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={handleCloseModals}></div>
             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

             <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                <div className="bg-white px-5 pt-5 pb-4 sm:p-6 sm:pb-4">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg leading-6 font-bold text-stone-900">
                        {selectedApp.title}
                      </h3>
                      <button onClick={handleCloseModals} className="text-stone-400 hover:text-stone-600 transition-colors">
                        <X size={22} />
                      </button>
                   </div>
                   <div className="mt-2 max-h-96 overflow-y-auto">
                      <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed">
                        {selectedApp.fullDesc}
                      </p>
                   </div>
                </div>
                <div className="bg-stone-50 px-5 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                   <button
                     type="button"
                     className="w-full inline-flex justify-center rounded-xl shadow-sm px-4 py-2.5 bg-teal-600 text-sm font-medium text-white hover:bg-teal-700 sm:ml-3 sm:w-auto transition-colors"
                     onClick={() => { setSelectedApp(null); handleUseApp(selectedApp); }}
                   >
                     Sử dụng ngay
                   </button>
                   <button
                     type="button"
                     className="mt-3 w-full inline-flex justify-center rounded-xl border border-stone-300 shadow-sm px-4 py-2.5 bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 sm:mt-0 sm:ml-3 sm:w-auto transition-colors"
                     onClick={handleCloseModals}
                   >
                     Đóng
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {runningApp && (
        <EmbedModal title={runningApp.title} url={runningApp.link} onClose={handleCloseModals} />
      )}
    </div>
  );
};

export default Apps;
