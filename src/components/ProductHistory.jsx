import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ProductHistory({ showToast }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);

  // State untuk Custom Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchHistory = () => {
    setIsLoading(true);
    let url = `/history/?page=${currentPage}&page_size=${pageSize}`;
    
    if (debouncedSearch) {
      url += `&search=${encodeURIComponent(debouncedSearch)}`;
    }
    if (selectedAction) {
      url += `&action=${encodeURIComponent(selectedAction)}`;
    }

    api.get(url)
      .then((res) => {
        if (res.data.results) {
          setHistory(res.data.results);
          setTotalPages(Math.ceil(res.data.count / pageSize) || 1);
          setTotalItems(res.data.count);
        } else {
          setHistory(res.data);
          setTotalPages(1);
          setTotalItems(res.data.length);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat riwayat", err);
        showToast("Gagal memuat riwayat aktivitas.", "error");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
    setSelectedIds([]);
  }, [currentPage, pageSize, debouncedSearch, selectedAction]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = history.map(item => item.id).filter(Boolean);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = history.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Fungsi Eksekusi Hapus ke Backend (Dipanggil dari Tombol Modal Konfirmasi)
  const confirmDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    setIsDeleting(true);
    api.post('/history/bulk_delete/', { ids: selectedIds })
      .then((res) => {
        showToast(res.data.message || "Berhasil menghapus riwayat!", "success");
        setIsDeleteModalOpen(false);
        setIsDeleting(false);
        setSelectedIds([]);
        fetchHistory();
      })
      .catch((err) => {
        console.error("Gagal menghapus riwayat", err);
        showToast("Gagal menghapus riwayat aktivitas.", "error");
        setIsDeleting(false);
      });
  };

  const getActionBadge = (action) => {
    const act = String(action || '').toLowerCase();
    if (act.includes('tambah') || act.includes('create') || act.includes('add') || act.includes('post')) {
      return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">✨ Tambah</span>;
    } else if (act.includes('ubah') || act.includes('update') || act.includes('edit') || act.includes('put') || act.includes('patch')) {
      return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">✏️ Ubah</span>;
    } else if (act.includes('hapus') || act.includes('delete')) {
      return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">🗑️ Hapus</span>;
    }
    return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">{action || 'Aktivitas'}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleExportExcel = () => {
    if (history.length === 0) {
      showToast("Tidak ada data untuk diexport!", "warning");
      return;
    }
    try {
      const data = history.map((item, index) => ({
        "No": (currentPage - 1) * pageSize + index + 1,
        "Produk": item.product_name || item.product?.name || "-",
        "Aksi": item.action || item.action_type || "-",
        "Detail": item.details || item.description || item.message || "-",
        "User": item.user || item.username || "Sistem",
        "Waktu": formatDate(item.timestamp || item.created_at)
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Riwayat Aktivitas");
      XLSX.writeFile(wb, `Riwayat_Produk_${new Date().getTime()}.xlsx`);
      showToast("Excel berhasil diunduh!", "success");
    } catch (err) {
      showToast("Gagal mengunduh Excel", "error");
    }
  };

  const handleExportPdf = () => {
    if (history.length === 0) {
      showToast("Tidak ada data untuk diexport!", "warning");
      return;
    }
    try {
      const doc = new jsPDF();
      doc.text("LAPORAN RIWAYAT AKTIVITAS", 14, 15);
      const tableColumn = ["No", "Produk", "Aksi", "Detail", "User", "Waktu"];
      const tableRows = history.map((item, index) => [
        (currentPage - 1) * pageSize + index + 1,
        item.product_name || item.product?.name || "-",
        item.action || item.action_type || "-",
        item.details || item.description || item.message || "-",
        item.user || item.username || "Sistem",
        formatDate(item.timestamp || item.created_at)
      ]);
      autoTable(doc, { head: [tableColumn], body: tableRows, startY: 25 });
      doc.save(`Riwayat_Produk_${new Date().getTime()}.pdf`);
      showToast("PDF berhasil diunduh!", "success");
    } catch (err) {
      showToast("Gagal mengunduh PDF", "error");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
      {/* Header & Aksi Filter / Tombol Export */}
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Riwayat Aktivitas Sistem</h2>
          <p className="text-xs text-slate-500 font-medium">Memantau seluruh perubahan data produk dan stok</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <button 
              type="button" 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-1.5 animate-pulse"
            >
              🗑️ Hapus ({selectedIds.length})
            </button>
          )}
          <input 
            type="text" 
            placeholder="Cari..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-48" 
          />
          <select 
            value={selectedAction} 
            onChange={(e) => { setSelectedAction(e.target.value); setCurrentPage(1); }} 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">Semua Aksi</option>
            <option value="tambah">Tambah</option>
            <option value="ubah">Ubah</option>
            <option value="hapus">Hapus</option>
          </select>
          <button type="button" onClick={handleExportExcel} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer">📊 Excel</button>
          <button type="button" onClick={handleExportPdf} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer">📄 PDF</button>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={history.length > 0 && history.every(item => selectedIds.includes(item.id))}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th className="p-4">No</th>
              <th className="p-4">Produk</th>
              <th className="p-4">Aksi</th>
              <th className="p-4">Detail</th>
              <th className="p-4">User</th>
              <th className="p-4">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              <tr><td colSpan="7" className="p-12 text-center text-slate-400 font-medium">Memuat data riwayat...</td></tr>
            ) : history.length > 0 ? (
              history.map((item, index) => {
                const absoluteIndex = (currentPage - 1) * pageSize + index + 1;
                const isChecked = selectedIds.includes(item.id);

                return (
                  <tr key={item.id || index} className={`hover:bg-slate-50/80 transition ${isChecked ? 'bg-indigo-50/40' : ''}`}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleSelectOne(item.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4 font-semibold text-slate-500">{absoluteIndex}</td>
                    <td className="p-4 font-bold text-slate-800">{item.product_name || item.product?.name || '-'}</td>
                    <td className="p-4">{getActionBadge(item.action || item.action_type)}</td>
                    <td className="p-4 text-slate-700 font-medium">{item.details || item.description || item.message || '-'}</td>
                    <td className="p-4 text-slate-600">{item.user || item.username || 'Sistem'}</td>
                    <td className="p-4 text-slate-500 text-xs font-semibold">{formatDate(item.timestamp || item.created_at)}</td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="7" className="p-12 text-center text-slate-400 font-medium">Tidak ada riwayat aktivitas yang ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bagian Bawah: Info Data & Backend Pagination Controls */}
      <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span>Menampilkan {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} data</span>
          <select 
            value={pageSize} 
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 bg-white border border-slate-200 rounded-lg outline-none cursor-pointer text-xs font-semibold"
          >
            <option value={10}>10 per halaman</option>
            <option value={25}>25 per halaman</option>
            <option value={50}>50 per halaman</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer"
          >
            ‹ Prev
          </button>

          <span className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0 || isLoading}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer"
          >
            Next ›
          </button>
        </div>
      </div>

      {/* CUSTOM DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-150 text-center">
            
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl mx-auto flex items-center justify-center text-xl font-bold">
              🗑️
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Hapus Riwayat Terpilih?</h3>
              <p className="text-xs text-slate-500">
                Anda akan menghapus <span className="font-bold text-slate-800">{selectedIds.length} data</span> riwayat aktivitas. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteSelected}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-rose-100 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}