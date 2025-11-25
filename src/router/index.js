import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import ProductsList from '../pages/ProductList.vue'
import ProductView from '../pages/ProductView.vue'
import AddProduct from '../pages/AddProduct.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', component: LoginPage, meta: { public: true } },
  { path: '/', redirect: '/products' },
  { path: '/products', component: ProductsList },
  { path: '/products/new', component: AddProduct },
  { path: '/products/:id', component: ProductView, props: true },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  // Ensure session restored once (if app reload)
  if (!auth.token) auth.restoreSession()

  const requiresAuth = !to.meta.public
  if (requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }
  // prevent logged-in users from visiting /login
  if (to.path === '/login' && auth.isAuthenticated) {
    return next('/products')
  }
  next()
})

export default router
