import React, { useEffect, useState, useMemo } from 'react';
import { Eye, CheckCircle, Download, Gift, Loader2, Users, Link as LinkIcon, Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ProductItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/ToastContext';
import PurchaseModal from '../components/PurchaseModal';
import EmbedModal from '../components/EmbedModal';
import AuthModal from '../components/AuthModal';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ITEMS_PER_PAGE = 12;

const Software: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useAuth();

  const [purchaseItem, setPurchaseItem] = useState<ProductItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ProductItem | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authMessage, setAuthMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    api.getSoftware()
      .then(res => {
        if (res.success && res.data) {
          setItems(res.data);
          if (id) {
            const soft = res.data.find((s: ProductItem) => s.id === id);
            if (soft) setViewingItem(soft);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filteredItems = useMemo(() => {
    if (!searchKeyword) return items;
    return items.filter(s =>
      s.title.toLowerCase().includes(searchKeyword) ||
      s.description.toLowerCase().includes(searchKeyword)
    );
  }, [items, searchKeyword]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
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

  const handlePurchase = (item: ProductItem) => {
    if (!user) {
      setAuthInitialMode('register');
      setAuthMessage('Bạn cần có tài khoản để mua phần mềm này.');
      setShowAuthModal(true);
      return;
    }
    setPurchaseItem(item);
  };

  const handleFreeRegister = async (item: ProductItem) => {
     if (!user) {
        setAuthInitialMode('login');
        setAuthMessage('Đăng nhập ngay để tải phần mềm miễn phí.');
        setShowAuthModal(true);
        return;
     }

     setRegisteringId(item.id);
     try {
        const res = await api.registerFreeProduct(user.username, item.id);
        if (res.success && res.data) {
           updateUser({ ...user, purchasedItems: res.data });
           toast.success('Đăng ký thành công! Bạn có thể tải về ngay.');
        } else {
           toast.error(res.message || 'Đăng ký thất bại.');
        }
     } catch (e) {
        toast.error('Lỗi kết nối.');
     } finally {
        setRegisteringId(null);
     }
  };

  const isOwned = (itemId: string) => user?.purchasedItems?.includes(itemId);

  const handleShowIntro = (item: ProductItem) => {
    navigate(`/software/${item.id}`);
    setViewingItem(item);
  };

  const handleCloseModals = () => {
    setViewingItem(null);
    setPurchaseItem(null);
    navigate('/software');
  };

  const handleCopyLink = (itemId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/software/${itemId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyingId(itemId);
      setTimeout(() => setCopyingId(null), 2000);
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <LoadingSpinner message="Đang tải phần mềm..." />
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <SEO title="Phần mềm & Tool" description="Các phần mềm đóng gói, source code mẫu chất lượng cao sẵn sàng sử dụng." />

      <div className="flex items-center mb-6 border-l-4 border-teal-600 pl-4">
        <h1 className="text-2xl font-bold text-stone-900">Phần mềm & Tool</h1>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Tìm kiếm phần mềm theo tên hoặc mô tả..." onSearch={handleSearch} />
      </div>

      {filteredItems.length === 0 && searchKeyword && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg">Không tìm thấy phần mềm nào phù hợp.</p>
          <p className="text-sm mt-2">Thử từ khóa khác.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {currentItems.map(item => {
          const owned = isOwned(item.id);
          const isFree = item.price === 0;

          return (
            <div key={item.id} className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] flex flex-col border border-stone-100 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden h-full">
              <div className="relative h-44 w-full">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                  <button
                    onClick={() => handleCopyLink(item.id)}
                    className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md text-stone-600 hover:text-teal-600 hover:scale-110 transition-all z-10"
                    title="Sao chép liên kết phần mềm"
                  >
                    {copyingId === item.id ? <Check size={15} className="text-teal-600" /> : <LinkIcon size={15} />}
                  </button>

                  {owned && (
                    <div className="absolute top-2 left-2 text-teal-500 bg-white/90 rounded-full p-1 shadow-sm">
                      <CheckCircle size={18} fill="currentColor" className="text-white" />
                    </div>
                  )}
                  {isFree && !owned && (
                    <div className="absolute bottom-2 right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow animate-pulse">
                      Miễn phí
                    </div>
                  )}

                  {item.usageCount && item.usageCount > 0 && (
                     <div className="absolute bottom-2 left-2 text-white text-xs font-medium flex items-center bg-stone-900/60 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Users size={11} className="mr-1" />
                        {new Intl.NumberFormat('vi-VN').format(item.usageCount)} đã mua
                     </div>
                  )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-stone-900 mb-1.5 line-clamp-2">{item.title}</h3>
                  <p className="text-stone-500 text-sm mb-5 flex-grow line-clamp-3 leading-relaxed">{item.description}</p>

                  <div className="mt-auto pt-4 border-t border-stone-100">
                    <div className="flex items-end justify-between mb-4">
                      <span className="text-sm text-stone-400 font-medium">Giá trọn gói</span>
                      <span className={`text-xl font-bold ${isFree ? 'text-teal-600' : 'text-teal-600'}`}>
                          {isFree
                            ? 'Miễn phí'
                            : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)
                          }
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => handleShowIntro(item)}
                        className="flex justify-center items-center py-2 px-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                      >
                        <Eye size={15} className="mr-1" /> Giới thiệu
                      </button>

                      {owned ? (
                        <a
                          href={item.contentLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex justify-center items-center py-2 px-3 bg-teal-600 rounded-xl text-sm font-medium text-white hover:bg-teal-700 transition shadow-[0_2px_8px_-2px_rgba(13,148,136,0.4)]"
                        >
                          <Download size={15} className="mr-1" /> Tải về
                        </a>
                      ) : isFree ? (
                          <button
                            onClick={() => handleFreeRegister(item)}
                            disabled={registeringId === item.id}
                            className="flex justify-center items-center py-2 px-3 bg-pink-600 rounded-xl text-sm font-medium text-white hover:bg-pink-700 transition shadow-md disabled:opacity-70"
                          >
                            {registeringId === item.id ? <Loader2 size={15} className="animate-spin" /> : 'Nhận ngay'}
                          </button>
                      ) : (
                        <button
                          onClick={() => handlePurchase(item)}
                          className="flex justify-center items-center py-2 px-3 bg-teal-600 rounded-xl text-sm font-medium text-white hover:bg-teal-700 transition shadow-[0_2px_8px_-2px_rgba(13,148,136,0.4)]"
                        >
                          Mua ngay
                        </button>
                      )}
                    </div>
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      {purchaseItem && <PurchaseModal product={purchaseItem} onClose={handleCloseModals} />}

      {viewingItem && (
        <EmbedModal title={`Giới thiệu: ${viewingItem.title}`} url={viewingItem.landingPageUrl} onClose={handleCloseModals} />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} initialMode={authInitialMode} message={authMessage} />
      )}
    </div>
  );
};

export default Software;