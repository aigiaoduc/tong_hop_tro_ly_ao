import React, { useEffect, useState } from 'react';
import { ShoppingCart, Eye, CheckCircle, PlayCircle, ChevronLeft, ChevronRight, Gift, Loader2, Users, Link as LinkIcon, Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ProductItem } from '../types';
import { useAuth } from '../context/AuthContext';
import PurchaseModal from '../components/PurchaseModal';
import EmbedModal from '../components/EmbedModal';
import AuthModal from '../components/AuthModal';

const ITEMS_PER_PAGE = 6;

const Courses: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useAuth();
  
  const [purchaseItem, setPurchaseItem] = useState<ProductItem | null>(null);
  const [viewingItem, setViewingItem] = useState<ProductItem | null>(null);
  const [learningItem, setLearningItem] = useState<ProductItem | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authMessage, setAuthMessage] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.getCourses()
      .then(res => {
        if (res.success && res.data) {
          setCourses(res.data);
          
          // Deep Linking: Auto-open course intro if ID exists
          if (id) {
            const course = res.data.find((c: ProductItem) => c.id === id);
            if (course) {
              setViewingItem(course);
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

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

     if (!confirm(`Bạn muốn đăng ký miễn phí khóa học "${course.title}"?`)) return;

     setRegisteringId(course.id);
     try {
        const res = await api.registerFreeProduct(user.username, course.id);
        if (res.success && res.data) {
           updateUser({
              ...user,
              purchasedItems: res.data 
           });
           alert('Đăng ký thành công! Bạn có thể vào học ngay.');
        } else {
           alert(res.message || 'Đăng ký thất bại.');
        }
     } catch (e) {
        alert('Lỗi kết nối.');
     } finally {
        setRegisteringId(null);
     }
  };

  const isOwned = (courseId: string) => {
    return user?.purchasedItems?.includes(courseId);
  };

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

  // Pagination Logic
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const currentCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Đang tải khóa học...</div>;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center mb-8 border-l-4 border-indigo-600 pl-4">
        <h1 className="text-2xl font-bold text-gray-800">Khóa học Trực tuyến</h1>
      </div>
      
      <div className="space-y-6">
        {currentCourses.map(course => {
          const owned = isOwned(course.id);
          const isFree = course.price === 0;

          return (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100 hover:shadow-lg transition">
              <div className="md:w-1/3 h-48 md:h-64 relative">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                
                <button 
                  onClick={() => handleCopyLink(course.id)}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md text-gray-700 hover:text-indigo-600 hover:scale-110 transition-all z-10"
                  title="Sao chép liên kết khóa học"
                >
                  {copyingId === course.id ? <Check size={16} className="text-green-600" /> : <LinkIcon size={16} />}
                </button>

                {owned && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow flex items-center">
                    <CheckCircle size={12} className="mr-1" /> Đã sở hữu
                  </div>
                )}
                {!owned && isFree && (
                  <div className="absolute bottom-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow flex items-center animate-pulse">
                    <Gift size={12} className="mr-1" /> Miễn phí
                  </div>
                )}
                
                {/* Usage Count Badge */}
                {course.usageCount && course.usageCount > 0 && (
                   <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                     <Users size={12} className="mr-1" />
                     {new Intl.NumberFormat('vi-VN').format(course.usageCount)} học viên
                   </div>
                )}
              </div>
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 text-justify leading-relaxed line-clamp-3">{course.description}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className={`text-2xl font-bold ${isFree ? 'text-green-600' : 'text-indigo-600'}`}>
                    {isFree 
                        ? 'Miễn phí' 
                        : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)
                    }
                  </span>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleShowIntro(course)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                    >
                      <Eye size={18} /> <span>Giới thiệu</span>
                    </button>
                    
                    {owned ? (
                      <button 
                        onClick={() => setLearningItem(course)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md text-sm font-medium"
                      >
                        <PlayCircle size={18} /> <span>Vào học</span>
                      </button>
                    ) : isFree ? (
                      <button 
                         onClick={() => handleFreeRegister(course)}
                         disabled={registeringId === course.id}
                         className="flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition shadow-md text-sm font-medium disabled:opacity-70"
                      >
                         {registeringId === course.id ? <Loader2 size={18} className="animate-spin" /> : <Gift size={18} />} 
                         <span>Đăng ký ngay</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePurchase(course)}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md text-sm font-medium"
                      >
                        <ShoppingCart size={18} /> <span>Mua ngay</span>
                      </button>
                    )}
                  </div>
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

      {/* Modals */}
      {purchaseItem && <PurchaseModal product={purchaseItem} onClose={handleCloseModals} />}

      {viewingItem && (
        <EmbedModal 
          title={`Giới thiệu: ${viewingItem.title}`}
          url={viewingItem.landingPageUrl}
          onClose={handleCloseModals}
        />
      )}

      {learningItem && (
        <EmbedModal 
          title={`Đang học: ${learningItem.title}`}
          url={learningItem.contentLink}
          onClose={() => setLearningItem(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            initialMode={authInitialMode}
            message={authMessage}
        />
      )}
    </div>
  );
};

export default Courses;