import axios from 'axios';

const API = axios.create({
  // baseURL: 'https://GreenNus.pythonanywhere.com/api',
  baseURL: 'http://127.0.0.1:8000/api',
});

// 1. Interceptor Request: Mengirim token di setiap request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Interceptor Response: Otomatis refresh token jika 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error adalah 401 dan kita belum mencoba me-refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // Panggil endpoint refresh token di backend Anda
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });

        // const response = await axios.post('https://GreenNus.pythonanywhere.com/api/token/refresh/', {
        //   refresh: refreshToken,
        // });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Update header untuk request yang gagal tadi dengan token baru
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Ulangi request asli
        return API(originalRequest);
      } catch (refreshError) {
        // Jika refresh token juga expired, arahkan ke login
        console.error("Session expired, logging out...");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;