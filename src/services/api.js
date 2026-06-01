export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
