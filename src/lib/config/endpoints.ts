// API Base URL
// export const API_BASE_URL = 'https://star-moderately-penguin.ngrok-free.app';
export const API_BASE_URL = 'https://api.offers.run';
// Authentication endpoints
export const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/api/register`,
  login: `${API_BASE_URL}/api/login`,
  logout: `${API_BASE_URL}/api/logout`,
  resetPassword: `${API_BASE_URL}/reset-password`,
  verify: {
    status: `${API_BASE_URL}/api/verification/status`,
    email: {
      send: `${API_BASE_URL}/api/verify/email/send`,
    },
    phone: {
      send: `${API_BASE_URL}/api/verify/phone/send`,
      verify: `${API_BASE_URL}/api/verify/phone/otp`,
     
    }
  },
} as const;

// User management endpoints
export const USER_ENDPOINTS = {
  profile: `${API_BASE_URL}/user/profile`,
  updateProfile: `${API_BASE_URL}/user/profile/update`,
} as const;

// Brand specific endpoints
export const BRAND_ENDPOINTS = {
  create: `${API_BASE_URL}/api/brands`,
  update: (brandId: string) => `${API_BASE_URL}/api/brands/${brandId}`,
  ads: {
    create: `${API_BASE_URL}/api/ads`,
    list: (brandId: string) => `${API_BASE_URL}/api/brands/${brandId}/ads`,
  },
  delete: (brandId: string) => `${API_BASE_URL}/api/brands/${brandId}`,
  list: `${API_BASE_URL}/api/user/brands`,
  toggleAd: (adId: string) => `${API_BASE_URL}/api/ads/${adId}/toggle`,
  createCampaign: `${API_BASE_URL}/brand/campaign/create`,
  campaigns: `${API_BASE_URL}/brand/campaigns`,
  analytics: `${API_BASE_URL}/brand/analytics`,
} as const;

// Presenter specific endpoints
export const PRESENTER_ENDPOINTS = {
  campaigns: `${API_BASE_URL}/api/presenter/campaigns`,
  earnings: `${API_BASE_URL}/presenter/earnings`,
  analytics: `${API_BASE_URL}/presenter/analytics`,
  tokens: {
    generate: `${API_BASE_URL}/api/presenters/generate-token`,
    get: `${API_BASE_URL}/api/presenters/get-token`,
  },
  stats: `${API_BASE_URL}/api/presenters/stats`,
  clicks: `${API_BASE_URL}/api/presenters/clicks`,
} as const;

// Ads endpoints
export const ADS_ENDPOINTS = {
  list: `${API_BASE_URL}/api/ads`,
  get: (adId: string) => `${API_BASE_URL}/api/ads/${adId}`,
  toggleAd: (adId: string) => `${API_BASE_URL}/api/ads/${adId}/toggle`,
} as const;