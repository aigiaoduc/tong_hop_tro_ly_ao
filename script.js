document.addEventListener('DOMContentLoaded', function() {
    // --- TRUNG TÂM CẤU HÌNH ---
    const apps = [
        { name: 'Trợ lý tích hợp năng lực số', path: 'apps/prompt_nsl/index.html' },
        { name: 'Trợ lý tạo trò chơi dạy học', path: 'apps/tro_ly_tao_tro_choi_day_hoc/index.html' },
        { name: 'Trợ lý Ma trận đề kiểm tra', path: 'apps/ma_tran_de_kiem_tra/index.html' },
        { name: 'Trợ lý tạo Đề kiểm tra', path: 'apps/tao_de_kiem_tra/index.html' },
        { name: 'Tạo mã Qr nâng cao', path: 'apps/tao_ma_qr/index.html' },
        { name: 'Dự báo thời tiết', path: '#' },
        { name: 'Trình phát Nhạc', path: '#' },
        { name: 'Quản lý Công việc', path: '#' },
        { name: 'Lịch vạn niên', path: '#' },
        { name: 'Trình đọc RSS', path: '#' },
        { name: 'Bản đồ Tư duy', path: '#' },
        { name: 'Chuyển đổi Đơn vị', path: '#' },
        { name: 'Ứng dụng Ghi chú', path: '#' },
        { name: 'Từ điển Anh-Việt', path: '#' },
        { name: 'Quản lý Chi tiêu', path: '#' }
    ];

    const menuContainer = document.querySelector('.menu-items-container');
    const appFrame = document.getElementById('app-frame');
    const searchInput = document.getElementById('search-input');
    const toast = document.getElementById('toast-notification');
    const logoContainer = document.getElementById('logo-container');
    let currentActiveButton = null;
    let menuButtons = [];
    let toastTimeout;

    // --- CÁC HÀM CHỨC NĂNG ---

    // Hiển thị thông báo toast
    function showToast(message) {
        if (toastTimeout) clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500); // Thông báo hiển thị trong 2.5 giây
    }

    // Tạo và hiển thị các nút menu
    function generateMenu() {
        if (!menuContainer) return;

        apps.forEach((app, index) => {
            const button = document.createElement('button');
            button.textContent = app.name;
            button.classList.add('menu-button');
            button.dataset.path = app.path;
            button.style.animationDelay = `${index * 0.07}s`; // Hiệu ứng xuất hiện lần lượt

            button.addEventListener('click', () => {
                if (app.path && app.path !== '#') {
                    // Thêm hiệu ứng loading cho iframe
                    appFrame.classList.add('loading');
                    
                    // Chỉ thay đổi src sau một khoảng trễ ngắn để hiệu ứng kịp thực thi
                    setTimeout(() => { appFrame.src = app.path; }, 150);

                    if (currentActiveButton) {
                        currentActiveButton.classList.remove('active');
                    }
                    button.classList.add('active');
                    currentActiveButton = button;
                } else {
                    showToast('Chức năng đang được phát triển!');
                }
            });

            menuContainer.appendChild(button);
            menuButtons.push(button);
        });

        // Đánh dấu active cho nút đầu tiên có path hợp lệ, nhưng không load
        const firstValidButton = menuButtons.find(btn => btn.dataset.path && btn.dataset.path !== '#');
        if (firstValidButton) {
            // firstValidButton.classList.add('active');
            // currentActiveButton = firstValidButton;
        }
    }

    // Lọc menu theo từ khóa tìm kiếm
    function filterMenu() {
        const searchTerm = searchInput.value.toLowerCase();
        menuButtons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            const isVisible = buttonText.includes(searchTerm);
            button.style.display = isVisible ? 'block' : 'none';
            // Giữ lại hiệu ứng khi tìm kiếm
            if(isVisible) {
                button.style.animation = 'none';
                void button.offsetWidth; // Trigger reflow
                button.style.animation = null;
            }
        });
    }

    // Quay về trang chủ
    function goHome() {
        appFrame.classList.add('loading');
        setTimeout(() => { appFrame.src = 'welcome.html'; }, 150);
        if (currentActiveButton) {
            currentActiveButton.classList.remove('active');
            currentActiveButton = null;
        }
    }

    // --- KHỞI TẠO ---

    generateMenu();

    if (searchInput) {
        searchInput.addEventListener('input', filterMenu);
    }

    if (logoContainer) {
        logoContainer.addEventListener('click', goHome);
        logoContainer.style.cursor = 'pointer'; // Thêm con trỏ chuột
    }

    // Xóa class loading sau khi iframe đã tải xong
    appFrame.addEventListener('load', () => {
        appFrame.classList.remove('loading');
    });
});
