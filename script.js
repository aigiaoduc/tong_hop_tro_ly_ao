document.addEventListener('DOMContentLoaded', function() {
    // --- TRUNG TÂM CẤU HÌNH ---
    const appCategories = {
        'Miễn phí': {
            apps: [
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
                { name: 'Tạo Prompt Infographic Chuyên Nghiệp', path: 'apps/prompt_infographic/index.html' }
            ],
            isLocked: false
        },
        'Trả phí': {
            apps: [
             { name: 'Trợ lý viết SKKN', path: 'apps/Tro_ly_viet_SKKN/index.html' }   
            ],
            isLocked: false,
            unlocked: true
        },
        'Thành viên': {
            apps: [
                { name: 'Tạo Prompt Veo 3', path: 'apps/prompt_veo3/index.html' }
            ],
            isLocked: true,
            password: 'camonban',
            unlocked: false
        }
    };

    // --- DOM Elements ---
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

    // Password Modal Elements
    const modalOverlay = document.getElementById('password-modal-overlay');
    const modalTitle = document.getElementById('password-modal-title');
    const passwordInput = document.getElementById('password-input');
    const passwordError = document.getElementById('password-error-message');
    const cancelBtn = document.getElementById('password-cancel-btn');
    const submitBtn = document.getElementById('password-submit-btn');

    // --- State Variables ---
    let currentActiveButton = null;
    let menuButtons = [];
    let toastTimeout;
    let categoryContext = null; // To store which category is being unlocked

    // --- CÁC HÀM CHỨC NĂNG ---

    function showToast(message) {
        if (toastTimeout) clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // --- Password Modal Logic ---
    function openPasswordModal(categoryName, category, header, container) {
        categoryContext = { categoryName, category, header, container };
        modalTitle.textContent = `Mở khóa mục "${categoryName}"`;
        modalOverlay.classList.add('visible');
        passwordInput.focus();
    }

    function closePasswordModal() {
        modalOverlay.classList.remove('visible');
        passwordInput.value = '';
        passwordError.textContent = '';
        categoryContext = null;
    }

    function handlePasswordSubmit() {
        if (!categoryContext) return;

        const { categoryName, category, header, container } = categoryContext;
        const enteredPassword = passwordInput.value;

        if (enteredPassword === category.password) {
            category.unlocked = true;
            header.classList.remove('locked');
            header.classList.add('unlocked');
            container.style.display = 'block';
            header.classList.add('expanded');
            showToast(`Đã mở khóa mục "${categoryName}"`);
            closePasswordModal();
        } else {
            passwordError.textContent = 'Mật khẩu không chính xác!';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    // --- Menu Generation and Filtering ---
    function generateMenu() {
        if (!menuContainer) return;
        menuContainer.innerHTML = '';
        menuButtons = [];

        for (const categoryName in appCategories) {
            const category = appCategories[categoryName];

            const categoryHeader = document.createElement('div');
            categoryHeader.classList.add('menu-category-header');
            categoryHeader.textContent = categoryName;

            const appContainer = document.createElement('div');
            appContainer.classList.add('menu-app-container');
            
            if (category.isLocked) {
                categoryHeader.classList.add('locked');
            }
            appContainer.style.display = 'none'; // Collapse all by default

            categoryHeader.addEventListener('click', () => {
                if (category.isLocked && !category.unlocked) {
                    openPasswordModal(categoryName, category, categoryHeader, appContainer);
                    return;
                }

                const isVisible = appContainer.style.display === 'block';
                appContainer.style.display = isVisible ? 'none' : 'block';
                categoryHeader.classList.toggle('expanded', !isVisible);
            });
            
            menuContainer.appendChild(categoryHeader);
            menuContainer.appendChild(appContainer);

            if (category.apps.length === 0) {
                 const placeholder = document.createElement('div');
                 placeholder.classList.add('menu-item-placeholder');
                 placeholder.textContent = 'Chưa có ứng dụng trong mục này.';
                 appContainer.appendChild(placeholder);
            }

            category.apps.forEach(app => {
                const button = document.createElement('button');
                button.title = app.name;
                button.classList.add('menu-button');
                button.dataset.path = app.path;
                button.textContent = app.name;

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

                appContainer.appendChild(button);
                menuButtons.push({ element: button, category: categoryName });
            });
        }
    }

    function filterMenu() {
        const searchTerm = searchInput.value.toLowerCase();
        let categoriesWithVisibleApps = new Set();

        menuButtons.forEach(buttonInfo => {
            const button = buttonInfo.element;
            const buttonText = button.textContent.toLowerCase();
            const isVisible = buttonText.includes(searchTerm);
            button.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                categoriesWithVisibleApps.add(buttonInfo.category);
            }
        });

        for (const categoryName in appCategories) {
            const header = [...document.querySelectorAll('.menu-category-header')].find(h => h.textContent === categoryName);
            if (!header) continue;
            
            const appContainer = header.nextElementSibling;
            const hasVisibleApps = categoriesWithVisibleApps.has(categoryName);

            if (searchTerm) {
                 header.style.display = hasVisibleApps ? 'flex' : 'none';
                 if (hasVisibleApps) {
                    appContainer.style.display = 'block';
                    header.classList.add('expanded');
                 } else {
                    appContainer.style.display = 'none';
                    header.classList.remove('expanded');
                 }
            } else {
                header.style.display = 'flex';
                // Restore expanded state based on whether it was expanded before search
                if (!header.classList.contains('expanded')) {
                    appContainer.style.display = 'none';
                }
            }
        }
    }

    function goHome() {
        appFrame.classList.add('loading');
        setTimeout(() => { appFrame.src = 'welcome.html'; }, 150);
        if (currentActiveButton) {
            currentActiveButton.classList.remove('active');
            currentActiveButton = null;
        }
    }

    // --- KHỞI TẠO VÀ EVENT LISTENERS ---

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
        logoContainer.style.cursor = 'pointer';
    }

    // Modal Listeners
    if (modalOverlay) {
        cancelBtn.addEventListener('click', closePasswordModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closePasswordModal();
            }
        });
        submitBtn.addEventListener('click', handlePasswordSubmit);
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handlePasswordSubmit();
            }
        });
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

    appFrame.addEventListener('load', () => {
        appFrame.classList.remove('loading');
    });
});
