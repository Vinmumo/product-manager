<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
   
<div class="flex items-center gap-3 mb-6">
  <div class="text-4xl text-blue-700">🛒</div>
  <h1 class="text-2xl font-semibold text-blue-700">Platform Logo</h1>
</div>


    <!-- Card -->
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-center text-2xl font-semibold text-gray-800 mb-2">
        Welcome Back
      </h2>
      <p class="text-center text-gray-500 mb-6">
        Sign in to manage your products.
      </p>

      <form @submit.prevent="submit">
        <!-- Email / Username -->
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email or Username
        </label>
        <input
          v-model="username"
          type="text"
          required
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="you@example.com"
        />

        <!-- Password -->
        <label class="block text-sm font-medium text-gray-700 mt-4 mb-1">
          Password
        </label>

        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your password"
          />
          
          <!-- Eye toggle -->
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-2.5 text-gray-500"
          >
            <span v-if="showPassword">🙈</span>
            <span v-else>👁️</span>
          </button>
        </div>

        <!-- Remember + Forgot mock-->
        <div class="flex items-center justify-between mt-3 text-sm">
          <label class="flex items-center gap-2 text-gray-700">
            <input type="checkbox" v-model="remember" />
            Remember me
          </label>

          <router-link
            to="/forgot-password"
            class="text-blue-600 hover:underline"
          >
            Forgot Password?
          </router-link>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="mt-6 w-full py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

        <!-- Error -->
        <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>
      </form>
    </div>

    <!-- Footer -->
    <p class="mt-6 text-gray-400 text-sm">
      © 2024 Platform Inc. All Rights Reserved.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref(null)

const submit = async () => {
  loading.value = true
  error.value = null

  try {
    await auth.login({
      username: username.value,
      password: password.value,
      remember: remember.value,
    })
    router.push('/products')
  } catch (err) {
    error.value = auth.error || 'Invalid login'
  } finally {
    loading.value = false
  }
}
</script>
