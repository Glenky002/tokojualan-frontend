import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Toast from '../components/Toast';
import OrderHistory from '../components/OrderHistory';
import AddressManager from '../components/AddressManager';

export default function Profile() {
  const [user, setUser] = useState({ 
    name: '',
    first_name: '', 
    email: '', 
    whatsapp: '', 
    address: '', 
    role: '', 
    avatar: null 
  });
  
  const [orders, setOrders] = useState([]); 
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk Tab Aktif: 'profile' | 'addresses' | 'orders' | 'security'
  const [activeTab, setActiveTab] = useState('profile');
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.get('/auth/user-profile/'),
          api.get('/transactions/') // <--- Ubah dari /orders/ ke /transactions/
        ]);
        
        setUser(profileRes.data);
        // Menangani format data DRF yang mungkin menggunakan .results atau langsung array
        const ordersData = ordersRes.data.results || ordersRes.data;
        setOrders(ordersData);
        setIsLoading(false);
      } catch (err) {
        console.error("Gagal memuat data profil atau pesanan", err);
        showToast("Gagal memuat data profil", "error");
        setIsLoading(false);
      }
    };

      fetchProfileAndOrders();
    }, []);



  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Ganti dari api.put menjadi api.patch
    api.patch('/auth/user-profile/', {
      first_name: user.first_name,
      whatsapp: user.whatsapp,
      address: user.address
    })
    .then((res) => {
      setUser(res.data);
      showToast("Profil berhasil diperbarui! ✨", "success");
      setIsSaving(false);
    })
    .catch((err) => {
      console.error("Gagal update profil", err);
      showToast("Gagal memperbarui profil.", "error");
      setIsSaving(false);
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    showToast("Mengunggah foto profil...", "success");

    api.put('/auth/user-profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => {
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      showToast("Foto profil berhasil diubah! 📸", "success");
    })
    .catch((err) => {
      console.error("Gagal upload foto", err);
      showToast("Gagal mengunggah foto.", "error");
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    api.post('/auth/change-password/', {
      old_password: passwords.old_password,
      new_password: passwords.new_password
    })
    .then(() => {
      showToast("Password berhasil diubah! 🔑", "success");
      setPasswords({ old_password: '', new_password: '' });
    })
    .catch((err) => {
      // Tampilkan pesan error dari backend jika password lama salah
      const errorMsg = err.response?.data?.detail || "Gagal mengubah password.";
      showToast(errorMsg, "error");
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 mb-20">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast((prev) => ({ ...prev, show: false }))} 
        />
      )}

      {/* --- HEADER KARTU PROFIL & AVATAR --- */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-24 h-24 mb-3">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-indigo-500" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">{user.first_name || user.name || 'User Toko'}</h2>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-0.5">{user.role || 'customer'}</p>
          
          <label className="cursor-pointer mt-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5">
            <span>📷 Ganti Foto Profil</span>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        {/* --- TOMBOL TAB NAVIGASI (MENU UTAMA) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-100 p-1.5 rounded-2xl mb-8 gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            👤 Informasi Profil
          </button>
          
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'addresses' 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            📍 Daftar Alamat
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs font-bold rounded-xl transition cursor-pointer relative ${
              activeTab === 'orders' 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            📦 Riwayat Pesanan 
            {orders.length > 0 && (
              <span className="ml-1 bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full text-[10px]">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'security' 
                ? 'bg-white text-indigo-600 shadow-md' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🔑 Ubah Sandi
          </button>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4 py-6">
            <div className="h-12 bg-slate-100 rounded-xl"></div>
            <div className="h-12 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
          </div>
        ) : (
          <div>
            {/* --- KONTEN TAB 1: EDIT PROFIL --- */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="first_name" 
                      value={user.first_name || ''} 
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email (Terkunci)</label>
                    <input 
                      type="email" 
                      value={user.email || ''} 
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 p-3.5 rounded-xl font-semibold text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nomor WhatsApp</label>
                  <input 
                    type="text" 
                    name="whatsapp" 
                    placeholder="Contoh: 08123456789" 
                    value={user.whatsapp || ''} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition cursor-pointer"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            )}

            {/* --- KONTEN TAB 2: DAFTAR ALAMAT --- */}
            {activeTab === 'addresses' && (
              <div className="animate-in fade-in duration-200">
                <AddressManager showToast={showToast} />
              </div>
            )}

            {/* --- KONTEN TAB 3: RIWAYAT PESANAN --- */}
            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-200">
                <OrderHistory orders={orders} />
              </div>
            )}

            {/* --- KONTEN TAB 4: UBAH SANDI --- */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="space-y-4 animate-in fade-in duration-200 max-w-lg mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Keamanan Akun</h3>
                  <p className="text-xs text-slate-500">Pastikan menggunakan sandi yang kuat dan tidak mudah ditebak.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password Lama</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={passwords.old_password}
                    onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password Baru</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Perbarui Sandi
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- TOMBOL KEMBALI --- */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center">
          <button 
            onClick={() => window.history.back()} 
            className="px-8 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-sm text-slate-700 transition cursor-pointer"
          >
            ← Kembali
          </button>
        </div>

      </div>
    </div>
  );
}