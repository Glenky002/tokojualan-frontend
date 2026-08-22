// src/components/ProductModal.jsx
import React from 'react';

export default function ProductModal({
  isOpen,
  onClose,
  isEditing,
  formData,
  handleFormChange,
  handleSubmit,
  categories,
  suppliers,
  loading,
  error
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? '✏️ Edit Produk' : '✨ Tambah Produk Baru'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full cursor-pointer">✕</button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nama Produk</label>
              <input name="name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500" onChange={handleFormChange} value={formData.name} required placeholder="Contoh: Kemeja Flanel" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Kategori</label>
                <select name="category" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer" onChange={handleFormChange} value={formData.category} required>
                  <option value="">Pilih Kategori...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Supplier</label>
                <select name="supplier" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer" onChange={handleFormChange} value={formData.supplier} required>
                  <option value="">Pilih Supplier...</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Harga Beli (Rp)</label>
                <input type="number" name="purchase_price" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500" onChange={handleFormChange} value={formData.purchase_price} required placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Harga Jual (Rp)</label>
                <input type="number" name="selling_price" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500" onChange={handleFormChange} value={formData.selling_price} required placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Stok Pcs</label>
                <input type="number" name="stock" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500" onChange={handleFormChange} value={formData.stock} required placeholder="0" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Deskripsi Lengkap</label>
              <textarea name="description" rows="3" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 resize-none" onChange={handleFormChange} value={formData.description} placeholder="Deskripsi produk..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Foto Produk</label>
              <input type="file" name="image" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm cursor-pointer" accept="image/*" onChange={handleFormChange} />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={onClose} className="w-full px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer">Batal</button>
              <button type="submit" disabled={loading} className="w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer">
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}