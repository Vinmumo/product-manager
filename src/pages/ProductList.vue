<template>
  <div class="p-10 bg-[#F5F6FA] min-h-screen flex flex-col">

    <!-- PAGE HEADER -->
    <div class="mb-8">
      <h1 class="text-4xl font-semibold">Products</h1>
      <p class="text-gray-500 mt-1 text-lg">Manage your inventory and view product performance.</p>
    </div>

    <!-- TOP BAR: Search + Filters + Add Button -->
    <div class="flex items-center justify-between mb-8">

      <div class="flex items-center gap-4 w-full">

        <!-- Search -->
        <div class="flex items-center bg-white shadow-sm border border-gray-200 rounded-2xl px-5 py-3 w-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            v-model="search"
            placeholder="Search by product name..."
            class="ml-3 w-full outline-none text-gray-700"
          />
        </div>

        <!-- Category Filter -->
        <select
          v-model="category"
          class="bg-white shadow-sm border border-gray-200 rounded-2xl px-5 py-3 text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-800"
        >
          <option value="all">Category</option>
          <option v-for="c in categories" :key="c.slug" :value="c.slug">{{ c.name }}</option>
        </select>

        <!-- Stock Filter -->
        <select
          v-model="stock"
          class="bg-white shadow-sm border border-gray-200 rounded-2xl px-5 py-3 text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-800"
        >
          <option value="all">Stock Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

      </div>

      <!-- Add Button -->
      <router-link
        to="/products/new"
        class="ml-4 bg-[#000080] text-white px-6 py-3 rounded-2xl shadow hover:bg-blue-900 flex items-center gap-2 transition"
      >
        <span class="text-xl font-bold">＋</span>
        Add New Product
      </router-link>
    </div>

    <!-- PRODUCT TABLE -->
    <div class="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="text-left text-gray-500 border-b bg-gray-50">
            <th class="py-4 px-6">Product</th>
            <th class="px-6">Category</th>
            <th class="px-6">Price</th>
            <th class="px-6">Stock</th>
            <th class="px-6"></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="p in paginatedItems"
            :key="p.id"
            class="border-b hover:bg-gray-50 transition cursor-pointer"
            @click="view(p.id)"
          >
            <td class="flex items-center gap-4 py-4 px-6">
              <img :src="p.thumbnail" class="w-12 h-12 rounded-xl object-cover" />
              <div>
                <div class="font-medium text-gray-800">{{ p.title }}</div>
                <div class="text-sm text-gray-500">{{ truncate(p.description) }}</div>
              </div>
            </td>

            <td class="px-6">
              <span class="px-3 py-1 rounded-full text-sm"
                :class="badgeColor(p.category)">
                {{ p.category }}
              </span>
            </td>

            <td class="px-6 font-medium text-gray-700">
              ${{ p.price }}
            </td>

            <td class="px-6">
              <div class="flex items-center gap-2">
                <span :class="stockDot(p.stock)" class="w-3 h-3 rounded-full"></span>
                <span>{{ stockLabel(p.stock) }}</span>
              </div>
            </td>

            <td class="px-6">
              <button class="text-gray-500 hover:text-gray-800 text-lg">⋮</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-6">

      <p class="text-sm text-gray-500">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredProducts.length }} results
      </p>

      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="w-10 h-10 flex items-center justify-center rounded-xl border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
        >
          <span class="text-lg">‹</span>
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="w-10 h-10 flex items-center justify-center rounded-xl border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
        >
          <span class="text-lg">›</span>
        </button>
      </div>
    </div>

    <!-- LOGOUT BUTTON -->
    <div class="mt-auto pt-10 flex justify-center">
      <button
        @click="handleLogout"
        class="px-6 py-3 bg-blue-300 text-white rounded-xl shadow hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const store = useProductsStore()
const router = useRouter()
const auth = useAuthStore()

// Filters
const search = ref('')
const category = ref('all')
const stock = ref('all')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 12

// Categories
const categories = ref([])

// Fetch products and categories on mount
onMounted(async () => {
  await store.fetchProducts()

  try {
    const res = await fetch('https://dummyjson.com/products/categories')
    const data = await res.json()
    // data is an array of objects: {slug, name, url}
    categories.value = data
  } catch (error) {
    console.error("Failed to fetch categories:", error)
  }
})

// Filtered products
const filteredProducts = computed(() => {
  let result = store.products

  // search filter
  if (search.value.trim() !== '') {
    result = result.filter(p =>
      p.title.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  // category filter — only filter if not 'all'
  if (category.value !== 'all') {
    result = result.filter(p => p.category === category.value)
  }

  // stock filter
  if (stock.value === 'in') result = result.filter(p => p.stock > 20)
  else if (stock.value === 'low') result = result.filter(p => p.stock > 0 && p.stock <= 20)
  else if (stock.value === 'out') result = result.filter(p => p.stock === 0)

  return result
})

// Pagination logic
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredProducts.value.length))
const paginatedItems = computed(() => filteredProducts.value.slice(startIndex.value, endIndex.value))

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

// Utilities
const truncate = s => (s?.length > 60 ? s.slice(0, 60) + '…' : s)
const view = id => router.push(`/products/${id}`)

// Badge colors
const badgeColor = (category) => ({
  "beauty": "bg-pink-100 text-pink-700",
  "fragrances": "bg-purple-100 text-purple-700",
  "furniture": "bg-yellow-100 text-yellow-700",
  "groceries": "bg-green-100 text-green-700",
  "home-decoration": "bg-blue-100 text-blue-700"
}[category] || "bg-gray-100 text-gray-700")

// Stock dot & label
const stockDot = stock => stock <= 0 ? "bg-red-500" : stock < 20 ? "bg-yellow-500" : "bg-green-500"
const stockLabel = stock => stock <= 0 ? "Out of Stock" : stock < 20 ? `${stock} Low Stock` : `${stock} In Stock`

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}

</script>
