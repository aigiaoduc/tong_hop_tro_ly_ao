document.addEventListener('DOMContentLoaded', function() {
    // --- TRUNG TÂM CẤU HÌNH ---
    // Thêm các ứng dụng của bạn vào đây.
    // 'name': Tên sẽ hiển thị trên menu.
    // 'path': Đường dẫn tới file index.html của ứng dụng con.
    const apps = [
        { name: 'Trợ lý tích hợp năng lực số', path: 'apps/prompt_nsl/index.html' },
        { name: 'Trợ lý tạo trò chơi dạy học', path: 'apps/tro_ly_tao_tro_choi_day_hoc/index.html' },
        { name: 'Trợ lý Ma trận đề kiểm tra', path: 'apps/ma_tran_de_kiem_tra/index.html' },
        { name: 'Đồng hồ bấm giờ', path: '#' },
        { name: 'Ứng dụng Ghi chú', path: '#' },
        { name: 'Dự báo thời tiết', path: '#' },
        { name: 'Trình phát Nhạc', path: '#' },
        { name: 'Quản lý Công việc', path: '#' },
        { name: 'Lịch vạn niên', path: '#' },
        { name: 'Trình đọc RSS', path: '#' },
        { name: 'Bản đồ Tư duy', path: '#' },
        { name: 'Chuyển đổi Đơn vị', path: '#' },
        { name: 'Trình tạo Mã QR', path: '#' },
        { name: 'Từ điển Anh-Việt', path: '#' },
        { name: 'Quản lý Chi tiêu', path: '#' }
    ];

    const menuContainer = document.querySelector('.menu-items-container');
    const appFrame = document.getElementById('app-frame');
    let currentActiveButton = null;

    // Function to create and append menu buttons
    function generateMenu() {
        if (!menuContainer) {
            console.error('Menu container .menu-items-container not found!');
            return;
        }

        if (apps.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'Chưa có ứng dụng nào. Hãy thêm ứng dụng vào file script.js.';
            menuContainer.appendChild(message);
            return;
        }

        apps.forEach(app => {
            const button = document.createElement('button');
            button.textContent = app.name;
            button.classList.add('menu-button');
            button.dataset.path = app.path; // Store path in data attribute

            button.addEventListener('click', () => {
                // Only load if path is valid
                if (app.path && app.path !== '#') {
                    appFrame.src = app.path;

                    // Update active state for buttons
                    if (currentActiveButton) {
                        currentActiveButton.classList.remove('active');
                    }
                    button.classList.add('active');
                    currentActiveButton = button;
                }
            });

            menuContainer.appendChild(button);

            // Load the first valid app by default and set it as active
            if (!currentActiveButton && app.path && app.path !== '#') {
                appFrame.src = app.path;
                button.classList.add('active');
                currentActiveButton = button;
            }
        });
    }

    // Initialize the menu
    generateMenu();
});
