import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Package, Shield, ExternalLink, Download, PlayCircle, Monitor, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { ProductItem, ProductType } from '../types';
import EmbedModal from '../components/EmbedModal';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [purchasedProducts, setPurchasedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingItem, setViewingItem] = useState<ProductItem | null>(null);

  useEffect(() => {
    if (user && user.purchasedItems && user.purchasedItems.length > 0) {
      setLoading(true);
      // Fetch all products to match with purchased IDs
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
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-12">
      {/* User Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden text-white mb-8">
        <div className="px-8 py-10 flex flex-col md:flex-row items-center md:items-start md:justify-between">
          <div className="flex items-center mb-6 md:mb-0">
             <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-gray-700">
               {user.fullName.charAt(0)}
             </div>
             <div className="ml-6">
                <h1 className="text-3xl font-bold">{user.fullName}</h1>
                <p className="opacity-80 text-lg">@{user.username}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-yellow-500 text-yellow-900 text-xs rounded-full font-bold">
                  <Shield size={12} className="mr-1" />
                  {user.membership || 'Thành viên'}
                </div>
             </div>
          </div>
          <div className="text-right hidden md:block opacity-70">
            <p className="text-sm">Email đăng ký:</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div>
         <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center border-b pb-2">
           <Package size={24} className="mr-2 text-indigo-600" />
           Kho nội dung đã mua
         </h2>

         {loading ? (
           <div className="text-center py-12 text-gray-500">Đang tải dữ liệu của bạn...</div>
         ) : purchasedProducts.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {purchasedProducts.map((item) => (
               <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col">
                  {/* Card Image */}
                  <div className="h-40 overflow-hidden relative bg-gray-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg shadow-sm">
                      {item.type === ProductType.COURSE ? <BookOpen size={18} className="text-indigo-600"/> : <Monitor size={18} className="text-green-600"/>}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-grow flex flex-col">
                     <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                     <p className="text-gray-500 text-xs mb-4">Mã đơn hàng: {item.id}</p>
                     
                     <div className="mt-auto">
                        {item.contentLink ? (
                          <button 
                            onClick={() => handleAccessContent(item)}
                            className={`w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-bold text-white transition shadow-md ${
                              item.type === ProductType.COURSE 
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700' 
                                : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                            }`}
                          >
                            {item.type === ProductType.COURSE ? (
                              <><PlayCircle size={18} className="mr-2" /> Vào học ngay</>
                            ) : (
                              <><Download size={18} className="mr-2" /> Tải / Sử dụng</>
                            )}
                          </button>
                        ) : (
                          <button disabled className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                            Đang cập nhật link
                          </button>
                        )}
                     </div>
                  </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
             <Package size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500 text-lg">Bạn chưa mua sản phẩm nào.</p>
             <p className="text-gray-400 text-sm mt-2">
               Nếu đã thanh toán, hãy liên hệ Admin để kích hoạt.
             </p>
           </div>
         )}
      </div>

      {/* Support Section */}
      <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start">
         <div className="bg-blue-100 p-2 rounded-lg mr-4 text-blue-600">
           <Shield size={24} />
         </div>
         <div>
            <h3 className="font-bold text-blue-900 mb-1">Cần hỗ trợ?</h3>
            <p className="text-blue-800 text-sm">Nếu bạn đã thanh toán nhưng chưa thấy sản phẩm trong danh sách, hoặc gặp lỗi khi truy cập nội dung, vui lòng liên hệ Admin qua Zalo hoặc Facebook để được hỗ trợ.</p>
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