import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '../services/api';

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');

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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi phản hồi / Liên hệ</h2>
        
        {status === 'SUCCESS' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Cảm ơn bạn! Tin nhắn đã được gửi thành công.
          </div>
        )}

        {status === 'ERROR' && (
           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
             Có lỗi xảy ra. Vui lòng thử lại sau.
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên của bạn</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'SENDING'}
            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${status === 'SENDING' ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {status === 'SENDING' ? 'Đang gửi...' : <><Send size={18} className="mr-2" /> Gửi tin nhắn</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;