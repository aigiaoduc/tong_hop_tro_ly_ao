document.addEventListener('DOMContentLoaded', function() {
    // --- TRUNG TÂM CẤU HÌNH ---
    const apps = [
        { name: 'Tích Hợp Năng Lực Số', path: 'apps/prompt_nsl/index.html' },
        { name: 'Gợi Ý Năng Lực Số', path: 'apps/goi_y_nang_luc_so/index.html' },
        { name: 'Trò chơi Dạy Học', path: 'apps/tro_ly_tao_tro_choi_day_hoc/index.html' },
        { name: 'Ma Trận Đề Kiểm Tra', path: 'apps/ma_tran_de_kiem_tra/index.html' },
        { name: 'Tạo Đề Kiểm Tra', path: 'apps/tao_de_kiem_tra/index.html' },
        { name: 'Tạo Mã QR', path: 'apps/tao_ma_qr/index.html' },
        { name: 'Tối Ưu Hóa Prompt', path: 'apps/toi_uu_hoa_prompt/index.html' },
        { name: 'Tạo Prompt Veo3 Sora', path: 'apps/tro_ly_veo3_sora/index.html' },
        { name: 'Sơ Đồ Tư Duy', path: 'apps/so_do_tu_duy/index.html' },
        { name: 'Tạo Truyện Tranh Đồng Bộ Nhân Vật', path: 'apps/tao_prompt_truyen_tranh/index.html' },
        { name: 'Tạo Prompt Infographic Chuyên Nghiệp', path: 'apps/prompt_infographic/index.html' },
        { name: 'Tạo Prompt Veo 3', path: 'apps/prompt_veo3/index.html' }
    ];

    const menuContainer = document.querySelector('.menu-items-container');
    const appFrame = document.getElementById('app-frame');
    const searchInput = document.getElementById('search-input');
    const toast = document.getElementById('toast-notification');
    const logoContainer = document.getElementById('logo-container');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const appMenu = document.getElementById('app-menu');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const contentFrame = document.querySelector('.content-frame');
    const fullscreenIcon = document.querySelector('.icon-fullscreen');
    const exitFullscreenIcon = document.querySelector('.icon-exit-fullscreen');
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

        // Dọn dẹp menu cũ trước khi tạo mới
        menuContainer.innerHTML = '';
        menuButtons = [];

        apps.forEach((app, index) => {
            const button = document.createElement('button');
            button.title = app.name;
            button.classList.add('menu-button');
            button.dataset.path = app.path;
            
            // Bọc văn bản trong một span để kiểm tra và cuộn
            const textWrap = document.createElement('span');
            textWrap.classList.add('text-wrap');
            textWrap.textContent = app.name;
            button.appendChild(textWrap);

            button.addEventListener('click', () => {
                if (app.path && app.path !== '#') {
                    appFrame.classList.add('loading');
                    setTimeout(() => { appFrame.src = app.path; }, 150);

                    if (currentActiveButton) {
                        currentActiveButton.classList.remove('active');
                    }
                    button.classList.add('active');
                    currentActiveButton = button;
                    if (window.innerWidth <= 768) {
                        appMenu.classList.remove('open');
                        hamburgerMenu.classList.remove('active');
                    }
                } else {
                    showToast('Chức năng đang được phát triển!');
                }
            });

            menuContainer.appendChild(button);
            menuButtons.push(button);

            // --- Logic cho hiệu ứng cuộn chữ ---
            // Phải kiểm tra sau khi nút đã được thêm vào DOM để có kích thước chính xác
            const isOverflowing = textWrap.scrollWidth > button.clientWidth;
            
            if (isOverflowing) {
                button.classList.add('marquee');
                const originalText = app.name;
                // Chuẩn bị sẵn văn bản sẽ cuộn
                const marqueeText = `${originalText} \u00A0 | \u00A0 ${originalText}`;

                button.addEventListener('mouseenter', () => {
                    // Khi di chuột vào, nếu text đang ở dạng gốc thì đổi sang dạng cuộn
                    if (textWrap.textContent === originalText) {
                        textWrap.textContent = marqueeText;
                    }
                });

                button.addEventListener('mouseleave', () => {
                    // Khi chuột rời đi, ngay lập tức đặt lại text gốc
                    // Animation sẽ dừng lại nhờ CSS :hover
                    textWrap.textContent = originalText;
                });
            }
        });
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

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            appMenu.classList.toggle('open');
            hamburgerMenu.classList.toggle('active');
        });
    }

    if (logoContainer) {
        logoContainer.addEventListener('click', goHome);
        logoContainer.style.cursor = 'pointer'; // Thêm con trỏ chuột
    }

    // --- FULLSCREEN LOGIC ---
    function updateFullscreenIcons() {
        const isFullscreen = !!document.fullscreenElement;
        fullscreenIcon.style.display = isFullscreen ? 'none' : 'block';
        exitFullscreenIcon.style.display = isFullscreen ? 'block' : 'none';
    }

    if (fullscreenBtn && contentFrame) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                contentFrame.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }

    document.addEventListener('fullscreenchange', updateFullscreenIcons);


    // Xóa class loading sau khi iframe đã tải xong
    appFrame.addEventListener('load', () => {
        appFrame.classList.remove('loading');
    });
});
