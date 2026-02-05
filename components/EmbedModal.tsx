import React, { useState } from 'react';
import { X, Heart, MessageSquareWarning, Send } from 'lucide-react';
import { api } from '../services/api';

interface EmbedModalProps {
  title: string;
  url: string;
  onClose: () => void;
}

const EmbedModal: React.FC<EmbedModalProps> = ({ title, url, onClose }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  
  // State for Feedback Form
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSupport = () => {
    window.open('https://unghotacgia.netlify.app/', '_blank');
  };

  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');
    
    try {
      const res = await api.submitFeedback({
        ...formData,
        message: `[Báo lỗi từ: ${title}] ${formData.message}`
      });
      if (res.success) {
        setStatus('SUCCESS');
        setFormData({ name: '', email: '', message: '' });
        // Tự đóng sau 2 giây
        setTimeout(() => {
            setShowReportModal(false);
            setStatus('IDLE');
        }, 2000);
      } else {
        setStatus('ERROR');
      }
    } catch (err) {
      setStatus('ERROR');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-900 bg-opacity-95 flex flex-col">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-800 text-white shadow-md border-b border-gray-700 shrink-0">
         <h3 className="font-bold truncate pr-4 text-sm md:text-base flex-grow">
           {title}
         </h3>
         
         <div className="flex items-center space-x-3">
            {/* Nút Ủng hộ */}
            <button 
              onClick={handleSupport}
              className="flex items-center space-x-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 rounded-full text-xs font-bold transition-colors animate-pulse"
              title="Ủng hộ tác giả"
            >
              <Heart size={14} fill="white" />
              <span className="hidden md:inline">Ủng hộ Coffee</span>
            </button>

            {/* Nút Báo cáo */}
            <button 
              onClick={handleReportClick}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-full text-xs font-medium transition-colors"
              title="Báo lỗi / Liên hệ"
            >
              <MessageSquareWarning size={14} />
              <span className="hidden md:inline">Báo lỗi</span>
            </button>

            {/* Nút Đóng */}
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
         </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-grow w-full h-full relative bg-black">
         {url ? (
            <iframe 
               src={url} 
               className="w-full h-full border-0" 
               title={title}
               allowFullScreen
               sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
         ) : (
            <div className="flex items-center justify-center h-full text-gray-400 flex-col">
               <p>Chưa có liên kết nội dung.</p>
            </div>
         )}
      </div>

      {/* Internal Report Modal (Popup) */}
      {showReportModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-b">
                    <h4 className="font-bold text-gray-800 flex items-center">
                        <MessageSquareWarning size={18} className="mr-2 text-red-500" />
                        Báo lỗi / Góp ý
                    </h4>
                    <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-800">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-5">
                    {status === 'SUCCESS' ? (
                        <div className="text-center py-6 text-green-600">
                            <p className="font-bold text-lg mb-2">Đã gửi thành công!</p>
                            <p className="text-sm">Cảm ơn bạn đã phản hồi.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitReport} className="space-y-4">
                            {status === 'ERROR' && (
                                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                                    Lỗi kết nối. Vui lòng thử lại.
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Tên của bạn</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Email (để nhận phản hồi)</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Chi tiết lỗi / Góp ý</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    placeholder="Mô tả vấn đề bạn đang gặp phải..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'SENDING'}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-70"
                            >
                                {status === 'SENDING' ? 'Đang gửi...' : <><Send size={14} className="mr-2" /> Gửi báo cáo</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default EmbedModal;