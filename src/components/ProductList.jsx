// // // // import React from 'react';

// // // // export default function ProductList({ 
// // // //   products, 
// // // //   onEdit, 
// // // //   onDelete, 
// // // //   onOpenAddModal,
// // // //   totalItems, 
// // // //   searchQuery, 
// // // //   setSearchQuery, 
// // // //   selectedCategory, 
// // // //   setSelectedCategory, 
// // // //   categories, 
// // // //   currentPage, 
// // // //   setCurrentPage, 
// // // //   hasNextPage, 
// // // //   hasPrevPage,
// // // //   getImageUrl 
// // // // }) {
// // // //   return (
// // // //     <div>
// // // //       {/* Header Action */}
// // // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
// // // //         <div>
// // // //           <h2 className="text-2xl font-bold text-slate-900">Daftar Produk</h2>
// // // //           <p className="text-sm text-slate-500 mt-1">Total {totalItems} produk terdaftar.</p>
// // // //         </div>
// // // //         <button 
// // // //           onClick={onOpenAddModal} 
// // // //           className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition-all duration-200 cursor-pointer"
// // // //         >
// // // //           + Tambah Produk
// // // //         </button>
// // // //       </div>

// // // //       {/* Kotak Filter & Search */}
// // // //       <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
// // // //         <input
// // // //           type="text"
// // // //           placeholder="Cari nama produk..."
// // // //           value={searchQuery}
// // // //           onChange={(e) => {
// // // //             setSearchQuery(e.target.value);
// // // //             setCurrentPage(1);
// // // //           }}
// // // //           className="w-full sm:w-1/3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
// // // //         />

// // // //         <select
// // // //           value={selectedCategory}
// // // //           onChange={(e) => {
// // // //             setSelectedCategory(e.target.value);
// // // //             setCurrentPage(1);
// // // //           }}
// // // //           className="w-full sm:w-1/4 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
// // // //         >
// // // //           <option value="">Semua Kategori</option>
// // // //           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
// // // //         </select>
// // // //       </div>

// // // //       {/* Table Card */}
// // // //       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
// // // //         <div className="overflow-x-auto">
// // // //           <table className="w-full text-left whitespace-nowrap">
// // // //             <thead>
// // // //               <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
// // // //                 <th className="p-5">Info Produk</th>
// // // //                 <th className="p-5">Harga Jual</th>
// // // //                 <th className="p-5">Stok</th>
// // // //                 <th className="p-5 text-right">Aksi</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody className="divide-y divide-slate-100">
// // // //               {products.length > 0 ? products.map(p => (
// // // //                 <tr key={p.id} className="hover:bg-slate-50/80 transition duration-150 group">
// // // //                   <td className="p-5 flex items-center gap-4">
// // // //                     {p.image ? (
// // // //                       <img 
// // // //                         src={getImageUrl(p.image)} 
// // // //                         alt={p.name} 
// // // //                         className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
// // // //                         onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
// // // //                       />
// // // //                     ) : (
// // // //                       <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 text-xs">
// // // //                         No Image
// // // //                       </div>
// // // //                     )}
// // // //                     <div>
// // // //                       <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition">{p.name}</p>
// // // //                       <p className="text-xs text-slate-500 font-medium">SKU: {p.sku || '-'}</p>
// // // //                     </div>
// // // //                   </td>
// // // //                   <td className="p-5">
// // // //                     <p className="text-slate-800 font-bold">Rp {Number(p.selling_price).toLocaleString('id-ID')}</p>
// // // //                     <p className="text-xs text-slate-400">Beli: Rp {Number(p.purchase_price).toLocaleString('id-ID')}</p>
// // // //                   </td>
// // // //                   <td className="p-5">
// // // //                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
// // // //                       p.stock <= 5 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
// // // //                     }`}>
// // // //                       {p.stock} Pcs
// // // //                     </span>
// // // //                   </td>
// // // //                   <td className="p-5 text-right space-x-2">
// // // //                     <button onClick={() => onEdit(p)} className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition cursor-pointer">Edit</button>
// // // //                     <button onClick={() => onDelete(p.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition cursor-pointer">Hapus</button>
// // // //                   </td>
// // // //                 </tr>
// // // //               )) : (
// // // //                 <tr>
// // // //                   <td colSpan="4" className="text-center py-12 text-slate-400 text-sm font-medium">
// // // //                     Produk tidak ditemukan.
// // // //                   </td>
// // // //                 </tr>
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       </div>

// // // //       {/* Pagination Controls */}
// // // //       <div className="flex justify-between items-center mt-6">
// // // //         <button
// // // //           disabled={!hasPrevPage}
// // // //           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // // //           className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
// // // //         >
// // // //           ← Sebelumnya
// // // //         </button>
// // // //         <span className="text-xs font-semibold text-slate-500">
// // // //           Halaman {currentPage}
// // // //         </span>
// // // //         <button
// // // //           disabled={!hasNextPage}
// // // //           onClick={() => setCurrentPage(prev => prev + 1)}
// // // //           className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
// // // //         >
// // // //           Berikutnya →
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // src/components/ProductList.jsx
// // // import React from 'react';

// // // export default function ProductList({ 
// // //   products, 
// // //   onEdit, 
// // //   onDelete, 
// // //   onOpenAddModal,
// // //   totalItems, 
// // //   searchQuery, 
// // //   setSearchQuery, 
// // //   selectedCategory, 
// // //   setSelectedCategory, 
// // //   categories, 
// // //   currentPage, 
// // //   setCurrentPage, 
// // //   hasNextPage, 
// // //   hasPrevPage,
// // //   getImageUrl,
// // //   onExportExcel,
// // //   onExportPdf,
// // //   onImport
// // // }) {
// // //   return (
// // //     <div>
// // //       {/* Header Aksi Utama */}
// // //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
// // //         <div>
// // //           <h2 className="text-2xl font-bold text-slate-900">Daftar Produk</h2>
// // //           <p className="text-sm text-slate-500 mt-1">Total {totalItems} produk terdaftar.</p>
// // //         </div>

// // //         {/* Grup Tombol Samping (Export, Import, Tambah) */}
// // //         <div className="flex flex-wrap items-center gap-2">
          
// // //           {/* Tombol Export Excel */}
// // //           <button 
// // //             onClick={onExportExcel}
// // //             className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm"
// // //           >
// // //             📊 Export Excel
// // //           </button>

// // //           {/* Tombol Export PDF */}
// // //           <button 
// // //             onClick={onExportPdf}
// // //             className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm"
// // //           >
// // //             📄 Export PDF
// // //           </button>

// // //           {/* Tombol Import File */}
// // //           <label className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm">
// // //             📥 Import
// // //             <input type="file" onChange={onImport} className="hidden" accept=".xlsx, .csv" />
// // //           </label>

// // //           {/* Tombol Tambah Produk */}
// // //           <button 
// // //             onClick={onOpenAddModal} 
// // //             className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition cursor-pointer"
// // //           >
// // //             + Tambah Produk
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Filter & Search */}
// // //       <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
// // //         <input
// // //           type="text"
// // //           placeholder="Cari nama produk..."
// // //           value={searchQuery}
// // //           onChange={(e) => {
// // //             setSearchQuery(e.target.value);
// // //             setCurrentPage(1);
// // //           }}
// // //           className="w-full sm:w-1/3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
// // //         />

// // //         <select
// // //           value={selectedCategory}
// // //           onChange={(e) => {
// // //             setSelectedCategory(e.target.value);
// // //             setCurrentPage(1);
// // //           }}
// // //           className="w-full sm:w-1/4 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
// // //         >
// // //           <option value="">Semua Kategori</option>
// // //           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
// // //         </select>
// // //       </div>

// // //       {/* Tabel Data Produk */}
// // //       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
// // //         <div className="overflow-x-auto">
// // //           <table className="w-full text-left whitespace-nowrap">
// // //             <thead>
// // //               <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
// // //                 <th className="p-5">Info Produk</th>
// // //                 <th className="p-5">Kategori</th> {/* <-- Kolom Kategori Ditambahkan */}
// // //                 <th className="p-5">Harga Jual</th>
// // //                 <th className="p-5">Stok</th>
// // //                 <th className="p-5 text-right">Aksi</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="divide-y divide-slate-100">
// // //               {products.length > 0 ? products.map(p => (
// // //                 <tr key={p.id} className="hover:bg-slate-50/80 transition duration-150 group">
// // //                   <td className="p-5 flex items-center gap-4">
// // //                     {p.image ? (
// // //                       <img 
// // //                         src={getImageUrl(p.image)} 
// // //                         alt={p.name} 
// // //                         className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
// // //                         onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
// // //                       />
// // //                     ) : (
// // //                       <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 text-xs">
// // //                         No Image
// // //                       </div>
// // //                     )}
// // //                     <div>
// // //                       <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition">{p.name}</p>
// // //                       <p className="text-xs text-slate-500 font-medium">SKU: {p.sku || '-'}</p>
// // //                     </div>
// // //                   </td>
// // //                     <td className="p-5">
// // //                         <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
// // //                             {p.category?.name || p.category_name || '-'}
// // //                         </span>
// // //                     </td>
// // //                   <td className="p-5">
// // //                     <p className="text-slate-800 font-bold">Rp {Number(p.selling_price).toLocaleString('id-ID')}</p>
// // //                     <p className="text-xs text-slate-400">Beli: Rp {Number(p.purchase_price).toLocaleString('id-ID')}</p>
// // //                   </td>
// // //                   <td className="p-5">
// // //                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
// // //                       p.stock <= 5 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
// // //                     }`}>
// // //                       {p.stock} Pcs
// // //                     </span>
// // //                   </td>
// // //                   <td className="p-5 text-right space-x-2">
// // //                     <button onClick={() => onEdit(p)} className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition cursor-pointer">Edit</button>
// // //                     <button onClick={() => onDelete(p.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition cursor-pointer">Hapus</button>
// // //                   </td>
// // //                 </tr>
// // //               )) : (
// // //                 <tr>
// // //                   <td colSpan="4" className="text-center py-12 text-slate-400 text-sm font-medium">
// // //                     Produk tidak ditemukan.
// // //                   </td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       </div>

// // //       {/* Pagination */}
// // //       <div className="flex justify-between items-center mt-6">
// // //         <button
// // //           disabled={!hasPrevPage}
// // //           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // //           className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
// // //         >
// // //           ← Sebelumnya
// // //         </button>
// // //         <span className="text-xs font-semibold text-slate-500">
// // //           Halaman {currentPage}
// // //         </span>
// // //         <button
// // //           disabled={!hasNextPage}
// // //           onClick={() => setCurrentPage(prev => prev + 1)}
// // //           className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
// // //         >
// // //           Berikutnya →
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import React from 'react';

// // export default function ProductList({ 
// //   products, 
// //   onEdit, 
// //   onDelete, 
// //   onOpenAddModal,
// //   totalItems, 
// //   searchQuery, 
// //   setSearchQuery, 
// //   selectedCategory, 
// //   setSelectedCategory, 
// //   categories, 
// //   currentPage, 
// //   setCurrentPage, 
// //   hasNextPage, 
// //   hasPrevPage,
// //   getImageUrl,
// //   onExportExcel,
// //   onExportPdf,
// //   onImport
// // }) {
// //   return (
// //     <div>
// //       {/* Header Aksi Utama */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
// //         <div>
// //           <h2 className="text-2xl font-bold text-slate-900">Daftar Produk</h2>
// //           <p className="text-sm text-slate-500 mt-1">Total {totalItems} produk terdaftar.</p>
// //         </div>

// //         {/* Grup Tombol Samping (Export, Import, Tambah) */}
// //         <div className="flex flex-wrap items-center gap-2">
          
// //           {/* Tombol Export Excel */}
// //           <button 
// //             type="button"
// //             onClick={onExportExcel}
// //             className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm"
// //           >
// //             📊 Export Excel
// //           </button>

// //           {/* Tombol Export PDF */}
// //           <button 
// //             type="button"
// //             onClick={onExportPdf}
// //             className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm"
// //           >
// //             📄 Export PDF
// //           </button>

// //           {/* Tombol Import File */}
// //           <label className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm">
// //             📥 Import
// //             <input type="file" onChange={onImport} className="hidden" accept=".xlsx, .csv" />
// //           </label>

// //           {/* Tombol Tambah Produk */}
// //           <button 
// //             type="button"
// //             onClick={onOpenAddModal} 
// //             className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition cursor-pointer"
// //           >
// //             + Tambah Produk
// //           </button>
// //         </div>
// //       </div>

// //       {/* Filter & Search */}
// //       <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
// //         <input
// //           type="text"
// //           placeholder="Cari nama produk..."
// //           value={searchQuery}
// //           onChange={(e) => {
// //             setSearchQuery(e.target.value);
// //             setCurrentPage(1);
// //           }}
// //           className="w-full sm:w-1/3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
// //         />

// //         <select
// //           value={selectedCategory}
// //           onChange={(e) => {
// //             setSelectedCategory(e.target.value);
// //             setCurrentPage(1);
// //           }}
// //           className="w-full sm:w-1/4 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
// //         >
// //           <option value="">Semua Kategori</option>
// //           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
// //         </select>
// //       </div>

// //       {/* Tabel Data Produk */}
// //       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-left whitespace-nowrap">
// //             <thead>
// //               <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
// //                 <th className="p-5">Info Produk</th>
// //                 <th className="p-5">Kategori</th>
// //                 <th className="p-5">Harga Jual</th>
// //                 <th className="p-5">Stok</th>
// //                 <th className="p-5 text-right">Aksi</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-slate-100">
// //               {products.length > 0 ? products.map(p => (
// //                 <tr key={p.id} className="hover:bg-slate-50/80 transition duration-150 group">
// //                   <td className="p-5 flex items-center gap-4">
// //                     {p.image ? (
// //                       <img 
// //                         src={getImageUrl(p.image)} 
// //                         alt={p.name} 
// //                         className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
// //                         onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
// //                       />
// //                     ) : (
// //                       <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 text-xs">
// //                         No Image
// //                       </div>
// //                     )}
// //                     <div>
// //                       <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition">{p.name}</p>
// //                       <p className="text-xs text-slate-500 font-medium">SKU: {p.sku || '-'}</p>
// //                     </div>
// //                   </td>
// //                   <td className="p-5">
// //                     <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
// //                       {p.category?.name || p.category_name || '-'}
// //                     </span>
// //                   </td>
// //                   <td className="p-5">
// //                     <p className="text-slate-800 font-bold">Rp {Number(p.selling_price || p.price || 0).toLocaleString('id-ID')}</p>
// //                     <p className="text-xs text-slate-400">Beli: Rp {Number(p.purchase_price || 0).toLocaleString('id-ID')}</p>
// //                   </td>
// //                   <td className="p-5">
// //                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
// //                       Number(p.stock) <= 5 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
// //                     }`}>
// //                       {p.stock} Pcs
// //                     </span>
// //                   </td>
// //                   <td className="p-5 text-right space-x-2">
// //                     <button type="button" onClick={() => onEdit(p)} className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition cursor-pointer">Edit</button>
// //                     <button type="button" onClick={() => onDelete(p.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition cursor-pointer">Hapus</button>
// //                   </td>
// //                 </tr>
// //               )) : (
// //                 <tr>
// //                   <td colSpan="5" className="text-center py-12 text-slate-400 text-sm font-medium">
// //                     Produk tidak ditemukan.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* Pagination */}
// //       <div className="flex justify-between items-center mt-6">
// //         <button
// //           type="button"
// //           disabled={!hasPrevPage}
// //           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// //           className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
// //         >
// //           ← Sebelumnya
// //         </button>
// //         <span className="text-xs font-semibold text-slate-500">
// //           Halaman {currentPage}
// //         </span>
// //         <button
// //           type="button"
// //           disabled={!hasNextPage}
// //           onClick={() => setCurrentPage(prev => prev + 1)}
// //           className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
// //         >
// //           Berikutnya →
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from 'react';

// export default function ProductList({
//   products,
//   onEdit,
//   onDelete,
//   onOpenAddModal,
//   totalItems,
//   searchQuery,
//   setSearchQuery,
//   selectedCategory,
//   setSelectedCategory,
//   categories,
//   currentPage,
//   setCurrentPage,
//   hasNextPage,
//   hasPrevPage,
//   getImageUrl,
//   onExportExcel,
//   onExportPdf,
//   onImport
// }) {
//   // Local state untuk input ketikan agar bisa didebounce
//   const [localSearch, setLocalSearch] = useState(searchQuery);

//   // Efek Debounce (menunggu 400ms sebelum mengubah searchQuery utama di ProductAdmin)
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setSearchQuery(localSearch);
//       setCurrentPage(1); // Reset ke halaman 1 saat mulai mencari
//     }, 400);

//     return () => clearTimeout(handler);
//   }, [localSearch, setSearchQuery, setCurrentPage]);

//   return (
//     <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
//       {/* Header & Filter Bar */}
//       <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/50">
//         <div className="w-full lg:w-auto">
//           <h2 className="text-lg font-bold text-slate-800">Daftar Produk Inventaris</h2>
//           <p className="text-xs text-slate-500 font-medium">Total: {totalItems} produk terdaftar</p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
//           {/* Input Pencarian dengan Debounce */}
//           <input 
//             type="text" 
//             placeholder="Cari nama produk..." 
//             value={localSearch} 
//             onChange={(e) => setLocalSearch(e.target.value)} 
//             className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-56" 
//           />

//           {/* Filter Kategori */}
//           <select 
//             value={selectedCategory} 
//             onChange={(e) => {
//               setSelectedCategory(e.target.value);
//               setCurrentPage(1);
//             }} 
//             className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
//           >
//             <option value="">Semua Kategori</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>{cat.name}</option>
//             ))}
//           </select>

//           {/* Tombol Tambah Produk */}
//           <button 
//             type="button" 
//             onClick={onOpenAddModal} 
//             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition cursor-pointer flex items-center gap-2"
//           >
//             <span>+ Tambah Produk</span>
//           </button>
//         </div>
//       </div>

//       {/* Action Bar (Export & Import) */}
//       <div className="px-6 py-3 bg-slate-100/60 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
//         <div className="flex items-center gap-2">
//           <button type="button" onClick={onExportExcel} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer">📊 Export Excel</button>
//           <button type="button" onClick={onExportPdf} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition cursor-pointer">📄 Export PDF</button>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <label className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5">
//             📥 Import Excel/CSV
//             <input type="file" accept=".xlsx, .xls, .csv" onChange={onImport} className="hidden" />
//           </label>
//         </div>
//       </div>

//       {/* Tabel Produk */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
//               <th className="p-5">No</th>
//               <th className="p-5">Gambar</th>
//               <th className="p-5">Nama Produk</th>
//               <th className="p-5">Kategori</th>
//               <th className="p-5">Harga Beli</th>
//               <th className="p-5">Harga Jual</th>
//               <th className="p-5">Stok</th>
//               <th className="p-5 text-center">Aksi</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100 text-sm">
//             {products.length > 0 ? (
//               products.map((p, index) => {
//                 let categoryName = "-";
//                 if (typeof p.category === 'object' && p.category !== null) {
//                   categoryName = p.category.name || "-";
//                 } else if (p.category_name) {
//                   categoryName = p.category_name;
//                 } else if (p.category) {
//                   const foundCat = categories.find(c => c.id === p.category);
//                   categoryName = foundCat ? foundCat.name : "-";
//                 }

//                 return (
//                   <tr key={p.id} className="hover:bg-slate-50/80 transition">
//                     <td className="p-5 font-semibold text-slate-500">{(currentPage - 1) * 10 + (index + 1)}</td>
//                     <td className="p-5">
//                       {p.image ? (
//                         <img src={getImageUrl(p.image)} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-xs" />
//                       ) : (
//                         <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium border border-slate-200">No Img</div>
//                       )}
//                     </td>
//                     <td className="p-5 font-bold text-slate-800">{p.name}</td>
//                     <td className="p-5 text-slate-600 font-medium">
//                       <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
//                         {categoryName}
//                       </span>
//                     </td>
//                     <td className="p-5 text-slate-600">Rp {Number(p.purchase_price).toLocaleString('id-ID')}</td>
//                     <td className="p-5 font-semibold text-emerald-600">Rp {Number(p.selling_price).toLocaleString('id-ID')}</td>
//                     <td className="p-5">
//                       <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${p.stock > 5 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
//                         {p.stock} Pcs
//                       </span>
//                     </td>
//                     <td className="p-5 text-center">
//                       <div className="flex items-center justify-center gap-2">
//                         <button type="button" onClick={() => onEdit(p)} className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition cursor-pointer" title="Edit">✏️</button>
//                         <button type="button" onClick={() => onDelete(p.id, p.name)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition cursor-pointer" title="Hapus">🗑️</button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="8" className="p-12 text-center text-slate-400 font-medium">Tidak ada produk ditemukan.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Footer */}
//       <div className="p-5 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center">
//         <span className="text-xs text-slate-500 font-semibold">Halaman {currentPage}</span>
//         <div className="flex items-center gap-2">
//           <button 
//             type="button"
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={!hasPrevPage}
//             className={`px-4 py-2 rounded-xl text-xs font-bold transition ${hasPrevPage ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
//           >
//             ← Sebelumnya
//           </button>
//           <button 
//             type="button"
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             disabled={!hasNextPage}
//             className={`px-4 py-2 rounded-xl text-xs font-bold transition ${hasNextPage ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
//           >
//             Berikutnya →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';

export default function ProductList({
  products,
  onEdit,
  onDelete,
  onBulkDelete = () => {}, // <-- PASTIKAN INI ADA DI SINI
  onOpenAddModal,
  totalItems,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  currentPage,
  setCurrentPage,
  hasNextPage,
  hasPrevPage,
  getImageUrl,
  onExportExcel,
  onExportPdf,
  onImport
}) {
  // Local state untuk input ketikan agar bisa didebounce
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // State untuk Pilih Banyak (Bulk Select & Modal Delete)
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Efek Debounce (menunggu 400ms sebelum mengubah searchQuery utama di ProductAdmin)
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
      setCurrentPage(1); // Reset ke halaman 1 saat mulai mencari
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery, setCurrentPage]);

  // Reset pilihan checkbox saat halaman, pencarian, atau kategori berubah
  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage, searchQuery, selectedCategory]);

  // --- HANDLE CHECKBOX ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = products.map(item => item.id).filter(Boolean);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = products.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectOne = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);

    // Memanggil fungsi onBulkDelete dari parent component dan mengirimkan selectedIds
    Promise.resolve(onBulkDelete(selectedIds))
      .then(() => {
        setIsDeleteModalOpen(false);
        setIsDeleting(false);
        setSelectedIds([]);
      })
      .catch(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
      
      {/* --- MODAL KONFIRMASI BULK DELETE --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center transform scale-100 transition-all">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl mx-auto flex items-center justify-center text-2xl shadow-inner animate-pulse">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Hapus Produk Terpilih?</h3>
              <p className="text-xs text-slate-500 px-2">
                Anda akan menghapus <span className="font-bold text-slate-800">{selectedIds.length} data produk</span> secara permanen dari inventaris.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-3">
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
                onClick={confirmBulkDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-rose-200 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Filter Bar */}
      <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div className="w-full lg:w-auto">
          <h2 className="text-lg font-bold text-slate-800">Daftar Produk Inventaris</h2>
          <p className="text-xs text-slate-500 font-medium">Total: {totalItems} produk terdaftar</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Input Pencarian dengan Debounce */}
          <input 
            type="text" 
            placeholder="Cari nama produk..." 
            value={localSearch} 
            onChange={(e) => setLocalSearch(e.target.value)} 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-56" 
          />

          {/* Filter Kategori */}
          <select 
            value={selectedCategory} 
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }} 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Tombol Tambah Produk */}
          <button 
            type="button" 
            onClick={onOpenAddModal} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition cursor-pointer flex items-center gap-2"
          >
            <span>+ Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Action Bar (Export, Import & Bulk Delete) */}
      <div className="px-6 py-3 bg-slate-100/60 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button 
              type="button" 
              onClick={() => setIsDeleteModalOpen(true)} 
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-md shadow-rose-200 animate-bounce flex items-center gap-1.5"
            >
              🗑️ Hapus Terpilih ({selectedIds.length})
            </button>
          )}
          <button type="button" onClick={onExportExcel} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer">📊 Export Excel</button>
          <button type="button" onClick={onExportPdf} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition cursor-pointer">📄 Export PDF</button>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs flex items-center gap-1.5">
            📥 Import Excel/CSV
            <input type="file" accept=".xlsx, .xls, .csv" onChange={onImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Tabel Produk */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={products.length > 0 && products.every(item => selectedIds.includes(item.id))}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th className="p-4">No</th>
              <th className="p-4">Gambar</th>
              <th className="p-4">Nama Produk</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga Beli</th>
              <th className="p-4">Harga Jual</th>
              <th className="p-4">Stok</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.length > 0 ? (
              products.map((p, index) => {
                let categoryName = "-";
                if (typeof p.category === 'object' && p.category !== null) {
                  categoryName = p.category.name || "-";
                } else if (p.category_name) {
                  categoryName = p.category_name;
                } else if (p.category) {
                  const foundCat = categories.find(c => c.id === p.category);
                  categoryName = foundCat ? foundCat.name : "-";
                }

                const isChecked = selectedIds.includes(p.id);

                return (
                  <tr key={p.id} className={`hover:bg-slate-50/80 transition ${isChecked ? 'bg-indigo-50/40' : ''}`}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => handleSelectOne(p.id, e)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4 font-semibold text-slate-500">{(currentPage - 1) * 10 + (index + 1)}</td>
                    <td className="p-4">
                      {p.image ? (
                        <img src={getImageUrl(p.image)} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-xs" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium border border-slate-200">No Img</div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{p.name}</td>
                    <td className="p-4 text-slate-600 font-medium">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {categoryName}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">Rp {Number(p.purchase_price).toLocaleString('id-ID')}</td>
                    <td className="p-4 font-semibold text-emerald-600">Rp {Number(p.selling_price).toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${p.stock > 5 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {p.stock} Pcs
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" onClick={() => onEdit(p)} className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition cursor-pointer" title="Edit">✏️</button>
                        <button type="button" onClick={() => onDelete(p.id, p.name)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition cursor-pointer" title="Hapus">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="p-12 text-center text-slate-400 font-medium">Tidak ada produk ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-5 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center">
        <span className="text-xs text-slate-500 font-semibold">Halaman {currentPage}</span>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={!hasPrevPage}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${hasPrevPage ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            ← Sebelumnya
          </button>
          <button 
            type="button"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${hasNextPage ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
          >
            Berikutnya →
          </button>
        </div>
      </div>
    </div>
  );
}