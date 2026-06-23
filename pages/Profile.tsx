import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Package, Shield, Download, PlayCircle, Monitor, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { ProductItem, ProductType } from '../types';
import EmbedModal from '../components/EmbedModal';
import SEO from '../components/common/SEO';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [purchasedProducts, setPurchasedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingItem, setViewingItem] = useState<ProductItem | null>(null);

  useEffect(() => {
    if (user && user.purchasedItems && user.purchasedItems.length > 0) {
      setLoading(true);
      Promise.all([api.getCourses(), api.getSoftware()])
        .then(([coursesRes, softwareRes]) => {
          const allProducts = [
            ...(coursesRes.data || []),
            ...(softwareRes.data || [])
          ];

          const owned = allProducts.filter(p => user.purchasedItems.includes(p.id));
          setPurchasedProducts(owned);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleAccessContent = (item: ProductItem) => {
    if (item.contentLink) {
      setViewingItem(item);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <SEO title="Tài khoản" description="Quản lý tài khoản và nội dung đã mua." />

      {/* User Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl shadow-lg overflow-hidden text-white mb-8">
        <div className="px-8 py-10 flex flex-col md:flex-row items-center md:items-start md:justify-between">
          <div className="flex items-center mb-6 md:mb-0">
             <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold border-2 border-white/30">
               {user.fullName.charAt(0)}
             </div>
             <div className="ml-6">
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <p className="opacity-80 text-sm mt-0.5">@{user.username}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-semibold">
                  <Shield size={12} className="mr-1" />
                  {user.membership || 'Thành viên'}
                </div>
             </div>
          </div>
          <div className="text-right hidden md:block opacity-80">
            <p className="text-xs text-teal-100">Email đăng ký</p>
            <p className="font-medium text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div>
         <h2 className="text-xl font-bold text-stone-900 mb-5 flex items-center">
           <Package size={20} className="mr-2 text-teal-600" />
           Kho nội dung đã mua
         </h2>

         {loading ? (
           <div className="flex justify-center items-center py-12">
             <div className="w-8 h-8 border-2 border-stone-200 border-t-teal-600 rounded-full animate-spin"></div>
           </div>
         ) : purchasedProducts.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
             {purchasedProducts.map((item) => (
               <div key={item.id} className="bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-stone-100 overflow-hidden hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col">
                  <div className="h-40 overflow-hidden relative bg-stone-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg shadow-sm">
                      {item.type === ProductType.COURSE ? <BookOpen size={16} className="text-teal-600"/> : <Monitor size={16} className="text-teal-600"/>}
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                     <h3 className="font-bold text-base text-stone-900 mb-1.5 line-clamp-2">{item.title}</h3>
                     <p className="text-stone-400 text-xs mb-4">Mã đơn hàng: {item.id}</p>

                     <div className="mt-auto">
                        {item.contentLink ? (
                          <button
                            onClick={() => handleAccessContent(item)}
                            className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 transition shadow-[0_2px_8px_-2px_rgba(13,148,136,0.4)]"
                          >
                            {item.type === ProductType.COURSE ? (
                              <><PlayCircle size={16} className="mr-2" /> Vào học ngay</>
                            ) : (
                              <><Download size={16} className="mr-2" /> Tải / Sử dụng</>
                            )}
                          </button>
                        ) : (
                          <button disabled className="w-full py-2.5 bg-stone-100 text-stone-400 rounded-xl text-sm font-medium cursor-not-allowed">
                            Đang cập nhật link
                          </button>
                        )}
                     </div>
                  </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="bg-stone-50 border border-stone-200 rounded-2xl p-10 text-center">
             <Package size={40} className="mx-auto text-stone-300 mb-3" />
             <p className="text-stone-500 text-base font-medium">Bạn chưa mua sản phẩm nào.</p>
             <p className="text-stone-400 text-sm mt-1">
               Nếu đã thanh toán, hãy liên hệ Admin để kích hoạt.
             </p>
           </div>
         )}
      </div>

      {/* Support Section */}
      <div className="mt-10 bg-teal-50 border border-teal-200 p-5 rounded-2xl flex items-start">
         <div className="bg-teal-100 p-2 rounded-xl mr-4 text-teal-600 shrink-0">
           <Shield size={20} />
         </div>
         <div>
            <h3 className="font-bold text-teal-900 mb-1 text-sm">Cần hỗ trợ?</h3>
            <p className="text-teal-700 text-sm leading-relaxed">Nếu bạn đã thanh toán nhưng chưa thấy sản phẩm trong danh sách, hoặc gặp lỗi khi truy cập nội dung, vui lòng liên hệ Admin qua Zalo hoặc Facebook để được hỗ trợ.</p>
         </div>
      </div>

      {/* Embed Viewer */}
      {viewingItem && (
        <EmbedModal
          title={viewingItem.type === ProductType.COURSE ? `Đang học: ${viewingItem.title}` : `Sử dụng: ${viewingItem.title}`}
          url={viewingItem.contentLink}
          onClose={() => setViewingItem(null)}
        />
      )}
    </div>
  );
};

export default Profile;
