// VITE_API_URL must be set to the absolute Render backend URL, e.g.:
//   https://your-backend.onrender.com/api/v1
const rawApiUrl = import.meta.env.VITE_API_URL || '';

if (!rawApiUrl && import.meta.env.PROD) {
  console.error(
    'VITE_API_URL is not set! API calls will fail.\n' +
    'Set it in Vercel dashboard → Settings → Environment Variables:\n' +
    '  VITE_API_URL = https://your-backend.onrender.com/api/v1'
  );
}

const API_SERVER = rawApiUrl.replace('/api/v1', '') || '';

export const API_BASE_URL = API_SERVER ? `${API_SERVER}/api/v1` : '/api/v1';
export const SOCKET_URL = API_SERVER || '';
export const GITHUB_AUTH_URL = API_SERVER ? `${API_SERVER}/api/v1/auth/github` : '/api/v1/auth/github';
