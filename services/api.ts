import { API_URL, MOCK_DATA } from '../constants';
import { ApiResponse, AppItem, Config, ProductItem, ProductType, AdItem } from '../types';

// Caching Keys
const CACHE_KEYS = {
  VERSION: 'app_data_version',
  APPS: 'app_cache_apps',
  COURSES: 'app_cache_courses',
  SOFTWARE: 'app_cache_software',
  ADS: 'app_cache_ads'
};

// --- Cache Helpers ---
const getFromCache = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn('Cache parsing error', e);
    return null;
  }
};

const saveToCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Cache saving error', e);
  }
};

const clearDataCache = () => {
  localStorage.removeItem(CACHE_KEYS.APPS);
  localStorage.removeItem(CACHE_KEYS.COURSES);
  localStorage.removeItem(CACHE_KEYS.SOFTWARE);
  localStorage.removeItem(CACHE_KEYS.ADS);
};

// --- Fetcher ---
const fetchFromScript = async (action: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
  if (MOCK_DATA) return mockHandler(action, body);

  const url = `${API_URL}?action=${action}`;
  
  const options: RequestInit = {
    method,
  };

  if (method === 'POST') {
    options.body = JSON.stringify(body);
    options.headers = {
      'Content-Type': 'text/plain;charset=utf-8',
    };
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API Error [${action}]:`, error);
    // If network fails, try to return cache if possible for GET requests
    if (method === 'GET') {
       if (action === 'getApps') return { success: true, data: getFromCache(CACHE_KEYS.APPS) || [] };
       if (action === 'getCourses') return { success: true, data: getFromCache(CACHE_KEYS.COURSES) || [] };
       if (action === 'getSoftware') return { success: true, data: getFromCache(CACHE_KEYS.SOFTWARE) || [] };
       if (action === 'getAds') return { success: true, data: getFromCache(CACHE_KEYS.ADS) || [] };
    }
    return { success: false, message: "Lỗi kết nối mạng." };
  }
};

export const api = {
  // Public with Smart Caching Strategy
  
  // getConfig: Always fetches from network to check Version (The "Check" Command)
  getConfig: async () => {
    const response = await fetchFromScript('getConfig');
    if (response.success && response.data) {
       const serverVersion = response.data.DATA_VERSION || '1.0';
       const localVersion = localStorage.getItem(CACHE_KEYS.VERSION);

       // Nếu phiên bản server khác local -> Xóa cache cũ
       if (serverVersion !== localVersion) {
          console.log(`New version detected: ${serverVersion} (Old: ${localVersion}). Clearing cache.`);
          clearDataCache();
          localStorage.setItem(CACHE_KEYS.VERSION, serverVersion);
       }
    }
    return response;
  },

  // Data Getters: Try Cache First -> Then Network
  getApps: async () => {
    const cached = getFromCache<AppItem[]>(CACHE_KEYS.APPS);
    if (cached) return { success: true, data: cached };
    
    const response = await fetchFromScript('getApps');
    if (response.success) saveToCache(CACHE_KEYS.APPS, response.data);
    return response;
  },

  getCourses: async () => {
    const cached = getFromCache<ProductItem[]>(CACHE_KEYS.COURSES);
    if (cached) return { success: true, data: cached };

    const response = await fetchFromScript('getCourses');
    if (response.success) saveToCache(CACHE_KEYS.COURSES, response.data);
    return response;
  },

  getSoftware: async () => {
    const cached = getFromCache<ProductItem[]>(CACHE_KEYS.SOFTWARE);
    if (cached) return { success: true, data: cached };

    const response = await fetchFromScript('getSoftware');
    if (response.success) saveToCache(CACHE_KEYS.SOFTWARE, response.data);
    return response;
  },

  getAds: async () => {
    const cached = getFromCache<AdItem[]>(CACHE_KEYS.ADS);
    if (cached) return { success: true, data: cached };

    const response = await fetchFromScript('getAds');
    if (response.success) saveToCache(CACHE_KEYS.ADS, response.data);
    return response;
  },
  
  // Auth (Never Cache)
  register: (data: any) => fetchFromScript('register', 'POST', data),
  login: (data: any) => fetchFromScript('login', 'POST', data),
  submitFeedback: (data: any) => fetchFromScript('submitFeedback', 'POST', data),
  registerFreeProduct: (username: string, productId: string) => fetchFromScript('registerFreeProduct', 'POST', { username, productId }),

  // Admin Methods
  adminGetAllData: (sheetName: string) => fetchFromScript('adminGetAllData', 'POST', { sheetName }),
  adminUpdateConfig: (config: any) => fetchFromScript('adminUpdateConfig', 'POST', config),
  adminSaveItem: (sheetName: string, item: any) => fetchFromScript('adminSaveItem', 'POST', { sheetName, item }),
};

// --- Mock Data Handler ---
const mockHandler = async (action: string, body: any): Promise<ApiResponse<any>> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: false, message: "Mock data not fully implemented." };
};