import { supabase } from '../supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Wraps fetch() and automatically attaches the logged-in admin's Supabase
// access token, so protected backend routes (see backend/index.js) accept it.
export async function apiFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  const headers = { ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}

export { API_BASE_URL };
