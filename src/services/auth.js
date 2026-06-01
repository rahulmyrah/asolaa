import { apiUrl } from './api';

const TOKEN_KEY = 'asolaa_internal_auth_token';

const authHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const requestAuth = async (path, options = {}) => {
    const response = await fetch(apiUrl(`/auth${path}`), {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
            ...options.headers,
        },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
    }
    return data;
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const data = await requestAuth('/me');
    return data.user;
};

export const registerWithEmail = async (email, password, name, inviteCode = '') => {
    const data = await requestAuth('/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, inviteCode }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    return data.user;
};

export const loginWithEmail = async (email, password) => {
    const data = await requestAuth('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    return data.user;
};

export const logoutUser = async () => {
    localStorage.removeItem(TOKEN_KEY);
};
