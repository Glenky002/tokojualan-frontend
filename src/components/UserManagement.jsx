import React, { useEffect, useState } from 'react';
import { getAllUsers, promoteUser } from '../services/authService';

export default function UserManagement({ showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Custom Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({ show: false, userId: null, username: '' });

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      if (showToast) showToast("Gagal memuat data pengguna", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fungsi saat tombol "Jadikan Pegawai" diklik (Membuka Custom Modal)
  const handleOpenConfirm = (userId, username) => {
    setConfirmModal({ show: true, userId, username });
  };

  // Fungsi eksekusi setelah user menekan tombol "Ya, Lanjutkan" di modal
  const handleConfirmPromote = async () => {
    const { userId, username } = confirmModal;
    setConfirmModal({ show: false, userId: null, username: '' }); // Tutup modal dulu

    try {
      await promoteUser(userId);
      if (showToast) {
        showToast(`Berhasil! ${username} sekarang adalah pegawai.`, "success");
      }
      fetchUsers(); // Refresh data user secara real-time
    } catch (err) {
      console.error(err);
      if (showToast) {
        showToast("Gagal mengubah hak akses user.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
        <p className="text-sm font-medium text-slate-500">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manajemen Pengguna & Pegawai</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola hak akses akun yang terdaftar di sistem</p>
        </div>
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl">
          Total: {users.length} Akun
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status Role</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition">
                <td className="p-4 font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  {u.username}
                </td>
                <td className="p-4 text-slate-500">{u.email || "-"}</td>
                <td className="p-4">
                  {u.is_staff ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg border border-indigo-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                      Pegawai / Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Pembeli
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {!u.is_staff ? (
                    <button 
                      onClick={() => handleOpenConfirm(u.id, u.username)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-emerald-100 cursor-pointer"
                    >
                      Jadikan Pegawai
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium italic">Akses Penuh</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl mb-4 font-bold">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Konfirmasi Perubahan</h3>
            <p className="text-sm text-slate-500 mb-6">
              Yakin ingin mengangkat <strong className="text-slate-700">"{confirmModal.username}"</strong> menjadi Pegawai/Admin?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, userId: null, username: '' })}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPromote}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-indigo-100 cursor-pointer"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}