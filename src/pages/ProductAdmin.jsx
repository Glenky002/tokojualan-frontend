import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductList from '../components/ProductList';
import ProductHistory from '../components/ProductHistory';
import ProductModal from '../components/ProductModal';
import Toast from '../components/Toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import langsung function-nya
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/UserManagement';

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });

  // Perbaikan Nama State Toast di sini
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const showToast = (message, type) => setToast({ show: true, message, type });

  const [formData, setFormData] = useState({
    name: '', category: '', purchase_price: '', selling_price: '',
    stock: '', supplier: '', description: '', image: null,
  });

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
      if (activeTab === 'list') fetchProducts();
      else if (activeTab === 'history') fetchHistory();
      // Jika activeTab === 'users', data akan diambil sendiri di dalam komponen UserManagement
    }, [currentPage, searchQuery, selectedCategory, activeTab]);

  const fetchProducts = () => {
    let url = `/products/?page=${currentPage}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory) url += `&category=${selectedCategory}`;

    api.get(url).then(res => {
      const data = res.data;
      if (data.results) {
        setProducts(data.results);
        setHasNextPage(Boolean(data.next));
        setHasPrevPage(Boolean(data.previous));
        setTotalItems(data.count || 0);
      } else {
        setProducts(data);
        setHasNextPage(false);
        setHasPrevPage(false);
        setTotalItems(data.length);
      }
    }).catch(err => console.error("Gagal ambil produk:", err));
  };

  const fetchHistory = () => api.get('/history/').then(res => setHistory(res.data.results || res.data));
  const fetchCategories = () => api.get('/categories/').then(res => setCategories(res.data.results || res.data));
  const fetchSuppliers = () => api.get('/suppliers/').then(res => setSuppliers(res.data.results || res.data));

  // --- EXPORT EXCEL ---
  const handleExportExcel = () => {
    try {
      const data = products.map((p, index) => {
        // Ambil nama kategori dengan aman
        let categoryName = "-";
        if (typeof p.category === 'object' && p.category !== null) {
          categoryName = p.category.name || "-";
        } else if (p.category_name) {
          categoryName = p.category_name;
        } else if (p.category) {
          const foundCat = categories.find(c => c.id === p.category);
          categoryName = foundCat ? foundCat.name : "-";
        }

        return {
          "No": index + 1,
          "Nama Produk": p.name,
          "Kategori": categoryName,
          "Harga Beli (Rp)": p.purchase_price,
          "Harga Jual (Rp)": p.selling_price,
          "Stok (Pcs)": p.stock
        };
      });

      const ws = XLSX.utils.json_to_sheet(data);

      // Sesuaikan lebar kolom karena supplier dihapus
      ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 25 }, // Nama Produk
        { wch: 18 }, // Kategori
        { wch: 15 }, // Harga Beli
        { wch: 15 }, // Harga Jual
        { wch: 10 }, // Stok
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Produk");
      
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Laporan_Produk_${dateStr}.xlsx`);
      showToast("Excel berhasil diunduh!", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal mengunduh Excel", "error");
    }
  };

  // --- EXPORT PDF DENGAN HEADER WARNA-WARNI & STYLING PROFESIONAL ---
 const handleExportPdf = () => {
    try {
      const doc = new jsPDF();
      
      // Kop Laporan
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text("LAPORAN INVENTARIS STOK PRODUK", 14, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      doc.text(`Dicetak pada: ${currentDate}`, 14, 24);

      const tableColumn = ["No", "Nama Produk", "Kategori", "Harga Jual", "Stok"];
      
      // Ambil nama kategori dengan pengecekan aman (mendukung object, string, atau relasi ID)
      const tableRows = products.map((p, index) => {
        let categoryName = "-";
        if (typeof p.category === 'object' && p.category !== null) {
          categoryName = p.category.name || "-";
        } else if (p.category_name) {
          categoryName = p.category_name;
        } else if (p.category) {
          // Jika hanya berupa ID, kita cari namanya di state categories jika ada
          const foundCat = categories.find(c => c.id === p.category);
          categoryName = foundCat ? foundCat.name : `ID: ${p.category}`;
        }

        return [
          index + 1,
          p.name, 
          categoryName, 
          `Rp ${Number(p.selling_price).toLocaleString('id-ID')}`, 
          `${p.stock} Pcs`
        ];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        headStyles: { 
          fillColor: [79, 70, 229], // Warna Indigo terang
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 }, 
          2: { halign: 'center' }, // Kategori di tengah
          3: { halign: 'right' },  
          4: { halign: 'center', cellWidth: 20 }, 
        },
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 4,
          textColor: [51, 65, 85]
        },
        alternateRowStyles: {
          fillColor: [241, 245, 249]
        }
      });

      // Footer Nomor Halaman
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
      }

      const dateStr = new Date().toISOString().split('T')[0];
      doc.save(`Laporan_Produk_${dateStr}.pdf`);
      showToast("PDF berhasil diunduh!", "success");
    } catch (err) {
      console.error("Error PDF:", err);
      showToast("Gagal mengunduh PDF", "error");
    }
  };

  // --- IMPORT DATA ---
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('products/import_data/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Tangkap pesan sukses dari backend dengan aman
      const successMsg = response?.data?.detail || "Berhasil mengimpor data produk!";
      showToast(successMsg, "success");
      
      // Refresh data produk
      if (typeof fetchProducts === 'function') {
        fetchProducts();
      }
    } catch (err) {
      console.error("Gagal Import Detail:", err);
      
      // Cek berbagai kemungkinan format error dari Django
      const errorData = err.response?.data;
      let errorMsg = "Gagal mengimport file.";

      if (typeof errorData === 'string') {
        errorMsg = errorData;
      } else if (errorData?.detail) {
        errorMsg = errorData.detail;
      } else if (errorData && typeof errorData === 'object') {
        // Jika error dari DRF berupa key-value (misal: {"file": ["Wajib diisi"]})
        const firstKey = Object.keys(errorData)[0];
        if (firstKey) {
          errorMsg = `${firstKey}: ${Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey]}`;
        }
      }

      showToast("Gagal Import: " + errorMsg, "error");
    } finally {
      e.target.value = null; // Reset input file
    }
  };

  const handleFormChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({ name: '', category: '', purchase_price: '', selling_price: '', stock: '', supplier: '', description: '', image: null });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name, 
      category: product.category?.id || product.category || '', 
      purchase_price: product.purchase_price,
      selling_price: product.selling_price, 
      stock: product.stock, 
      supplier: product.supplier?.id || product.supplier || '',
      description: product.description || '', 
      image: null, 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    }

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const request = isEditing ? api.put(`/products/${currentId}/`, data, config) : api.post('/products/', data, config);

    request.then(() => {
      setIsModalOpen(false);
      fetchProducts();
      showToast(isEditing ? "Produk berhasil diubah!" : "Produk berhasil ditambahkan!", "success");
    }).catch(() => {
      setError("Gagal menyimpan produk. Periksa kembali inputan Anda.");
    }).finally(() => setLoading(false));
  };

  const confirmDelete = (id, name) => {
    setDeleteModal({ show: true, id, name });
  };

  // Fungsi untuk benar-benar mengeksekusi penghapusan ke API
  const executeDelete = () => {
    api.delete(`/products/${deleteModal.id}/`).then(() => {
      fetchProducts();
      showToast("Produk berhasil dihapus", "success");
      setDeleteModal({ show: false, id: null, name: '' });
    }).catch(() => {
      showToast("Gagal menghapus produk", "error");
      setDeleteModal({ show: false, id: null, name: '' });
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    const backendUrl = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : 'http://localhost:8000';
    return `${backendUrl}${imagePath}`;
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Toast Notification */}
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">📦</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Dashboard Admin</h1>
              <p className="text-xs text-slate-500 font-medium">Manajemen Inventaris Toko</p>
            </div>
          </div>
          <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition">Lihat Katalog ↗</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex gap-3 mb-6 border-b border-slate-200 pb-4">
          <button 
            onClick={() => setActiveTab('list')} 
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${activeTab === 'list' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            📋 Daftar Produk
          </button>

          <button 
            onClick={() => setActiveTab('history')} 
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            🕒 Riwayat Aktivitas
          </button>

          <button 
            onClick={() => setActiveTab('users')} 
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            👥 Kelola Pengguna / Pegawai
          </button>
        </div>

        {/* Render Konten Berdasarkan Tab yang Aktif */}
        {activeTab === 'list' && (
          <ProductList 
            products={products}
            onEdit={handleOpenEditModal}
            onDelete={(id, name) => confirmDelete(id, name)}
            onOpenAddModal={handleOpenAddModal}
            totalItems={totalItems}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            getImageUrl={getImageUrl}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            onImport={handleImport}
          />
        )}
        
        {activeTab === 'history' && (
          <ProductHistory history={history} showToast={showToast}/>
        )}

        {activeTab === 'users' && (
          <UserManagement showToast={showToast} />
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={isEditing}
        formData={formData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        categories={categories}
        suppliers={suppliers}
        loading={loading}
        error={error}
      />

      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hapus Produk?</h3>
            <p className="text-xs text-slate-500 mb-6 px-2">
              Apakah Anda yakin ingin menghapus produk <span className="font-bold text-slate-700">"{deleteModal.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-200 transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}