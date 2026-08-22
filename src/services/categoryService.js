import api from './api';

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get('categories/');
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
      throw error;
    }
  }
};