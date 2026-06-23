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

  const transferContent = `${user?.username || 'GUEST'} - ${product.id}`;
  const encodedContent = encodeURIComponent(transferContent);

  const vietQrUrl = `https://img.vietqr.io/image/${config.bankName}-${config.bankAccountNo}-compact.jpg?amount=${product.price}&addInfo=${encodedContent}`;
  const qrDisplayUrl = config.qrImageUrl ? config.qrImageUrl : vietQrUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-stone-100">
          <div className="bg-stone-900 px-5 py-3.5 sm:px-6 flex justify-between items-center">
             <h3 className="text-base leading-6 font-bold text-white tracking-tight" id="modal-title">
                Thanh toán an toàn
             </h3>
             <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors">
                <X size={22} />
             </button>
          </div>

          <div className="px-5 pt-5 pb-5 sm:px-6">
             <div className="bg-stone-50 p-4 rounded-xl mb-4 text-center border border-stone-100">
                  <p className="text-xs text-stone-400 mb-1">Bạn đang mua gói:</p>
                  <p className="text-base text-stone-900 font-bold">{product.title}</p>
                  <p className="text-2xl text-teal-600 font-bold mt-2">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
             </div>

             <div className="flex flex-col items-center mb-5">
                <div className="p-2 border border-stone-200 rounded-xl bg-white">
                  <img
                    src={qrDisplayUrl}
                    alt="QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="mt-2 text-xs text-stone-400">Quét mã bằng App Ngân hàng</p>
             </div>

             <div className="space-y-3 text-sm border-t border-stone-100 pt-4">
                 <div className="flex justify-between">
                   <span className="text-stone-400">Ngân hàng:</span>
                   <span className="font-bold text-stone-900">{config.bankName}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-stone-400">Số tài khoản:</span>
                   <span className="font-bold text-stone-900">{config.bankAccountNo}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-stone-400">Chủ tài khoản:</span>
                   <span className="font-bold uppercase text-stone-900">{config.bankAccountName}</span>
                 </div>
                 <div className="bg-teal-50 p-3 rounded-xl border border-teal-200 mt-2">
                   <p className="text-xs text-teal-700 mb-1 font-medium">Nội dung chuyển khoản (Bắt buộc):</p>
                   <p className="font-mono font-bold text-stone-900 text-sm select-all bg-white px-3 py-2 rounded-lg border border-teal-200 text-center">
                     {transferContent}
                   </p>
                 </div>
             </div>

             <div className="mt-5 text-center">
                <p className="text-sm text-stone-500 mb-3">
                  Sau khi chuyển khoản, vui lòng liên hệ Admin để được kích hoạt ngay:
                </p>
                <div className="flex justify-center space-x-3">
                   {config.zaloUrl && (
                     <a href={config.zaloUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-all duration-200 active:scale-[0.98] shadow-[0_2px_8px_-2px_rgba(13,148,136,0.4)]">
                       Chat Zalo
                     </a>
                   )}
                   {config.facebookUrl && (
                     <a href={config.facebookUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-stone-800 text-white rounded-xl text-sm font-medium hover:bg-stone-900 transition-all duration-200 active:scale-[0.98]">
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
