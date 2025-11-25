<template>
  <div class="min-h-screen p-10 bg-gray-100 flex justify-center">
    <div class="w-full max-w-4xl bg-white rounded-xl shadow p-10">

      <!-- Success Toast -->
      <div
        v-if="showSuccess"
        class="fixed top-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-fade"
      >
        ✅ Product added successfully!
      </div>

      <!-- Page Title -->
      <h1 class="text-3xl font-semibold">Add New Product</h1>
      <p class="text-gray-500 mt-1 mb-8">
        Enter the details below to add a new item to your inventory.
      </p>

      <form @submit.prevent="submit" class="space-y-10">

        <!-- Product Info -->
        <div>
          <h2 class="font-semibold text-lg mb-4">Product Information</h2>

          <label class="block text-sm font-medium">Product Title</label>
          <input
            v-model="title"
            required
            class="w-full border rounded-md p-3 mt-1 mb-5 bg-gray-50"
            placeholder="Enter product title"
          />

          <label class="block text-sm font-medium">Product Description</label>
          <textarea
            v-model="description"
            class="w-full border rounded-md p-3 h-28 mt-1 bg-gray-50"
            placeholder="Provide a detailed description of the product"
          ></textarea>
        </div>

        <!-- Pricing Section -->
        <div>
          <h2 class="font-semibold text-lg mb-4">Pricing & Inventory</h2>

          <div class="grid grid-cols-2 gap-6">

            <div>
              <label class="block text-sm font-medium">Price</label>
              <input
                type="number"
                step="0.01"
                v-model.number="price"
                class="w-full border rounded-md p-3 mt-1 bg-gray-50"
                placeholder="$ 0.00"
              />
            </div>

            <div>
              <label class="block text-sm font-medium">Stock Quantity</label>
              <input
                type="number"
                v-model.number="stock"
                class="w-full border rounded-md p-3 mt-1 bg-gray-50"
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          <!-- Category -->
          <label class="block text-sm font-medium mt-5">Category</label>
          <select
            v-model="category"
            class="w-full border rounded-md p-3 mt-1 bg-gray-50"
          >
            <option value="">Select a category</option>

            <option
              v-for="c in categoriesStore.categories"
              :key="c.slug"
              :value="c.slug"
            >
              {{ c.name }}
            </option>
          </select>
        </div>

        <!-- Media Section -->
        <div>
          <h2 class="font-semibold text-lg mb-4">Media</h2>

          <div
            class="w-full border-2 border-dashed rounded-xl p-10 text-center text-gray-500 bg-gray-50 cursor-pointer"
            @click="triggerFileSelect"
            @dragover.prevent="dragging = true"
            @dragleave="dragging = false"
            @drop.prevent="handleDrop"
            :class="{ 'border-blue-500 bg-blue-50': dragging }"
          >
            <div class="text-4xl">⬆️</div>
            <p class="mt-2">
              <span class="text-primary font-medium">Click to upload</span>
              or drag and drop
            </p>
            <p class="text-xs text-gray-400 mt-1">
              SVG, PNG, JPG or GIF (MAX. 800×400px)
            </p>
          </div>

          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleFileInput"
          />

          <img
            v-if="thumbnail"
            :src="thumbnail"
            class="w-40 rounded-lg mt-5 border"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-4 pt-5 border-t">
          <button
            type="button"
            @click="$router.push('/products')"
            class="px-6 py-3 rounded-lg border bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-6 py-3 rounded-lg bg-blue-900 text-gray-200 hover:bg-blue-900"
          >
            {{ loading ? "Saving..." : "Save Product" }}
          </button>
        </div>
      </form>

      <p v-if="error" class="text-red-600 text-sm mt-4">
        {{ error }}
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCategoriesStore } from '../stores/categories'

const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const title = ref('')
const description = ref('')
const price = ref(0)
const stock = ref(0)
const category = ref('')
const thumbnail = ref('')
const dragging = ref(false)

const loading = ref(false)
const error = ref(null)
const showSuccess = ref(false)

const fileInput = ref(null)

// Fetch all categories on page load
onMounted(() => {
  categoriesStore.fetchCategories()
})

const triggerFileSelect = () => {
  fileInput.value.click()
}

const handleFileInput = (event) => {
  const file = event.target.files[0]
  if (file) convertToBase64(file)
}

const handleDrop = (event) => {
  dragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) convertToBase64(file)
}

function convertToBase64(file) {
  const reader = new FileReader()
  reader.onload = () => {
    thumbnail.value = reader.result
  }
  reader.readAsDataURL(file)
}

const submit = async () => {
  loading.value = true
  error.value = null

  const payload = {
    title: title.value,
    description: description.value,
    price: Number(price.value),
    stock: Number(stock.value),
    category: category.value.toLowerCase(),
    thumbnail: thumbnail.value
  }

  try {
    await productsStore.addProduct(payload)
    showSuccess.value = true

    setTimeout(() => {
      router.push('/products')
    }, 1000)

  } catch (err) {
    error.value = 'Failed to add product.'
  } finally {
    loading.value = false
  }
}
</script>

<style>
@keyframes fade {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade {
  animation: fade 0.3s ease-out;
}
</style>
