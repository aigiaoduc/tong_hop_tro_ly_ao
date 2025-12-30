import React from 'react';
import { LucideIcon, X, CheckCircle, Lock, AlertCircle, Copy, ChevronLeft, ChevronRight, ExternalLink, Heart, Search, Facebook, Phone } from 'lucide-react';

// --- BUTTONS ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', icon: Icon, children, className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-3 md:px-5 md:py-2.5 text-sm font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 touch-manipulation";
  const variants = {
    primary: "border-transparent text-white bg-primary hover:bg-blue-700 focus:ring-blue-500 shadow-blue-200 hover:shadow-blue-300 hover:shadow-lg",
    secondary: "border-transparent text-white bg-secondary hover:bg-blue-900 focus:ring-blue-500 shadow-blue-900/20",
    outline: "border-gray-200 text-slate-700 bg-white hover:bg-gray-50 hover:text-blue-600 focus:ring-blue-500 hover:border-blue-200",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-200",
    ghost: "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-none",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
};

// --- SEARCH INPUT ---
interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ placeholder = "Tìm kiếm...", value, onChange }) => {
  return (
    <div className="relative mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm text-base md:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

// --- PAGINATION ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-lg text-sm font-bold transition-all touch-manipulation ${
              currentPage === i
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {i}
          </button>
        );
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 md:mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 md:p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex space-x-1 md:space-x-2 overflow-x-auto pb-1 px-1 max-w-[200px] md:max-w-none no-scrollbar">
        {renderPageNumbers()}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 md:p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// --- CARDS ---
interface CardProps {
  image?: string;
  title: string;
  description: string;
  badges?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ image, title, description, badges, footer, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-2xl flex flex-col h-full transition-all duration-300 border border-slate-100 hover:border-blue-100 shadow-soft hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden active:scale-[0.98] md:active:scale-100 touch-manipulation"
      onClick={onClick}
    >
      {/* Image Container with Badges */}
      <div className="h-40 md:h-48 w-full overflow-hidden bg-slate-100 relative">
        {image ? (
          <>
             <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
             <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 transform rotate-12 translate-x-1/2 translate-y-1/2 scale-150 rounded-full blur-2xl"></div>
            <span className="text-white text-5xl font-extrabold relative z-10 shadow-sm">{title.charAt(0)}</span>
          </div>
        )}
        
        {/* Badges positioned top-right over the image */}
        {badges && (
           <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20 flex flex-col items-end gap-1">
             {badges}
           </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 md:px-5 md:py-5 flex-1 flex flex-col">
        {/* Title: Fixed height for ~3 lines */}
        <h3 
          className="text-base md:text-lg font-bold text-slate-800 line-clamp-3 leading-snug mb-2 group-hover:text-blue-600 transition-colors h-[4.5rem]" 
          title={title}
        >
          {title}
        </h3>
        
        {/* Description: Fixed height for ~3 lines */}
        <p 
          className="text-slate-500 text-sm line-clamp-3 leading-relaxed h-[3.75rem]"
          title={description}
        >
          {description}
        </p>
      </div>

      {footer && (
        <div className="px-4 py-3 md:px-6 md:py-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
          {footer}
        </div>
      )}
    </div>
  );
};

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "sm:max-w-lg" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-3 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle ${maxWidth} w-full border border-slate-100`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-5">
               <h3 className="text-lg md:text-xl leading-6 font-bold text-slate-800 pr-4" id="modal-title">{title}</h3>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors flex-shrink-0">
                 <X className="h-5 w-5" />
               </button>
            </div>
            <div className="mt-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP VIEWER (IFRAME) ---
interface AppViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const AppViewer: React.FC<AppViewerProps> = ({ isOpen, onClose, url, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900 flex flex-col h-screen w-screen overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-3 md:px-4 border-b border-slate-800 shadow-lg flex-shrink-0 gap-3">
         <div className="flex items-center gap-3 truncate min-w-0">
             <div className="bg-blue-600 p-1.5 rounded-lg flex-shrink-0">
                <ExternalLink className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-sm md:text-base truncate">{title}</span>
         </div>
         
         <div className="flex items-center gap-2 flex-shrink-0">
             <a 
               href="https://unghotacgia.netlify.app/" 
               target="_blank"
               rel="noreferrer"
               className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shadow-rose-900/20"
             >
                <Heart className="w-4 h-4 fill-current" /> <span className="hidden sm:inline">Ủng hộ tác giả</span>
             </a>

             <button 
               onClick={onClose} 
               className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
             >
                <X className="w-4 h-4" /> <span className="hidden sm:inline">Đóng</span>
             </button>
         </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 bg-slate-100 relative w-full h-full">
         <iframe 
           src={url} 
           title={title}
           className="w-full h-full border-0"
           allowFullScreen
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           // sandbox="allow-forms allow-scripts allow-same-origin allow-popups" // Bỏ comment nếu muốn bảo mật cao hơn nhưng có thể làm lỗi web nhúng
         />
      </div>
    </div>
  );
};

// --- PAYMENT INFO ---
interface PaymentInfoProps {
  bankName: string;
  bankNumber: string;
  amount: string;
  content: string;
  qrCodeUrl?: string;
  zalo?: string;
  facebook?: string;
}

export const PaymentInfo: React.FC<PaymentInfoProps> = ({ bankName, bankNumber, amount, content, qrCodeUrl, zalo, facebook }) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="bg-white border-2 border-dashed border-blue-200 rounded-xl p-4 md:p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-blue-50 rounded-bl-full z-0 opacity-50"></div>
      
      <div className="flex items-center space-x-2 text-blue-700 font-bold border-b border-blue-100 pb-3 mb-4 relative z-10">
         <div className="bg-blue-100 p-1.5 rounded-lg">
           <AlertCircle className="w-5 h-5" />
         </div>
         <span>Thông tin chuyển khoản</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative z-10 mb-6">
        {/* Left column: Text info */}
        <div className="flex-1 space-y-4 text-sm order-2 md:order-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Ngân hàng</span>
              <span className="font-semibold text-slate-900">{bankName}</span>
            </div>
            
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-500">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base md:text-lg text-blue-700">{bankNumber}</span>
                <button onClick={() => handleCopy(bankNumber)} className="text-slate-400 hover:text-blue-600 p-1" title="Sao chép">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Số tiền</span>
              <span className="font-bold text-lg md:text-xl text-red-600">{amount}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-xs uppercase tracking-wide">Nội dung chuyển khoản (Bắt buộc)</span>
              <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg border border-yellow-200 border-dashed">
                <span className="font-mono font-bold text-slate-900 break-all mr-2">{content}</span>
                 <button onClick={() => handleCopy(content)} className="text-yellow-600 hover:text-yellow-800 p-1 flex-shrink-0" title="Sao chép">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
        </div>

        {/* Right column: QR Code */}
        {qrCodeUrl && (
          <div className="w-full md:w-48 flex-shrink-0 flex flex-col items-center justify-center order-1 md:order-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
             <div className="aspect-square w-full max-w-[160px] md:max-w-none bg-white p-2 rounded-lg shadow-sm border border-slate-100">
               <img src={qrCodeUrl} alt="QR Code Ngân hàng" className="w-full h-full object-contain" />
             </div>
             <p className="text-xs text-slate-500 mt-2 text-center font-medium">Quét mã để thanh toán</p>
          </div>
        )}
      </div>

      {/* Confirmation Instructions */}
      <div className="bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-100 relative z-10">
        <p className="text-sm text-blue-800 mb-3 font-medium flex items-start gap-2">
           <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
           <span className="leading-snug">Sau khi chuyển khoản, vui lòng chụp màn hình và gửi qua Zalo/Facebook để được kích hoạt ngay.</span>
        </p>
        
        <div className="flex flex-wrap gap-2 md:gap-3">
          {zalo && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-100 shadow-sm text-sm text-slate-700 w-full md:w-auto">
               <div className="bg-blue-100 p-1 rounded-full flex-shrink-0"><Phone className="w-3 h-3 text-blue-600" /></div>
               <span className="font-bold flex-1 truncate">Zalo: {zalo}</span>
               <button onClick={() => handleCopy(zalo)} className="text-slate-400 hover:text-blue-600 ml-1 p-1" title="Sao chép">
                  <Copy className="w-3 h-3" />
               </button>
            </div>
          )}
          
          {facebook && (
             <a href={facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors w-full md:w-auto justify-center md:justify-start">
               <Facebook className="w-4 h-4" />
               Nhắn tin Facebook
             </a>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center relative z-10">
        <p className="text-xs text-slate-500 italic">
          Hệ thống sẽ tự động kích hoạt sau khi nhận được tiền (1-5 phút)
        </p>
      </div>
    </div>
  );
};