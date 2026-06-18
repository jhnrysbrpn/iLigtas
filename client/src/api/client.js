const BASE_URL = 'https://iligtas-2.onrender.com';

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("BASE_URL:", BASE_URL);

// ─── Token Helpers ────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem('bdrrmc_token');
export const setToken = (token) => localStorage.setItem('bdrrmc_token', token);
export const removeToken = () => localStorage.removeItem('bdrrmc_token');

// ─── Base Fetch Wrapper ───────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    // Throw the full error payload so callers can read data.message or data.errors
    throw { status: res.status, ...data };
  }

  return data.data ?? data;
}

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

export const authAPI = {
  /**
   * POST /api/auth/signup
   * @param {{ name, email, phone, username, password, role?, requestedRole?, department?, departmentId? }} body
   */
  signup: (body) =>
    request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * POST /api/auth/login
   * @param {{ email, password }} body
   */
  login: (body) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

// ─── Health Check ─────────────────────────────────────────────────────────────

export const healthCheck = () => request('/api/health');