
import React, { useState } from 'react';
// Added Smartphone to the imports from lucide-react
import { Check, Star, Zap, MessageSquare, X, Copy, CheckCircle2, CreditCard, Smartphone } from 'lucide-react';
import { MEMBERSHIP_TIERS } from '../constants';

const Membership: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [username, setUsername] = useState('');

  const bankInfo = {
    bank: 'Vietcombank (VCB)',
    accountName: 'TRẦN HỒNG QUÂN',
    accountNumber: '1022936211',
    qrUrl: 'https://res.cloudinary.com/dejnvixvn/image/upload/v1763528268/z7240006634341_beff3d9a3b81b070647071be92b1ceb5_rf6neu.jpg'
  };

  const getTransferContent = () => {
    const cleanUser = username.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').toUpperCase();
    return `${cleanUser || 'TEN_CUA_BAN'}_khoungdungai`;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAction = (tierId: string) => {
    if (tierId === 'pro') setShowPaymentModal(true);
    else if (tierId === 'custom') setShowContactModal(true);
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-500 pb-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
          <Zap className="w-3 md:w-3.5 h-3 md:h-3.5" /> Đặc quyền hội viên
        </div>
        <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight">Nâng cấp <br className="sm:hidden" /><span className="gradient-text">Đặc quyền</span></h1>
        <p className="text-gray-400 text-sm md:text-xl font-normal leading-relaxed px-4">Mở khóa toàn bộ sức mạnh AI của Thầy Quân.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4 md:pt-8">
        {MEMBERSHIP_TIERS.map((tier) => (
          <div key={tier.id} className={`relative glass rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border-2 transition-all duration-500 flex flex-col ${tier.color} ${tier.recommended ? 'shadow-2xl shadow-indigo-500/10' : ''}`}>
            {tier.recommended && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] md:text-[10px] font-black px-4 md:px-5 py-2 rounded-full shadow-lg flex items-center gap-2 tracking-widest whitespace-nowrap uppercase"><Star className="w-3 md:w-3.5 h-3 md:h-3.5 fill-white" /> ƯA CHUỘNG</div>}
            <div className="mb-8 md:mb-10">
              <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight uppercase leading-tight">{tier.name}</h3>
              <div className="flex items-baseline gap-1"><span className="text-3xl md:text-4xl font-black text-white tracking-tighter">{tier.price}</span><span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{tier.period}</span></div>
            </div>
            <ul className="space-y-4 md:space-y-5 mb-10 md:mb-12 flex-grow">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 md:gap-4 text-gray-300 text-xs md:text-sm leading-snug"><div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-2.5 md:w-3 h-2.5 md:h-3 stroke-[3]" /></div><span>{feature}</span></li>
              ))}
            </ul>
            <button onClick={() => handleAction(tier.id)} className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${tier.recommended ? 'bg-indigo-600 text-white' : tier.id === 'custom' ? 'bg-fuchsia-600 text-white' : 'bg-white/5 text-white'}`}>{tier.id === 'custom' ? 'Zalo Đặt hàng' : tier.id === 'pro' ? 'Đăng ký ngay' : 'Dùng miễn phí'}</button>
          </div>
        ))}
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 py-6 overflow-y-auto no-scrollbar">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-[#0f172a] w-full max-w-4xl rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in duration-300">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 z-10 text-gray-400 hover:text-white bg-slate-900/50 p-2 rounded-full backdrop-blur-md"><X className="w-5 h-5" /></button>
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-[35%] bg-white p-8 md:p-10 flex flex-col items-center justify-center space-y-4 shrink-0">
                <img src={bankInfo.qrUrl} alt="QR" className="w-full max-w-[160px] md:max-w-[200px] rounded-xl shadow-2xl" />
                <p className="text-indigo-600 font-black text-[9px] md:text-[10px] tracking-widest uppercase text-center leading-relaxed">Quét mã bằng ứng dụng Ngân hàng</p>
              </div>
              <div className="lg:w-[65%] p-6 md:p-10 space-y-6 md:space-y-8">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Thủ tục kích hoạt</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="p-4 rounded-xl bg-[#1e293b] border border-white/5"><p className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase mb-1">Ngân hàng</p><p className="text-white text-[11px] md:text-xs font-black">{bankInfo.bank}</p></div>
                  <div className="p-4 rounded-xl bg-[#1e293b] border border-white/5 flex justify-between items-center"><div className="overflow-hidden min-w-0"><p className="text-[7px] md:text-[8px] text-gray-500 font-black uppercase mb-1">Số tài khoản</p><p className="text-white text-[11px] md:text-xs font-black truncate">{bankInfo.accountNumber}</p></div><button onClick={() => copyToClipboard(bankInfo.accountNumber, 'acc')} className="p-2 bg-white/5 rounded-lg shrink-0 ml-2">{copiedField === 'acc' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-500" />}</button></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2.5">Bước 1: Nhập Tên của bạn (KHÔNG DẤU)</p>
                    <input type="text" placeholder="VD: THAYQUAN" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#1e293b] border border-white/5 rounded-xl px-5 md:px-6 py-3.5 md:py-4 text-white font-black uppercase text-sm md:text-base outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2.5">Bước 2: Copy nội dung chuyển khoản</p>
                    <div className="flex items-center justify-between p-3.5 md:p-4 bg-indigo-600/10 border border-indigo-600/20 rounded-xl">
                      <code className="text-indigo-400 font-black tracking-[0.05em] md:tracking-widest text-base md:text-lg truncate">{getTransferContent()}</code>
                      <button onClick={() => copyToClipboard(getTransferContent(), 'nd')} className="bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg text-[8px] md:text-[9px] font-black uppercase shrink-0 ml-3">SAO CHÉP</button>
                    </div>
                  </div>
                </div>
                <a href="https://zalo.me/0355213107" target="_blank" className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-center text-white py-4 md:py-5 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"><Smartphone className="w-4 h-4" /> Báo đã chuyển (Zalo)</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          <div className="relative bg-[#0f172a] w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in zoom-in duration-300">
            <button onClick={() => setShowContactModal(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-fuchsia-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-fuchsia-600/20"><MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-white" /></div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Đặt hàng AI</h3>
              <p className="text-gray-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest leading-relaxed px-2">Kết bạn Zalo Thầy Quân để bắt đầu thiết kế App hoặc Website riêng.</p>
              <div className="bg-[#1e293b] p-5 md:p-6 rounded-2xl"><p className="text-gray-500 text-[8px] md:text-[9px] font-black uppercase mb-1">Số điện thoại Zalo</p><p className="text-fuchsia-400 text-xl md:text-2xl font-black tracking-[0.1em] md:tracking-widest">0355 213 107</p></div>
              <a href="https://zalo.me/0355213107" target="_blank" className="w-full block bg-fuchsia-600 text-white py-4 md:py-5 rounded-xl font-black uppercase text-xs md:text-sm tracking-widest shadow-xl active:scale-95 transition-all">Nhắn Zalo ngay</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;
