# **Product Management App — Vue 3 + Pinia + TailwindCSS**

A mini Product Management application built using **Vue 3**, **Pinia**, **Vue Router**, and **Tailwind CSS**, based on the *Frontend Technical Test* by AlienSoft Technologies.

The application integrates with the **DummyJSON API** for authentication and product management.

---

## 🚀 **Features**

### 🔐 **Authentication**
- Login using DummyJSON authentication  
- Token stored in **Pinia + localStorage**  
- Redirects to **`/products`** after login  
- Full route protection  
- Logout button on the Product List page  

---

### 📦 **Products**
- Product list page with:
  - Search by product title  
  - Thumbnail, title, truncated description, category, price & stock  
- View Product page with full details  
- Add Product form with:
  - Title  
  - Description  
  - Category  
  - Price  
  - Stock  
  - Thumbnail upload (click or drag & drop)  
- Form validation on required fields  
- Store updates immediately after product creation  

---

## 🗃 **State Management (Pinia)**

### **authStore**
- `token`  
- `user`  
- `isAuthenticated`  
- Session persistence  

### **productsStore**
- Fetch all products  
- Add new product  
- Fetch product by ID  

---

## 🛠 **Tech Stack**
- **Vue 3** (Composition API)  
- **Pinia**  
- **Vue Router**  
- **Tailwind CSS**  
- **Fetch / Axios**  
- **DummyJSON API**  

---

## 📦 **Project Setup**

### 1️⃣ **Clone the repository**
```bash
git clone https://github.com/Vinmumo/product-manager.git
cd product-manager

2️⃣ Install dependencies
npm install

3️⃣ Run the development server
npm run dev

4️⃣ Build for production
npm run build

5️⃣ Preview production build
npm run preview

🔧 Environment / Config

No .env file is required.

API Endpoints Used

Auth: https://dummyjson.com/auth/login

Products: https://dummyjson.com/products

🗂 Routing Structure
Route	Description
/login	Login page
/products	Product list
/products/:id	View product details
/products/new	Add new product
🔐 Authentication Flow

User logs in at /login

Credentials are sent to the DummyJSON Auth API

On successful login:

Token is saved in Pinia

Token is persisted to localStorage

User is redirected to /products

Navigation guards protect all authenticated routes

📄 Assumptions

/products functions as the main dashboard after login

Logging out clears the auth store and redirects to /login

Update/Delete product features are optional and may be added later

🌐 Live Deployment

🔗 Live Demo: Add your GitHub Pages link here
🔗 Repository: https://github.com/Vinmumo/product-manager