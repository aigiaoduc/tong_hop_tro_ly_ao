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
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/95 flex flex-col">
      {/* Header Bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-stone-900 text-white border-b border-stone-800 shrink-0">
         <h3 className="font-medium text-sm md:text-base truncate pr-4 flex-grow">
           {title}
         </h3>

         <div className="flex items-center space-x-2.5">
            {/* Nút Ủng hộ */}
            <button
              onClick={handleSupport}
              className="flex items-center space-x-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 rounded-full text-xs font-medium transition-colors"
              title="Ủng hộ tác giả"
            >
              <Heart size={13} fill="white" />
              <span className="hidden md:inline">Ủng hộ Coffee</span>
            </button>

            {/* Nút Báo lỗi */}
            <button
              onClick={handleReportClick}
              className="flex items-center space-x-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded-full text-xs font-medium transition-colors"
              title="Báo lỗi / Liên hệ"
            >
              <MessageSquareWarning size={13} />
              <span className="hidden md:inline">Báo lỗi</span>
            </button>

            {/* Nút Đóng */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-stone-800 rounded-full transition-colors text-stone-400 hover:text-white"
            >
              <X size={22} />
            </button>
         </div>
      </div>

      {/* Iframe Content */}
      <div className="flex-grow w-full h-full relative bg-stone-950">
         {url ? (
            <iframe
               src={url}
               className="w-full h-full border-0"
               title={title}
               allowFullScreen
               allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; display-capture; document-domain; encrypted-media; fullscreen; geolocation; gyroscope; keyboard-map; magnetometer; microphone; midi; otp-credentials; picture-in-picture; publickey-credentials-get; screen-wake-lock; serial; speaker-selection; storage-access; usb; web-share; xr-spatial-tracking; clipboard-write; clipboard-read;"
            />
         ) : (
            <div className="flex items-center justify-center h-full text-stone-500 flex-col gap-2">
               <p className="text-sm">Chưa có liên kết nội dung.</p>
            </div>
         )}
      </div>

      {/* Internal Report Modal (Popup) */}
      {showReportModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-stone-900/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center bg-stone-50 px-5 py-3 border-b border-stone-100">
                    <h4 className="font-bold text-stone-800 flex items-center text-sm">
                        <MessageSquareWarning size={16} className="mr-2 text-red-500" />
                        Báo lỗi / Góp ý
                    </h4>
                    <button onClick={() => setShowReportModal(false)} className="text-stone-400 hover:text-stone-700 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5">
                    {status === 'SUCCESS' ? (
                        <div className="text-center py-6">
                            <p className="font-bold text-teal-600 text-lg mb-2">Đã gửi thành công!</p>
                            <p className="text-sm text-stone-500">Cảm ơn bạn đã phản hồi.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitReport} className="space-y-4">
                            {status === 'ERROR' && (
                                <div className="text-red-600 text-sm bg-red-50 p-2.5 rounded-lg border border-red-100">
                                    Lỗi kết nối. Vui lòng thử lại.
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-medium text-stone-700 mb-1">Tên của bạn</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-stone-700 mb-1">Email (để nhận phản hồi)</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-stone-700 mb-1">Chi tiết lỗi / Góp ý</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    placeholder="Mô tả vấn đề bạn đang gặp phải..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'SENDING'}
                                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-70"
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
