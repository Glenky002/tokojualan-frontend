import api from '../api/axiosConfig';

// Fungsi Login
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  if (response.data.access) {
    // Simpan token dan data user ke localStorage
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('is_staff', response.data.is_staff); // True jika admin, False jika pembeli
  }
  return response.data;
};

// Fungsi Register
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

// Fungsi Logout
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
  localStorage.removeItem('is_staff');
};

// Cek apakah user sudah login
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// Cek apakah user adalah admin
export const isAdmin = () => {
  return localStorage.getItem('is_staff') === 'true';
};

// Mengambil semua daftar user (Khusus Admin)
export const getAllUsers = async () => {
  const token = localStorage.getItem('access_token');
  const response = await api.get('/auth/users/', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Mengubah user biasa menjadi pegawai/admin
export const promoteUser = async (userId) => {
  const token = localStorage.getItem('access_token');
  const response = await api.patch(`/auth/users/${userId}/promote/`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};