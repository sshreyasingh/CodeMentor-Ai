// API and Socket server URL. 
// In split deployment (Vercel frontend + Render backend), set VITE_API_URL to the absolute Render URL.
// In same-origin deployment (backend serves frontend), leave empty for relative paths.
const API_SERVER = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || '';

export const API_BASE_URL = API_SERVER ? `${API_SERVER}/api/v1` : '/api/v1';
export const SOCKET_URL = API_SERVER || '';
export const GITHUB_AUTH_URL = `${API_SERVER || ''}/api/v1/auth/github`;
