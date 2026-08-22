import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pastikan sudah import ini
import { getAllUsers, promoteUser, deleteUser, adminUpdatePassword, toggleUserStatus } from '../services/authService';

export default function UserManagement({ showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Paginasi DRF
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // State Modal-modal (Promote, Delete, Suspend, Password) ...
  const [confirmModal, setConfirmModal] = useState({ show: false, userId: null, username: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, username: '' });
  const [suspendModal, setSuspendModal] = useState({ show: false, userId: null, username: '', isActive: true });
  const [editPasswordModal, setEditPasswordModal] = useState({ show: false, userId: null, username: '' });
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate(); // Inisialisasi navigate


  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getAllUsers(page);

      // Cek apakah data dibungkus DRF (.results) atau array biasa
      const userList = data.results || data;
      const count = data.count || userList.length;

      setUsers(userList);
      setTotalCount(count);
      
      // Atur status tombol berdasarkan response DRF
      setHasNext(data.next !== null && data.next !== undefined);
      setHasPrev(data.previous !== null && data.previous !== undefined);

      // Hitung total halaman (asumsi 10 per halaman, atau ganti sesuai page_size backend kamu)
      setTotalPages(Math.ceil(count / 10));
      
    } catch (err) {
      console.error("Error:", err);
      if (showToast) showToast("Gagal memuat data pengguna", "error");
    } finally {
      setLoading(false);
    }
  };

    // 3. Pastikan useEffect memanggil fetchUsers setiap currentPage berubah
    useEffect(() => {
      fetchUsers(currentPage);
    }, [currentPage]);

  // Handler Promote
  const handleOpenConfirm = (userId, username) => {
    setConfirmModal({ show: true, userId, username });
  };

  const handleConfirmPromote = async () => {
    const { userId, username } = confirmModal;
    setConfirmModal({ show: false, userId: null, username: '' });

    try {
      await promoteUser(userId);
      if (showToast) showToast(`Berhasil! ${username} sekarang adalah pegawai.`, "success");
      fetchUsers(currentPage);
    } catch (err) {
      if (showToast) showToast("Gagal mengubah hak akses user.", "error");
    }
  };

  // Handler Delete
  const handleOpenDelete = (userId, username) => {
    setDeleteModal({ show: true, userId, username });
  };

  const handleConfirmDelete = async () => {
    const { userId, username } = deleteModal;
    setDeleteModal({ show: false, userId: null, username: '' });

    try {
      await deleteUser(userId);
      if (showToast) showToast(`Pengguna ${username} berhasil dihapus.`, "success");
      fetchUsers(currentPage);
    } catch (err) {
      if (showToast) showToast("Gagal menghapus pengguna.", "error");
    }
  };

  // Handler Suspend / Toggle Status
  const handleOpenSuspend = (userId, username, isActive) => {
    setSuspendModal({ show: true, userId, username, isActive });
  };

  const handleConfirmSuspend = async () => {
    const { userId, username, isActive } = suspendModal;
    setSuspendModal({ show: false, userId: null, username: '', isActive: true });

    try {
      await toggleUserStatus(userId);
      const actionText = isActive ? "dinonaktifkan" : "diaktifkan kembali";
      if (showToast) showToast(`Akun ${username} berhasil ${actionText}.`, "success");
      fetchUsers(currentPage);
    } catch (err) {
      if (showToast) showToast("Gagal mengubah status akun.", "error");
    }
  };

  // Handler Edit Password
  const handleOpenEditPassword = (userId, username) => {
    setEditPasswordModal({ show: true, userId, username });
    setNewPassword('');
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    const { userId, username } = editPasswordModal;

    if (!newPassword || newPassword.length < 6) {
      if (showToast) showToast("Password minimal harus 6 karakter!", "error");
      return;
    }

    try {
      await adminUpdatePassword(userId, newPassword);
      if (showToast) showToast(`Password untuk ${username} berhasil diubah!`, "success");
      setEditPasswordModal({ show: false, userId: null, username: '' });
      setNewPassword('');
    } catch (err) {
      if (showToast) showToast("Gagal mengubah password.", "error");
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
        <p className="text-sm font-medium text-slate-500">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
      {/* Header Section */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manajemen Pengguna & Pegawai</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kelola hak akses, status akun, sandi, dan hapus pengguna</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl">
              Total: {totalCount} Akun
            </span>

            <button 
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Tambah Akun
            </button>
          </div>
        </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="p-4 pl-6">Pengguna</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role & Status</th>
              <th className="p-4 pr-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 pl-6 font-semibold text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs shrink-0">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate max-w-[150px] sm:max-w-xs">{u.username}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-500 truncate max-w-[180px]">{u.email || "-"}</td>
                <td className="p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {u.is_staff ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
                        Pegawai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
                        Pembeli
                      </span>
                    )}

                    {u.is_active === false ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg border border-rose-100">
                        Ditangguhkan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg">
                        Aktif
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!u.is_staff && (
                      <button 
                        onClick={() => handleOpenConfirm(u.id, u.username)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                      >
                        Jadikan Pegawai
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleOpenSuspend(u.id, u.username, u.is_active)}
                      className={`px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer ${
                        u.is_active !== false ? 'bg-slate-600 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {u.is_active !== false ? 'Suspend' : 'Aktifkan'}
                    </button>

                    <button 
                      onClick={() => handleOpenEditPassword(u.id, u.username)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                    >
                      Sandi
                    </button>
                    
                    <button 
                      onClick={() => handleOpenDelete(u.id, u.username)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalCount > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Total keseluruhan: <span className="font-semibold">{totalCount}</span> akun
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!hasPrev}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
            >
              Sebelumnya
            </button>
            
            <span className="text-xs font-semibold text-slate-700 px-2">
              Halaman {currentPage} / {totalPages || 1}
            </span>

            {/* PASTIKAN BAGIAN INI SAMA PERSIS */}
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!hasNext}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL MODAL (Sama seperti sebelumnya) --- */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-2">Konfirmasi Perubahan Role</h3>
            <p className="text-sm text-slate-600 mb-6">
              Yakin ingin mengangkat <span className="font-semibold text-slate-800">"{confirmModal.username}"</span> menjadi Pegawai/Admin?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, userId: null, username: '' })}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPromote}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {suspendModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-2">
              {suspendModal.isActive ? 'Tangguhkan Akun Pengguna' : 'Aktifkan Kembali Akun'}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {suspendModal.isActive 
                ? `Yakin ingin menangguhkan akses akun "${suspendModal.username}"?`
                : `Yakin ingin mengaktifkan kembali akun "${suspendModal.username}"?`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSuspendModal({ show: false, userId: null, username: '', isActive: true })}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSuspend}
                className={`flex-1 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer ${
                  suspendModal.isActive ? 'bg-slate-700 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {suspendModal.isActive ? 'Ya, Suspend' : 'Ya, Aktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-2">Hapus Akun Pengguna</h3>
            <p className="text-sm text-slate-600 mb-6">
              Tindakan ini permanen. Yakin ingin menghapus akun <span className="font-semibold text-slate-800">"{deleteModal.username}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, userId: null, username: '' })}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {editPasswordModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-2">Ganti Sandi Pengguna</h3>
            <p className="text-sm text-slate-600 mb-4">
              Masukkan sandi baru untuk <span className="font-semibold text-slate-800">"{editPasswordModal.username}"</span>
            </p>
            <form onSubmit={handleSavePassword}>
              <input 
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 mb-6"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditPasswordModal({ show: false, userId: null, username: '' })}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}