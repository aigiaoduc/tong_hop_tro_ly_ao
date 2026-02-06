import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Code, BookOpen, Monitor, MessageSquare, Users, Plus, Edit, Save, X, LayoutDashboard, Megaphone, Eye, EyeOff, Lock, Unlock, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { Config } from '../types';

// Định nghĩa cấu hình cho các trường nhập liệu (Label, Tooltip, Loại input)
const FIELD_METADATA: Record<string, { label: string; help: string; type?: 'text' | 'number' | 'textarea' | 'select'; options?: {value: string; label: string}[] }> = {
  // Chung
  id: { label: 'Mã ID (Duy nhất)', help: 'Mã định danh duy nhất, không được trùng với cái cũ (VD: APP01, KH01).', type: 'text' },
  title: { label: 'Tiêu đề / Tên', help: 'Tên hiển thị của sản phẩm, ứng dụng hoặc tiêu đề quảng cáo.', type: 'text' },
  imageUrl: { label: 'Link Hình ảnh', help: 'Đường dẫn URL trực tiếp đến file ảnh (VD: https://imgur.com/...).', type: 'text' },
  status: { label: 'Trạng thái', help: 'Chọn trạng thái hiển thị hoặc hoạt động.', type: 'select' }, 
  usageCount: { label: 'Số lượt mua/dùng', help: 'Hiển thị số lượng người đã mua hoặc sử dụng. Có thể nhập số ảo để tăng uy tín.', type: 'number' },

  // Ứng dụng
  shortDesc: { label: 'Mô tả ngắn', help: 'Dòng giới thiệu ngắn gọn hiển thị ở thẻ bên ngoài.', type: 'textarea' },
  fullDesc: { label: 'Mô tả chi tiết', help: 'Nội dung đầy đủ hiển thị khi bấm nút "Chi tiết".', type: 'textarea' },
  link: { label: 'Link Ứng dụng', help: 'Đường dẫn đến web app hoặc tool cần chạy.', type: 'text' },
  mode: { 
    label: 'Chế độ mở', 
    help: 'Chọn cách ứng dụng được mở khi bấm nút "Sử dụng".', 
    type: 'select',
    options: [
      { value: 'EMBED', label: 'Nhúng (Mở popup trong web)' },
      { value: 'NEW_TAB', label: 'Mở Tab mới (Chuyển hướng)' }
    ]
  },

  // Sản phẩm (Khóa học/Phần mềm)
  description: { label: 'Mô tả', help: 'Giới thiệu về nội dung khóa học hoặc phần mềm.', type: 'textarea' },
  price: { label: 'Giá bán (VNĐ)', help: 'Nhập số tiền (VD: 500000).', type: 'number' },
  landingPageUrl: { label: 'Link Giới thiệu (Landing Page)', help: 'Link video Youtube hoặc trang web giới thiệu sản phẩm (Sẽ mở dạng Nhúng).', type: 'text' },
  contentLink: { label: 'Link Nội dung gốc', help: 'Link bài học hoặc link tải phần mềm. Chỉ hiện cho người đã mua.', type: 'text' },

  // Quảng cáo
  // (Sử dụng chung title, imageUrl, landingPageUrl)

  // Người dùng
  username: { label: 'Tên đăng nhập', help: 'Tài khoản dùng để đăng nhập hệ thống.', type: 'text' },
  password: { label: 'Mật khẩu', help: 'Mật khẩu đăng nhập.', type: 'text' },
  fullName: { label: 'Họ và tên', help: 'Tên đầy đủ của người dùng.', type: 'text' },
  email: { label: 'Email', help: 'Địa chỉ thư điện tử.', type: 'text' },
  membership: { label: 'Hạng thành viên', help: 'VD: MEMBER, VIP...', type: 'text' },
  purchasedItems: { label: 'Sản phẩm đã mua', help: 'Danh sách ID các sản phẩm đã mua, cách nhau bằng dấu phẩy.', type: 'text' }
};

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('config');
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [config, setConfig] = useState<Config | any>({});
  
  // Edit/Add Modal State
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>({});
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');

  // Check Admin Access
  useEffect(() => {
    if (!user || user.username !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Load data when tab changes
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'config') {
        const res = await api.getConfig();
        if (res.success) setConfig(res.data);
      } else {
        const sheetName = getSheetName(activeTab);
        const res = await api.adminGetAllData(sheetName);
        if (res.success) setDataList(res.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSheetName = (tab: string) => {
    switch(tab) {
      case 'apps': return 'Ứng dụng';
      case 'courses': return 'Khóa học';
      case 'software': return 'Phần mềm';
      case 'users': return 'Người dùng';
      case 'feedback': return 'Phản hồi';
      case 'ads': return 'Quảng cáo';
      default: return '';
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.adminUpdateConfig(config);
    if (res.success) alert('Cập nhật cấu hình thành công!');
    else alert('Lỗi: ' + res.message);
    setLoading(false);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const sheetName = getSheetName(activeTab);
    setLoading(true);
    const res = await api.adminSaveItem(sheetName, currentItem);
    if (res.success) {
      setShowModal(false);
      loadData(); // Reload list
    } else {
      alert('Lỗi: ' + res.message);
    }
    setLoading(false);
  };

  const openEditModal = (item: any) => {
    setCurrentItem({ ...item });
    setModalMode('EDIT');
    setShowModal(true);
  };

  const openAddModal = () => {
    const defaultItem: any = {};
    // Mặc định chế độ EMBED cho App khi thêm mới
    if (activeTab === 'apps') defaultItem.mode = 'EMBED';
    // Mặc định trạng thái Hiện cho các mục khác
    if (activeTab !== 'users') defaultItem.status = 'Hiện';
    
    setCurrentItem(defaultItem);
    setModalMode('ADD');
    setShowModal(true);
  };

  const toggleStatus = async (item: any) => {
    const isUserTab = activeTab === 'users';
    // Lấy trạng thái hiện tại, xóa khoảng trắng thừa nếu có
    const currentStatus = item.status ? String(item.status).trim() : '';
    
    let newStatus = '';
    let actionName = '';

    if (isUserTab) {
        // Logic Người dùng: Khóa <-> [Rỗng]
        if (currentStatus === 'Khóa') {
            newStatus = ''; // Mở khóa thì để trống
            actionName = 'MỞ KHÓA';
        } else {
            newStatus = 'Khóa';
            actionName = 'KHÓA';
        }
    } else {
        // Logic Sản phẩm/Ứng dụng/Quảng cáo: Ẩn <-> Hiện
        if (currentStatus === 'Ẩn') {
            newStatus = 'Hiện';
            actionName = 'HIỆN';
        } else {
            newStatus = 'Ẩn';
            actionName = 'ẨN';
        }
    }
    
    if(!confirm(`Bạn muốn ${actionName}: ${item.title || item.username}?`)) return;
    
    const updatedItem = {
       ...item,
       status: newStatus
    };

    setLoading(true);
    const res = await api.adminSaveItem(getSheetName(activeTab), updatedItem);
    if(res.success) {
        loadData();
    } else {
        alert(res.message);
    }
    setLoading(false);
  };

  const sidebarItems = [
    { id: 'config', label: 'Cấu hình chung', icon: <Settings size={18} /> },
    { id: 'apps', label: 'Ứng dụng', icon: <Code size={18} /> },
    { id: 'courses', label: 'Khóa học', icon: <BookOpen size={18} /> },
    { id: 'software', label: 'Phần mềm', icon: <Monitor size={18} /> },
    { id: 'ads', label: 'Quảng cáo', icon: <Megaphone size={18} /> },
    { id: 'users', label: 'Người dùng', icon: <Users size={18} /> },
    { id: 'feedback', label: 'Phản hồi', icon: <MessageSquare size={18} /> },
  ];

  // --- Helper to Render Form Fields ---
  const renderField = (key: string) => {
    let meta = FIELD_METADATA[key];
    
    // Xử lý động cho trường Status: Cập nhật options dựa trên tab hiện tại
    if (key === 'status') {
        const isUserTab = activeTab === 'users';
        meta = {
            label: 'Trạng thái',
            help: isUserTab ? 'Trạng thái hoạt động của tài khoản.' : 'Trạng thái hiển thị trên website.',
            type: 'select',
            options: isUserTab 
             ? [
                 { value: '', label: 'Hoạt động (Bình thường)' },
                 { value: 'Khóa', label: 'Khóa (Chặn đăng nhập)' }
               ]
             : [
                 { value: 'Hiện', label: 'Hiện (Hoạt động)' },
                 { value: 'Ẩn', label: 'Ẩn (Tạm ẩn)' }
               ]
        };
    }

    const label = meta?.label || key;
    const help = meta?.help || '';
    const type = meta?.type || 'text';

    // Các trường chỉ đọc khi ở chế độ Chỉnh sửa (ID, Username)
    const isReadOnly = modalMode === 'EDIT' && (key === 'id' || key === 'username');

    // Chuẩn hóa giá trị cho select status (Vì rỗng '' thường là Hiện với Item)
    let value = currentItem[key] || '';
    if (key === 'status' && activeTab !== 'users') {
        // Nếu là Item và giá trị rỗng hoặc 'Hiện', set value hiển thị là 'Hiện'
        if (value === '' || value === 'Hiện') value = 'Hiện';
        else value = 'Ẩn';
    }

    return (
      <div key={key} className="mb-4">
         <div className="flex items-center mb-1">
            <label className="block text-sm font-bold text-gray-700 capitalize mr-2">
              {label}
            </label>
            {help && (
              <div className="group relative flex items-center">
                 <HelpCircle size={14} className="text-gray-400 cursor-help" />
                 <div className="absolute left-6 top-0 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 transition-all">
                    {help}
                 </div>
              </div>
            )}
         </div>

         {type === 'textarea' ? (
           <textarea 
             className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
             rows={3}
             value={value}
             onChange={e => setCurrentItem({...currentItem, [key]: e.target.value})}
           />
         ) : type === 'select' && meta?.options ? (
           <select
             className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
             value={value}
             onChange={e => setCurrentItem({...currentItem, [key]: e.target.value})}
           >
             {meta.options.map(opt => (
               <option key={opt.value} value={opt.value}>{opt.label}</option>
             ))}
           </select>
         ) : (
           <input 
             type={type}
             readOnly={isReadOnly}
             className={`w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${isReadOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
             value={value}
             onChange={e => setCurrentItem({...currentItem, [key]: e.target.value})}
           />
         )}
      </div>
    );
  };

  // Xác định thứ tự hiển thị các trường khi Thêm mới
  const getFieldsForTab = (tab: string) => {
    switch(tab) {
      case 'apps': return ['id', 'title', 'mode', 'link', 'imageUrl', 'shortDesc', 'fullDesc', 'usageCount', 'status'];
      case 'courses':
      case 'software': return ['id', 'title', 'price', 'description', 'landingPageUrl', 'contentLink', 'imageUrl', 'usageCount', 'status'];
      case 'ads': return ['id', 'title', 'landingPageUrl', 'imageUrl', 'status'];
      case 'users': return ['username', 'password', 'fullName', 'email', 'membership', 'status'];
      default: return [];
    }
  };

  if (!user || user.username !== 'admin') return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md flex-shrink-0 z-10">
        <div className="p-6 bg-indigo-800 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <LayoutDashboard className="mr-2" /> Quản Trị Viên
          </h2>
          <p className="text-xs text-indigo-200 mt-1">Hệ thống quản lý dữ liệu</p>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 md:p-8 overflow-x-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-800 uppercase">
               {sidebarItems.find(i => i.id === activeTab)?.label}
             </h2>
             {activeTab !== 'config' && activeTab !== 'feedback' && (
               <button 
                 onClick={openAddModal}
                 className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
               >
                 <Plus size={16} /> <span>Thêm mới</span>
               </button>
             )}
          </div>

          {/* Body */}
          <div className="p-6 flex-grow">
             {loading && <div className="text-center text-gray-500 py-4">Đang xử lý dữ liệu...</div>}
             
             {/* --- CONFIG TAB --- */}
             {!loading && activeTab === 'config' && (
               <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(config).map((key) => {
                     // Simple label localization for config
                     const label = key.replace(/([A-Z])/g, ' $1').trim();
                     return (
                        <div key={key}>
                          <label className="block text-sm font-bold text-gray-700 mb-1 capitalize">
                            {label}
                          </label>
                          {key === 'bio' || key === 'footerText' ? (
                             <textarea 
                               className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                               rows={3}
                               value={config[key] || ''}
                               onChange={e => setConfig({...config, [key]: e.target.value})}
                             />
                          ) : (
                             <input 
                               type="text" 
                               className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                               value={config[key] || ''}
                               onChange={e => setConfig({...config, [key]: e.target.value})}
                             />
                          )}
                        </div>
                     )
                  })}
                  <div className="md:col-span-2 mt-4">
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md font-bold hover:bg-green-700 flex justify-center items-center shadow-sm">
                       <Save size={18} className="mr-2" /> Lưu Cấu Hình
                    </button>
                  </div>
               </form>
             )}

             {/* --- LIST TAB --- */}
             {!loading && activeTab !== 'config' && (
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                         <tr>
                            <th className="px-4 py-3">ID / Tên</th>
                            {activeTab !== 'feedback' && <th className="px-4 py-3">Hình ảnh / Info</th>}
                            <th className="px-4 py-3">Chi tiết</th>
                            {activeTab !== 'feedback' && <th className="px-4 py-3">Trạng thái</th>}
                            {activeTab !== 'feedback' && <th className="px-4 py-3 text-right">Hành động</th>}
                         </tr>
                      </thead>
                      <tbody>
                         {dataList.map((item, idx) => {
                           const status = item.status ? String(item.status).trim() : '';
                           const isHidden = status === 'Ẩn' || status === 'Khóa';

                           return (
                           <tr key={idx} className={`bg-white border-b hover:bg-gray-50 ${isHidden ? 'bg-gray-50 opacity-75' : ''}`}>
                              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                 {item.id || item.username || item.time}
                              </td>
                              {activeTab !== 'feedback' && (
                                <td className="px-4 py-3">
                                   {item.imageUrl ? (
                                      <img src={item.imageUrl} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                                   ) : <span className="font-bold text-gray-700">{item.fullName}</span>}
                                </td>
                              )}
                              <td className="px-4 py-3 max-w-xs truncate">
                                 {item.title || item.message || item.email}
                              </td>
                              {activeTab !== 'feedback' && (
                                <td className="px-4 py-3">
                                   <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit ${
                                      isHidden 
                                      ? 'bg-gray-200 text-gray-600' 
                                      : 'bg-green-100 text-green-800'
                                   }`}>
                                      {isHidden 
                                        ? (activeTab === 'users' ? <Lock size={12} className="mr-1"/> : <EyeOff size={12} className="mr-1"/>)
                                        : (activeTab === 'users' ? <Unlock size={12} className="mr-1"/> : <Eye size={12} className="mr-1"/>)
                                      }
                                      {isHidden ? (activeTab === 'users' ? 'Đã Khóa' : 'Đang Ẩn') : 'Hiển thị'}
                                   </span>
                                </td>
                              )}
                              {activeTab !== 'feedback' && (
                                <td className="px-4 py-3 text-right flex justify-end space-x-2">
                                   <button 
                                      onClick={() => openEditModal(item)}
                                      className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                                      title="Chỉnh sửa"
                                   >
                                      <Edit size={16} />
                                   </button>
                                   <button 
                                      onClick={() => toggleStatus(item)}
                                      className={`p-1.5 rounded transition ${
                                        isHidden 
                                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                      title={activeTab === 'users' ? (isHidden ? 'Mở khóa' : 'Khóa tài khoản') : (isHidden ? 'Hiển thị lại' : 'Ẩn đi')}
                                   >
                                      {isHidden 
                                        ? (activeTab === 'users' ? <Unlock size={16} /> : <Eye size={16} />)
                                        : (activeTab === 'users' ? <Lock size={16} /> : <EyeOff size={16} />)
                                      }
                                   </button>
                                </td>
                              )}
                           </tr>
                         )})}
                      </tbody>
                   </table>
                   {dataList.length === 0 && <div className="text-center py-8 text-gray-400">Chưa có dữ liệu nào.</div>}
                </div>
             )}
          </div>
        </div>
      </div>

      {/* --- MODAL EDIT/ADD --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                 <h3 className="text-lg font-bold text-gray-800">
                    {modalMode === 'ADD' ? 'Thêm Mới' : 'Chỉnh Sửa Thông Tin'}
                 </h3>
                 <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500"><X size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                 <form id="itemForm" onSubmit={handleSaveItem}>
                    {activeTab === 'users' && (
                       <div className="text-xs text-red-600 mb-4 bg-red-50 p-2 rounded border border-red-100">
                         <strong>Lưu ý:</strong> Bạn chỉ có thể sửa thông tin thành viên. Để đổi mật khẩu hoặc xóa hẳn, vui lòng thao tác trực tiếp trên Google Sheet.
                       </div>
                    )}

                    {/* Rendering Logic */}
                    {modalMode === 'ADD' ? (
                       // ADD MODE: Use predefined order
                       getFieldsForTab(activeTab).map(key => renderField(key))
                    ) : (
                       // EDIT MODE: Iterate available keys, but prioritize known metadata order if possible
                       Object.keys(currentItem).map(key => {
                          if (key === 'purchasedItems') return null; // Hide complex fields
                          return renderField(key);
                       })
                    )}
                 </form>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm font-medium">
                    Hủy bỏ
                 </button>
                 <button type="submit" form="itemForm" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-bold shadow-sm">
                    {modalMode === 'ADD' ? 'Thêm mới' : 'Lưu thay đổi'}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Admin;