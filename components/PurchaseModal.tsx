import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ProductItem, Config } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface PurchaseModalProps {
  product: ProductItem;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ product, onClose }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    api.getConfig().then(res => {
      if (res.success) setConfig(res.data);
    });
  }, []);

  if (!config) return null;

  // Cú pháp: Username - Mã sản phẩm
  const transferContent = `${user?.username || 'GUEST'} - ${product.id}`;
  const encodedContent = encodeURIComponent(transferContent);
  
  // Ưu tiên dùng ảnh QR từ Config nếu có, nếu không thì dùng VietQR tự tạo
  const vietQrUrl = `https://img.vietqr.io/image/${config.bankName}-${config.bankAccountNo}-compact.jpg?amount=${product.price}&addInfo=${encodedContent}`;
  const qrDisplayUrl = config.qrImageUrl ? config.qrImageUrl : vietQrUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-indigo-600 px-4 py-3 sm:px-6 flex justify-between items-center">
             <h3 className="text-lg leading-6 font-bold text-white" id="modal-title">
                Thanh toán an toàn
             </h3>
             <button onClick={onClose} className="text-indigo-100 hover:text-white">
                <X size={24} />
             </button>
          </div>
          
          <div className="px-4 pt-5 pb-4 sm:p-6">
             <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Bạn đang mua gói:</p>
                  <p className="text-lg text-indigo-700 font-bold">{product.title}</p>
                  <p className="text-2xl text-red-600 font-bold mt-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
             </div>

             <div className="flex flex-col items-center mb-6">
                <div className="p-2 border-2 border-indigo-100 rounded-lg">
                  <img 
                    src={qrDisplayUrl} 
                    alt="QR Code" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 italic">Quét mã bằng App Ngân hàng</p>
             </div>

             <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                 <div className="flex justify-between">
                   <span className="text-gray-500">Ngân hàng:</span>
                   <span className="font-bold text-gray-800">{config.bankName}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">Số tài khoản:</span>
                   <span className="font-bold text-indigo-600 text-lg">{config.bankAccountNo}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">Chủ tài khoản:</span>
                   <span className="font-bold uppercase text-gray-800">{config.bankAccountName}</span>
                 </div>
                 <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-2">
                   <p className="text-xs text-yellow-800 mb-1">Nội dung chuyển khoản (Bắt buộc):</p>
                   <p className="font-mono font-bold text-red-600 text-base select-all bg-white px-2 py-1 rounded border border-yellow-300 text-center">
                     {transferContent}
                   </p>
                 </div>
             </div>

             <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Sau khi chuyển khoản, vui lòng liên hệ Admin để được kích hoạt ngay:
                </p>
                <div className="flex justify-center space-x-3">
                   {config.zaloUrl && (
                     <a href={config.zaloUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition">
                       Chat Zalo
                     </a>
                   )}
                   {config.facebookUrl && (
                     <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-700 text-white rounded-md text-sm font-medium hover:bg-blue-800 transition">
                       Chat Facebook
                     </a>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;