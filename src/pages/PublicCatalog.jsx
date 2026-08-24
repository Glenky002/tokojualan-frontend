// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import api from '../api/axiosConfig';

// // export default function PublicCatalog() {
// //   const [products, setProducts] = useState([]);
// //   const [categories, setCategories] = useState([]);
  
// //   // State untuk status login admin
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const navigate = useNavigate();

// //   // Filter & Search State
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [selectedCategory, setSelectedCategory] = useState('');
  
// //   // Pagination State
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);

// //   // Modal & Drawer State
// //   const [selectedProduct, setSelectedProduct] = useState(null);
// //   const [isCartOpen, setIsCartOpen] = useState(false);
// //   const [isFormOpen, setIsFormOpen] = useState(false);

// //   // Cart State
// //   const [cart, setCart] = useState([]);

// //   // Form Identitas Pembeli State
// //   const [customerForm, setCustomerForm] = useState({
// //     name: '',
// //     phone: '',
// //     address: '',
// //     notes: ''
// //   });

// //   // Banner Slider State
// //   const [currentSlide, setCurrentSlide] = useState(0);
// //   const banners = [
// //     {
// //       title: "Diskon Spesial Akhir Tahun 🎉",
// //       subtitle: "Nikmati potongan harga menarik untuk semua produk pilihan terbaik minggu ini.",
// //       bg: "from-indigo-600 to-blue-600",
// //       badge: "Promo Terbatas"
// //     },
// //     {
// //       title: "Produk 100% Original & Berkualitas 🛡️",
// //       subtitle: "Belanja aman, stok terjamin real-time, langsung kirim via WhatsApp.",
// //       bg: "from-purple-600 to-indigo-600",
// //       badge: "Garansi Mutu"
// //     },
// //     {
// //       title: "Pesan Cepat, Kirim Cepat 🚀",
// //       subtitle: "Layanan responsif langsung terhubung dengan admin toko kami.",
// //       bg: "from-emerald-600 to-teal-600",
// //       badge: "Pelayanan Kilat"
// //     }
// //   ];

// //   // Cek status login admin (misalnya berdasarkan role di localStorage atau token khusus admin)
// //   const isAdmin = localStorage.getItem('role') === 'admin' || localStorage.getItem('is_staff') === 'true'; 
// // // atau bisa juga mengecek keberadaan token khusus admin

// //   // Auto slide banner setiap 4 detik
// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setCurrentSlide((prev) => (prev + 1) % banners.length);
// //     }, 4000);
// //     return () => clearInterval(timer);
// //   }, [banners.length]);

// //   const WHATSAPP_NUMBER = "628984234000"; // Ganti nomor WhatsApp toko Anda

// //   // Cek status login saat halaman dimuat
// //   useEffect(() => {
// //     const token = localStorage.getItem('access_token');
// //     if (token) {
// //       setIsLoggedIn(true);
// //     }
// //   }, []);

// //   // Fungsi Logout Admin
// //   const handleLogout = () => {
// //     localStorage.removeItem('access_token');
// //     localStorage.removeItem('refresh_token');
// //     setIsLoggedIn(false);
// //     navigate('/');
// //   };

// //   // 1. Ambil Data Kategori
// //   useEffect(() => {
// //     api.get('/categories/')
// //       .then((res) => {
// //         const data = res.data;
// //         setCategories(data.results || data);
// //       })
// //       .catch((err) => console.log('Gagal ambil kategori:', err));
// //   }, []);

// //   // 2. Ambil Data Produk (Sudah Diperbaiki untuk Pagination)
// //  // 2. Ambil Data Produk (Disesuaikan dengan CustomPagination Django)
// // // 2. Ambil Data Produk (Sinkron dengan ProductPagination Django)
// //   useEffect(() => {
// //     let url = `/products/?page=${currentPage}`;
// //     if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
// //     if (selectedCategory) url += `&category=${selectedCategory}`;

// //     api.get(url)
// //       .then((res) => {
// //         const data = res.data;
        
// //         // Karena pakai PageNumberPagination standar DRF, datanya ada di dalam 'results'
// //         if (data.results) {
// //           setProducts(data.results);
          
// //           // PENTING: Gunakan angka 10, karena page_size di backend Django Anda diatur 10
// //           const pageSize = 10; 
// //           setTotalPages(Math.ceil(data.count / pageSize) || 1);
// //         } else {
// //           // Fallback jika format data bukan objek pagination
// //           setProducts(Array.isArray(data) ? data : []);
// //           setTotalPages(1);
// //         }
// //       })
// //       .catch((err) => console.log('Gagal ambil produk:', err));
// //   }, [searchQuery, selectedCategory, currentPage]);

// //   // Fungsi Tambah ke Keranjang
// //   const addToCart = (product, e) => {
// //     if (e) e.stopPropagation();
    
// //     setCart((prevCart) => {
// //       const existingItem = prevCart.find((item) => item.id === product.id);
// //       if (existingItem) {
// //         if (existingItem.quantity >= product.stock) {
// //           alert('Stok produk tidak mencukupi!');
// //           return prevCart;
// //         }
// //         return prevCart.map((item) =>
// //           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
// //         );
// //       }
// //       return [...prevCart, { ...product, quantity: 1 }];
// //     });
// //   };

// //   // Fungsi Ubah Jumlah di Keranjang
// //   const updateQuantity = (productId, delta) => {
// //     setCart((prevCart) => {
// //       return prevCart.map((item) => {
// //         if (item.id === productId) {
// //           const newQty = item.quantity + delta;
// //           return newQty > 0 ? { ...item, quantity: newQty } : null;
// //         }
// //         return item;
// //       }).filter(Boolean);
// //     });
// //   };

// //   const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
// //   const totalPrice = cart.reduce((sum, item) => sum + (Number(item.selling_price) * item.quantity), 0);

// //   const handleFormChange = (e) => {
// //     setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
// //   };

// //   const handleCheckoutWhatsApp = (e) => {
// //     e.preventDefault();
// //     if (cart.length === 0) return;

// //     if (!customerForm.name || !customerForm.phone || !customerForm.address) {
// //       alert('Mohon lengkapi Nama, No. HP, dan Alamat pengiriman terlebih dahulu!');
// //       return;
// //     }

// //     let message = "Halo Kak, saya ingin memesan produk berikut:\n\n";
    
// //     cart.forEach((item, index) => {
// //       const subtotal = Number(item.selling_price) * item.quantity;
// //       message += `${index + 1}. *${item.name}* (${item.quantity}x) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
// //     });

// //     message += `\n*Total Belanja: Rp ${totalPrice.toLocaleString('id-ID')}*\n`;
// //     message += `-----------------------------------\n`;
// //     message += `*DATA PEMESAN:*\n`;
// //     message += `👤 Nama: ${customerForm.name}\n`;
// //     message += `📞 No. HP: ${customerForm.phone}\n`;
// //     message += `🏠 Alamat: ${customerForm.address}\n`;
// //     if (customerForm.notes) {
// //       message += `📝 Catatan: ${customerForm.notes}\n`;
// //     }
// //     message += `-----------------------------------\n`;
// //     message += `Mohon informasi ketersediaan dan total pembayaran beserta ongkirnya. Terima kasih!`;

// //     const encodedMessage = encodeURIComponent(message);
// //     const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

// //     window.open(whatsappUrl, '_blank');
// //     setIsFormOpen(false);
// //     setIsCartOpen(false);
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      
// //       {/* Header & Navigasi */}
// //       <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
// //         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
// //           <div className="flex items-center gap-3">
// //             <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">🛍️</div>
// //             <div>
// //               <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Katalog Toko</h1>
// //               <p className="text-xs text-slate-500 font-medium">Belanja mudah & real-time</p>
// //             </div>
// //           </div>
          
// //           <div className="flex items-center gap-3">
// //             {/* Navigasi Admin Dinamis (Hanya muncul jika login) */}
// //             {isLoggedIn ? (
// //               <div className="flex items-center gap-2">
// //               {isAdmin && (
// //                 <Link 
// //                   to="/admin/products" 
// //                   className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition"
// //                 >
// //                   Dashboard Admin ⚙️
// //                 </Link>
// //               )}
// //                 <button 
// //                   onClick={handleLogout}
// //                   className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
// //                 >
// //                   Logout
// //                 </button>
// //               </div>
// //             ) : (
// //               <Link 
// //                 to="/login" 
// //                 className="text-xs text-indigo-600 font-bold hover:bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-200 transition"
// //               >
// //                 Login
// //               </Link>
// //             )}

// //             {/* Tombol Keranjang Belanja */}
// //             <button 
// //               onClick={() => setIsCartOpen(true)}
// //               className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl flex items-center gap-2.5 hover:bg-indigo-100 transition cursor-pointer shadow-xs"
// //             >
// //               <span className="text-sm font-bold text-indigo-900">🛒 Keranjang</span>
// //               <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
// //                 {totalCartItems}
// //               </span>
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto px-6 pt-6">
        
// //         {/* === BANNER SLIDER ESTETIK === */}
// //         <div className="relative w-full h-48 md:h-60 rounded-2xl overflow-hidden shadow-md mb-8">
// //           {banners.map((banner, index) => (
// //             <div
// //               key={index}
// //               className={`absolute inset-0 bg-gradient-to-r ${banner.bg} p-8 flex flex-col justify-center text-white transition-opacity duration-700 ease-in-out ${
// //                 index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
// //               }`}
// //             >
// //               <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold w-max mb-3">
// //                 {banner.badge}
// //               </span>
// //               <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">{banner.title}</h2>
// //               <p className="text-sm md:text-base text-white/90 max-w-xl">{banner.subtitle}</p>
// //             </div>
// //           ))}

// //           {/* Titik Indikator Slider */}
// //           <div className="absolute bottom-3 right-6 z-20 flex gap-1.5">
// //             {banners.map((_, index) => (
// //               <button
// //                 key={index}
// //                 onClick={() => setCurrentSlide(index)}
// //                 className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
// //               />
// //             ))}
// //           </div>
// //         </div>

// //         {/* Pencarian & Filter */}
// //         <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
// //           <div className="relative w-full md:w-1/3">
// //             <input
// //               type="text"
// //               placeholder="Cari nama produk..."
// //               value={searchQuery}
// //               onChange={(e) => {
// //                 setSearchQuery(e.target.value);
// //                 setCurrentPage(1);
// //               }}
// //               className="w-full px-4 py-2.5 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs text-sm"
// //             />
// //             <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
// //           </div>

// //           <div className="w-full md:w-1/4">
// //             <select
// //               value={selectedCategory}
// //               onChange={(e) => {
// //                 setSelectedCategory(e.target.value);
// //                 setCurrentPage(1);
// //               }}
// //               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs text-slate-700 font-semibold text-sm cursor-pointer"
// //             >
// //               <option value="">Semua Kategori</option>
// //               {categories.map((cat) => (
// //                 <option key={cat.id} value={cat.id}>{cat.name}</option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>

// //         {/* Grid Produk */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
// //           {products.length > 0 ? (
// //             products.map((product) => (
// //               <div
// //                 key={product.id}
// //                 onClick={() => setSelectedProduct(product)}
// //                 className="bg-white rounded-2xl shadow-xs border border-slate-200 hover:shadow-lg transition cursor-pointer p-4 flex flex-col justify-between group"
// //               >
// //                 <div>
// //                   <div className="h-44 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 overflow-hidden relative">
// //                     {product.image ? (
// //                       <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
// //                     ) : (
// //                       <span className="text-xs font-semibold">Tidak Ada Foto</span>
// //                     )}
// //                     <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-indigo-600 font-bold text-[10px] uppercase rounded-lg shadow-xs">
// //                       {product.category_name || product.category?.name || 'Umum'}
// //                     </span>
// //                   </div>
// //                   <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1">{product.name}</h3>
// //                   <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description || "Produk berkualitas tinggi siap pakai."}</p>
// //                 </div>

// //                 <div>
// //                   <div className="flex items-center justify-between mb-3 pt-2 border-t border-slate-100">
// //                     <span className="text-base font-extrabold text-emerald-600">
// //                       Rp {Number(product.selling_price).toLocaleString('id-ID')}
// //                     </span>
// //                     <span className="text-xs font-semibold text-slate-400">Stok: {product.stock}</span>
// //                   </div>
                  
// //                   <button
// //                     onClick={(e) => addToCart(product, e)}
// //                     className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white py-2.5 rounded-xl text-xs font-bold transition border border-indigo-100 cursor-pointer shadow-xs"
// //                   >
// //                     + Tambah ke Keranjang
// //                   </button>
// //                 </div>
// //               </div>
// //             ))
// //           ) : (
// //             <div className="col-span-full text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200">
// //               <p className="text-lg font-bold mb-1">Produk tidak ditemukan</p>
// //               <p className="text-xs text-slate-400">Coba kata kunci atau kategori lain.</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Pagination */}
// //         <div className="flex justify-center items-center gap-4 mt-10">
// //           <button
// //             disabled={currentPage === 1}
// //             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
// //             className="px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 text-slate-700 hover:bg-slate-100 shadow-xs font-semibold text-sm cursor-pointer"
// //           >
// //             Sebelumnya
// //           </button>
// //           <span className="text-sm font-bold text-slate-600">
// //             Halaman {currentPage} dari {totalPages || 1}
// //           </span>
// //           <button
// //             disabled={currentPage >= totalPages}
// //             onClick={() => setCurrentPage((prev) => prev + 1)}
// //             className="px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 text-slate-700 hover:bg-slate-100 shadow-xs font-semibold text-sm cursor-pointer"
// //           >
// //             Berikutnya
// //           </button>
// //         </div>
// //       </div>

// //       {/* === DRAWER / MODAL KERANJANG BELANJA === */}
// //       {isCartOpen && (
// //         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
// //           <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
// //             <div>
// //               <div className="flex justify-between items-center pb-4 border-b border-slate-100">
// //                 <h2 className="text-lg font-bold text-slate-900">Keranjang Belanja 🛒</h2>
// //                 <button 
// //                   onClick={() => setIsCartOpen(false)}
// //                   className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
// //                 >
// //                   ✕
// //                 </button>
// //               </div>

// //               {cart.length === 0 ? (
// //                 <div className="text-center py-20 text-slate-400">
// //                   <p className="text-4xl mb-3">🛍️</p>
// //                   <p className="text-sm font-semibold">Keranjang belanja masih kosong.</p>
// //                 </div>
// //               ) : (
// //                 <div className="divide-y divide-slate-100 my-4">
// //                   {cart.map((item) => (
// //                     <div key={item.id} className="py-3 flex justify-between items-center">
// //                       <div>
// //                         <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
// //                         <p className="text-xs text-emerald-600 font-semibold">
// //                           Rp {Number(item.selling_price).toLocaleString('id-ID')}
// //                         </p>
// //                       </div>
// //                       <div className="flex items-center gap-2">
// //                         <button 
// //                           onClick={() => updateQuantity(item.id, -1)}
// //                           className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
// //                         >
// //                           -
// //                         </button>
// //                         <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
// //                         <button 
// //                           onClick={() => updateQuantity(item.id, 1)}
// //                           className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
// //                         >
// //                           +
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {cart.length > 0 && (
// //               <div className="border-t border-slate-100 pt-4">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <span className="text-sm font-bold text-slate-500">Total Harga:</span>
// //                   <span className="text-lg font-extrabold text-emerald-600">
// //                     Rp {totalPrice.toLocaleString('id-ID')}
// //                   </span>
// //                 </div>
// //                 <button
// //                   onClick={() => setIsFormOpen(true)}
// //                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-md shadow-emerald-100 cursor-pointer"
// //                 >
// //                   Checkout via WhatsApp 📲
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* === MODAL FORM CHECKOUT WHATSAPP === */}
// //       {isFormOpen && (
// //         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-lg font-bold text-slate-900">Data Pengiriman Pesanan</h3>
// //               <button 
// //                 onClick={() => setIsFormOpen(false)}
// //                 className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <form onSubmit={handleCheckoutWhatsApp} className="space-y-4">
// //               <div>
// //                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Lengkap</label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={customerForm.name}
// //                   onChange={handleFormChange}
// //                   required
// //                   placeholder="Contoh: Budi Santoso"
// //                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nomor WhatsApp / HP</label>
// //                 <input
// //                   type="tel"
// //                   name="phone"
// //                   value={customerForm.phone}
// //                   onChange={handleFormChange}
// //                   required
// //                   placeholder="Contoh: 08123456789"
// //                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Alamat Pengiriman Lengkap</label>
// //                 <textarea
// //                   name="address"
// //                   value={customerForm.address}
// //                   onChange={handleFormChange}
// //                   required
// //                   rows="3"
// //                   placeholder="Jalan, No Rumah, RT/RW, Kecamatan, Kota"
// //                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
// //                 ></textarea>
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Catatan Tambahan (Opsional)</label>
// //                 <input
// //                   type="text"
// //                   name="notes"
// //                   value={customerForm.notes}
// //                   onChange={handleFormChange}
// //                   placeholder="Contoh: Tolong pilihkan warna hitam"
// //                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
// //                 />
// //               </div>

// //               <button
// //                 type="submit"
// //                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-md shadow-emerald-100 cursor-pointer mt-2"
// //               >
// //                 Kirim Pesanan ke WhatsApp 🚀
// //               </button>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* === MODAL DETAIL PRODUK === */}
// //       {selectedProduct && (
// //         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-100">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-lg font-bold text-slate-900">Detail Produk</h3>
// //               <button 
// //                 onClick={() => setSelectedProduct(null)}
// //                 className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
// //               >
// //                 ✕
// //               </button>
// //             </div>

// //             <div className="h-56 bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
// //               {selectedProduct.image ? (
// //                 <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
// //               ) : (
// //                 <span className="text-slate-400 text-sm">Tidak Ada Foto</span>
// //               )}
// //             </div>

// //             <span className="text-xs font-bold text-indigo-600 uppercase">
// //               {selectedProduct.category_name || selectedProduct.category?.name || 'Kategori'}
// //             </span>
// //             <h2 className="text-xl font-extrabold text-slate-900 mt-0.5 mb-2">{selectedProduct.name}</h2>
// //             <p className="text-sm text-slate-600 mb-6 leading-relaxed">{selectedProduct.description || "Belum ada deskripsi untuk produk ini."}</p>

// //             <div className="flex items-center justify-between pt-4 border-t border-slate-100">
// //               <div>
// //                 <span className="text-xs text-slate-400 block font-medium">Harga</span>
// //                 <span className="text-xl font-extrabold text-emerald-600">
// //                   Rp {Number(selectedProduct.selling_price).toLocaleString('id-ID')}
// //                 </span>
// //               </div>
// //               <div>
// //                 <span className="text-xs text-slate-400 block font-medium">Stok Tersedia</span>
// //                 <span className="text-base font-bold text-slate-700">{selectedProduct.stock} Pcs</span>
// //               </div>
// //             </div>

// //             <button
// //               onClick={(e) => {
// //                 addToCart(selectedProduct, e);
// //                 setSelectedProduct(null);
// //                 setIsCartOpen(true);
// //               }}
// //               className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-md shadow-indigo-100 cursor-pointer"
// //             >
// //               Masukkan ke Keranjang 🛒
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../api/axiosConfig';

// export default function PublicCatalog() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
  
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   // Filter & Search State
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
  
//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Modal & Drawer State
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   // Cart State
//   const [cart, setCart] = useState([]);

//   // Notifikasi Toast Custom State
//   const [toastMessage, setToastMessage] = useState(null);

//   // Form Identitas Pembeli State
//   const [customerForm, setCustomerForm] = useState({
//     name: '',
//     phone: '',
//     address: '',
//     notes: ''
//   });

//   // Banner Slider State
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const banners = [
//     {
//       title: "Diskon Spesial Akhir Tahun 🎉",
//       subtitle: "Nikmati potongan harga menarik untuk semua produk pilihan terbaik minggu ini.",
//       bg: "from-indigo-600 to-blue-600",
//       badge: "Promo Terbatas"
//     },
//     {
//       title: "Produk 100% Original & Berkualitas 🛡️",
//       subtitle: "Belanja aman, stok terjamin real-time, langsung kirim via WhatsApp.",
//       bg: "from-purple-600 to-indigo-600",
//       badge: "Garansi Mutu"
//     },
//     {
//       title: "Pesan Cepat, Kirim Cepat 🚀",
//       subtitle: "Layanan responsif langsung terhubung dengan admin toko kami.",
//       bg: "from-emerald-600 to-teal-600",
//       badge: "Pelayanan Kilat"
//     }
//   ];

//   const isAdmin = localStorage.getItem('role') === 'admin' || localStorage.getItem('is_staff') === 'true';

//   // Fungsi helper untuk memunculkan Toast Kustom
//   const showToast = (message) => {
//     setToastMessage(message);
//     setTimeout(() => {
//       setToastMessage(null);
//     }, 3500); // Hilang otomatis setelah 3.5 detik
//   };

//   // Auto slide banner setiap 4 detik
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % banners.length);
//     }, 4000);
//     return () => clearInterval(timer);
//   }, [banners.length]);

//   const WHATSAPP_NUMBER = "628984234000"; // Ganti nomor WhatsApp toko Anda

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     setIsLoggedIn(false);
//     navigate('/');
//   };

//   // 1. Ambil Data Kategori
//   useEffect(() => {
//     api.get('/categories/')
//       .then((res) => {
//         const data = res.data;
//         setCategories(data.results || data);
//       })
//       .catch((err) => console.log('Gagal ambil kategori:', err));
//   }, []);

//   // 2. Ambil Data Produk (Pagination)
//   useEffect(() => {
//     let url = `/products/?page=${currentPage}`;
//     if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
//     if (selectedCategory) url += `&category=${selectedCategory}`;

//     api.get(url)
//       .then((res) => {
//         const data = res.data;
//         if (data.results) {
//           setProducts(data.results);
//           const pageSize = 10; 
//           setTotalPages(Math.ceil(data.count / pageSize) || 1);
//         } else {
//           setProducts(Array.isArray(data) ? data : []);
//           setTotalPages(1);
//         }
//       })
//       .catch((err) => console.log('Gagal ambil produk:', err));
//   }, [searchQuery, selectedCategory, currentPage]);

//   // Fungsi Tambah ke Keranjang
//   const addToCart = (product, e) => {
//     if (e) e.stopPropagation();
//     if (product.stock <= 0) return;
    
//     setCart((prevCart) => {
//       const existingItem = prevCart.find((item) => item.id === product.id);
//       if (existingItem) {
//         if (existingItem.quantity >= product.stock) {
//           showToast('⚠️ Stok produk tidak mencukupi!');
//           return prevCart;
//         }
//         return prevCart.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       }
//       return [...prevCart, { ...product, quantity: 1 }];
//     });
//   };

//   // Fungsi Beli Sekarang
//   const handleBuyNow = (product, e) => {
//     if (e) e.stopPropagation();
//     if (product.stock <= 0) return;

//     setCart([{ ...product, quantity: 1 }]);
//     setIsFormOpen(true);
//   };

//   // Fungsi Ubah Jumlah di Keranjang
//   const updateQuantity = (productId, delta) => {
//     setCart((prevCart) => {
//       return prevCart.map((item) => {
//         if (item.id === productId) {
//           const newQty = item.quantity + delta;
//           return newQty > 0 ? { ...item, quantity: newQty } : null;
//         }
//         return item;
//       }).filter(Boolean);
//     });
//   };

//   const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//   const totalPrice = cart.reduce((sum, item) => sum + (Number(item.selling_price) * item.quantity), 0);

//   const handleFormChange = (e) => {
//     setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
//   };

//   // Generator Format Pesan WhatsApp
//   const generateWhatsAppMessage = () => {
//     let message = "Halo Kak, saya ingin memesan produk berikut:\n\n";
    
//     cart.forEach((item, index) => {
//       const subtotal = Number(item.selling_price) * item.quantity;
//       message += `${index + 1}. *${item.name}* (${item.quantity}x) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
//     });

//     message += `\n*Total Belanja: Rp ${totalPrice.toLocaleString('id-ID')}*\n`;
//     message += `-----------------------------------\n`;
//     message += `*DATA PEMESAN:*\n`;
//     message += `👤 Nama: ${customerForm.name}\n`;
//     message += `📞 No. HP: ${customerForm.phone}\n`;
//     message += `🏠 Alamat: ${customerForm.address}\n`;
//     if (customerForm.notes) {
//       message += `📝 Catatan: ${customerForm.notes}\n`;
//     }
//     message += `-----------------------------------\n`;
//     message += `Mohon informasi ketersediaan dan total pembayaran beserta ongkirnya. Terima kasih!`;
//     return message;
//   };

//   const handleCheckoutWhatsApp = (e) => {
//     e.preventDefault();
//     if (cart.length === 0) return;

//     if (!customerForm.name || !customerForm.phone || !customerForm.address) {
//       showToast('⚠️ Mohon lengkapi Nama, No. HP, dan Alamat pengiriman!');
//       return;
//     }

//     const message = generateWhatsAppMessage();
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

//     window.open(whatsappUrl, '_blank');
//     setIsFormOpen(false);
//     setIsCartOpen(false);
//   };

//   // Fitur Salin Pesanan ke Clipboard dengan Toast Custom
//   const handleCopyOrder = () => {
//     if (!customerForm.name || !customerForm.phone || !customerForm.address) {
//       showToast('⚠️ Lengkapi Data Pengiriman sebelum menyalin pesanan!');
//       return;
//     }
//     const message = generateWhatsAppMessage();
//     navigator.clipboard.writeText(message);
//     showToast('✅ Pesanan berhasil disalin ke Clipboard!');
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 relative">
      
//       {/* === CUSTOM TOAST NOTIFICATION (Pojok Kanan Atas) === */}
//       {toastMessage && (
//         <div className="fixed top-6 right-6 z-[99] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
//           <span>{toastMessage}</span>
//         </div>
//       )}

//       {/* Header & Navigasi */}
//       <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md">🛍️</div>
//             <div>
//               <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Katalog Toko</h1>
//               <p className="text-xs text-slate-500 font-medium">Belanja mudah & real-time</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             {isLoggedIn ? (
//               <div className="flex items-center gap-2">
//               {isAdmin && (
//                 <Link 
//                   to="/admin/products" 
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition"
//                 >
//                   Dashboard Admin ⚙️
//                 </Link>
//               )}
//                 <button 
//                   onClick={handleLogout}
//                   className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 to="/login" 
//                 className="text-xs text-indigo-600 font-bold hover:bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-200 transition"
//               >
//                 Login
//               </Link>
//             )}

//             {/* Tombol Keranjang Belanja */}
//             <button 
//               onClick={() => setIsCartOpen(true)}
//               className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl flex items-center gap-2.5 hover:bg-indigo-100 transition cursor-pointer shadow-xs"
//             >
//               <span className="text-sm font-bold text-indigo-900">🛒 Keranjang</span>
//               <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                 {totalCartItems}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 pt-6">
        
//         {/* === BANNER SLIDER ESTETIK === */}
//         <div className="relative w-full h-48 md:h-60 rounded-2xl overflow-hidden shadow-md mb-8">
//           {banners.map((banner, index) => (
//             <div
//               key={index}
//               className={`absolute inset-0 bg-gradient-to-r ${banner.bg} p-8 flex flex-col justify-center text-white transition-opacity duration-700 ease-in-out ${
//                 index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
//               }`}
//             >
//               <span className="inline-block px-3 py-1 bg-white/25 backdrop-blur-md rounded-lg text-xs font-bold w-max mb-3">
//                 {banner.badge}
//               </span>
//               <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">{banner.title}</h2>
//               <p className="text-sm md:text-base text-white/90 max-w-xl">{banner.subtitle}</p>
//             </div>
//           ))}

//           <div className="absolute bottom-3 right-6 z-20 flex gap-1.5">
//             {banners.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Pencarian & Filter */}
//         <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
//           <div className="relative w-full md:w-1/3">
//             <input
//               type="text"
//               placeholder="Cari nama produk..."
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full px-4 py-2.5 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs text-sm"
//             />
//             <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
//           </div>

//           <div className="w-full md:w-1/4">
//             <select
//               value={selectedCategory}
//               onChange={(e) => {
//                 setSelectedCategory(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs text-slate-700 font-semibold text-sm cursor-pointer"
//             >
//               <option value="">Semua Kategori</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>{cat.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Grid Produk */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {products.length > 0 ? (
//             products.map((product) => {
//               const isOutOfStock = product.stock <= 0;

//               return (
//                 <div
//                   key={product.id}
//                   onClick={() => setSelectedProduct(product)}
//                   className="bg-white rounded-2xl shadow-xs border border-slate-200 hover:shadow-lg transition cursor-pointer p-4 flex flex-col justify-between group"
//                 >
//                   <div>
//                     <div className="h-44 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 overflow-hidden relative">
//                       {product.image ? (
//                         <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
//                       ) : (
//                         <span className="text-xs font-semibold">Tidak Ada Foto</span>
//                       )}
//                       <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-indigo-600 font-bold text-[10px] uppercase rounded-lg shadow-xs">
//                         {product.category_name || product.category?.name || 'Umum'}
//                       </span>

//                       {/* Badge Stok Habis */}
//                       {isOutOfStock && (
//                         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
//                           <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider">
//                             Stok Habis
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                     <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1">{product.name}</h3>
//                     <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description || "Produk berkualitas tinggi siap pakai."}</p>
//                   </div>

//                   <div>
//                     <div className="flex items-center justify-between mb-3 pt-2 border-t border-slate-100">
//                       <span className="text-base font-extrabold text-emerald-600">
//                         Rp {Number(product.selling_price).toLocaleString('id-ID')}
//                       </span>
//                       <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
//                         Stok: {product.stock}
//                       </span>
//                     </div>
                    
//                     {/* Tombol Aksi Produk */}
//                     <div className="grid grid-cols-2 gap-2">
//                       <button
//                         onClick={(e) => addToCart(product, e)}
//                         disabled={isOutOfStock}
//                         className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer shadow-xs ${
//                           !isOutOfStock 
//                             ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100' 
//                             : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
//                         }`}
//                       >
//                         + Keranjang
//                       </button>
//                       <button
//                         onClick={(e) => handleBuyNow(product, e)}
//                         disabled={isOutOfStock}
//                         className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer shadow-xs ${
//                           !isOutOfStock 
//                             ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 shadow-emerald-100' 
//                             : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
//                         }`}
//                       >
//                         Beli Cepat
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="col-span-full text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200">
//               <p className="text-lg font-bold mb-1">Produk tidak ditemukan</p>
//               <p className="text-xs text-slate-400">Coba kata kunci atau kategori lain.</p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-4 mt-10">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 text-slate-700 hover:bg-slate-100 shadow-xs font-semibold text-sm cursor-pointer"
//           >
//             Sebelumnya
//           </button>
//           <span className="text-sm font-bold text-slate-600">
//             Halaman {currentPage} dari {totalPages || 1}
//           </span>
//           <button
//             disabled={currentPage >= totalPages}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//             className="px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 text-slate-700 hover:bg-slate-100 shadow-xs font-semibold text-sm cursor-pointer"
//           >
//             Berikutnya
//           </button>
//         </div>
//       </div>

//       {/* === DRAWER / MODAL KERANJANG BELANJA === */}
//       {isCartOpen && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
//           <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
//             <div>
//               <div className="flex justify-between items-center pb-4 border-b border-slate-100">
//                 <h2 className="text-lg font-bold text-slate-900">Keranjang Belanja 🛒</h2>
//                 <button 
//                   onClick={() => setIsCartOpen(false)}
//                   className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
//                 >
//                   ✕
//                 </button>
//               </div>

//               {cart.length === 0 ? (
//                 <div className="text-center py-20 text-slate-400">
//                   <p className="text-4xl mb-3">🛍️</p>
//                   <p className="text-sm font-semibold">Keranjang belanja masih kosong.</p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-slate-100 my-4">
//                   {cart.map((item) => (
//                     <div key={item.id} className="py-3 flex justify-between items-center">
//                       <div>
//                         <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
//                         <p className="text-xs text-emerald-600 font-semibold">
//                           Rp {Number(item.selling_price).toLocaleString('id-ID')}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button 
//                           onClick={() => updateQuantity(item.id, -1)}
//                           className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
//                         >
//                           -
//                         </button>
//                         <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
//                         <button 
//                           onClick={() => updateQuantity(item.id, 1)}
//                           className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {cart.length > 0 && (
//               <div className="border-t border-slate-100 pt-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="text-sm font-bold text-slate-500">Total Harga:</span>
//                   <span className="text-lg font-extrabold text-emerald-600">
//                     Rp {totalPrice.toLocaleString('id-ID')}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => setIsFormOpen(true)}
//                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-md shadow-emerald-100 cursor-pointer"
//                 >
//                   Checkout via WhatsApp 📲
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* === MODAL FORM CHECKOUT WHATSAPP === */}
//       {isFormOpen && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-slate-900">Data Pengiriman Pesanan</h3>
//               <button 
//                 onClick={() => setIsFormOpen(false)}
//                 className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
//               >
//                 ✕
//               </button>
//             </div>

//             <form onSubmit={handleCheckoutWhatsApp} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Lengkap</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={customerForm.name}
//                   onChange={handleFormChange}
//                   required
//                   placeholder="Contoh: Budi Santoso"
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nomor WhatsApp / HP</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={customerForm.phone}
//                   onChange={handleFormChange}
//                   required
//                   placeholder="Contoh: 08123456789"
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Alamat Pengiriman Lengkap</label>
//                 <textarea
//                   name="address"
//                   value={customerForm.address}
//                   onChange={handleFormChange}
//                   required
//                   rows="3"
//                   placeholder="Jalan, No Rumah, RT/RW, Kecamatan, Kota"
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 ></textarea>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Catatan Tambahan (Opsional)</label>
//                 <input
//                   type="text"
//                   name="notes"
//                   value={customerForm.notes}
//                   onChange={handleFormChange}
//                   placeholder="Contoh: Tolong pilihkan warna hitam"
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={handleCopyOrder}
//                   className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition cursor-pointer border border-slate-200"
//                 >
//                   📋 Salin Pesanan
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs transition shadow-md shadow-emerald-100 cursor-pointer"
//                 >
//                   Kirim via WhatsApp 🚀
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* === MODAL DETAIL PRODUK === */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-100">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-slate-900">Detail Produk</h3>
//               <button 
//                 onClick={() => setSelectedProduct(null)}
//                 className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="h-56 bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
//               {selectedProduct.image ? (
//                 <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
//               ) : (
//                 <span className="text-slate-400 text-sm">Tidak Ada Foto</span>
//               )}
//               {selectedProduct.stock <= 0 && (
//                 <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
//                   <span className="px-4 py-1.5 bg-rose-600 text-white font-extrabold text-sm rounded-xl shadow-md uppercase">
//                     Stok Habis
//                   </span>
//                 </div>
//               )}
//             </div>

//             <span className="text-xs font-bold text-indigo-600 uppercase">
//               {selectedProduct.category_name || selectedProduct.category?.name || 'Kategori'}
//             </span>
//             <h2 className="text-xl font-extrabold text-slate-900 mt-0.5 mb-2">{selectedProduct.name}</h2>
//             <p className="text-sm text-slate-600 mb-6 leading-relaxed">{selectedProduct.description || "Belum ada deskripsi untuk produk ini."}</p>

//             <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-6">
//               <div>
//                 <span className="text-xs text-slate-400 block font-medium">Harga</span>
//                 <span className="text-xl font-extrabold text-emerald-600">
//                   Rp {Number(selectedProduct.selling_price).toLocaleString('id-ID')}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-xs text-slate-400 block font-medium">Stok Tersedia</span>
//                 <span className={`text-base font-bold ${selectedProduct.stock <= 0 ? 'text-rose-600' : 'text-slate-700'}`}>
//                   {selectedProduct.stock} Pcs
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 disabled={selectedProduct.stock <= 0}
//                 onClick={(e) => {
//                   addToCart(selectedProduct, e);
//                   setSelectedProduct(null);
//                   setIsCartOpen(true);
//                 }}
//                 className={`py-3 rounded-xl font-bold text-xs transition border cursor-pointer shadow-xs ${
//                   selectedProduct.stock > 0 
//                     ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100' 
//                     : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
//                 }`}
//               >
//                 + Masukkan Keranjang 🛒
//               </button>
//               <button
//                 disabled={selectedProduct.stock <= 0}
//                 onClick={(e) => {
//                   handleBuyNow(selectedProduct, e);
//                   setSelectedProduct(null);
//                 }}
//                 className={`py-3 rounded-xl font-bold text-xs transition shadow-md cursor-pointer ${
//                   selectedProduct.stock > 0 
//                     ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100' 
//                     : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
//                 }`}
//               >
//                 Beli Cepat 🚀
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function PublicCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State untuk Skeleton Loading
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // ---> TAMBAHKAN STATE ALAMAT DI SINI <---
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal & Drawer State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // State untuk Halaman Sukses Checkout (Nomor 3)
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Cart State
  const [cart, setCart] = useState([]);

  // Notifikasi Toast Custom State
  const [toastMessage, setToastMessage] = useState(null);

  const [flyingImage, setFlyingImage] = useState(null);

  // Form Identitas Pembeli State
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Banner Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    {
      title: "Diskon Spesial Akhir Tahun 🎉",
      subtitle: "Nikmati potongan harga menarik untuk semua produk pilihan terbaik minggu ini.",
      bg: "from-indigo-600 to-blue-600",
      badge: "Promo Terbatas"
    },
    {
      title: "Produk 100% Original & Berkualitas 🛡️",
      subtitle: "Belanja aman, stok terjamin real-time, langsung kirim via WhatsApp.",
      bg: "from-purple-600 to-indigo-600",
      badge: "Garansi Mutu"
    },
    {
      title: "Pesan Cepat, Kirim Cepat 🚀",
      subtitle: "Layanan responsif langsung terhubung dengan admin toko kami.",
      bg: "from-emerald-600 to-teal-600",
      badge: "Pelayanan Kilat"
    }
  ];

  const isAdmin = localStorage.getItem('role') === 'admin' || localStorage.getItem('is_staff') === 'true';

  // Fungsi helper untuk memunculkan Toast Kustom
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auto slide banner setiap 4 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const WHATSAPP_NUMBER = "628984234000"; // Ganti nomor WhatsApp toko Anda

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Ambil data alamat pengiriman user jika sudah login
      api.get('/shipping-addresses/')
        .then((res) => {
          const data = res.data.results || res.data;
          setAddresses(data);
          const defaultAddr = data.find(addr => addr.is_default);
          if (defaultAddr) {
            setSelectedAddress(defaultAddr);
          } else if (data.length > 0) {
            setSelectedAddress(data[0]);
          }
        })
        .catch((err) => console.log("Gagal memuat alamat pengiriman:", err));
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/');
  };

  // 1. Ambil Data Kategori
  useEffect(() => {
    api.get('/categories/')
      .then((res) => {
        const data = res.data;
        setCategories(data.results || data);
      })
      .catch((err) => console.log('Gagal ambil kategori:', err));
  }, []);

  // 2. Ambil Data Produk (Pagination + Loading State)
  useEffect(() => {
    setIsLoading(true);
    let url = `/products/?page=${currentPage}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory) url += `&category=${selectedCategory}`;

    api.get(url)
      .then((res) => {
        const data = res.data;
        if (data.results) {
          setProducts(data.results);
          const pageSize = 10; 
          setTotalPages(Math.ceil(data.count / pageSize) || 1);
        } else {
          setProducts(Array.isArray(data) ? data : []);
          setTotalPages(1);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log('Gagal ambil produk:', err);
        setIsLoading(false);
      });
  }, [searchQuery, selectedCategory, currentPage]);

  // Fungsi Tambah ke Keranjang
  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (product.stock <= 0) return;

    // --- ANIMASI FLYING TO CART ---
    if (e && e.target) {
      const buttonRect = e.target.getBoundingClientRect();
      // Cari posisi keranjang di header (asumsi ikon keranjang ada di kanan atas)
      const cartIcon = document.querySelector('button.bg-indigo-600'); 
      
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();

        // Buat elemen gambar melayang sementara
        const flyer = document.createElement('div');
        flyer.innerHTML = `<img src="${product.image || 'https://via.placeholder.com/50'}" class="w-full h-full object-cover rounded-xl shadow-2xl border-2 border-indigo-500" />`;
        flyer.style.position = 'fixed';
        flyer.style.left = `${buttonRect.left}px`;
        flyer.style.top = `${buttonRect.top}px`;
        flyer.style.width = '45px';
        flyer.style.height = '45px';
        flyer.style.zIndex = '9999';
        
        // SETEL DURASI DI SINI (Misal 1.2 detik biar benar-benar kelihatan terbang santai)
        flyer.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.appendChild(flyer);

        // 2. Jeda sedikit (100ms) agar browser siap, baru jalankan perpindahan ke keranjang
        setTimeout(() => {
          flyer.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`;
          flyer.style.top = `${cartRect.top}px`;
          flyer.style.transform = 'scale(0.15) rotate(360deg)';
          flyer.style.opacity = '0.3';
        }, 100); // Diubah dari 20 jadi 100 biar ada jeda mulainya

        // 3. Hapus elemen setelah animasi benar-benar selesai (harus > 1200ms)
        setTimeout(() => {
          flyer.remove();
        }, 1400); // 1.4 detik baru dihapus
      }
    }
    // -----------------------------

    // Trigger toast masuk keranjang di bawah
    showToast(`✨ Berhasil menambahkan "${product.name}" ke keranjang!`);

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          showToast('⚠️ Stok produk tidak mencukupi!');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Fungsi Beli Sekarang
  const handleBuyNow = (product, e) => {
    if (e) e.stopPropagation();
    if (product.stock <= 0) return;

    // 1. Cek apakah user sudah login lewat token
    const token = localStorage.getItem('access_token');

    if (!token) {
      // Jika belum login, arahkan ke halaman login
      navigate('/login');
      return;
    }

    // 2. Jika sudah login, jalankan fungsi aslimu
    setCart([{ ...product, quantity: 1 }]);
    setIsFormOpen(true);
  };

  // Fungsi Ubah Jumlah di Keranjang
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.selling_price) * item.quantity), 0);

  const handleFormChange = (e) => {
    setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
  };

  // Generator Format Pesan WhatsApp
  const generateWhatsAppMessage = () => {
    let message = "Halo Kak, saya ingin memesan produk berikut:\n\n";
    
    cart.forEach((item, index) => {
      const subtotal = Number(item.selling_price) * item.quantity;
      message += `${index + 1}. *${item.name}* (${item.quantity}x) - Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total Belanja: Rp ${totalPrice.toLocaleString('id-ID')}*\n`;
    message += `-----------------------------------\n`;
    message += `*DATA PEMESAN:*\n`;
    message += `👤 Nama: ${customerForm.name}\n`;
    message += `📞 No. HP: ${customerForm.phone}\n`;
    message += `🏠 Alamat: ${customerForm.address}\n`;
    if (customerForm.notes) {
      message += `📝 Catatan: ${customerForm.notes}\n`;
    }
    message += `-----------------------------------\n`;
    message += `Mohon informasi ketersediaan dan total pembayaran beserta ongkirnya. Terima kasih!`;
    return message;
  };

  const handleOpenCheckoutForm = () => {
    // 1. Cek login dulu
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      // Kalau belum login, lempar ke login
      navigate('/login');
      return;
    }

    // 2. Kalau sudah login, buka modal form checkout-nya
    setIsFormOpen(true);
  };

  // Checkout WhatsApp dengan Tampilan Sukses (Success View)
 const handleCheckoutWhatsApp = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // 1. Cek kelengkapan data form
    if (!customerForm.name || !customerForm.phone || !customerForm.address) {
      showToast('⚠️ Mohon lengkapi Nama, No. HP, dan Alamat pengiriman!');
      return;
    }

    // Hitung total belanja dari keranjang
    const totalAmount = cart.reduce((sum, item) => sum + (Number(item.selling_price || item.price) * item.quantity), 0);

    // 2. Siapkan data items sesuai dengan TransactionSerializer Django
    // Menggunakan ID produk asli (item.id) supaya stok bisa dipotong otomatis
    const itemsPayload = cart.map(item => ({
      product: item.id, 
      quantity: item.quantity,
      price_at_sale: Number(item.selling_price || item.price)
    }));

    const transactionPayload = {
      customer_name: customerForm.name,
      customer_phone: customerForm.phone,
      shipping_address: customerForm.address,
      total_amount: totalAmount,
      order_type: 'WhatsApp Order',
      status: 'Belum Bayar', // Status awal saat checkout
      items: itemsPayload
    };

    try {
      // 3. Simpan transaksi ke backend endpoint /transactions/
      // Pastikan menggunakan 'API' (instance axiosConfig kamu)
      const response = await api.post('/transactions/', transactionPayload);
      // console.log("Transaksi berhasil dicatat ke database:", response.data);

      const message = generateWhatsAppMessage();
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // Simpan data pesanan ke state sukses sebelum membuka WhatsApp
      setOrderSuccessData({
        message,
        whatsappUrl,
        cartSnapshot: [...cart],
        totalSnapshot: totalAmount
      });

      // Reset keranjang & tutup modal form
      setCart([]);
      setIsFormOpen(false);
      setIsCartOpen(false);

      // Buka WhatsApp di tab baru
      window.open(whatsappUrl, '_blank');
      showToast('✅ Pesanan berhasil dibuat & tercatat di sistem!');

    } catch (error) {
      console.error("Gagal menyimpan transaksi ke database:", error.response?.data || error);
      showToast('❌ Gagal memproses pesanan ke sistem. Cek stok atau koneksi.');
    }
  };

  // Fitur Salin Pesanan ke Clipboard dengan Toast Custom
  const handleCopyOrder = () => {
    if (!customerForm.name || !customerForm.phone || !customerForm.address) {
      showToast('⚠️ Lengkapi Data Pengiriman sebelum menyalin pesanan!');
      return;
    }
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message);
    showToast('✅ Pesanan berhasil disalin ke Clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 relative">
      
      {/* === CUSTOM TOAST NOTIFICATION === */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Navigasi */}
     <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl shadow-md shadow-indigo-100">
              🛍️
            </div>
            <div>
              <h1 className="text-base md:text-lg font-extrabold tracking-tight text-slate-900 leading-tight">Katalog Toko</h1>
              <p className="text-[11px] text-slate-500 font-medium">Belanja mudah & real-time</p>
            </div>
          </div>
          
          {/* Menu Kanan */}
          <div className="flex items-center gap-2.5">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link 
                    to="/admin/products" 
                    className="hidden sm:inline-flex px-3.5 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition border border-indigo-100 items-center gap-1.5"
                  >
                    <span>⚙️</span> Dashboard
                  </Link>
                )}
                
                <Link 
                  to="/profile" 
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>👤</span> Profil
                </Link>

                <button 
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="text-xs text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200/80 transition shadow-xs"
              >
                Login Masuk
              </Link>
            )}

            {/* Garis Pembatas Vertikal Tipis */}
            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Tombol Keranjang Belanja (Utama) */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-100"
            >
              <span className="text-sm">🛒</span>
              <span className="text-xs font-bold hidden sm:inline">Keranjang</span>
              <span className="bg-white text-indigo-700 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                {totalCartItems}
              </span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        
        {/* === HALAMAN SUKSES CHECKOUT (NOMOR 3) === */}
        {orderSuccessData ? (
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-emerald-100 text-center max-w-2xl mx-auto my-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 text-3xl rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              ✅
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Pesanan Berhasil Dibuat!</h2>
            <p className="text-slate-500 text-sm md:text-base mb-8">
              WhatsApp Anda telah otomatis terbuka dengan detail pesanan. Jika belum terbuka, silakan klik tombol di bawah ini.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-left mb-8 border border-slate-200 text-xs text-slate-600 font-mono max-h-48 overflow-y-auto whitespace-pre-line shadow-inner">
              {orderSuccessData.message}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={orderSuccessData.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-lg shadow-emerald-200 transition"
              >
                Buka WhatsApp Lagi 📲
              </a>
              <button
                onClick={() => setOrderSuccessData(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl text-sm transition"
              >
                Kembali Belanja 🛍️
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* === BANNER SLIDER ESTETIK === */}
            <div className="relative w-full h-48 md:h-60 rounded-2xl overflow-hidden shadow-md mb-8">
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-gradient-to-r ${banner.bg} p-8 flex flex-col justify-center text-white transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <span className="inline-block px-3 py-1 bg-white/25 backdrop-blur-md rounded-lg text-xs font-bold w-max mb-3">
                    {banner.badge}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">{banner.title}</h2>
                  <p className="text-sm md:text-base text-white/90 max-w-xl">{banner.subtitle}</p>
                </div>
              ))}

              <div className="absolute bottom-3 right-6 z-20 flex gap-1.5">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            {/* Pencarian & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Cari nama produk..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs text-sm"
                />
                <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
              </div>

              <div className="w-full md:w-1/4">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs text-slate-700 font-semibold text-sm cursor-pointer"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid Produk & SKELETON LOADING (NOMOR 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {isLoading ? (
                // Tampilan Skeleton saat data dimuat
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs animate-pulse">
                    <div className="h-44 bg-slate-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-1/2 mb-4"></div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
                      <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="h-9 bg-slate-200 rounded-xl"></div>
                      <div className="h-9 bg-slate-200 rounded-xl"></div>
                    </div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((product) => {
                  const isOutOfStock = product.stock <= 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white rounded-2xl shadow-xs border border-slate-200 hover:shadow-lg transition cursor-pointer p-4 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="h-44 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-slate-400 overflow-hidden relative">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                          ) : (
                            <span className="text-xs font-semibold">Tidak Ada Foto</span>
                          )}
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-indigo-600 font-bold text-[10px] uppercase rounded-lg shadow-xs">
                            {product.category_name || product.category?.name || 'Umum'}
                          </span>

                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider">
                                Stok Habis
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description || "Produk berkualitas tinggi siap pakai."}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3 pt-2 border-t border-slate-100">
                          <span className="text-base font-extrabold text-emerald-600">
                            Rp {Number(product.selling_price).toLocaleString('id-ID')}
                          </span>
                          <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                            Stok: {product.stock}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={(e) => addToCart(product, e)}
                            disabled={isOutOfStock}
                            className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer shadow-xs ${
                              !isOutOfStock 
                                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100' 
                                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            + Keranjang
                          </button>
                          <button
                            onClick={(e) => handleBuyNow(product, e)}
                            disabled={isOutOfStock}
                            className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer shadow-xs ${
                              !isOutOfStock 
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 shadow-emerald-100' 
                                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            Beli Cepat
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200">
                  <p className="text-lg font-bold mb-1">Produk tidak ditemukan</p>
                  <p className="text-xs text-slate-400">Coba kata kunci atau kategori lain.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 text-slate-700 hover:bg-slate-100 shadow-xs font-semibold text-sm cursor-pointer"
              >
                Sebelumnya
              </button>
              <span className="text-sm font-bold text-slate-600">
                Halaman {currentPage} dari {totalPages || 1}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 text-slate-700 hover:bg-slate-100 shadow-xs font-semibold text-sm cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </>
        )}
      </div>

      {/* === DRAWER / MODAL KERANJANG BELANJA === */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Keranjang Belanja 🛒</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <p className="text-4xl mb-3">🛍️</p>
                  <p className="text-sm font-semibold">Keranjang belanja masih kosong.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 my-4">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                        <p className="text-xs text-emerald-600 font-semibold">
                          Rp {Number(item.selling_price).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 bg-slate-100 rounded-lg font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-500">Total Harga:</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={handleOpenCheckoutForm}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition shadow-md shadow-emerald-100 cursor-pointer"
                >
                  Checkout via WhatsApp 📲
                </button>
              </div>
            )}
          </div>
        </div>
      )}


  {/* === MODAL FORM CHECKOUT WHATSAPP === */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Data Pengiriman Pesanan</h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckoutWhatsApp} className="space-y-4">
              
              {/* --- PILIH ALAMAT DARI PROFIL --- */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Pilih Alamat Pengiriman</label>
                  <Link to="/profile" className="text-xs text-indigo-600 font-bold hover:underline">
                    + Kelola Alamat Profil
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 space-y-1">
                    <p>⚠️ Belum ada alamat tersimpan di profilmu.</p>
                    <Link to="/profile" className="inline-block font-bold underline text-amber-800">
                      Tambah alamat & titik map dulu di sini ➔
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          // Otomatis isi data customerForm agar sinkron saat pesan dikirim
                          setCustomerForm(prev => ({
                            ...prev,
                            name: addr.recipient_name,
                            phone: addr.phone_number,
                            address: `${addr.address_line}, ${addr.city} (${addr.postal_code})${addr.latitude ? ` [Lat: ${addr.latitude.toFixed(4)}, Lng: ${addr.longitude.toFixed(4)}]` : ''}`
                          }));
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition flex justify-between items-center ${
                          selectedAddress?.id === addr.id 
                            ? 'bg-indigo-50 border-indigo-500 shadow-xs' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span>{addr.recipient_name}</span>
                            <span className="text-slate-500 font-normal">({addr.phone_number})</span>
                            {addr.is_default && (
                              <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.2 rounded-full">Utama</span>
                            )}
                          </div>
                          <p className="text-slate-600 mt-0.5 line-clamp-2">{addr.address_line}, {addr.city}</p>
                          {addr.latitude && addr.longitude && (
                            <span className="text-[10px] text-indigo-600 font-semibold block mt-1">
                              📍 Koordinat Map Tersimpan
                            </span>
                          )}
                        </div>
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-600 flex items-center justify-center shrink-0 ml-2">
                          {selectedAddress?.id === addr.id && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  name="notes"
                  value={customerForm.notes}
                  onChange={handleFormChange}
                  placeholder="Contoh: Tolong pilihkan warna hitam"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition cursor-pointer border border-slate-200"
                >
                  📋 Salin Pesanan
                </button>
                <button
                  type="submit"
                  disabled={!selectedAddress}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-xs transition shadow-md shadow-emerald-100 cursor-pointer"
                >
                  Kirim via WhatsApp 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* === MODAL DETAIL PRODUK === */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 overflow-hidden transform transition-all">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                {selectedProduct.category_name || selectedProduct.category?.name || 'Katalog Produk'}
              </span>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Area Gambar Utama & Slide Thumbnail */}
            <div className="space-y-3 mb-5">
              {/* Gambar Utama yang Sedang Dipilih (Bisa diklik untuk zoom) */}
              <div 
                onClick={() => {
                  const currentImg = selectedProduct.activeImage || selectedProduct.image || (selectedProduct.images && selectedProduct.images[0]?.image);
                  if (currentImg) setIsZoomOpen(true);
                }}
                className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner group cursor-pointer"
                title="Klik untuk memperbesar gambar"
              >
                {selectedProduct.image || (selectedProduct.images && selectedProduct.images.length > 0) ? (
                  <>
                    <img 
                      src={selectedProduct.activeImage || selectedProduct.image || selectedProduct.images[0]?.image} 
                      alt={selectedProduct.name} 
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" 
                    />
                    {/* Label/ikon petunjuk klik zoom */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center gap-1 shadow-md">
                      <span>🔍</span> Klik untuk perbesar
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <span className="text-3xl mb-1">📦</span>
                    <span className="text-xs font-medium">Tidak Ada Foto</span>
                  </div>
                )}

                {/* Badge Stok Habis */}
                {selectedProduct.stock <= 0 && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-5 py-2 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-lg uppercase tracking-wider">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail / Daftar Foto Tambahan (Bisa di-klik buat ganti slide) */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {selectedProduct.image && (
                    <button
                      onClick={() => setSelectedProduct({...selectedProduct, activeImage: selectedProduct.image})}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        (!selectedProduct.activeImage || selectedProduct.activeImage === selectedProduct.image) 
                          ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100' 
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={selectedProduct.image} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  )}
                  
                  {selectedProduct.images.map((imgObj, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedProduct({...selectedProduct, activeImage: imgObj.image})}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        selectedProduct.activeImage === imgObj.image 
                          ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100' 
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={imgObj.image} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informasi Nama & Deskripsi */}
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900 mb-2 leading-snug">{selectedProduct.name}</h2>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-24 overflow-y-auto">
                {selectedProduct.description || "Belum ada deskripsi untuk produk ini."}
              </p>
            </div>

            {/* Harga & Informasi Stok */}
            <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-2xl border border-slate-100 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Harga Satuan</span>
                <span className="text-xl font-black text-emerald-600">
                  Rp {Number(selectedProduct.selling_price).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Ketersediaan</span>
                <span className={`text-sm font-extrabold px-2.5 py-0.5 rounded-lg inline-block ${
                  selectedProduct.stock <= 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {selectedProduct.stock} Pcs Tersedia
                </span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={selectedProduct.stock <= 0}
                onClick={(e) => {
                  addToCart(selectedProduct, e);
                  setSelectedProduct(null);
                  setIsCartOpen(true);
                }}
                className={`py-3.5 rounded-2xl font-bold text-xs transition border cursor-pointer shadow-xs flex items-center justify-center gap-1.5 ${
                  selectedProduct.stock > 0 
                    ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100' 
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                <span>🛒</span> + Keranjang
              </button>
              <button
                disabled={selectedProduct.stock <= 0}
                onClick={(e) => {
                  handleBuyNow(selectedProduct, e);
                  setSelectedProduct(null);
                }}
                className={`py-3.5 rounded-2xl font-bold text-xs transition shadow-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedProduct.stock > 0 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>🚀</span> Beli Cepat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* === SUB-MODAL ZOOM / LIGHTBOX GAMBAR FULLSCREEN === */}
      {isZoomOpen && selectedProduct && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[60] p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            {/* Tombol Close Zoom */}
            <button 
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white font-bold flex items-center justify-center transition cursor-pointer text-lg"
            >
              ✕
            </button>
            {/* Gambar Ukuran Penuh */}
            <img 
              src={selectedProduct.activeImage || selectedProduct.image || (selectedProduct.images && selectedProduct.images[0]?.image)} 
              alt={selectedProduct.name} 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} // Supaya klik di area gambar tidak sengaja menutup modal
            />
          </div>
        </div>
      )}

      {/* Tombol Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo, saya ingin bertanya seputar produk di katalog.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
        title="Hubungi Kami via WhatsApp"
      >
        {/* SVG Icon WhatsApp */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="lucide lucide-message-circle"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </a>

    </div>
  );
}