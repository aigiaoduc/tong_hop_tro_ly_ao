import React, { useEffect, useState } from 'react';
import { ShoppingCart, Monitor, Eye, CheckCircle, Download, ChevronLeft, ChevronRight, Gift, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { ProductItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PurchaseModal from '../components/PurchaseModal';
import EmbedModal from '../components/EmbedModal';

const ITEMS_PER_PAGE = 12;

const Software: React.FC = () => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [purchaseItem, setPurchaseItem] = useState<ProductItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ProductItem | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.getSoftware()
      .then(res => {
        if (res.success && res.data) setItems(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = (item: ProductItem) => {
    if (!user) {
      // Chuyển hướng đến trang Login với state yêu cầu Đăng ký
      navigate('/login', { 
        state: { 
          mode: 'register', 
          message: 'Bạn cần đăng ký tài khoản để mua phần mềm này.' 
        } 
      });
      return;
    }
    setPurchaseItem(item);
  };

  const handleFreeRegister = async (item: ProductItem) => {
     if (!user) {
        navigate('/login', { 
          state: { 
            mode: 'login', 
            message: 'Bạn cần đăng nhập để tải phần mềm miễn phí.' 
          } 
        });
        return;
     }

     if (!confirm(`Bạn muốn đăng ký miễn phí "${item.title}"?`)) return;

     setRegisteringId(item.id);
     try {
        const res = await api.registerFreeProduct(user.username, item.id);
        if (res.success && res.data) {
           updateUser({
              ...user,
              purchasedItems: res.data 
           });
           alert('Đăng ký thành công! Bạn có thể tải về ngay.');
        } else {
           alert(res.message || 'Đăng ký thất bại.');
        }
     } catch (e) {
        alert('Lỗi kết nối.');
     } finally {
        setRegisteringId(null);
     }
  };

  const isOwned = (itemId: string) => {
    return user?.purchasedItems?.includes(itemId);
  };

  // Pagination Logic
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const currentItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Đang tải phần mềm...</div>;

  return (
    <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center mb-8 border-l-4 border-indigo-600 pl-4">
        <h1 className="text-2xl font-bold text-gray-800">Phần mềm & Tool</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentItems.map(item => {
          const owned = isOwned(item.id);
          const isFree = item.price === 0;

          return (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col border border-gray-100 hover:shadow-xl transition-all relative">
              {owned && (
                <div className="absolute top-4 right-4 text-green-500">
                   <CheckCircle size={24} fill="#e6fffa" />
                </div>
              )}
              {isFree && !owned && (
                <div className="absolute top-4 right-4 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow animate-pulse">
                   Miễn phí
                </div>
              )}

              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
                <Monitor size={28} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{item.description}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-end justify-between mb-4">
                   <span className="text-sm text-gray-500 font-medium">Giá trọn gói</span>
                   <span className={`text-xl font-bold ${isFree ? 'text-green-600' : 'text-indigo-600'}`}>
                      {isFree 
                        ? 'Miễn phí'
                        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)
                      }
                   </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => setViewingItem(item)}
                     className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                   >
                     <Eye size={16} className="mr-1" /> Giới thiệu
                   </button>
                   
                   {owned ? (
                     <a 
                       href={item.contentLink} 
                       target="_blank"
                       rel="noreferrer"
                       className="flex justify-center items-center py-2 px-4 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700 transition shadow-md"
                     >
                       <Download size={16} className="mr-1" /> Tải về
                     </a>
                   ) : isFree ? (
                      <button 
                         onClick={() => handleFreeRegister(item)}
                         disabled={registeringId === item.id}
                         className="flex justify-center items-center py-2 px-4 bg-pink-600 rounded-lg text-sm font-medium text-white hover:bg-pink-700 transition shadow-md disabled:opacity-70"
                      >
                         {registeringId === item.id ? <Loader2 size={16} className="animate-spin" /> : 'Nhận ngay'}
                      </button>
                   ) : (
                     <button 
                       onClick={() => handlePurchase(item)}
                       className="flex justify-center items-center py-2 px-4 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition shadow-md"
                     >
                       Mua ngay
                     </button>
                   )}
                </div>
              </div>
            </div>
          );
        })}
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

      {purchaseItem && <PurchaseModal product={purchaseItem} onClose={() => setPurchaseItem(null)} />}

      {viewingItem && (
        <EmbedModal 
          title={`Giới thiệu: ${viewingItem.title}`}
          url={viewingItem.landingPageUrl}
          onClose={() => setViewingItem(null)}
        />
      )}
    </div>
  );
};

export default Software;