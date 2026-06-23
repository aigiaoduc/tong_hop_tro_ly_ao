import React, { useEffect, useState, useMemo } from 'react';
import { ShoppingCart, Eye, CheckCircle, PlayCircle, Gift, Loader2, Users, Link as LinkIcon, Check } from 'lucide-react';
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

const ITEMS_PER_PAGE = 6;

const Courses: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [courses, setCourses] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useAuth();

  const [purchaseItem, setPurchaseItem] = useState<ProductItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ProductItem | null>(null);
  const [learningItem, setLearningItem] = useState<ProductItem | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authMessage, setAuthMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    api.getCourses()
      .then(res => {
        if (res.success && res.data) {
          setCourses(res.data);
          if (id) {
            const course = res.data.find((c: ProductItem) => c.id === id);
            if (course) setViewingItem(course);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const filteredCourses = useMemo(() => {
    if (!searchKeyword) return courses;
    return courses.filter(c =>
      c.title.toLowerCase().includes(searchKeyword) ||
      c.description.toLowerCase().includes(searchKeyword)
    );
  }, [courses, searchKeyword]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const currentCourses = filteredCourses.slice(
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

  const handlePurchase = (course: ProductItem) => {
    if (!user) {
      setAuthInitialMode('register');
      setAuthMessage('Bạn cần có tài khoản để mua khóa học này.');
      setShowAuthModal(true);
      return;
    }
    setPurchaseItem(course);
  };

  const handleFreeRegister = async (course: ProductItem) => {
     if (!user) {
        setAuthInitialMode('login');
        setAuthMessage('Đăng nhập ngay để nhận khóa học miễn phí.');
        setShowAuthModal(true);
        return;
     }

     setRegisteringId(course.id);
     try {
        const res = await api.registerFreeProduct(user.username, course.id);
        if (res.success && res.data) {
           updateUser({ ...user, purchasedItems: res.data });
           toast.success('Đăng ký thành công! Bạn có thể vào học ngay.');
        } else {
           toast.error(res.message || 'Đăng ký thất bại.');
        }
     } catch (e) {
        toast.error('Lỗi kết nối.');
     } finally {
        setRegisteringId(null);
     }
  };

  const isOwned = (courseId: string) => user?.purchasedItems?.includes(courseId);

  const handleShowIntro = (course: ProductItem) => {
    navigate(`/courses/${course.id}`);
    setViewingItem(course);
  };

  const handleCloseModals = () => {
    setViewingItem(null);
    setLearningItem(null);
    setPurchaseItem(null);
    navigate('/courses');
  };

  const handleCopyLink = (courseId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/courses/${courseId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyingId(courseId);
      setTimeout(() => setCopyingId(null), 2000);
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <LoadingSpinner message="Đang tải danh sách khóa học..." />
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
      <SEO title="Khóa học Trực tuyến" description="Chương trình đào tạo từ cơ bản đến nâng cao về lập trình và tư duy hệ thống." />

      <div className="flex items-center mb-6 border-l-4 border-teal-600 pl-4">
        <h1 className="text-2xl font-bold text-stone-900">Khóa học Trực tuyến</h1>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Tìm kiếm khóa học theo tên hoặc mô tả..." onSearch={handleSearch} />
      </div>

      {filteredCourses.length === 0 && searchKeyword && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg">Không tìm thấy khóa học nào phù hợp.</p>
          <p className="text-sm mt-2">Thử từ khóa khác.</p>
        </div>
      )}

      <div className="space-y-5">
        {currentCourses.map(course => {
          const owned = isOwned(course.id);
          const isFree = course.price === 0;

          return (
            <div key={course.id} className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row border border-stone-100 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] transition-all duration-300">
              <div className="md:w-1/3 aspect-video md:aspect-auto h-48 md:h-auto min-h-[200px] relative">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />

                <button
                  onClick={() => handleCopyLink(course.id)}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md text-stone-600 hover:text-teal-600 hover:scale-110 transition-all z-10"
                  title="Sao chép liên kết khóa học"
                >
                  {copyingId === course.id ? <Check size={15} className="text-teal-600" /> : <LinkIcon size={15} />}
                </button>

                {owned && (
                  <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow flex items-center">
                    <CheckCircle size={11} className="mr-1" /> Đã sở hữu
                  </div>
                )}
                {!owned && isFree && (
                  <div className="absolute bottom-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow flex items-center animate-pulse">
                    <Gift size={11} className="mr-1" /> Miễn phí
                  </div>
                )}

                {course.usageCount && course.usageCount > 0 && (
                   <div className="absolute bottom-2 left-2 bg-stone-900/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                     <Users size={11} className="mr-1" />
                     {new Intl.NumberFormat('vi-VN').format(course.usageCount)} học viên
                   </div>
                )}
              </div>
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{course.title}</h3>
                  <p className="text-stone-500 mb-4 text-justify leading-relaxed line-clamp-3">{course.description}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                  <span className={`text-2xl font-bold ${isFree ? 'text-teal-600' : 'text-teal-600'}`}>
                    {isFree
                        ? 'Miễn phí'
                        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)
                    }
                  </span>

                  <div className="flex space-x-2.5">
                    <button
                      onClick={() => handleShowIntro(course)}
                      className="flex items-center space-x-1.5 px-4 py-2 border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50 transition text-sm font-medium"
                    >
                      <Eye size={16} /> <span>Giới thiệu</span>
                    </button>

                    {owned ? (
                      <button
                        onClick={() => setLearningItem(course)}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition text-sm font-medium shadow-[0_2px_8px_-2px_rgba(13,148,136,0.4)]"
                      >
                        <PlayCircle size={16} /> <span>Vào học</span>
                      </button>
                    ) : isFree ? (
                      <button
                         onClick={() => handleFreeRegister(course)}
                         disabled={registeringId === course.id}
                         className="flex items-center space-x-1.5 px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition text-sm font-medium shadow-md disabled:opacity-70"
                      >
                         {registeringId === course.id ? <Loader2 size={16} className="animate-spin" /> : <Gift size={16} />}
                         <span>Đăng ký ngay</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(course)}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition text-sm font-medium shadow-[0_2px_8px_-2px_rgba(13,148,136,0.4)]"
                      >
                        <ShoppingCart size={16} /> <span>Mua ngay</span>
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

      {learningItem && (
        <EmbedModal title={`Đang học: ${learningItem.title}`} url={learningItem.contentLink} onClose={() => setLearningItem(null)} />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} initialMode={authInitialMode} message={authMessage} />
      )}
    </div>
  );
};

export default Courses;
