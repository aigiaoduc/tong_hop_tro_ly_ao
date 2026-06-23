import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/common/ToastContext';
import SEO from '../components/common/SEO';

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SENDING');

    try {
      const res = await api.submitFeedback(formData);
      if (res.success) {
        setStatus('SUCCESS');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('ERROR');
      }
    } catch (err) {
      setStatus('ERROR');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <SEO title="Liên hệ" description="Gửi phản hồi, góp ý hoặc liên hệ hợp tác với tôi." />

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_-6px_rgba(0,0,0,0.06)] p-8 border border-stone-100">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 tracking-tight">Gửi phản hồi / Liên hệ</h2>

        {status === 'SUCCESS' && (
          <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-xl mb-6 text-sm">
            Cảm ơn bạn! Tin nhắn đã được gửi thành công.
          </div>
        )}

        {status === 'ERROR' && (
           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
             Có lỗi xảy ra. Vui lòng thử lại sau.
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Họ tên của bạn</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white text-stone-900"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Email liên hệ</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white text-stone-900"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Nội dung</label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white text-stone-900 resize-none"
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'SENDING'}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-all duration-200 active:scale-[0.98] shadow-[0_2px_10px_-2px_rgba(13,148,136,0.4)] ${status === 'SENDING' ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {status === 'SENDING' ? 'Đang gửi...' : <><Send size={16} className="mr-2" /> Gửi tin nhắn</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
