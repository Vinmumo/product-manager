import { defineStore } from 'pinia'
import api from '../utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    isLoading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login({ username, password }) {
  this.isLoading = true
  this.error = null
  try {
    console.log("Trying login with:", username, password)

    const res = await api.post('/auth/login', { username, password })

    console.log("LOGIN SUCCESS:", res.data)

    this.token = res.data.accessToken
    this.user = { ...res.data }
    localStorage.setItem('auth', JSON.stringify({ token: this.token, user: this.user }))
  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err)

    this.error = err.response?.data?.message || err.message || 'Login failed'
    throw err
  } finally {
    this.isLoading = false
  }
}
,
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth')
    },
    restoreSession() {
      const raw = localStorage.getItem('auth')
      if (raw) {
        try {
          const { token, user } = JSON.parse(raw)
          this.token = token
          this.user = user
        } catch {}
      }
    }
  }
})
