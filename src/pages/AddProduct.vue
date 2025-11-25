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

          <!-- Title -->
          <label class="block text-sm font-medium">Product Title</label>
          <input
            v-model="title"
            class="w-full border rounded-md p-3 mt-1 mb-1 bg-gray-50"
            :class="{ 'border-red-500': errors.title }"
            placeholder="Enter product title"
          />
          <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>

          <!-- Description -->
          <label class="block text-sm font-medium mt-5">Product Description</label>
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

            <!-- Price -->
            <div>
              <label class="block text-sm font-medium">Price</label>
              <input
                type="number"
                v-model.number="price"
                class="w-full border rounded-md p-3 mt-1 bg-gray-50"
                :class="{ 'border-red-500': errors.price }"
                placeholder="$ 0.00"
              />
              <p v-if="errors.price" class="text-red-500 text-sm">{{ errors.price }}</p>
            </div>

            <!-- Stock -->
            <div>
              <label class="block text-sm font-medium">Stock Quantity</label>
              <input
                type="number"
                v-model.number="stock"
                class="w-full border rounded-md p-3 mt-1 bg-gray-50"
                :class="{ 'border-red-500': errors.stock }"
                placeholder="Enter stock quantity"
              />
              <p v-if="errors.stock" class="text-red-500 text-sm">{{ errors.stock }}</p>
            </div>
          </div>

          <!-- Category -->
          <label class="block text-sm font-medium mt-5">Category</label>
          <select
            v-model="category"
            class="w-full border rounded-md p-3 mt-1 bg-gray-50"
            :class="{ 'border-red-500': errors.category }"
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
          <p v-if="errors.category" class="text-red-500 text-sm">{{ errors.category }}</p>
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
            :class="{ 'border-blue-500 bg-blue-50': dragging, 'border-red-500': errors.thumbnail }"
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

          <!-- File Input -->
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleFileInput"
          />

          <!-- Thumbnail Preview -->
          <img
            v-if="thumbnail"
            :src="thumbnail"
            class="w-40 rounded-lg mt-5 border"
          />

          <p v-if="errors.thumbnail" class="text-red-500 text-sm mt-2">
            {{ errors.thumbnail }}
          </p>
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
            class="px-6 py-3 rounded-lg bg-blue-900 text-gray-200 hover:bg-blue-800"
          >
            {{ loading ? "Saving..." : "Save Product" }}
          </button>
        </div>
      </form>

      <!-- Global Error -->
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
const price = ref(null)
const stock = ref(null)
const category = ref('')
const thumbnail = ref('')
const dragging = ref(false)

const loading = ref(false)
const error = ref(null)
const showSuccess = ref(false)

const fileInput = ref(null)

// Validation errors
const errors = ref({
  title: '',
  price: '',
  stock: '',
  category: '',
  thumbnail: ''
})

// Load category list
onMounted(() => {
  categoriesStore.fetchCategories()
})

// Thumbnail upload flow
const triggerFileSelect = () => fileInput.value.click()

const handleFileInput = (event) => {
  const file = event.target.files[0]
  if (file) convertToBase64(file)
}

const handleDrop = (event) => {
  dragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) convertToBase64(file)
}

const convertToBase64 = (file) => {
  const reader = new FileReader()
  reader.onload = () => {
    thumbnail.value = reader.result
  }
  reader.readAsDataURL(file)
}

// Validation logic
const validateForm = () => {
  let valid = true

  errors.value = {
    title: '',
    price: '',
    stock: '',
    category: '',
    thumbnail: ''
  }

  if (!title.value.trim()) {
    errors.value.title = 'Title is required.'
    valid = false
  }

  if (!price.value || price.value <= 0) {
    errors.value.price = 'Price must be greater than zero.'
    valid = false
  }

  if (stock.value === null || stock.value < 0) {
    errors.value.stock = 'Stock must be zero or more.'
    valid = false
  }

  if (!category.value) {
    errors.value.category = 'Please select a category.'
    valid = false
  }

  if (!thumbnail.value) {
    errors.value.thumbnail = 'Product image is required.'
    valid = false
  }

  return valid
}

// Submit Handler
const submit = async () => {
  error.value = null

  if (!validateForm()) return

  loading.value = true

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
