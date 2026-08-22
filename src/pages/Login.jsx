import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(formData);
      
      // Cek apakah user adalah admin atau pembeli, lalu arahkan sesuai hak aksesnya
      if (data.is_staff) {
        navigate('/admin/products');
      } else {
        navigate('/'); // Halaman katalog publik pembeli
      }
    } catch (err) {
      console.error("Login gagal:", err);
      setError(err.response?.data?.detail || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto shadow-lg mb-3">🔐</div>
          <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
          <p className="text-sm text-slate-500 mt-1">Masuk ke akun inventaris Anda</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Username</label>
            <input 
              type="text" 
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-100 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Belum punya akun? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Daftar di sini</Link>
        </p>

      </div>
    </div>
  );
}