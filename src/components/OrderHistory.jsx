import React, { useState } from 'react';
import api from '../api/axiosConfig';
import Toast from './Toast'; // Pastikan path import Toast sudah sesuai

export default function OrderHistory({ orders, onOrderUpdated }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State untuk popup konfirmasi
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
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

  const ADMIN_WHATSAPP_NUMBER = "6281234567890"; // Ganti dengan nomor WhatsApp admin tokomu

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;

    setIsLoadingCancel(true);
    try {
      const response = await api.patch(`/transactions/${selectedOrder.id}/cancel_order/`);
      showToast(response.data.message || "Pesanan berhasil dibatalkan dan stok dikembalikan.", "success");
      
      // Tutup semua modal
      setShowConfirmModal(false);
      setSelectedOrder(null);

      // Refresh data pesanan dari parent component jika tersedia
      if (onOrderUpdated) {
        onOrderUpdated();
      } else {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      console.error("Gagal membatalkan pesanan:", err);
      const errorMsg = err.response?.data?.error || "Gagal membatalkan pesanan.";
      showToast(errorMsg, "error");
    } finally {
      setIsLoadingCancel(false);
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast((prev) => ({ ...prev, show: false }))} 
        />
      )}

      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Riwayat Pesanan Saya</h3>
          <p className="text-xs text-slate-500">Daftar belanjaan masa lalu yang pernah kamu checkout.</p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm font-semibold">Kamu belum memiliki riwayat pesanan.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 hover:bg-slate-100/70 p-4 rounded-2xl border border-slate-100 transition gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600">{order.invoice_number}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 mt-1 block">
                  {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <span className="font-extrabold text-slate-800 text-sm">
                  Rp {Number(order.total_amount).toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="text-xs font-bold text-indigo-600 bg-white border border-indigo-200 px-3.5 py-1.5 rounded-xl hover:bg-indigo-50 transition cursor-pointer shadow-sm"
                >
                  🔍 Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL DETAIL PESANAN USER --- */}
      {selectedOrder && !showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">Rincian Belanja</span>
                <h4 className="text-lg font-extrabold text-slate-900">{selectedOrder.invoice_number}</h4>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Barang yang Dibeli:</span>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
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

            <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-1.5 text-slate-600">
              <p><strong className="text-slate-800">Status Pesanan:</strong> <span className="font-bold text-indigo-600">{selectedOrder.status}</span></p>
              <p><strong className="text-slate-800">Alamat Kirim:</strong> {selectedOrder.shipping_address || 'Alamat utama profil'}</p>
            </div>

            {/* --- TOMBOL CHAT ADMIN WHATSAPP & BATALKAN PESANAN --- */}
            <div className="space-y-2">
              <a 
                href={`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=Halo%20Admin,%20saya%20mau%20konfirmasi%20terkait%20pesanan%20dengan%20Invoice%20%23${selectedOrder.invoice_number}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-100 transition cursor-pointer"
              >
                💬 Hubungi Admin via WhatsApp
              </a>

              {/* Tombol Batal membuka Modal Konfirmasi */}
              {(selectedOrder.status === 'Belum Bayar' || selectedOrder.status === 'Diproses') && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
                >
                  ❌ Batalkan Pesanan Ini
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Total Belanja</span>
                <span className="text-base font-extrabold text-indigo-600">Rp {Number(selectedOrder.total_amount).toLocaleString('id-ID')}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL POPUP KONSEKUENSI / KONFIRMASI PEMBATALAN --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900">Batalkan Pesanan Ini?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Tindakan ini tidak dapat dibatalkan. Stok produk untuk invoice <strong className="text-slate-700">{selectedOrder?.invoice_number}</strong> akan dikembalikan ke sistem.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoadingCancel}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tidak, Kembali
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isLoadingCancel}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-100 transition cursor-pointer disabled:opacity-50"
              >
                {isLoadingCancel ? 'Memproses...' : 'Ya, Batalkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}