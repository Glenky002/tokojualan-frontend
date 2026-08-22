import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Toast from '../components/Toast'; // <--- Import Toast lokal Anda

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '', role: '', avatar: null });
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk mengontrol Toast lokal
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fungsi helper untuk memunculkan toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Ambil data profil dari backend saat halaman dimuat
  useEffect(() => {
    api.get('/auth/user-profile/') 
      .then((res) => {
        setUser(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data user", err);
        showToast("Gagal memuat data profil", "error");
        setIsLoading(false);
      });
  }, []);

  // Fungsi untuk handle upload foto profil baru
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    showToast("Mengunggah foto profil...", "success");

    api.put('/auth/user-profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      // Update state avatar secara instan agar langsung berubah tanpa refresh
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      showToast("Foto profil berhasil diubah! ✨", "success");
    })
    .catch((err) => {
      console.error("Gagal upload foto", err);
      showToast("Gagal mengunggah foto.", "error");
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      {/* Panggil Toast lokal Anda */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast((prev) => ({ ...prev, show: false }))} 
        />
      )}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
        
        {/* --- BAGIAN AVATAR & TOMBOL UPLOAD --- */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-indigo-500" 
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition flex items-center gap-2">
            <span>📷 Ganti Foto</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange} 
              className="hidden" 
            />
          </label>
        </div>
        
        <h2 className="text-2xl font-extrabold text-center text-slate-900 mb-8">Profil Saya</h2>
        
        {/* --- KONTEN INFORMASI USER --- */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-100 rounded-xl"></div>
            <div className="h-12 bg-slate-100 rounded-xl"></div>
            <div className="h-12 bg-slate-100 rounded-xl"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase">Nama Lengkap</label>
              <p className="text-lg font-semibold text-slate-800">{user.name || 'User'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
              <p className="text-lg font-semibold text-slate-800">{user.email}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <label className="text-xs font-bold text-indigo-400 uppercase">Status Akun</label>
              <p className="text-lg font-bold text-indigo-700 capitalize">{user.role}</p>
            </div>
          </div>
        )}

        {/* --- TOMBOL KEMBALI --- */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => window.history.back()} 
            className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-sm text-slate-700 transition cursor-pointer"
          >
            Kembali
          </button>
        </div>

      </div>
    </div>
  );
}