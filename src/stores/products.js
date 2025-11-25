import { defineStore } from 'pinia'
import api from '../utils/api'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: JSON.parse(localStorage.getItem('products')) || [],
    isLoading: false,
    error: null
  }),

  actions: {
    saveToLocal() {
      localStorage.setItem('products', JSON.stringify(this.products))
    },

    async fetchProducts(params = {}) {
      this.isLoading = true
      this.error = null
      try {
        const res = await api.get('/products', { params })

        // merge local added products + API products
        const apiProducts = res.data.products || []
        const localProducts = JSON.parse(localStorage.getItem('products')) || []

        this.products = [...localProducts, ...apiProducts]
        this.saveToLocal()

      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    async addProduct(payload) {
      const res = await api.post('/products/add', payload)

      // Add API response + persist locally
      this.products.unshift(res.data)
      this.saveToLocal()

      return res.data
    },

    async deleteProduct(id) {
      try {
        await api.delete(`/products/${id}`)
      } catch (err) {
        console.warn("DummyJSON delete is fake, but we'll handle it locally.")
      }

      this.products = this.products.filter(p => p.id !== id)
      this.saveToLocal()
    }
  }
})
