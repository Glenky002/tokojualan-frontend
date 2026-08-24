import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Toast from './Toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // State Pagination Backend
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // State Pilih Banyak & Modal Delete Keren
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    type: 'bulk', // 'bulk' atau 'single'
    targetId: null,
    targetInvoice: null
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchOrders = () => {
    setIsLoading(true);
    let url = `/transactions/?page=${currentPage}&page_size=${pageSize}`;
    if (filterStatus !== 'All') {
      url += `&status=${encodeURIComponent(filterStatus)}`;
    }

    api.get(url)
      .then((res) => {
        if (res.data.results) {
          setOrders(res.data.results);
          setTotalPages(Math.ceil(res.data.count / pageSize) || 1);
          setTotalItems(res.data.count);
        } else {
          setOrders(res.data);
          setTotalPages(1);
          setTotalItems(res.data.length);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat pesanan", err);
        showToast("Gagal memuat daftar pesanan.", "error");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    setSelectedIds([]);
  }, [currentPage, pageSize, filterStatus]);

  const formatWhatsAppNumber = (phone) => {
    if (!phone) return null;
    let cleaned = String(phone).replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    } else if (!cleaned.startsWith('62') && cleaned.length >= 9) {
      cleaned = '62' + cleaned;
    }
    return cleaned.length >= 10 ? cleaned : null;
  };

  const getCustomerName = (order) => order.customer_name || 'Tamu / Pembeli WA';
  const getWhatsAppNumber = (order) => formatWhatsAppNumber(order.customer_phone || order.whatsapp_number);

  const handleStatusChange = (orderId, newStatus, e) => {
    if (e) e.stopPropagation();
    api.patch(`/transactions/${orderId}/update_status/`, { status: newStatus })
      .then((res) => {
        showToast(res.data.message || "Status berhasil diperbarui!", "success");
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.error || "Gagal mengubah status pesanan.";
        showToast(errorMsg, "error");
      });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = orders.map(item => item.id).filter(Boolean);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = orders.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // --- EKsekusi HAPUS (SATUAN ATAU BULK) ---
  const executeDelete = () => {
    setIsDeleting(true);

    if (deleteModalConfig.type === 'bulk') {
      api.post('/transactions/bulk_delete/', { ids: selectedIds })
        .then((res) => {
          showToast(res.data.message || "Berhasil menghapus pesanan terpilih!", "success");
          closeDeleteModal();
          setSelectedIds([]);
          fetchOrders();
        })
        .catch((err) => {
          showToast(err.response?.data?.error || "Gagal menghapus pesanan.", "error");
          setIsDeleting(false);
        });
    } else {
      // Hapus Satuan menggunakan DELETE endpoint standar DRF
      api.delete(`/transactions/${deleteModalConfig.targetId}/`)
        .then(() => {
          showToast(`Pesanan #${deleteModalConfig.targetInvoice} berhasil dihapus!`, "success");
          closeDeleteModal();
          if (selectedOrder && selectedOrder.id === deleteModalConfig.targetId) {
            setSelectedOrder(null);
          }
          fetchOrders();
        })
        .catch((err) => {
          showToast(err.response?.data?.error || "Gagal menghapus pesanan.", "error");
          setIsDeleting(false);
        });
    }
  };

  const openBulkDeleteModal = () => {
    if (selectedIds.length === 0) return;
    setDeleteModalConfig({
      isOpen: true,
      type: 'bulk',
      targetId: null,
      targetInvoice: null
    });
  };

  const openSingleDeleteModal = (id, invoice, e) => {
    if (e) e.stopPropagation();
    setDeleteModalConfig({
      isOpen: true,
      type: 'single',
      targetId: id,
      targetInvoice: invoice
    });
  };

  const closeDeleteModal = () => {
    setDeleteModalConfig({ isOpen: false, type: 'bulk', targetId: null, targetInvoice: null });
    setIsDeleting(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Belum Bayar': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Diproses': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Dikirim': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Batal': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("LAPORAN PENJUALAN TOKO", 14, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 27);

    const tableColumn = ["Invoice", "Pembeli", "Tanggal", "Total Harga", "Status"];
    const tableRows = orders.map(o => [
      o.invoice_number,
      getCustomerName(o),
      new Date(o.created_at).toLocaleDateString('id-ID'),
      `Rp ${Number(o.total_amount).toLocaleString('id-ID')}`,
      o.status
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 35, theme: 'grid', headStyles: { fillColor: [79, 70, 229] } });
    doc.save(`Laporan_Pesanan_${filterStatus}.pdf`);
    showToast("Berhasil mengunduh PDF! 📄", "success");
  };

  const exportToExcel = () => {
    const excelData = orders.map(o => ({
      "Invoice": o.invoice_number,
      "Nama Pembeli": getCustomerName(o),
      "No. WhatsApp": getWhatsAppNumber(o) || '-',
      "Tanggal Pesan": new Date(o.created_at).toLocaleString('id-ID'),
      "Total Harga (Rp)": Number(o.total_amount),
      "Status": o.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Transaksi");
    XLSX.writeFile(workbook, `Laporan_Pesanan_${filterStatus}.xlsx`);
    showToast("Berhasil mengunduh Excel! 📊", "success");
  };

  return (
    <div className="w-full relative">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Kelola Pesanan Masuk</h3>
          <p className="text-xs text-slate-500">Pantau transaksi, filter status, dan kelola arsip data toko.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={openBulkDeleteModal}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-rose-200 transition-all cursor-pointer transform hover:scale-105 animate-bounce"
            >
              🗑️ Hapus Terpilih ({selectedIds.length})
            </button>
          )}
          <button onClick={exportToPDF} className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition cursor-pointer">
            📄 PDF
          </button>
          <button onClick={exportToExcel} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition cursor-pointer">
            📊 Excel
          </button>
        </div>
      </div>

      {/* Filter Status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', 'Belum Bayar', 'Diproses', 'Dikirim', 'Selesai', 'Batal'].map((status) => (
          <button
            key={status}
            onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterStatus === status 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'All' ? 'Semua Status' : status}
          </button>
        ))}
      </div>

      {/* Tabel Data */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse p-4">
          <div className="h-16 bg-slate-100 rounded-2xl"></div>
          <div className="h-16 bg-slate-100 rounded-2xl"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-slate-400 font-semibold text-sm">Tidak ada pesanan untuk status "{filterStatus}".</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={orders.length > 0 && orders.every(item => selectedIds.includes(item.id))}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">Invoice</th>
                <th className="p-4">Pembeli</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {orders.map((order) => {
                const customerName = getCustomerName(order);
                const isChecked = selectedIds.includes(order.id);

                return (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`hover:bg-slate-50/80 transition cursor-pointer ${isChecked ? 'bg-indigo-50/40' : ''}`}
                  >
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => handleSelectOne(order.id, e)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4 font-bold text-indigo-600">{order.invoice_number}</td>
                    <td className="p-4 font-semibold text-slate-800">{customerName}</td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 font-bold text-slate-800">Rp {Number(order.total_amount).toLocaleString('id-ID')}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value, e)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${getStatusBadge(order.status)}`}
                      >
                        <option value="Belum Bayar">Belum Bayar</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Dikirim">Dikirim</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Batal">Batal</option>
                      </select>
                    </td>
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {getWhatsAppNumber(order) && (
                          <a
                            href={`https://wa.me/${getWhatsAppNumber(order)}?text=Halo%20${encodeURIComponent(customerName)},%20menghubungi%20terkait%20pesanan%20%23${order.invoice_number}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 p-2 rounded-xl hover:bg-emerald-100 transition"
                            title="Chat WhatsApp"
                          >
                            💬
                          </a>
                        )}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition"
                        >
                          Detail
                        </button>
                        <button
                          onClick={(e) => openSingleDeleteModal(order.id, order.invoice_number, e)}
                          className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl hover:bg-rose-100 transition"
                          title="Hapus Pesanan Ini"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>Menampilkan {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} pesanan</span>
              <select 
                value={pageSize} 
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg outline-none cursor-pointer text-xs font-semibold"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer"
              >
                ‹ Prev
              </button>
              <span className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl">
                {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0 || isLoading}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer"
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI HAPUS (KEMASAN MODERN & HALUS) --- */}
      {deleteModalConfig.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center transform scale-100 transition-all">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-inner animate-pulse">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">
                {deleteModalConfig.type === 'bulk' ? 'Hapus Pesanan Terpilih?' : 'Hapus Pesanan Ini?'}
              </h3>
              <p className="text-xs text-slate-500 px-2">
                {deleteModalConfig.type === 'bulk' ? (
                  <>Anda akan menghapus <span className="font-bold text-slate-800">{selectedIds.length} data transaksi</span> secara permanen.</>
                ) : (
                  <>Transaksi dengan nomor invoice <span className="font-bold text-indigo-600">#{deleteModalConfig.targetInvoice}</span> akan dihapus permanen.</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-rose-200 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PESANAN */}
      {selectedOrder && (() => {
        const modalWaNumber = getWhatsAppNumber(selectedOrder);
        const modalCustomerName = getCustomerName(selectedOrder);

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase">Detail Transaksi</span>
                  <h4 className="text-lg font-extrabold text-slate-900">#{selectedOrder.invoice_number}</h4>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full font-bold flex items-center justify-center hover:bg-slate-200 transition"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-3 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Pembeli</span>
                  <span className="font-semibold text-slate-800">{modalCustomerName}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">WhatsApp</span>
                  {modalWaNumber ? (
                    <a 
                      href={`https://wa.me/${modalWaNumber}?text=Halo%20${encodeURIComponent(modalCustomerName)},%20terkait%20pesanan%20%23${selectedOrder.invoice_number}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-semibold text-emerald-600 hover:underline flex items-center gap-1.5 mt-0.5 bg-white border border-emerald-200 p-2.5 rounded-xl shadow-xs w-fit"
                    >
                      💬 Chat WhatsApp: +{modalWaNumber}
                    </a>
                  ) : (
                    <span className="text-rose-500 italic text-xs font-medium">Nomor WhatsApp tidak tersedia</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Alamat Pengiriman</span>
                  <p className="font-semibold text-slate-700">{selectedOrder.shipping_address || 'Alamat tidak diisi'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Barang yang Dibeli:</span>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-medium text-slate-800">
                        {item.quantity}x {item.product_name || item.name || `Produk ID: ${item.product}`}
                      </span>
                      <span className="font-bold text-slate-600">
                        Rp {Number(item.quantity * Number(item.price_at_sale || item.price || 0)).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Total Keseluruhan</span>
                  <span className="text-lg font-extrabold text-indigo-600">Rp {Number(selectedOrder.total_amount).toLocaleString('id-ID')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => openSingleDeleteModal(selectedOrder.id, selectedOrder.invoice_number, e)}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition cursor-pointer border border-rose-200"
                  >
                    🗑️ Hapus
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}