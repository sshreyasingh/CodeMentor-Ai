// In production, the backend serves the frontend on the same origin,
// so API and Socket URLs resolve to the same host.
// In development, the Vite dev server runs on port 5173 and proxies
// /api and /socket.io to the backend on port 5000.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Empty string = socket.io connects to current origin (production).
// In dev, override with VITE_SOCKET_URL=http://localhost:5000 via .env
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';
