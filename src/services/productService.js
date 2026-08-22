import api from './api';

export const productService = {
  // Mengambil daftar produk (mendukung parameter pencarian, filter kategori, harga, dll)
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('products/', { params });
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      throw error;
    }
  },

  // Mengambil detail satu produk berdasarkan ID atau SKU
  getProductDetail: async (id) => {
    try {
      const response = await api.get(`products/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Gagal mengambil produk ID ${id}:`, error);
      throw error;
    }
  }
};