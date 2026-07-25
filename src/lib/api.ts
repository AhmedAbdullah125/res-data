import axios from 'axios'

/**
 * Central axios instance for the RES-DATA backend.
 * Base URL comes from VITE_API_BASE_URL (see .env.example), with a
 * fallback to the deployed backend host.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  'https://dashboard.res-va.com'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Skip ngrok's free-tier browser-warning interstitial so responses
    // come back as JSON instead of ngrok's HTML page. Harmless once the
    // base URL moves off ngrok.
    'ngrok-skip-browser-warning': 'true',
  },
})

// Attach a bearer token if one is stored (adjust to your auth flow).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('res_data_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
