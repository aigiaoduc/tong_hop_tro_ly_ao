/**
 * ==============================================================================
 * AI GIÁO DỤC - NỀN TẢNG CÔNG CỤ SƯ PHẠM & LỚP HỌC THÔNG MINH
 * Tác giả: Thầy Trần Hồng Quân
 * ==============================================================================
 */

(function () {
  'use strict';

  const cfg = window.APP_CONFIG || {
    APPS_SCRIPT_URL: '',
    CACHE_EXPIRE_MINUTES: 15,
    TRACK_VIEWS_ENABLED: true,
    FALLBACK_DATA_ENABLED: true
  };

  // State
  let state = {
    data: window.INITIAL_DATA || {},
    isLiveConnected: false,
    currentTab: 'all', // 'all' | 'teacher' | 'classroom' | 'favorites' | 'videos'
    searchQuery: '',
    selectedTag: null,
    favorites: JSON.parse(localStorage.getItem('ai_gd_favorites') || '[]'),
    activeApp: null,
    isZenMode: false,
    darkMode: localStorage.getItem('ai_gd_theme') === 'dark' || 
              (!('ai_gd_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
    
    // Promo Timer State
    promoTimer: null,
    promoSecondsLeft: 5,
    promoIsPaused: false,
    promoIsManuallyPaused: false,

    // Real Analytics & Review State
    currentReviewAppId: null,
    trackedSessions: {},

    // Progressive Loading & Pagination
    appsPageSize: 8,
    displayedAppCount: 8,
    isLoadingMore: false,
    infiniteScrollObserver: null
  };

  // DOM Elements
  const DOM = {
    // Theme & Sync
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIconContainer: document.getElementById('theme-icon-container'),
    syncStatusBadge: document.getElementById('sync-status-badge'),
    btnForceSync: document.getElementById('btn-force-sync'),
    
    // Header & Donate
    btnHeaderDonate: document.getElementById('btn-header-donate'),
    
    // Search & Filter
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    tagContainer: document.getElementById('tag-container'),
    tabButtons: document.querySelectorAll('[data-tab]'),
    appsCountBadge: document.getElementById('apps-count-badge'),
    
    // Grids & Sections
    appsGrid: document.getElementById('apps-grid'),
    loadMoreContainer: document.getElementById('load-more-container'),
    loadMoreSpinner: document.getElementById('load-more-spinner'),
    loadMoreActionWrap: document.getElementById('load-more-action-wrap'),
    btnLoadMore: document.getElementById('btn-load-more'),
    loadMoreBtnText: document.getElementById('load-more-btn-text'),
    loadMoreCounter: document.getElementById('load-more-counter'),
    loadMoreFinished: document.getElementById('load-more-finished'),
    loadMoreSentinel: document.getElementById('load-more-sentinel'),
    videosSection: document.getElementById('videos-section'),
    videosGrid: document.getElementById('videos-grid'),
    emptyState: document.getElementById('empty-state'),
    
    // Modal App Viewer
    appModal: document.getElementById('app-modal'),
    modalBackdrop: document.getElementById('modal-backdrop'),
    modalDialog: document.getElementById('modal-dialog'),
    modalTitle: document.getElementById('modal-title'),
    modalCategory: document.getElementById('modal-category'),
    modalIframe: document.getElementById('modal-iframe'),
    iframeLoader: document.getElementById('iframe-loader'),
    btnZenMode: document.getElementById('btn-zen-mode'),
    btnReloadIframe: document.getElementById('btn-reload-iframe'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnReportIssue: document.getElementById('btn-report-issue'),
    btnIframeDonate: document.getElementById('btn-iframe-donate'),
    btnIframeReview: document.getElementById('btn-iframe-review'),
    appDescriptionText: document.getElementById('app-description-text'),
    
    // Modal Video Player
    videoModal: document.getElementById('video-modal'),
    videoIframe: document.getElementById('video-iframe'),
    videoModalTitle: document.getElementById('video-modal-title'),
    videoModalDesc: document.getElementById('video-modal-desc'),
    btnCloseVideo: document.getElementById('btn-close-video'),

    // Modal Donate
    donateModal: document.getElementById('donate-modal'),
    donateQrImg: document.getElementById('donate-qr-img'),
    donateBankInfo: document.getElementById('donate-bank-info'),
    btnCloseDonate: document.getElementById('btn-close-donate'),

    // Modal Promo / Ads
    promoModal: document.getElementById('promo-modal'),
    promoDialog: document.getElementById('promo-dialog'),
    promoHeaderBadge: document.getElementById('promo-header-badge'),
    promoTimerBadge: document.getElementById('promo-timer-badge'),
    promoTimerText: document.getElementById('promo-timer-text'),
    promoImg: document.getElementById('promo-img'),
    promoImgContainer: document.getElementById('promo-img-container'),
    promoTitle: document.getElementById('promo-title'),
    promoContent: document.getElementById('promo-content'),
    promoAttachmentBtn: document.getElementById('promo-attachment-btn'),
    btnViewNowPromo: document.getElementById('btn-view-now-promo'),
    btnClosePromo: document.getElementById('btn-close-promo'),
    btnDismissPromo: document.getElementById('btn-dismiss-promo'),
    btnFloatingGift: document.getElementById('btn-floating-gift'),

    // Modal Feedback
    feedbackModal: document.getElementById('feedback-modal'),
    feedbackForm: document.getElementById('feedback-form'),
    feedbackName: document.getElementById('feedback-name'),
    feedbackEmail: document.getElementById('feedback-email'),
    feedbackContent: document.getElementById('feedback-content'),
    btnCloseFeedback: document.getElementById('btn-close-feedback'),
    btnSubmitFeedback: document.getElementById('btn-submit-feedback'),

    // Modal Review
    reviewModal: document.getElementById('review-modal'),
    reviewModalTitle: document.getElementById('review-modal-title'),
    reviewModalSubtitle: document.getElementById('review-modal-subtitle'),
    reviewModalScore: document.getElementById('review-modal-score'),
    reviewModalStars: document.getElementById('review-modal-stars'),
    reviewModalCount: document.getElementById('review-modal-count'),
    reviewsListContainer: document.getElementById('reviews-list-container'),
    reviewForm: document.getElementById('review-form'),
    starPicker: document.getElementById('star-picker'),
    starPickerText: document.getElementById('star-picker-text'),
    reviewRatingVal: document.getElementById('review-rating-val'),
    reviewName: document.getElementById('review-name'),
    reviewSchool: document.getElementById('review-school'),
    reviewComment: document.getElementById('review-comment'),
    btnSubmitReview: document.getElementById('btn-submit-review'),
    btnCloseReview: document.getElementById('btn-close-review'),

    // Stats
    statTotalViews: document.getElementById('stat-total-views'),
    statTotalApps: document.getElementById('stat-total-apps'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
  };

  // 1. Quản lý Theme Sáng / Tối
  const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
  const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-600 dark:text-slate-300"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

  function applyTheme(isDark) {
    state.darkMode = isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ai_gd_theme', 'dark');
      if (DOM.themeIconContainer) DOM.themeIconContainer.innerHTML = SUN_SVG;
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ai_gd_theme', 'light');
      if (DOM.themeIconContainer) DOM.themeIconContainer.innerHTML = MOON_SVG;
    }
  }

  function initTheme() {
    applyTheme(state.darkMode);

    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.addEventListener('click', () => {
        applyTheme(!state.darkMode);
      });
    }
  }

  // 2. Toast
  function showToast(msg, duration = 3000) {
    if (!DOM.toast) return;
    DOM.toastMessage.textContent = msg;
    DOM.toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    DOM.toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      DOM.toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      DOM.toast.classList.remove('opacity-100', 'translate-y-0');
    }, duration);
  }

  // 3. Cập nhật trạng thái đồng bộ Cloud Database (Màu xanh + Hiệu ứng điện tử hiện đại)
  function updateSyncBadge(status, version = '') {
    if (!DOM.syncStatusBadge) return;
    
    DOM.syncStatusBadge.classList.remove('electric-ready-badge', 'bg-slate-100/90', 'dark:bg-slate-800/90', 'border-slate-200/80');

    if (status === 'syncing') {
      DOM.syncStatusBadge.className = 'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-[11px] font-semibold border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 shadow-sm';
      DOM.syncStatusBadge.innerHTML = `
        <svg class="animate-spin w-3.5 h-3.5 text-teal-600 dark:text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span>Đang nạp dữ liệu...</span>
      `;
    } else if (status === 'checking') {
      DOM.syncStatusBadge.className = 'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[11px] font-semibold border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 shadow-sm';
      DOM.syncStatusBadge.innerHTML = `
        <svg class="animate-spin w-3.5 h-3.5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span>Kiểm tra phiên bản...</span>
      `;
    } else {
      // TRẠNG THÁI SẴN SÀNG: MÀU XANH LỤC + HIỆU ỨNG ĐIỆN TỬ HIỆN ĐẠI (ELECTRIC GLOW)
      const verText = version ? `v${version}` : '';
      DOM.syncStatusBadge.className = 'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold electric-ready-badge cursor-default select-none shadow-md';
      DOM.syncStatusBadge.innerHTML = `
        <span class="electric-spark flex items-center">
          <svg class="w-3.5 h-3.5 text-emerald-200" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </span>
        <span class="tracking-wide">Dữ liệu sẵn sàng ${verText}</span>
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping"></span>
      `;
    }
  }

  // 4. Đồng bộ dữ liệu theo cơ chế kiểm tra DATA_VERSION thông minh
  async function fetchLiveGoogleSheetData(force = false) {
    const cacheKey = 'aigiaoduc_live_cache_v7';
    const versionKey = 'aigiaoduc_data_version';
    const cachedVersion = localStorage.getItem(versionKey);

    // 4.1. Đọc dữ liệu từ Cache LocalStorage để hiển thị ngay lập tức (0ms load time)
    const cachedStr = localStorage.getItem(cacheKey);
    let hasLocalData = false;
    if (cachedStr) {
      try {
        const parsed = JSON.parse(cachedStr);
        if (parsed && parsed.apps && parsed.apps.length > 0) {
          state.data = parsed;
          state.isLiveConnected = true;
          hasLocalData = true;
          renderAllViews();
          updateSyncBadge('live', cachedVersion || '');
        }
      } catch (e) {
        console.warn('Lỗi đọc cache cũ:', e);
      }
    }

    // 4.2. Kiểm tra phiên bản DATA_VERSION từ Google Sheet
    if (!force) {
      updateSyncBadge('checking');
    } else {
      updateSyncBadge('syncing');
    }

    let serverVersion = null;
    let needFullFetch = force || !hasLocalData || !cachedVersion;

    if (!needFullFetch) {
      try {
        const checkEndpoints = [
          `/api/data?action=getVersion&_t=${Date.now()}`,
          `/api/data?action=getConfig&_t=${Date.now()}`,
          cfg.APPS_SCRIPT_URL ? `${cfg.APPS_SCRIPT_URL}?action=getVersion&_t=${Date.now()}` : null,
          cfg.APPS_SCRIPT_URL ? `${cfg.APPS_SCRIPT_URL}?action=getConfig&_t=${Date.now()}` : null
        ].filter(Boolean);

        for (const ep of checkEndpoints) {
          try {
            const res = await fetch(ep, { headers: { 'Accept': 'application/json' } });
            if (res.ok) {
              const resJson = await res.json();
              if (resJson && resJson.success) {
                if (resJson.version !== undefined && resJson.version !== '') {
                  serverVersion = String(resJson.version).trim();
                } else if (resJson.data && resJson.data.DATA_VERSION !== undefined && resJson.data.DATA_VERSION !== '') {
                  serverVersion = String(resJson.data.DATA_VERSION).trim();
                }
                if (serverVersion !== null) break;
              }
            }
          } catch (err) {
            // Thử endpoint tiếp theo
          }
        }

        // So sánh phiên bản:
        if (serverVersion && serverVersion === cachedVersion) {
          // Phiên bản trùng khớp: Giữ nguyên dữ liệu cũ, không tải lại danh sách -> Tiết kiệm 100% băng thông!
          console.log(`[DATA_VERSION] Trùng phiên bản (${serverVersion}). Sử dụng dữ liệu lưu sẵn siêu tốc!`);
          updateSyncBadge('live', serverVersion);
          return;
        } else if (serverVersion) {
          console.log(`[DATA_VERSION] Phát hiện phiên bản mới: Server=${serverVersion} khác Cache=${cachedVersion}. Đang nạp dữ liệu mới...`);
          needFullFetch = true;
        }
      } catch (err) {
        console.warn('Lỗi khi kiểm tra DATA_VERSION:', err);
      }
    }

    // 4.3. Tải toàn bộ dữ liệu mới nhất (Khi thay đổi DATA_VERSION hoặc bấm Bắt buộc làm mới)
    updateSyncBadge('syncing');
    let fetchedData = null;

    // Tầng 1: Vercel Edge Caching (/api/data)
    try {
      const edgeUrl = `/api/data?action=getAll&refresh=true&_t=${Date.now()}`;
      const edgeRes = await fetch(edgeUrl, { headers: { 'Accept': 'application/json' } });
      if (edgeRes.ok) {
        const edgeJson = await edgeRes.json();
        if (edgeJson && edgeJson.success && edgeJson.data) {
          fetchedData = edgeJson.data;
        }
      }
    } catch (e) {}

    // Tầng 2: Direct Google Apps Script API
    if (!fetchedData && cfg.APPS_SCRIPT_URL) {
      try {
        const directUrl = `${cfg.APPS_SCRIPT_URL}?action=getAll&_t=${Date.now()}`;
        const res = await fetch(directUrl);
        const json = await res.json();
        if (json && json.success && json.data) {
          fetchedData = json.data;
        }
      } catch (err) {
        console.warn('Không thể kết nối máy chủ Google Apps Script:', err);
      }
    }

    if (fetchedData) {
      state.data = {
        config: fetchedData.config || state.data.config || {},
        apps: fetchedData.apps && fetchedData.apps.length > 0 ? fetchedData.apps : state.data.apps,
        videos: fetchedData.videos && fetchedData.videos.length > 0 ? fetchedData.videos : (state.data.videos || []),
        ads: fetchedData.ads || state.data.ads || [],
        reviews: fetchedData.reviews || state.data.reviews || []
      };

      state.isLiveConnected = true;

      // Cập nhật DATA_VERSION mới vào localStorage
      const newVersion = (state.data.config && state.data.config.DATA_VERSION)
        ? String(state.data.config.DATA_VERSION).trim()
        : (serverVersion || String(Date.now()));

      localStorage.setItem(cacheKey, JSON.stringify(state.data));
      localStorage.setItem(versionKey, newVersion);

      updateSyncBadge('live', newVersion);
      renderAllViews();

      if (force) {
        showToast('Đã làm mới dữ liệu từ Google Sheet! ⚡');
      } else if (cachedVersion && cachedVersion !== newVersion) {
        showToast(`Đã tự động cập nhật phiên bản mới (v${newVersion})! ✨`);
      }
    } else {
      updateSyncBadge(hasLocalData ? 'live' : 'cached', cachedVersion || '');
      if (force) showToast('Đang hiển thị dữ liệu lưu đệm mượt mà.');
    }
  }

  // 5. Tăng lượt dùng (Track View) - Có cơ chế Anti-Spam Debounce
  async function trackAppView(appId) {
    if (!appId) return;

    const app = (state.data.apps || []).find(a => a.id === appId);
    if (app) {
      app.views = (app.views || 0) + 1;
      renderFilteredApps();
    }

    // Anti-spam debounce: trong 60 giây cùng 1 app chỉ gửi 1 lần về server
    const now = Date.now();
    const lastTracked = state.trackedSessions[appId] || 0;
    if (now - lastTracked < 60000) return;
    state.trackedSessions[appId] = now;

    const postPayload = { action: 'trackView', id: appId };
    const endpoints = ['/api/data', cfg.APPS_SCRIPT_URL].filter(Boolean);

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(postPayload)
        });
        const rJson = await res.json();
        if (rJson && rJson.success && rJson.newViews && app) {
          app.views = rJson.newViews;
          break;
        }
      } catch (err) {}
    }
  }

  // 6. Gửi Phản hồi
  async function submitFeedback(name, email, content) {
    if (!cfg.APPS_SCRIPT_URL) {
      alert('Chưa cấu hình APPS_SCRIPT_URL trong config.js!');
      return;
    }

    DOM.btnSubmitFeedback.disabled = true;
    DOM.btnSubmitFeedback.innerHTML = `Đang gửi...`;

    try {
      await fetch(cfg.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submitFeedback',
          name: name,
          email: email,
          content: content
        })
      });
      showToast('Đã gửi phản hồi thành công! Cảm ơn Thầy/Cô ❤️');
      closeFeedbackModal();
      DOM.feedbackForm.reset();
    } catch (err) {
      showToast('Đã gửi phản hồi thành công về Google Sheet!');
      closeFeedbackModal();
      DOM.feedbackForm.reset();
    } finally {
      DOM.btnSubmitFeedback.disabled = false;
      DOM.btnSubmitFeedback.innerHTML = `<span>Gửi phản hồi về Sheet</span>`;
    }
  }

  // 7. Render Toàn Bộ & Cập nhật Thống kê Lượt dùng thực tế
  function renderAllViews() {
    updateGlobalStats();
    renderTags();
    renderFilteredApps();
    renderVideos();
  }

  function updateGlobalStats() {
    const apps = state.data.apps || [];
    const totalViews = apps.reduce((sum, a) => sum + (Number(a.views) || 0), 0);
    if (DOM.statTotalViews) {
      DOM.statTotalViews.textContent = `${totalViews.toLocaleString('vi-VN')}+ Lượt sử dụng thực tế`;
    }
    if (DOM.statTotalApps) {
      DOM.statTotalApps.textContent = `${apps.length}+ Công cụ sư phạm & Game`;
    }
  }

  // 8. Render Tags
  function renderTags() {
    if (!DOM.tagContainer) return;
    const allApps = state.data.apps || [];
    const tagSet = new Set();
    allApps.forEach(a => (a.tags || []).forEach(t => tagSet.add(t)));
    const tags = Array.from(tagSet);

    let html = `
      <button class="tag-btn text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
        state.selectedTag === null
          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-500'
      }" data-tag="ALL">Tất cả chủ đề</button>
    `;

    tags.forEach(tag => {
      const active = state.selectedTag === tag;
      html += `
        <button class="tag-btn text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
          active
            ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-500'
        }" data-tag="${tag}">${tag}</button>
      `;
    });

    DOM.tagContainer.innerHTML = html;

    DOM.tagContainer.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        state.selectedTag = tag === 'ALL' ? null : tag;
        state.displayedAppCount = state.appsPageSize;
        renderTags();
        renderFilteredApps();
      });
    });
  }

  // Helper: Xác định app thuộc phân hệ Công việc Giáo viên (linh hoạt theo từ khóa Tiếng Việt hoặc Tiếng Anh)
  function isTeacherCategory(category, categoryName = '') {
    const combined = (String(category || '') + ' ' + String(categoryName || '')).toLowerCase().trim();
    if (combined.includes('giáo viên') || combined.includes('teacher') || combined.includes('công việc')) return true;
    if (combined.includes('học sinh') || combined.includes('lớp') || combined.includes('trò chơi') || combined.includes('classroom')) return false;
    return true; // mặc định
  }

  // Helper: Xác định app thuộc phân hệ Lớp học & Trò chơi / Dành cho Học sinh
  function isClassroomCategory(category, categoryName = '') {
    const combined = (String(category || '') + ' ' + String(categoryName || '')).toLowerCase().trim();
    if (combined.includes('học sinh') || combined.includes('lớp') || combined.includes('trò chơi') || combined.includes('classroom')) return true;
    return false;
  }

  // Helper: Lọc danh sách ứng dụng theo điều kiện hiện tại
  function getFilteredApps() {
    const apps = state.data.apps || [];
    return apps.filter(app => {
      if (app.status === 'Ẩn') return false;

      if (state.currentTab === 'teacher' && !isTeacherCategory(app.category, app.category_name)) return false;
      if (state.currentTab === 'classroom' && !isClassroomCategory(app.category, app.category_name)) return false;
      if (state.currentTab === 'favorites' && !state.favorites.includes(app.id)) return false;

      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchName = (app.name || '').toLowerCase().includes(q);
        const matchDesc = (app.short_desc || '').toLowerCase().includes(q) || (app.desc || '').toLowerCase().includes(q);
        const matchTags = (app.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchTags) return false;
      }

      if (state.selectedTag) {
        if (!(app.tags || []).includes(state.selectedTag)) return false;
      }

      return true;
    });
  }

  // Helper: Tạo mã HTML cho 1 thẻ ứng dụng kèm animation mờ hiện dần
  function generateAppCardHtml(app, indexInBatch = 0) {
    const isFav = state.favorites.includes(app.id);
    const isTeacher = isTeacherCategory(app.category, app.category_name);
    
    const categoryBadge = isTeacher
      ? `<span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/40"><i data-lucide="graduation-cap" class="w-3 h-3"></i> Dành Cho Giáo Viên</span>`
      : `<span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/40"><i data-lucide="gamepad-2" class="w-3 h-3"></i> Dành Cho Học Sinh</span>`;

    const tagBadges = (app.tags || []).slice(0, 2).map(t => 
      `<span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">#${t}</span>`
    ).join('');

    const viewsFormatted = (app.views || 0).toLocaleString('vi-VN');
    const isTopUsed = (app.views || 0) > 2500;

    // Tính điểm đánh giá và số lượng nhận xét
    const appReviews = (state.data.reviews || []).filter(r => r.appId === app.id && r.status !== 'Ẩn');
    const reviewCount = appReviews.length > 0 ? appReviews.length : (app.reviewCount || 0);
    let ratingScore = 5.0;
    if (appReviews.length > 0) {
      ratingScore = (appReviews.reduce((acc, c) => acc + (c.rating || 5), 0) / appReviews.length).toFixed(1);
    } else if (app.rating) {
      ratingScore = Number(app.rating).toFixed(1);
    }

    const animDelay = (indexInBatch * 0.05).toFixed(2);

    return `
      <div class="app-card app-card-fade-in flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 shadow-sm overflow-hidden group" style="animation-delay: ${animDelay}s;">
        <div class="relative h-40 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <img 
            src="${app.img || 'https://res.cloudinary.com/dejnvixvn/image/upload/v1770181393/1_kfr9et.png'}" 
            alt="${app.name}" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop';"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            ${categoryBadge}
            ${isTopUsed ? `<span class="trending-badge text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">🔥 Thịnh hành</span>` : (app.badge ? `<span class="pulse-badge text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-sm">${app.badge}</span>` : '')}
          </div>

          <button 
            class="btn-favorite absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors shadow-sm z-10" 
            data-id="${app.id}" 
            title="${isFav ? 'Bỏ lưu' : 'Lưu ứng dụng'}"
          >
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}"></i>
          </button>

          <div class="absolute bottom-2 right-3 text-[11px] text-white/90 flex items-center gap-1 drop-shadow font-medium">
            <i data-lucide="flame" class="w-3.5 h-3.5 text-amber-400"></i> ${viewsFormatted} lượt dùng
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1.5 mb-2">
              ${tagBadges}
            </div>
            <h3 class="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
              ${app.name}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
              ${app.short_desc || app.desc}
            </p>

            <!-- Điểm đánh giá & Nhận xét từ giáo viên -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <button class="btn-card-review flex items-center gap-1.5 text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 font-bold transition-transform hover:scale-105" data-id="${app.id}" title="Xem ${reviewCount} nhận xét từ đồng nghiệp">
                <span class="text-amber-400 text-sm leading-none">★</span>
                <span>${ratingScore}</span>
                <span class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">(${reviewCount} đánh giá)</span>
              </button>
              <span class="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                <i data-lucide="users" class="w-3.5 h-3.5 text-teal-600"></i> ${viewsFormatted} dùng
              </span>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <button 
              class="btn-launch flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-white transition-all shadow-sm ${
                isTeacher
                  ? 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98]'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
              }"
              data-id="${app.id}"
            >
              <i data-lucide="play" class="w-3.5 h-3.5"></i>
              Sử dụng ngay
            </button>
            <button 
              class="btn-detail p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              data-id="${app.id}"
              title="Thông tin chi tiết"
            >
              <i data-lucide="info" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Helper: Gắn sự kiện cho các thẻ ứng dụng
  function attachCardListeners(targetContainer) {
    if (!targetContainer) return;

    targetContainer.querySelectorAll('.btn-card-review').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openReviewModal(id);
      });
    });

    targetContainer.querySelectorAll('.btn-launch').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        launchApp(id);
      });
    });

    targetContainer.querySelectorAll('.btn-detail').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        showAppDetail(id);
      });
    });

    targetContainer.querySelectorAll('.btn-favorite').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleFavorite(id);
      });
    });

    refreshLucideIcons();
  }

  // Cập nhật giao diện thanh tải thêm / cuộn vô hạn
  function updateLoadMoreUI(currentCount, totalFiltered) {
    if (!DOM.loadMoreContainer) return;

    if (state.currentTab === 'videos' || totalFiltered === 0) {
      DOM.loadMoreContainer.classList.add('hidden');
      return;
    }

    DOM.loadMoreContainer.classList.remove('hidden');

    if (DOM.loadMoreCounter) {
      DOM.loadMoreCounter.textContent = `Đang hiển thị ${currentCount} / ${totalFiltered} công cụ`;
    }

    const hasMore = currentCount < totalFiltered;

    if (hasMore) {
      const remaining = totalFiltered - currentCount;
      const nextBatch = Math.min(state.appsPageSize, remaining);
      if (DOM.loadMoreBtnText) {
        DOM.loadMoreBtnText.textContent = `Xem thêm ${nextBatch} công cụ (còn lại ${remaining})`;
      }
      if (DOM.loadMoreActionWrap) DOM.loadMoreActionWrap.classList.remove('hidden');
      if (DOM.loadMoreFinished) {
        DOM.loadMoreFinished.classList.add('hidden');
        DOM.loadMoreFinished.classList.remove('flex');
      }
      if (DOM.loadMoreSentinel) DOM.loadMoreSentinel.classList.remove('hidden');
    } else {
      // Đã xem hết toàn bộ ứng dụng
      if (DOM.loadMoreActionWrap) DOM.loadMoreActionWrap.classList.add('hidden');
      if (DOM.loadMoreFinished) {
        DOM.loadMoreFinished.classList.remove('hidden');
        DOM.loadMoreFinished.classList.add('flex');
      }
      if (DOM.loadMoreSentinel) DOM.loadMoreSentinel.classList.add('hidden');
    }
  }

  // 9. Render Apps Grid với Progressive Loading & Hiệu ứng mờ hiện dần
  function renderFilteredApps(isAppend = false) {
    const filtered = getFilteredApps();
    const totalFiltered = filtered.length;

    if (!isAppend) {
      // Khi lọc hoặc đổi tab: hiển thị từ đầu
      if (state.displayedAppCount > state.appsPageSize) {
        state.displayedAppCount = state.appsPageSize;
      }
    }

    const currentCount = Math.min(state.displayedAppCount, totalFiltered);

    if (DOM.appsCountBadge && state.currentTab !== 'videos') {
      DOM.appsCountBadge.textContent = `${totalFiltered} công cụ`;
    }

    if (totalFiltered === 0 && state.currentTab !== 'videos') {
      DOM.appsGrid.innerHTML = '';
      DOM.emptyState.classList.remove('hidden');
      if (DOM.loadMoreContainer) DOM.loadMoreContainer.classList.add('hidden');
      return;
    }

    if (state.currentTab !== 'videos') {
      DOM.emptyState.classList.add('hidden');
      if (DOM.loadMoreContainer) DOM.loadMoreContainer.classList.remove('hidden');
    }

    if (isAppend) {
      // Chỉ nạp các thẻ mới từ vị trí cũ đến vị trí mới
      const previousCount = DOM.appsGrid.children.length;
      const newItems = filtered.slice(previousCount, currentCount);
      let newHtml = '';
      newItems.forEach((app, idx) => {
        newHtml += generateAppCardHtml(app, idx);
      });

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newHtml;
      const fragment = document.createDocumentFragment();
      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      DOM.appsGrid.appendChild(fragment);
      attachCardListeners(DOM.appsGrid);
    } else {
      // Render fresh
      const itemsToRender = filtered.slice(0, currentCount);
      let html = '';
      itemsToRender.forEach((app, idx) => {
        html += generateAppCardHtml(app, idx);
      });
      DOM.appsGrid.innerHTML = html;
      attachCardListeners(DOM.appsGrid);
    }

    // Cập nhật trạng thái thanh tải thêm
    updateLoadMoreUI(currentCount, totalFiltered);
  }

  // Nạp thêm ứng dụng khi cuộn xuống hoặc bấm nút
  function loadMoreApps() {
    if (state.isLoadingMore) return;
    const filtered = getFilteredApps();
    if (state.displayedAppCount >= filtered.length) return;

    state.isLoadingMore = true;
    if (DOM.loadMoreSpinner) {
      DOM.loadMoreSpinner.classList.remove('hidden');
      DOM.loadMoreSpinner.classList.add('flex');
    }
    if (DOM.loadMoreActionWrap) DOM.loadMoreActionWrap.classList.add('hidden');

    // Chờ 250ms để tạo hiệu ứng chuyển tiếp mượt mà, tự nhiên
    setTimeout(() => {
      state.displayedAppCount += state.appsPageSize;
      renderFilteredApps(true);
      state.isLoadingMore = false;
      if (DOM.loadMoreSpinner) {
        DOM.loadMoreSpinner.classList.add('hidden');
        DOM.loadMoreSpinner.classList.remove('flex');
      }
    }, 250);
  }

  // 10. Render Videos Grid
  function renderVideos() {
    if (!DOM.videosGrid) return;
    const videos = state.data.videos || [];

    let filtered = videos.filter(v => {
      if (v.status === 'Ẩn') return false;
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        const matchTitle = (v.title || '').toLowerCase().includes(q);
        const matchDesc = (v.desc || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });

    if (state.currentTab === 'videos' && DOM.appsCountBadge) {
      DOM.appsCountBadge.textContent = `${filtered.length} video`;
    }

    if (filtered.length === 0) {
      DOM.videosGrid.innerHTML = '';
      if (state.currentTab === 'videos') DOM.emptyState.classList.remove('hidden');
    } else {
      if (state.currentTab === 'videos') DOM.emptyState.classList.add('hidden');

      let html = '';
      filtered.forEach(v => {
        const thumb = v.thumbnail || (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : '');
        html += `
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/60 overflow-hidden shadow-sm flex flex-col justify-between app-card group">
            <div class="relative h-48 bg-slate-900 overflow-hidden cursor-pointer btn-play-video" data-id="${v.youtubeId}" data-vid-id="${v.id}" data-title="${v.title}" data-desc="${v.desc}">
              <img src="${thumb}" alt="${v.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop';" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                <div class="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <i data-lucide="play" class="w-6 h-6 fill-white text-white ml-0.5"></i>
                </div>
              </div>
              <div class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                <i data-lucide="eye" class="w-3 h-3"></i> ${(v.views || 0).toLocaleString('vi-VN')}
              </div>
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                  ${v.title}
                </h4>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  ${v.desc}
                </p>
              </div>
              <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <button class="btn-play-video w-full py-2 px-3 rounded-xl text-xs font-semibold text-center bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center gap-1.5" data-id="${v.youtubeId}" data-vid-id="${v.id}" data-title="${v.title}" data-desc="${v.desc}">
                  <i data-lucide="play" class="w-3.5 h-3.5"></i>
                  Xem video bài giảng
                </button>
              </div>
            </div>
          </div>
        `;
      });
      DOM.videosGrid.innerHTML = html;

      DOM.videosGrid.querySelectorAll('.btn-play-video').forEach(btn => {
        btn.addEventListener('click', () => {
          const ytId = btn.getAttribute('data-id');
          const vidId = btn.getAttribute('data-vid-id');
          const title = btn.getAttribute('data-title');
          const desc = btn.getAttribute('data-desc');
          openVideoModal(ytId, title, desc, vidId);
        });
      });
    }

    refreshLucideIcons();
  }

  // 11. Modal Phát Video & Đếm lượt xem thực tế
  function openVideoModal(youtubeId, title, desc, vidId) {
    if (!youtubeId) {
      alert('Video chưa có mã YouTube');
      return;
    }
    if (vidId) trackVideoView(vidId);
    DOM.videoModalTitle.textContent = title || 'Video Bài Giảng';
    DOM.videoModalDesc.textContent = desc || '';
    DOM.videoIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    DOM.videoModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    refreshLucideIcons();
  }

  async function trackVideoView(vidId) {
    if (!vidId) return;
    const video = (state.data.videos || []).find(v => v.id === vidId);
    if (video) {
      video.views = (video.views || 0) + 1;
      if (state.currentTab === 'videos') renderVideos();
    }
    const endpoints = ['/api/data', cfg.APPS_SCRIPT_URL].filter(Boolean);
    for (const ep of endpoints) {
      try {
        await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'trackVideoView', id: vidId })
        });
        break;
      } catch (e) {}
    }
  }

  function closeVideoModal() {
    DOM.videoModal.classList.add('hidden');
    DOM.videoIframe.src = 'about:blank';
    document.body.classList.remove('overflow-hidden');
  }

  // 12. Modal Mời Cà Phê / Donate
  function openDonateModal() {
    const cfgData = state.data.config || {};
    const bank = cfgData.bankName || 'VIETCOMBANK';
    const acc = cfgData.bankAccountNo || '1022936211';
    const name = encodeURIComponent(cfgData.bankAccountName || 'TRAN HONG QUAN');
    const memo = encodeURIComponent('MOI CA PHE THAY QUAN');
    const qrUrl = `https://img.vietqr.io/image/${bank}-${acc}-compact2.png?addInfo=${memo}&accountName=${name}`;

    DOM.donateQrImg.src = qrUrl;
    DOM.donateBankInfo.innerHTML = `
      <div><strong>Ngân hàng:</strong> ${bank}</div>
      <div><strong>Số tài khoản:</strong> <span class="font-mono font-bold text-teal-600">${acc}</span></div>
      <div><strong>Chủ tài khoản:</strong> ${cfgData.bankAccountName || 'TRẦN HỒNG QUÂN'}</div>
      <div><strong>Nội dung:</strong> <span class="font-mono bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded text-amber-700 dark:text-amber-300 font-bold">MOI CA PHE THAY QUAN</span></div>
    `;

    DOM.donateModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    refreshLucideIcons();
  }

  function closeDonateModal() {
    DOM.donateModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  // 13. Khởi Chạy Ứng Dụng
  function launchApp(appId) {
    const app = (state.data.apps || []).find(a => a.id === appId);
    if (!app) return;

    trackAppView(appId);

    state.activeApp = app;
    const isTeacher = isTeacherCategory(app.category, app.category_name);
    const catDisplayName = isTeacher ? 'Dành Cho Giáo Viên' : 'Dành Cho Học Sinh';

    DOM.modalTitle.textContent = app.name;
    DOM.modalCategory.textContent = catDisplayName;
    DOM.appDescriptionText.textContent = app.desc || app.short_desc;

    DOM.iframeLoader.classList.remove('hidden');
    DOM.modalIframe.src = app.link;
    DOM.modalIframe.onload = () => {
      DOM.iframeLoader.classList.add('hidden');
    };

    DOM.appModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    refreshLucideIcons();
  }

  function closeModal() {
    DOM.appModal.classList.add('hidden');
    DOM.modalIframe.src = 'about:blank';
    document.body.classList.remove('overflow-hidden');
    state.isZenMode = false;
    state.activeApp = null;
  }

  function toggleZenMode() {
    state.isZenMode = !state.isZenMode;
    if (DOM.btnZenMode) {
      if (state.isZenMode) {
        DOM.modalDialog.classList.add('zen-mode');
        DOM.btnZenMode.innerHTML = `<i data-lucide="minimize" class="w-4 h-4"></i>`;
      } else {
        DOM.modalDialog.classList.remove('zen-mode');
        DOM.btnZenMode.innerHTML = `<i data-lucide="maximize" class="w-4 h-4"></i>`;
      }
      refreshLucideIcons();
    }
  }

  function showAppDetail(appId) {
    openReviewModal(appId);
  }

  // 14. Hệ Thống Đánh Giá & Bình Luận (Reviews & Ratings)
  function openReviewModal(appId) {
    state.currentReviewAppId = appId;
    const app = (state.data.apps || []).find(a => a.id === appId);
    if (!app) return;

    const isTeacher = isTeacherCategory(app.category, app.category_name);
    const catDisplayName = isTeacher ? 'Công việc Giáo viên' : 'Dành cho Học sinh';

    if (DOM.reviewModalTitle) DOM.reviewModalTitle.textContent = `Đánh Giá: ${app.name}`;
    if (DOM.reviewModalSubtitle) DOM.reviewModalSubtitle.textContent = `Phân hệ: ${catDisplayName} • ${app.short_desc || ''}`;

    const reviews = (state.data.reviews || []).filter(r => r.appId === appId && r.status !== 'Ẩn');
    const count = reviews.length;
    let avg = 5.0;
    if (count > 0) {
      const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      avg = (sum / count).toFixed(1);
    } else if (app.rating) {
      avg = Number(app.rating).toFixed(1);
    }

    if (DOM.reviewModalScore) DOM.reviewModalScore.textContent = avg;
    if (DOM.reviewModalCount) DOM.reviewModalCount.textContent = `Dựa trên ${count} nhận xét từ Thầy/Cô`;

    if (DOM.reviewModalStars) {
      let starsHtml = '';
      const rounded = Math.round(Number(avg));
      for (let i = 1; i <= 5; i++) {
        starsHtml += `<span class="${i <= rounded ? 'text-amber-400 font-bold' : 'text-slate-300 dark:text-slate-700'}">★</span>`;
      }
      DOM.reviewModalStars.innerHTML = starsHtml;
    }

    // Render danh sách nhận xét
    if (DOM.reviewsListContainer) {
      if (reviews.length === 0) {
        DOM.reviewsListContainer.innerHTML = `
          <div class="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500">
            <p class="font-medium">Chưa có đánh giá nào cho công cụ này.</p>
            <p class="text-[11px] text-slate-400 mt-1">Thầy/Cô hãy là người đầu tiên để lại cảm nhận và chia sẻ kinh nghiệm nhé!</p>
          </div>
        `;
      } else {
        DOM.reviewsListContainer.innerHTML = reviews.map(r => {
          const initials = (r.name || 'G').split(' ').map(w => w[0]).join('').slice(-2).toUpperCase();
          let stars = '';
          for (let s = 1; s <= 5; s++) {
            stars += `<span class="${s <= (r.rating || 5) ? 'text-amber-400 font-bold' : 'text-slate-300 dark:text-slate-600'}">★</span>`;
          }
          return `
            <div class="review-card p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-xl review-avatar flex items-center justify-center text-[10px] shadow-sm">
                    ${initials}
                  </div>
                  <div>
                    <h5 class="font-bold text-slate-800 dark:text-slate-100">${r.name || 'Thầy/Cô đồng nghiệp'}</h5>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400">${r.school || 'Giáo viên toàn quốc'}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-amber-400 text-xs">${stars}</div>
                  <span class="text-[10px] text-slate-400">${r.time || 'Gần đây'}</span>
                </div>
              </div>
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed pl-9">
                ${r.comment || ''}
              </p>
            </div>
          `;
        }).join('');
      }
    }

    setStarPickerValue(5);
    DOM.reviewModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    refreshLucideIcons();
  }

  function closeReviewModal() {
    if (DOM.reviewModal) DOM.reviewModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  function setStarPickerValue(val) {
    if (!DOM.starPicker) return;
    const rating = Math.max(1, Math.min(5, Number(val) || 5));
    if (DOM.reviewRatingVal) DOM.reviewRatingVal.value = rating;

    const labels = {
      1: '1 sao - Cần cải thiện thêm',
      2: '2 sao - Tạm ổn',
      3: '3 sao - Khá hữu ích',
      4: '4 sao - Rất tốt',
      5: '5 sao - Rất tuyệt vời'
    };
    if (DOM.starPickerText) DOM.starPickerText.textContent = labels[rating] || `${rating} sao`;

    DOM.starPicker.querySelectorAll('.star-btn').forEach(btn => {
      const bVal = Number(btn.getAttribute('data-val'));
      if (bVal <= rating) {
        btn.classList.add('text-amber-400');
        btn.classList.remove('text-slate-300', 'dark:text-slate-600');
      } else {
        btn.classList.remove('text-amber-400');
        btn.classList.add('text-slate-300', 'dark:text-slate-600');
      }
    });
  }

  function setupStarPicker() {
    if (!DOM.starPicker) return;
    DOM.starPicker.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        setStarPickerValue(val);
      });
    });
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    const appId = state.currentReviewAppId;
    if (!appId) return;

    const app = (state.data.apps || []).find(a => a.id === appId);
    const name = (DOM.reviewName.value || '').trim();
    const school = (DOM.reviewSchool.value || '').trim();
    const rating = Number(DOM.reviewRatingVal.value) || 5;
    const comment = (DOM.reviewComment.value || '').trim();

    if (!name || !comment) {
      alert('Vui lòng nhập Họ tên và Nội dung nhận xét.');
      return;
    }

    DOM.btnSubmitReview.disabled = true;
    DOM.btnSubmitReview.innerHTML = `Đang gửi đánh giá...`;

    const newRev = {
      id: 'REV_' + Date.now(),
      time: 'Vừa xong',
      appId: appId,
      appName: app ? app.name : '',
      name: name,
      school: school || 'Giáo viên',
      rating: rating,
      comment: comment,
      status: 'Hiện'
    };

    // Optimistic UI Update: Thêm ngay vào state
    if (!state.data.reviews) state.data.reviews = [];
    state.data.reviews.unshift(newRev);

    // Tính lại rating app
    if (app) {
      const appRevs = state.data.reviews.filter(r => r.appId === appId);
      app.reviewCount = appRevs.length;
      app.rating = Number((appRevs.reduce((acc, c) => acc + c.rating, 0) / app.reviewCount).toFixed(1));
    }

    renderFilteredApps();
    openReviewModal(appId);

    // Reset form
    DOM.reviewComment.value = '';
    DOM.btnSubmitReview.disabled = false;
    DOM.btnSubmitReview.innerHTML = `
      <i data-lucide="send" class="w-3.5 h-3.5"></i>
      <span>Gửi Đánh Giá Ngay</span>
    `;
    refreshLucideIcons();

    showToast('❤️ Cảm ơn Thầy/Cô đã gửi đánh giá quý báu!');

    // Gửi ngầm về Vercel Edge Proxy hoặc Google Apps Script
    const payload = {
      action: 'submitReview',
      appId: appId,
      appName: app ? app.name : '',
      name: name,
      school: school,
      rating: rating,
      comment: comment
    };

    const endpoints = ['/api/data', cfg.APPS_SCRIPT_URL].filter(Boolean);
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        const rJson = await res.json();
        if (rJson && rJson.success) break;
      } catch (err) {}
    }
  }

  function toggleFavorite(appId) {
    const index = state.favorites.indexOf(appId);
    if (index > -1) {
      state.favorites.splice(index, 1);
      showToast('Đã xóa khỏi danh sách yêu thích');
    } else {
      state.favorites.push(appId);
      showToast('Đã thêm vào danh sách yêu thích! ❤️');
    }
    localStorage.setItem('ai_gd_favorites', JSON.stringify(state.favorites));
    renderFilteredApps();
  }

  function openFeedbackModal() {
    if (state.activeApp) {
      DOM.feedbackContent.value = `[Báo lỗi ứng dụng: ${state.activeApp.name}]\n`;
    }
    DOM.feedbackModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    refreshLucideIcons();
  }

  function closeFeedbackModal() {
    DOM.feedbackModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  // ================= 14. LOGIC QUẢNG CÁO & THÔNG BÁO THÔNG MINH =================
  function initPromoModal() {
    const ads = state.data.ads || [];
    const activeAd = ads.find(a => a.status !== 'Ẩn');
    if (!activeAd) {
      if (DOM.btnFloatingGift) DOM.btnFloatingGift.classList.add('hidden');
      return;
    }

    // Đổ dữ liệu
    DOM.promoTitle.textContent = activeAd.title || 'Thông Báo Nổi Bật';
    DOM.promoContent.textContent = activeAd.content || '';

    if (activeAd.img) {
      DOM.promoImg.src = activeAd.img;
      DOM.promoImgContainer.classList.remove('hidden');
    } else {
      DOM.promoImgContainer.classList.add('hidden');
    }

    if (activeAd.attachment) {
      DOM.promoAttachmentBtn.href = activeAd.attachment;
    }

    // Tự động mở popup sau 800ms với đếm ngược 5s
    setTimeout(() => {
      openPromoModal(true); // true = có đếm ngược 5s ban đầu
    }, 800);
  }

  // Mở Popup Quảng cáo
  // isCountdown: true = có đếm ngược 5s ban đầu; false = chế độ xem chi tiết không thời gian
  function openPromoModal(isCountdown = false) {
    DOM.promoModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    if (isCountdown) {
      // Chế độ tóm tắt đếm ngược 5s
      DOM.promoHeaderBadge.textContent = 'Thông Báo Nổi Bật';
      DOM.promoTimerBadge.classList.remove('hidden');
      DOM.btnViewNowPromo.classList.remove('hidden');
      DOM.promoAttachmentBtn.classList.add('hidden');
      startPromoTimer(5);
    } else {
      // Chế độ xem chi tiết KHÔNG GIỚI HẠN THỜI GIAN
      stopPromoTimer();
      DOM.promoHeaderBadge.textContent = '📢 Bản Tin Chi Tiết';
      DOM.promoTimerBadge.classList.add('hidden');
      DOM.btnViewNowPromo.classList.add('hidden');
      
      const activeAd = (state.data.ads || []).find(a => a.status !== 'Ẩn');
      if (activeAd && activeAd.attachment) {
        DOM.promoAttachmentBtn.classList.remove('hidden');
      }
    }
  }

  function startPromoTimer(seconds = 5) {
    stopPromoTimer();
    state.promoSecondsLeft = seconds;
    updatePromoTimerUI();

    state.promoTimer = setInterval(() => {
      state.promoSecondsLeft -= 1;
      updatePromoTimerUI();

      if (state.promoSecondsLeft <= 0) {
        stopPromoTimer();
        closePromoModal();
      }
    }, 1000);
  }

  function stopPromoTimer() {
    if (state.promoTimer) {
      clearInterval(state.promoTimer);
      state.promoTimer = null;
    }
  }

  function updatePromoTimerUI() {
    if (DOM.promoTimerText) {
      DOM.promoTimerText.textContent = `${state.promoSecondsLeft}s`;
    }
  }

  function closePromoModal() {
    stopPromoTimer();
    DOM.promoModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  // Thiết lập sự kiện cho Popup Quảng cáo (Đã bỏ tự dừng khi rê chuột)
  function setupPromoInteraction() {
    // Nút "XEM NGAY CHI TIẾT": Hủy đếm ngược và mở trang quảng cáo không còn thời gian
    if (DOM.btnViewNowPromo) {
      DOM.btnViewNowPromo.addEventListener('click', () => {
        openPromoModal(false); // Chuyển sang chế độ không thời gian
      });
    }

    // Nút Đóng
    if (DOM.btnClosePromo) DOM.btnClosePromo.addEventListener('click', closePromoModal);
    if (DOM.btnDismissPromo) DOM.btnDismissPromo.addEventListener('click', closePromoModal);

    // Nút Floating ở góc màn hình: Mở thẳng chế độ xem chi tiết KHÔNG CÓ THỜI GIAN
    if (DOM.btnFloatingGift) {
      DOM.btnFloatingGift.addEventListener('click', () => {
        openPromoModal(false); // Mở xem thoải mái, bấm đóng mới đóng
      });
    }
  }

  function refreshLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // 15. Setup Tabs
  function setupTabs() {
    DOM.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        state.currentTab = tab;
        state.displayedAppCount = state.appsPageSize;

        DOM.tabButtons.forEach(b => {
          b.classList.remove('active-tab', 'bg-teal-600', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        });

        btn.classList.add('active-tab', 'bg-teal-600', 'text-white', 'shadow-md');
        btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');

        if (tab === 'videos') {
          DOM.appsGrid.classList.add('hidden');
          DOM.tagContainer.classList.add('hidden');
          if (DOM.loadMoreContainer) DOM.loadMoreContainer.classList.add('hidden');
          DOM.videosSection.classList.remove('hidden');
          renderVideos();
        } else {
          DOM.appsGrid.classList.remove('hidden');
          DOM.tagContainer.classList.remove('hidden');
          DOM.videosSection.classList.add('hidden');
          renderFilteredApps();
        }
      });
    });
  }

  // 16. Setup Search
  function setupSearch() {
    if (!DOM.searchInput) return;

    DOM.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      state.displayedAppCount = state.appsPageSize;
      if (state.searchQuery) {
        DOM.clearSearchBtn.classList.remove('hidden');
      } else {
        DOM.clearSearchBtn.classList.add('hidden');
      }
      if (state.currentTab === 'videos') {
        renderVideos();
      } else {
        renderFilteredApps();
      }
    });

    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        state.searchQuery = '';
        state.displayedAppCount = state.appsPageSize;
        DOM.clearSearchBtn.classList.add('hidden');
        if (state.currentTab === 'videos') {
          renderVideos();
        } else {
          renderFilteredApps();
        }
      });
    }
  }

  // 17. Setup Infinite Scroll & Load More
  function setupInfiniteScroll() {
    if (DOM.btnLoadMore) {
      DOM.btnLoadMore.addEventListener('click', () => {
        loadMoreApps();
      });
    }

    if (!DOM.loadMoreSentinel) return;

    if ('IntersectionObserver' in window) {
      if (state.infiniteScrollObserver) {
        state.infiniteScrollObserver.disconnect();
      }

      state.infiniteScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !state.isLoadingMore && state.currentTab !== 'videos') {
            const filtered = getFilteredApps();
            if (state.displayedAppCount < filtered.length) {
              loadMoreApps();
            }
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.1
      });

      state.infiniteScrollObserver.observe(DOM.loadMoreSentinel);
    }
  }

  // 17. Setup Events
  function setupEvents() {
    if (DOM.btnCloseModal) DOM.btnCloseModal.addEventListener('click', closeModal);
    if (DOM.modalBackdrop) DOM.modalBackdrop.addEventListener('click', closeModal);
    if (DOM.btnZenMode) DOM.btnZenMode.addEventListener('click', toggleZenMode);
    if (DOM.btnReloadIframe) {
      DOM.btnReloadIframe.addEventListener('click', () => {
        if (state.activeApp) {
          DOM.iframeLoader.classList.remove('hidden');
          DOM.modalIframe.src = state.activeApp.link;
        }
      });
    }
    if (DOM.btnReportIssue) DOM.btnReportIssue.addEventListener('click', openFeedbackModal);

    // Donate buttons
    if (DOM.btnHeaderDonate) DOM.btnHeaderDonate.addEventListener('click', openDonateModal);
    if (DOM.btnIframeDonate) DOM.btnIframeDonate.addEventListener('click', openDonateModal);
    if (DOM.btnCloseDonate) DOM.btnCloseDonate.addEventListener('click', closeDonateModal);

    // Video modal
    if (DOM.btnCloseVideo) DOM.btnCloseVideo.addEventListener('click', closeVideoModal);

    // Force sync
    if (DOM.btnForceSync) {
      DOM.btnForceSync.addEventListener('click', () => {
        fetchLiveGoogleSheetData(true);
      });
    }

    // Feedback
    if (DOM.btnCloseFeedback) DOM.btnCloseFeedback.addEventListener('click', closeFeedbackModal);
    if (DOM.feedbackForm) {
      DOM.feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = DOM.feedbackName.value.trim();
        const email = DOM.feedbackEmail.value.trim();
        const content = DOM.feedbackContent.value.trim();
        if (!content) {
          alert('Vui lòng nhập nội dung');
          return;
        }
        submitFeedback(name, email, content);
      });
    }

    // Review Modal & Form
    if (DOM.btnIframeReview) {
      DOM.btnIframeReview.addEventListener('click', () => {
        if (state.activeApp) openReviewModal(state.activeApp.id);
      });
    }
    if (DOM.btnCloseReview) DOM.btnCloseReview.addEventListener('click', closeReviewModal);
    if (DOM.reviewForm) DOM.reviewForm.addEventListener('submit', handleReviewSubmit);
    setupStarPicker();

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!DOM.appModal.classList.contains('hidden')) closeModal();
        if (!DOM.videoModal.classList.contains('hidden')) closeVideoModal();
        if (!DOM.donateModal.classList.contains('hidden')) closeDonateModal();
        if (!DOM.feedbackModal.classList.contains('hidden')) closeFeedbackModal();
        if (!DOM.promoModal.classList.contains('hidden')) closePromoModal(true);
        if (DOM.reviewModal && !DOM.reviewModal.classList.contains('hidden')) closeReviewModal();
      }
    });

    setupPromoInteraction();
  }

  function init() {
    initTheme();
    renderAllViews();
    setupTabs();
    setupSearch();
    setupEvents();
    setupInfiniteScroll();
    refreshLucideIcons();

    // Mở popup quảng cáo tự động
    initPromoModal();

    setTimeout(() => {
      fetchLiveGoogleSheetData(false);
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
