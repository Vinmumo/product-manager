<template>
  <div class="p-8 max-w-6xl mx-auto">
    <!-- Back Button -->
    <button
      @click="$router.push('/products')"
      class="mb-6 text-blue-600 hover:underline"
    >
      ← Back to Products
    </button>

    <!-- Breadcrumb -->
    <div class="text-sm text-gray-500 mb-4">
      Products /
      <span class="text-gray-800 font-medium">{{ product.title }}</span>
    </div>

    <!-- Main Product Layout -->
    <div class="flex gap-12">
      <!-- Product Image -->
      <img
        :src="product.thumbnail"
        class="w-[500px] h-[500px] object-cover rounded-lg shadow"
      />

      <!-- Product Details -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold">{{ product.title }}</h1>

        <p class="text-gray-600 mt-2 max-w-xl">
          {{ product.description }}
        </p>

        <!-- Price / Category / Stock -->
        <div class="mt-8 space-y-2">
          <div class="text-xl font-semibold">${{ product.price }}</div>

          <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm">
            {{ product.category }}
          </span>

          <div class="mt-2">
            <span
              class="px-3 py-1 rounded-md text-sm"
              :class="
                product.stock > 0
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              "
            >
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>

            <span class="ml-2 text-gray-600">{{ product.stock }} units</span>
          </div>
        </div>

        <!-- Delete Button -->
        <button
          @click="showConfirm = true"
          class="mt-6 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Delete
        </button>
      </div>
    </div>

   
    <!-- CUSTOMER REVIEWS SECTION -->
    
    <div class="mt-16 pt-10 border-t">
      <h2 class="text-xl font-semibold mb-6">Customer Reviews</h2>

      <div class="bg-white p-6 rounded-xl shadow-md">
        <div class="flex items-center gap-6">
          <div>
            <div class="text-5xl font-bold">4.5</div>
            <div class="text-yellow-400 text-2xl mt-1">★★★★★</div>
            <p class="text-gray-500 text-sm mt-1">Based on 120 reviews</p>
          </div>

          <div class="flex-1">
            <!-- Rating bars -->
            <div
              v-for="rating in ratings"
              :key="rating.stars"
              class="flex items-center gap-4 mb-2"
            >
              <span class="w-4 text-sm font-medium">{{ rating.stars }}</span>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-yellow-400"
                  :style="{ width: rating.percent + '%' }"
                ></div>
              </div>
              <span class="w-10 text-sm text-gray-600">{{ rating.percent }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- CONFIRMATION MODAL -->
    
    <div
      v-if="showConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 class="text-lg font-semibold">Are you sure?</h3>
        <p class="text-gray-600 mt-2">This action cannot be undone.</p>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showConfirm = false"
            class="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>

          <button
            @click="remove"
            class="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    
    <!-- SUCCESS TOAST -->
    
    <div
      v-if="toast"
      class="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      Product deleted successfully!
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import { useProductsStore } from "../stores/products"
import { useRoute, useRouter } from "vue-router"

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const id = route.params.id
    const store = useProductsStore()

    const product = ref({})
    const showConfirm = ref(false)
    const toast = ref(false)

    // Mock review ratings (you can replace later with API data)
    const ratings = ref([
      { stars: 5, percent: 75 },
      { stars: 4, percent: 15 },
      { stars: 3, percent: 5 },
      { stars: 2, percent: 3 },
      { stars: 1, percent: 2 }
    ])

    // Load product (from store or API)
    onMounted(async () => {
      const found = store.products.find((p) => String(p.id) === String(id))
      product.value = found || (await store.fetchProductById(id))
    })

    // Delete product
   const remove = async () => {
    showConfirm.value = false

    try {
            await store.deleteProduct(Number(id))
        } catch (err) {
            alert("Failed to delete product")
            return
        }

        toast.value = true
        setTimeout(() => {
            toast.value = false
            router.push("/products")
        }, 1500)
    }

    return { product, showConfirm, toast, ratings, remove }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
