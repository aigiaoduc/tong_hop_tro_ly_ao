import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, Download, User as UserIcon, LogIn, LogOut, Phone, Mail, Facebook, LayoutGrid, GraduationCap, Crown, AlertCircle, ChevronRight, Star, Lock, CheckCircle, Youtube, Calendar, CreditCard, Gift, PlayCircle, Share, PlusSquare } from 'lucide-react';

// Types & Services
import { AppItem, CourseItem, MembershipItem, User, ConfigMap } from './types';
import { fetchFreeApps, fetchPaidApps, fetchCourses, fetchMemberships, fetchConfig, authenticateUser } from './services/dataService';
import { IS_DEMO_MODE } from './config';

// Components
import { Button, Card, Modal, PaymentInfo, Pagination, AppViewer, SearchInput } from './components/Components';

const ITEMS_PER_PAGE = 12;

// --- SHARED UI ---
const PageHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ElementType }> = ({ title, subtitle, icon: Icon }) => (
  <div className="mb-6 md:mb-10 text-center md:text-left">
    <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 mb-2 md:mb-3">
      {Icon && (
        <div className="p-2 md:p-3 bg-white shadow-sm border border-slate-100 rounded-xl text-primary hidden md:block">
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      )}
      <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{title}</h1>
    </div>
    {subtitle && <p className="text-sm md:text-lg text-slate-500 max-w-2xl mx-auto md:mx-0 leading-relaxed px-4 md:px-0">{subtitle}</p>}
  </div>
);

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [freeApps, setFreeApps] = useState<AppItem[]>([]);
  const [paidApps, setPaidApps] = useState<AppItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [config, setConfig] = useState<ConfigMap>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [freeAppsData, paidAppsData, coursesData, membershipsData, configData] = await Promise.all([
        fetchFreeApps(),
        fetchPaidApps(),
        fetchCourses(),
        fetchMemberships(),
        fetchConfig()
      ]);
      setFreeApps(freeAppsData);
      setPaidApps(paidAppsData);
      setCourses(coursesData);
      setMemberships(membershipsData);
      setConfig(configData);
      
      // Check session
      const savedUser = localStorage.getItem('user_session');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setCurrentUser(parsedUser);
        } catch (e) {
          localStorage.removeItem('user_session');
        }
      }
      setLoading(false);
    };

    loadData();
  }, []);

  // PWA Installation Logic
  useEffect(() => {
    // Check if app is already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIOS && !isAppInstalled) {
      setShowIOSPrompt(true);
    } else if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    } else {
       // Fallback or if already installed/not supported
       if (!isAppInstalled) {
          alert("Trình duyệt của bạn không hỗ trợ cài đặt tự động. Hãy thử tìm trong menu cài đặt của trình duyệt.");
       }
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('user_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user_session');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Update site title from config or default
  const siteTitle = config['tieu_de_web'] || 'Kho Tài Nguyên Thầy Quân';

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Navbar 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          siteName={siteTitle} 
          onInstallClick={handleInstallClick}
          canInstall={!!deferredPrompt || (/iPad|iPhone|iPod/.test(navigator.userAgent) && !isAppInstalled)}
          isInstalled={isAppInstalled}
        />
        
        <main className="flex-grow container mx-auto px-4 py-6 md:py-12 max-w-7xl">
           {IS_DEMO_MODE && (
             <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 mb-8 rounded-r-lg shadow-sm flex items-start gap-3" role="alert">
               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="font-bold">Chế độ Demo</p>
                 <p className="text-sm mt-1">Dữ liệu đang được giả lập. Vui lòng cấu hình link Google Sheet trong file <code>config.ts</code>.</p>
               </div>
             </div>
           )}

           <Routes>
             <Route path="/" element={<FreeAppsPage apps={freeApps} />} />
             <Route path="/paid-apps" element={<PaidAppsPage apps={paidApps} currentUser={currentUser} />} />
             <Route path="/courses" element={<CoursesPage courses={courses} currentUser={currentUser} />} />
             <Route path="/membership" element={<MembershipPage memberships={memberships} />} />
             <Route path="/contact" element={<ContactPage config={config} />} />
             <Route path="/login" element={!currentUser ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
           </Routes>
        </main>

        <Footer config={config} />

        {/* iOS Install Instructions Modal */}
        <Modal isOpen={showIOSPrompt} onClose={() => setShowIOSPrompt(false)} title="Cài đặt trên iPhone/iPad">
           <div className="space-y-4">
              <p className="text-slate-600">Để cài đặt ứng dụng này lên màn hình chính, vui lòng làm theo các bước sau:</p>
              
              <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                    <Share className="w-6 h-6" />
                 </div>
                 <div>
                    <span className="font-bold text-slate-800 block">Bước 1</span>
                    <span className="text-sm text-slate-600">Nhấn vào nút <span className="font-bold">Chia sẻ</span> trên thanh công cụ của trình duyệt Safari.</span>
                 </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="bg-white p-2 rounded-lg shadow-sm text-slate-600">
                    <PlusSquare className="w-6 h-6" />
                 </div>
                 <div>
                    <span className="font-bold text-slate-800 block">Bước 2</span>
                    <span className="text-sm text-slate-600">Chọn mục <span className="font-bold">Thêm vào MH chính</span> (Add to Home Screen) trong danh sách.</span>
                 </div>
              </div>

               <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                    <span className="text-lg font-bold">Thêm</span>
                 </div>
                 <div>
                    <span className="font-bold text-slate-800 block">Bước 3</span>
                    <span className="text-sm text-slate-600">Nhấn nút <span className="font-bold">Thêm</span> ở góc trên bên phải để hoàn tất.</span>
                 </div>
              </div>
           </div>
           <div className="mt-6">
              <Button onClick={() => setShowIOSPrompt(false)} className="w-full">Đã hiểu</Button>
           </div>
        </Modal>
      </div>
    </Router>
  );
};

// --- NAVIGATION ---

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  siteName: string;
  onInstallClick: () => void;
  canInstall: boolean;
  isInstalled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, siteName, onInstallClick, canInstall, isInstalled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Miễn phí', icon: Gift },
    { path: '/paid-apps', label: 'Thu phí', icon: Crown },
    { path: '/courses', label: 'Khóa học', icon: GraduationCap },
    { path: '/membership', label: 'Thành viên', icon: UserIcon },
    { path: '/contact', label: 'Liên hệ', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path 
    ? 'bg-blue-600 text-white shadow-md' 
    : 'text-slate-200 hover:bg-white/10 hover:text-white';

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg sticky top-0 z-40 backdrop-blur-lg bg-opacity-95 supports-[backdrop-filter]:bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 md:h-24">
          <div className="flex items-center">
            <Link to="/" className="font-extrabold text-lg md:text-2xl tracking-tight flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity truncate max-w-[250px] md:max-w-none">
               <img 
                 src="https://res.cloudinary.com/dejnvixvn/image/upload/v1765713021/16_wo3yjv.png" 
                 alt="Logo" 
                 className="h-12 md:h-20 w-auto object-contain flex-shrink-0"
               />
               <span className="truncate">{siteName}</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isActive(link.path)}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {/* Install Button (Desktop) */}
            {canInstall && !isInstalled && (
               <button 
                 onClick={onInstallClick}
                 className="ml-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-white/30 hover:bg-white/10 transition-colors flex items-center gap-2"
               >
                 <Download className="w-4 h-4" />
                 Cài đặt App
               </button>
            )}
            
            <div className="ml-6 pl-6 border-l border-white/20 h-10 flex items-center relative" ref={profileRef}>
               {currentUser ? (
                 <div className="relative">
                   <div 
                      className="flex items-center gap-4 group cursor-pointer"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                   >
                      <div className="text-right">
                         <p className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Thành viên</p>
                         <p className="text-base font-bold text-white group-hover:text-blue-100 transition-colors flex items-center gap-1">
                           {currentUser.fullName} <ChevronRight className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-90' : ''}`} />
                         </p>
                      </div>
                      <div className="bg-white/10 p-2 rounded-full border border-white/10 group-hover:bg-white/20">
                         <UserIcon className="w-5 h-5" />
                      </div>
                   </div>

                   {/* User Profile Dropdown */}
                   {isProfileOpen && (
                     <div className="absolute right-0 mt-3 w-72 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 py-4 px-5 z-50 transform origin-top-right transition-all">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                            {currentUser.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-lg leading-tight">{currentUser.fullName}</p>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              {currentUser.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                           <div className="flex items-center gap-3 text-sm text-slate-600">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span>Hết hạn: <span className="font-semibold text-slate-900">{currentUser.expiryDate}</span></span>
                           </div>
                           <div className="flex items-center gap-3 text-sm text-slate-600">
                              <CreditCard className="w-4 h-4 text-slate-400" />
                              <span>Gói: <span className="font-semibold text-slate-900">VIP Member</span></span>
                           </div>
                        </div>

                        <Button 
                          variant="danger" 
                          onClick={onLogout} 
                          className="w-full justify-center py-2 text-sm"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                        </Button>
                     </div>
                   )}
                 </div>
               ) : (
                 <Link to="/login">
                   <Button variant="secondary" className="bg-blue-900/50 hover:bg-blue-900 text-white border border-blue-400/30 shadow-lg font-bold px-6 py-3">
                      <LogIn className="w-5 h-5 mr-2" />
                      Đăng nhập
                   </Button>
                 </Link>
               )}
            </div>
          </div>

          {/* Mobile Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white hover:bg-white/10 focus:outline-none p-2 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-2xl z-50 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-4 rounded-xl text-base font-medium flex items-center gap-3 transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}

            {/* Install Button (Mobile) */}
            {canInstall && !isInstalled && (
               <button 
                 onClick={() => {
                   onInstallClick();
                   setIsOpen(false);
                 }}
                 className="w-full text-left block px-5 py-4 rounded-xl text-base font-medium flex items-center gap-3 transition-colors text-slate-300 hover:bg-white/5 hover:text-white"
               >
                 <Download className="w-5 h-5" />
                 Cài đặt Ứng dụng
               </button>
            )}

             <div className="border-t border-slate-700 mt-4 pt-4">
               {currentUser ? (
                  <div className="text-white bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                           {currentUser.fullName.charAt(0)}
                         </div>
                         <div>
                            <p className="text-xs text-slate-400">Xin chào</p>
                            <p className="font-bold text-base">{currentUser.fullName}</p>
                         </div>
                      </div>
                      <div className="text-sm text-slate-400 mb-4 pl-1">
                        Hết hạn: <span className="text-white">{currentUser.expiryDate}</span>
                      </div>
                      <Button onClick={onLogout} variant="danger" className="w-full justify-center">
                         <LogOut className="w-5 h-5 mr-2" /> Đăng xuất
                      </Button>
                  </div>
               ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full">
                    <Button variant="secondary" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold justify-center py-3.5 text-base">
                       <LogIn className="w-5 h-5 mr-2" /> Đăng nhập
                    </Button>
                  </Link>
               )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- PAGES ---

// 1. FREE APPS PAGE
const FreeAppsPage: React.FC<{ apps: AppItem[] }> = ({ apps }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingApp, setViewingApp] = useState<AppItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter logic
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentApps = filteredApps.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAppClick = (app: AppItem) => {
    if (app.openMode === 'iframe') {
      setViewingApp(app);
    } else {
      window.open(app.link, '_blank');
    }
  };

  return (
    <div>
      <PageHeader 
        title="Ứng Dụng Miễn Phí" 
        subtitle="Các công cụ hữu ích dành tặng cộng đồng giáo viên."
        icon={Gift}
      />

      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Tìm kiếm ứng dụng miễn phí..." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
         {currentApps.map(app => (
            <Card 
               key={app.id}
               title={app.name}
               description={app.description}
               image={app.imageUrl}
               badges={
                 <span className="px-3 py-1 text-xs font-bold bg-emerald-600 text-white shadow-lg rounded-lg backdrop-blur-sm border border-white/20">
                   Miễn phí
                 </span>
               }
               onClick={() => handleAppClick(app)}
               footer={<Button variant="outline" className="w-full text-sm">Mở ứng dụng <ChevronRight className="w-4 h-4 ml-1"/></Button>}
            />
         ))}
         {filteredApps.length === 0 && (
           <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
             <div className="text-slate-400 mb-2">Không tìm thấy kết quả nào cho "{searchTerm}".</div>
           </div>
         )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {viewingApp && (
        <AppViewer 
          isOpen={!!viewingApp}
          onClose={() => setViewingApp(null)}
          url={viewingApp.link}
          title={viewingApp.name}
        />
      )}
    </div>
  );
};

// 2. PAID APPS PAGE
const PaidAppsPage: React.FC<{ apps: AppItem[]; currentUser: User | null }> = ({ apps, currentUser }) => {
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null); // For Payment Modal
  const [viewingApp, setViewingApp] = useState<AppItem | null>(null); // For Iframe Viewer
  const [showPaywall, setShowPaywall] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter logic
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentApps = filteredApps.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAppClick = (app: AppItem) => {
    if (currentUser) {
      if (app.openMode === 'iframe') {
        setViewingApp(app);
      } else {
        window.open(app.link, '_blank');
      }
    } else {
      setSelectedApp(app);
      setShowPaywall(true);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Ứng Dụng Thu Phí" 
        subtitle="Các phần mềm chuyên sâu, tính năng cao cấp dành cho thành viên VIP."
        icon={Crown}
      />

      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Tìm kiếm ứng dụng thu phí..." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
         {currentApps.map(app => (
            <Card 
               key={app.id}
               title={app.name}
               description={app.description}
               image={app.imageUrl}
               badges={
                 <span className="px-3 py-1 text-xs font-bold bg-amber-500 text-white shadow-lg rounded-lg flex items-center gap-1 backdrop-blur-sm border border-white/20">
                   <Crown className="w-3 h-3 fill-current"/> VIP
                 </span>
               }
               onClick={() => handleAppClick(app)}
               footer={
                 <Button variant={currentUser ? "primary" : "secondary"} className={`w-full text-sm group ${!currentUser ? "opacity-90" : ""}`}>
                   {currentUser ? "Mở ứng dụng" : "Mở khóa ngay"}
                   {currentUser && <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"/>}
                   {!currentUser && <Lock className="w-3 h-3 ml-2"/>}
                 </Button>
               }
            />
         ))}
         {filteredApps.length === 0 && (
           <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
             <div className="text-slate-400 mb-2">Không tìm thấy kết quả nào cho "{searchTerm}".</div>
           </div>
         )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Paywall Modal */}
      <Modal isOpen={showPaywall} onClose={() => setShowPaywall(false)} title="Quyền truy cập VIP">
         <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6 relative">
               <div className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-20"></div>
               <Lock className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Chưa kích hoạt thành viên</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed text-sm md:text-base">
               Ứng dụng <b>{selectedApp?.name}</b> chỉ dành cho thành viên VIP. Vui lòng đăng ký để mở khóa toàn bộ kho ứng dụng.
            </p>
            <div className="flex flex-col gap-3">
               <Link to="/membership" className="w-full">
                  <Button variant="primary" className="w-full py-3 text-base shadow-lg shadow-blue-200">Xem các gói thành viên</Button>
               </Link>
               <Link to="/login" className="w-full">
                  <Button variant="ghost" className="w-full">Đăng nhập nếu đã có tài khoản</Button>
               </Link>
            </div>
         </div>
      </Modal>

      {/* App Viewer Iframe */}
      {viewingApp && (
        <AppViewer 
          isOpen={!!viewingApp}
          onClose={() => setViewingApp(null)}
          url={viewingApp.link}
          title={viewingApp.name}
        />
      )}
    </div>
  );
};

// 3. COURSES PAGE
const CoursesPage: React.FC<{ courses: CourseItem[]; currentUser: User | null }> = ({ courses, currentUser }) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null); // For Payment Modal
  const [viewingCourse, setViewingCourse] = useState<CourseItem | null>(null); // For Iframe Viewer
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter logic
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Helper to check if a course is free (0đ, 0, Miễn phí)
  const isFree = (price: string) => {
    if (!price) return false;
    const p = price.toLowerCase().replace(/\s/g, ''); // Remove spaces
    return p === '0' || p === '0đ' || p === '0vnd' || p === '0vnđ' || p === 'miễnphí' || p === 'free';
  };

  const isCourseOwned = (course: CourseItem) => {
    // Always return true if course is free
    if (isFree(course.price)) return true;

    if (!currentUser) return false;
    if (currentUser.purchasedCourseIds.includes('ALL')) return true;
    return currentUser.purchasedCourseIds.includes(course.id);
  };

  const handleCourseClick = (course: CourseItem) => {
    if (isCourseOwned(course)) {
      if (course.contentLink) {
        if (course.openMode === 'iframe') {
          setViewingCourse(course);
        } else {
          window.open(course.contentLink, '_blank');
        }
      } else {
        alert("Khóa học này đang được cập nhật nội dung.");
      }
    } else {
      setSelectedCourse(course);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Khóa Học Nổi Bật" 
        subtitle="Nâng cao kỹ năng với các khóa học thực chiến, được thiết kế chuyên biệt cho công việc giảng dạy."
        icon={GraduationCap}
      />

      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Tìm kiếm khóa học..." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {currentCourses.map(course => {
          const owned = isCourseOwned(course);
          const isFreeCourse = isFree(course.price);

          return (
            <Card 
              key={course.id}
              title={course.name}
              description={course.description}
              image={course.imageUrl}
              badges={
                owned ? (
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1 backdrop-blur-sm border border-white/20 ${isFreeCourse ? 'bg-emerald-600 text-white' : 'bg-green-600 text-white'}`}>
                    {isFreeCourse ? (
                       <>Miễn phí</>
                    ) : (
                       <><CheckCircle className="w-4 h-4" /> Đã sở hữu</>
                    )}
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-bold bg-blue-600 text-white rounded-lg shadow-lg backdrop-blur-sm border border-white/20">{course.price}</span>
                )
              }
              onClick={() => handleCourseClick(course)}
              footer={
                <Button variant={owned ? "primary" : "outline"} className={`w-full group ${owned ? "bg-green-600 hover:bg-green-700 shadow-green-200" : ""}`}>
                  {owned ? "Vào học ngay" : "Đăng ký khóa học"} 
                  {owned ? (
                    <PlayCircle className="w-4 h-4 ml-1 group-hover:scale-110 transition-transform"/>
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"/>
                  )}
                </Button>
              }
            />
          );
        })}
         {filteredCourses.length === 0 && (
           <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
             <div className="text-slate-400 mb-2">Không tìm thấy kết quả nào cho "{searchTerm}".</div>
           </div>
         )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Payment Modal */}
      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title="Đăng ký khóa học" maxWidth="sm:max-w-2xl">
         {selectedCourse && (
            <div className="space-y-4 md:space-y-6">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Khóa học</p>
                  <p className="font-bold text-slate-900 text-base md:text-lg">{selectedCourse.name}</p>
               </div>
               
               <PaymentInfo 
                  bankName={selectedCourse.bankName}
                  bankNumber={selectedCourse.bankNumber}
                  amount={selectedCourse.price}
                  content={selectedCourse.transferContent}
                  qrCodeUrl={selectedCourse.qrCodeUrl}
                  zalo={selectedCourse.zalo}
                  facebook={selectedCourse.facebook}
               />
            </div>
         )}
      </Modal>

       {/* Course Viewer Iframe */}
       {viewingCourse && viewingCourse.contentLink && (
        <AppViewer 
          isOpen={!!viewingCourse}
          onClose={() => setViewingCourse(null)}
          url={viewingCourse.contentLink}
          title={viewingCourse.name}
        />
      )}
    </div>
  );
};

// 4. MEMBERSHIP PAGE
const MembershipPage: React.FC<{ memberships: MembershipItem[] }> = ({ memberships }) => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10 md:mb-16 relative px-4">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20 -z-10"></div>
         <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 md:mb-6 tracking-tight">Nâng cấp tài khoản</h2>
         <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">Truy cập không giới hạn vào kho ứng dụng và tài nguyên giáo dục chất lượng cao.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center justify-center max-w-4xl mx-auto">
        {memberships.map((plan, index) => {
          // Use isPopular property directly
          const isHighlight = plan.isPopular;
          
          return (
           <div 
             key={plan.id} 
             className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col h-full ${isHighlight ? 'ring-4 ring-blue-500 shadow-2xl scale-105 z-10' : 'border border-slate-200 shadow-xl hover:-translate-y-2'}`}
             onClick={() => setSelectedPlan(plan)}
           >
              {isHighlight && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-bold tracking-wider uppercase">
                   Phổ biến nhất
                </div>
              )}
              <div className="p-6 md:p-10 flex-1 flex flex-col">
                 <h3 className="text-xl md:text-2xl font-bold text-slate-800">{plan.name}</h3>
                 <div className="mt-4 md:mt-6 flex items-baseline text-slate-900">
                    <span className="text-3xl md:text-5xl font-extrabold tracking-tight text-blue-600">{plan.price}</span>
                 </div>
                 <p className="mt-4 md:mt-6 text-slate-500 leading-relaxed flex-1 text-sm md:text-base">{plan.description}</p>
                 
                 <ul className="mt-6 md:mt-8 space-y-3 md:space-y-4 mb-6 md:mb-8">
                    {plan.benefits && plan.benefits.length > 0 ? (
                      plan.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-slate-600 text-sm md:text-base">
                           <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                           <span>{benefit}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-center text-slate-600 italic text-sm">Đang cập nhật quyền lợi...</li>
                    )}
                 </ul>

                 <Button 
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); }} 
                    className={`w-full py-3 md:py-4 text-base md:text-lg rounded-xl shadow-lg ${isHighlight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-900'}`} 
                    variant={isHighlight ? "primary" : "secondary"}
                  >
                    Đăng ký ngay
                 </Button>
              </div>
           </div>
          );
        })}
      </div>

      <Modal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} title="Thông tin thanh toán" maxWidth="sm:max-w-2xl">
         {selectedPlan && (
            <div className="space-y-4 md:space-y-6">
               <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-1">Gói được chọn</p>
                  <p className="font-extrabold text-slate-900 text-xl md:text-2xl">{selectedPlan.name}</p>
               </div>
               
               <PaymentInfo 
                  bankName={selectedPlan.bankName}
                  bankNumber={selectedPlan.bankNumber}
                  amount={selectedPlan.price}
                  content={selectedPlan.transferContent}
                  qrCodeUrl={selectedPlan.qrCodeUrl}
                  zalo={selectedPlan.zalo}
                  facebook={selectedPlan.facebook}
               />
            </div>
         )}
      </Modal>
    </div>
  );
};

// 5. CONTACT PAGE
const ContactPage: React.FC<{ config: ConfigMap }> = ({ config }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader 
        title="Liên Hệ Hỗ Trợ" 
        subtitle="Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn."
      />
      
      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-xl border border-slate-100">
         <div className="space-y-6 md:space-y-8">
            {config['email'] && (
              <div className="flex items-start gap-4 md:gap-5 p-3 md:p-4 rounded-xl hover:bg-slate-50 transition-colors">
                 <div className="bg-blue-100 p-3 rounded-full text-blue-600 shadow-sm flex-shrink-0"><Mail className="w-5 h-5 md:w-6 md:h-6"/></div>
                 <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1">Email</h4>
                    <a href={`mailto:${config['email']}`} className="text-blue-600 hover:text-blue-700 font-medium text-base md:text-lg break-all">{config['email']}</a>
                    <p className="text-slate-400 text-xs md:text-sm mt-1">Gửi mail cho chúng tôi bất cứ lúc nào</p>
                 </div>
              </div>
            )}

            {config['so_dien_thoai'] && (
              <div className="flex items-start gap-4 md:gap-5 p-3 md:p-4 rounded-xl hover:bg-slate-50 transition-colors">
                 <div className="bg-green-100 p-3 rounded-full text-green-600 shadow-sm flex-shrink-0"><Phone className="w-5 h-5 md:w-6 md:h-6"/></div>
                 <div>
                    <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1">Điện thoại / Zalo</h4>
                    <a href={`tel:${config['so_dien_thoai']}`} className="text-blue-600 hover:text-blue-700 font-medium text-base md:text-lg">{config['so_dien_thoai']}</a>
                    <p className="text-slate-400 text-xs md:text-sm mt-1">Hỗ trợ trong giờ hành chính</p>
                 </div>
              </div>
            )}

            {config['facebook'] && (
              <div className="flex items-start gap-4 md:gap-5 p-3 md:p-4 rounded-xl hover:bg-slate-50 transition-colors">
                 <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 shadow-sm flex-shrink-0"><Facebook className="w-5 h-5 md:w-6 md:h-6"/></div>
                 <div>
                    <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1">Facebook</h4>
                    <a href={config['facebook']} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">Nhắn tin qua Fanpage</a>
                    <p className="text-slate-400 text-xs md:text-sm mt-1">Theo dõi tin tức mới nhất</p>
                 </div>
              </div>
            )}

            {config['youtube'] && (
              <div className="flex items-start gap-4 md:gap-5 p-3 md:p-4 rounded-xl hover:bg-slate-50 transition-colors">
                 <div className="bg-red-100 p-3 rounded-full text-red-600 shadow-sm flex-shrink-0"><Youtube className="w-5 h-5 md:w-6 md:h-6"/></div>
                 <div>
                    <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1">YouTube</h4>
                    <a href={config['youtube']} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">Kênh Video Hướng Dẫn</a>
                    <p className="text-slate-400 text-xs md:text-sm mt-1">Xem video hướng dẫn sử dụng chi tiết</p>
                 </div>
              </div>
            )}
            
            {config['zalo'] && (
               <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 md:py-4 text-base md:text-lg shadow-blue-200" onClick={() => window.open(config['zalo'], '_blank')}>
                     Chat ngay qua Zalo
                  </Button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

// 6. LOGIN PAGE
const LoginPage: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await authenticateUser(username, password);
    
    setLoading(false);
    if (result.success && result.user) {
      onLogin(result.user);
    } else {
      setError(result.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="flex items-center justify-center py-6 md:py-10 px-4">
      <div className="w-full max-w-md bg-white py-8 px-6 md:py-10 md:px-8 shadow-2xl rounded-3xl border border-slate-100 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-50 opacity-50 z-0"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8 md:mb-10">
             <div className="mx-auto h-14 w-14 md:h-16 md:w-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg mb-4 md:mb-6 transform rotate-3">
                <UserIcon className="h-6 w-6 md:h-8 md:w-8" />
             </div>
             <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Chào mừng trở lại</h2>
             <p className="mt-2 text-sm md:text-base text-slate-500">Đăng nhập để truy cập kho tài nguyên</p>
          </div>

          <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tên đăng nhập</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-300 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-slate-50 focus:bg-white text-base" 
                placeholder="Nhập tên tài khoản..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-slate-50 focus:bg-white text-base" 
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                 <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full py-3.5 text-base shadow-lg shadow-blue-200" disabled={loading}>
              {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
            </Button>
            
            <div className="text-center mt-4">
               <p className="text-slate-600 text-sm">
                  Bạn chưa là thành viên? <Link to="/membership" className="text-blue-600 font-bold hover:underline">Bấm vào đây để đăng ký</Link>
               </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- FOOTER ---

const Footer: React.FC<{ config: ConfigMap }> = ({ config }) => (
  <footer className="bg-white border-t border-slate-200 mt-auto py-4 md:py-6">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="text-center md:text-left">
           <p className="font-bold text-slate-900 mb-1 text-sm md:text-base">Kho Tài Nguyên Thầy Quân</p>
        </div>
        
        <div className="flex items-center gap-6">
           <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook className="w-5 h-5"/></a>
           <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"><Mail className="w-5 h-5"/></a>
           {config['youtube'] && (
             <a href={config['youtube']} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-600 transition-colors"><Youtube className="w-5 h-5"/></a>
           )}
        </div>
      </div>
    </div>
  </footer>
);

export default App;