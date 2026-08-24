import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon marker default leaflet agar muncul dengan benar
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Komponen helper untuk mendeteksi klik/geser pada peta (Mode Edit/Tambah)
function LocationPicker({ position, setPosition, setAddressLine, disabled }) {
  useMapEvents({
    click(e) {
      if (disabled) return; // Jika mode detail (view-only), jangan ubah posisi
      setPosition([e.latlng.lat, e.latlng.lng]);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddressLine(data.display_name);
          }
        })
        .catch(err => console.log(err));
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

export default function AddressManager({ showToast }) {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal & Mode ('add' | 'edit' | 'detail')
  const [modalMode, setModalMode] = useState(null); // null = tertutup
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [formData, setFormData] = useState({
    recipient_name: '',
    phone_number: '',
    address_line: '',
    city: '',
    postal_code: '',
    is_default: false,
  });
  
  const [position, setPosition] = useState([-6.200000, 106.816666]); 

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/shipping-addresses/');
      setAddresses(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal memuat alamat", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Buka modal untuk Tambah
  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedAddressId(null);
    setFormData({ recipient_name: '', phone_number: '', address_line: '', city: '', postal_code: '', is_default: false });
    setPosition([-6.200000, 106.816666]);
  };

  // Buka modal untuk Edit
  const handleOpenEdit = (addr) => {
    setModalMode('edit');
    setSelectedAddressId(addr.id);
    setFormData({
      recipient_name: addr.recipient_name || '',
      phone_number: addr.phone_number || '',
      address_line: addr.address_line || '',
      city: addr.city || '',
      postal_code: addr.postal_code || '',
      is_default: addr.is_default || false,
    });
    if (addr.latitude && addr.longitude) {
      setPosition([parseFloat(addr.latitude), parseFloat(addr.longitude)]);
    }
  };

  // Buka modal untuk Lihat Detail saja (Read-only)
  const handleOpenDetail = (addr) => {
    setModalMode('detail');
    setFormData({
      recipient_name: addr.recipient_name || '',
      phone_number: addr.phone_number || '',
      address_line: addr.address_line || '',
      city: addr.city || '',
      postal_code: addr.postal_code || '',
      is_default: addr.is_default || false,
    });
    if (addr.latitude && addr.longitude) {
      setPosition([parseFloat(addr.latitude), parseFloat(addr.longitude)]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        latitude: position[0],
        longitude: position[1],
      };

      if (modalMode === 'edit') {
        await api.put(`/shipping-addresses/${selectedAddressId}/`, payload);
        showToast("Alamat berhasil diperbarui! 📍", "success");
      } else {
        await api.post('/shipping-addresses/', payload);
        showToast("Alamat baru berhasil ditambahkan! 📍", "success");
      }

      setModalMode(null);
      fetchAddresses();
    } catch (err) {
      console.error("Gagal menyimpan alamat", err);
      showToast("Gagal menyimpan alamat.", "error");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.patch(`/shipping-addresses/${id}/`, { is_default: true });
      showToast("Alamat utama berhasil diperbarui!", "success");
      fetchAddresses();
    } catch (err) {
      showToast("Gagal mengubah alamat utama.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus alamat ini?")) return;
    try {
      await api.delete(`/shipping-addresses/${id}/`);
      showToast("Alamat berhasil dihapus.", "success");
      fetchAddresses();
    } catch (err) {
      showToast("Gagal menghapus alamat.", "error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Daftar Alamat Pengiriman</h3>
          <p className="text-xs text-slate-500">Kelola alamat rumah atau kantor untuk pengiriman pesananmu.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
        >
          + Tambah Alamat Baru
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Memuat daftar alamat...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm font-semibold">Kamu belum menyimpan alamat pengiriman.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={`p-4 rounded-2xl border transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                addr.is_default ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{addr.recipient_name}</span>
                  <span className="text-xs text-slate-500">({addr.phone_number})</span>
                  {addr.is_default && (
                    <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      Utama
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{addr.address_line}</p>
                {addr.city && <p className="text-[11px] text-slate-400">{addr.city} {addr.postal_code}</p>}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <button
                  onClick={() => handleOpenDetail(addr)}
                  className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  Detail
                </button>
                <button
                  onClick={() => handleOpenEdit(addr)}
                  className="text-xs font-bold text-indigo-600 bg-white border border-indigo-200 px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition cursor-pointer"
                >
                  Edit
                </button>
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-emerald-600 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition cursor-pointer"
                  >
                    Atur Utama
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs font-bold text-rose-600 bg-white border border-rose-200 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL FORM (TAMBAH / EDIT / DETAIL) --- */}
      {modalMode && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="text-lg font-extrabold text-slate-900">
                {modalMode === 'add' && 'Tambah Alamat Baru'}
                {modalMode === 'edit' && 'Edit Alamat Pengiriman'}
                {modalMode === 'detail' && 'Detail Lokasi Alamat'}
              </h4>
              <button 
                onClick={() => setModalMode(null)}
                className="w-8 h-8 bg-slate-100 text-slate-500 rounded-full font-bold flex items-center justify-center hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Penerima</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalMode === 'detail'}
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">No. WhatsApp Penerima</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalMode === 'detail'}
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </div>

              {/* --- PETA INTERAKTIF --- */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  {modalMode === 'detail' ? 'Titik Pin Lokasi pada Peta' : 'Pin Titik Lokasi (Klik pada peta untuk ubah posisi)'}
                </label>
                <div className="h-56 w-full rounded-2xl overflow-hidden border border-slate-200 z-0 relative">
                  {/* Key dinamis dipasang agar MapContainer me-render ulang koordinat baru dengan mulus saat modal dibuka */}
                  <MapContainer key={`${position[0]}-${position[1]}`} center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <LocationPicker 
                      position={position} 
                      setPosition={setPosition} 
                      setAddressLine={(line) => setFormData(prev => ({ ...prev, address_line: line }))} 
                      disabled={modalMode === 'detail'}
                    />
                  </MapContainer>
                </div>
                <span className="text-[10px] text-indigo-600 mt-1 block font-medium">
                  Koordinat: {position[0].toFixed(5)}, {position[1].toFixed(5)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Detail Alamat (Nama Jalan, No. Rumah, Patokan)</label>
                <textarea 
                  rows="2"
                  required
                  disabled={modalMode === 'detail'}
                  value={formData.address_line}
                  onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                  placeholder="Contoh: Jl. Merdeka No. 45, Dekat Masjid..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kota / Kabupaten</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'detail'}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                    placeholder="Contoh: Jakarta Selatan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Kode Pos</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'detail'}
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                    placeholder="12950"
                  />
                </div>
              </div>

              {modalMode !== 'detail' && (
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_default" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Jadikan sebagai alamat pengiriman utama
                  </label>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  {modalMode === 'detail' ? 'Tutup' : 'Batal'}
                </button>
                {modalMode !== 'detail' && (
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
                  >
                    Simpan Perubahan
                  </button>
                )}
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}