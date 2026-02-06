import React, { useEffect, useState } from 'react';
import { Info, Play, X, ChevronLeft, ChevronRight, Users, Link as LinkIcon, Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { AppItem } from '../types';
import EmbedModal from '../components/EmbedModal';

const ITEMS_PER_PAGE = 12;

const Apps: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null); // For Details Modal
  const [runningApp, setRunningApp] = useState<AppItem | null>(null);   // For Embed Modal
  const [copyingId, setCopyingId] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.getApps()
      .then(res => {
        if (res.success && res.data) {
          setApps(res.data);
          
          // Deep Linking: Auto-open app if ID exists in URL
          if (id) {
            const app = res.data.find((a: AppItem) => a.id === id);
            if (app) {
              // Decide whether to show info or run immediately
              // Most common case for sharing apps is to run them if EMBED
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
    navigate('/apps'); // Clear ID from URL
  };

  const handleCopyLink = (appId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/apps/${appId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyingId(appId);
      setTimeout(() => setCopyingId(null), 2000);
    });
  };

  // Pagination Logic
  const totalPages = Math.ceil(apps.length / ITEMS_PER_PAGE);
  const currentApps = apps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Đang tải danh sách ứng dụng...</div>;

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center mb-8 border-l-4 border-indigo-600 pl-4">
        <h1 className="text-2xl font-bold text-gray-800">Kho Ứng Dụng</h1>
      </div>
      
      {/* Grid expanded for larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentApps.map(app => (
          <div key={app.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
            <div className="relative h-48 overflow-hidden rounded-t-xl group">
                <img src={app.imageUrl} alt={app.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-opacity"></div>
                
                {/* Action buttons on hover for desktop, or static for mobile */}
                <button 
                  onClick={() => handleCopyLink(app.id)}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md text-gray-700 hover:text-indigo-600 hover:scale-110 transition-all z-10"
                  title="Sao chép liên kết trực tiếp"
                >
                  {copyingId === app.id ? <Check size={16} className="text-green-600" /> : <LinkIcon size={16} />}
                </button>

                {/* Usage Count Badge */}
                {app.usageCount && app.usageCount > 0 && (
                   <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                     <Users size={12} className="mr-1" />
                     {new Intl.NumberFormat('vi-VN').format(app.usageCount)} lượt dùng
                   </div>
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{app.title}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{app.shortDesc}</p>
              
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button 
                  onClick={() => handleShowDetails(app)}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  <Info size={16} />
                  <span>Chi tiết</span>
                </button>
                <button 
                  onClick={() => handleUseApp(app)}
                  className="flex items-center justify-center space-x-2 py-2 px-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition text-sm shadow-md hover:shadow-lg"
                >
                  <Play size={16} />
                  <span>Sử dụng</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2">
            <button 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
                <ChevronLeft size={20} className="text-gray-600"/>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-lg font-bold transition shadow-sm ${
                        currentPage === page 
                        ? 'bg-indigo-600 text-white border border-indigo-600' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            >
                <ChevronRight size={20} className="text-gray-600"/>
            </button>
        </div>
      )}

      {/* Modal Details (Thông tin mô tả) */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
             <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={handleCloseModals}></div>
             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
             
             <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg leading-6 font-bold text-gray-900">
                        {selectedApp.title}
                      </h3>
                      <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-500">
                        <X size={24} />
                      </button>
                   </div>
                   <div className="mt-2 max-h-96 overflow-y-auto">
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {selectedApp.fullDesc}
                      </p>
                   </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                   <button
                     type="button"
                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                     onClick={() => {
                        setSelectedApp(null);
                        handleUseApp(selectedApp);
                     }}
                   >
                     Sử dụng ngay
                   </button>
                   <button
                     type="button"
                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                     onClick={handleCloseModals}
                   >
                     Đóng
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Modal Embed (Chạy ứng dụng) */}
      {runningApp && (
        <EmbedModal 
          title={runningApp.title}
          url={runningApp.link}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};

export default Apps;