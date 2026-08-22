// import React, { useState, useMemo } from 'react';
// import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export default function ProductHistory({ history = [], showToast }) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedAction, setSelectedAction] = useState('');

//   // Logika Filter & Pencarian
//   const filteredHistory = useMemo(() => {
//     const dataList = Array.isArray(history) ? history : [];
//     return dataList.filter(item => {
//       const action = String(item.action || item.action_type || '').toLowerCase();
//       const details = String(item.details || item.description || item.message || '').toLowerCase();
//       const user = String(item.user || item.username || '').toLowerCase();
//       const productName = String(item.product_name || item.product?.name || '').toLowerCase();

//       const matchesSearch = 
//         details.includes(searchQuery.toLowerCase()) || 
//         user.includes(searchQuery.toLowerCase()) ||
//         productName.includes(searchQuery.toLowerCase());

//       let matchesAction = true;
//       if (selectedAction !== '') {
//         const sel = selectedAction.toLowerCase();
//         if (sel === 'tambah') {
//           matchesAction = action.includes('tambah') || action.includes('create') || action.includes('add') || action.includes('post');
//         } else if (sel === 'ubah') {
//           matchesAction = action.includes('ubah') || action.includes('update') || action.includes('edit') || action.includes('put') || action.includes('patch');
//         } else if (sel === 'hapus') {
//           matchesAction = action.includes('hapus') || action.includes('delete');
//         } else {
//           matchesAction = action.includes(sel);
//         }
//       }
//       return matchesSearch && matchesAction;
//     });
//   }, [history, searchQuery, selectedAction]);

//   const getActionBadge = (action) => {
//     const act = String(action || '').toLowerCase();
//     if (act.includes('tambah') || act.includes('create') || act.includes('add') || act.includes('post')) {
//       return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">✨ Tambah</span>;
//     } else if (act.includes('ubah') || act.includes('update') || act.includes('edit') || act.includes('put') || act.includes('patch')) {
//       return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">✏️ Ubah</span>;
//     } else if (act.includes('hapus') || act.includes('delete')) {
//       return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">🗑️ Hapus</span>;
//     }
//     return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">{action || 'Aktivitas'}</span>;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? dateString : date.toLocaleString('id-ID', {
//       day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
//     });
//   };

//   const handleExportExcel = () => {
//     if (filteredHistory.length === 0) {
//       showToast("Tidak ada data untuk diexport!", "warning");
//       return;
//     }
//     try {
//       const data = filteredHistory.map((item, index) => ({
//         "No": index + 1,
//         "Produk": item.product_name || item.product?.name || "-",
//         "Aksi": item.action || item.action_type || "-",
//         "Detail": item.details || item.description || item.message || "-",
//         "User": item.user || item.username || "Sistem",
//         "Waktu": formatDate(item.timestamp || item.created_at)
//       }));
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Riwayat Aktivitas");
//       XLSX.writeFile(wb, `Riwayat_Produk_${new Date().getTime()}.xlsx`);
//       showToast("Excel berhasil diunduh!", "success");
//     } catch (err) {
//       showToast("Gagal mengunduh Excel", "error");
//     }
//   };

//   const handleExportPdf = () => {
//     if (filteredHistory.length === 0) {
//       showToast("Tidak ada data untuk diexport!", "warning");
//       return;
//     }
//     try {
//       const doc = new jsPDF();
//       doc.text("LAPORAN RIWAYAT AKTIVITAS", 14, 15);
//       const tableColumn = ["No", "Produk", "Aksi", "Detail", "User", "Waktu"];
//       const tableRows = filteredHistory.map((item, index) => [
//         index + 1,
//         item.product_name || item.product?.name || "-",
//         item.action || item.action_type || "-",
//         item.details || item.description || item.message || "-",
//         item.user || item.username || "Sistem",
//         formatDate(item.timestamp || item.created_at)
//       ]);
//       autoTable(doc, { head: [tableColumn], body: tableRows, startY: 25 });
//       doc.save(`Riwayat_Produk_${new Date().getTime()}.pdf`);
//       showToast("PDF berhasil diunduh!", "success");
//     } catch (err) {
//       showToast("Gagal mengunduh PDF", "error");
//     }
//   };

//   return (
//     <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//       <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
//         <div>
//           <h2 className="text-lg font-bold text-slate-800">Riwayat Aktivitas Sistem</h2>
//           <p className="text-xs text-slate-500 font-medium">Memantau seluruh perubahan data produk dan stok</p>
//         </div>
//         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//           <input type="text" placeholder="Cari..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-48" />
//           <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
//             <option value="">Semua Aksi</option>
//             <option value="tambah">Tambah</option>
//             <option value="ubah">Ubah</option>
//             <option value="hapus">Hapus</option>
//           </select>
//           <button type="button" onClick={handleExportExcel} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer">📊 Excel</button>
//           <button type="button" onClick={handleExportPdf} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer">📄 PDF</button>
//         </div>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200"><th className="p-5">No</th><th className="p-5">Produk</th><th className="p-5">Aksi</th><th className="p-5">Detail</th><th className="p-5">User</th><th className="p-5">Waktu</th></tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100 text-sm">
//             {filteredHistory.length > 0 ? (
//               filteredHistory.map((item, index) => (
//                 <tr key={item.id || index} className="hover:bg-slate-50/80 transition">
//                   <td className="p-5 font-semibold text-slate-500">{index + 1}</td>
//                   <td className="p-5 font-bold text-slate-800">{item.product_name || item.product?.name || '-'}</td>
//                   <td className="p-5">{getActionBadge(item.action || item.action_type)}</td>
//                   <td className="p-5 text-slate-700 font-medium">{item.details || item.description || item.message || '-'}</td>
//                   <td className="p-5 text-slate-600">{item.user || item.username || 'Sistem'}</td>
//                   <td className="p-5 text-slate-500 text-xs font-semibold">{formatDate(item.timestamp || item.created_at)}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan="6" className="p-12 text-center text-slate-400 font-medium">Tidak ada riwayat aktivitas yang ditemukan.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ProductHistory({ history = [], showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // State untuk debounce
  const [selectedAction, setSelectedAction] = useState('');

  // Efek Debounce untuk pencarian (menunggu 400ms setelah user berhenti mengetik)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Logika Filter & Pencarian (Menggunakan debouncedSearch alih-alih searchQuery langsung)
  const filteredHistory = useMemo(() => {
    const dataList = Array.isArray(history) ? history : [];
    return dataList.filter(item => {
      const action = String(item.action || item.action_type || '').toLowerCase();
      const details = String(item.details || item.description || item.message || '').toLowerCase();
      const user = String(item.user || item.username || '').toLowerCase();
      const productName = String(item.product_name || item.product?.name || '').toLowerCase();

      const query = debouncedSearch.toLowerCase();
      const matchesSearch = 
        details.includes(query) || 
        user.includes(query) ||
        productName.includes(query);

      let matchesAction = true;
      if (selectedAction !== '') {
        const sel = selectedAction.toLowerCase();
        if (sel === 'tambah') {
          matchesAction = action.includes('tambah') || action.includes('create') || action.includes('add') || action.includes('post');
        } else if (sel === 'ubah') {
          matchesAction = action.includes('ubah') || action.includes('update') || action.includes('edit') || action.includes('put') || action.includes('patch');
        } else if (sel === 'hapus') {
          matchesAction = action.includes('hapus') || action.includes('delete');
        } else {
          matchesAction = action.includes(sel);
        }
      }
      return matchesSearch && matchesAction;
    });
  }, [history, debouncedSearch, selectedAction]);

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
    if (filteredHistory.length === 0) {
      showToast("Tidak ada data untuk diexport!", "warning");
      return;
    }
    try {
      const data = filteredHistory.map((item, index) => ({
        "No": index + 1,
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
    if (filteredHistory.length === 0) {
      showToast("Tidak ada data untuk diexport!", "warning");
      return;
    }
    try {
      const doc = new jsPDF();
      doc.text("LAPORAN RIWAYAT AKTIVITAS", 14, 15);
      const tableColumn = ["No", "Produk", "Aksi", "Detail", "User", "Waktu"];
      const tableRows = filteredHistory.map((item, index) => [
        index + 1,
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Riwayat Aktivitas Sistem</h2>
          <p className="text-xs text-slate-500 font-medium">Memantau seluruh perubahan data produk dan stok</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Cari..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-48" 
          />
          <select 
            value={selectedAction} 
            onChange={(e) => setSelectedAction(e.target.value)} 
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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="p-5">No</th>
              <th className="p-5">Produk</th>
              <th className="p-5">Aksi</th>
              <th className="p-5">Detail</th>
              <th className="p-5">User</th>
              <th className="p-5">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50/80 transition">
                  <td className="p-5 font-semibold text-slate-500">{index + 1}</td>
                  <td className="p-5 font-bold text-slate-800">{item.product_name || item.product?.name || '-'}</td>
                  <td className="p-5">{getActionBadge(item.action || item.action_type)}</td>
                  <td className="p-5 text-slate-700 font-medium">{item.details || item.description || item.message || '-'}</td>
                  <td className="p-5 text-slate-600">{item.user || item.username || 'Sistem'}</td>
                  <td className="p-5 text-slate-500 text-xs font-semibold">{formatDate(item.timestamp || item.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="p-12 text-center text-slate-400 font-medium">Tidak ada riwayat aktivitas yang ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}