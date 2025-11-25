README.md
**Product Management App — Vue 3 + Pinia + TailwindCSS**

This is a mini Product Management application built using Vue 3, Pinia, Vue Router, and Tailwind CSS, based on the Frontend Technical Test by AlienSoft Technologies.

**The app communicates with the DummyJSON API to handle:**

User authentication

Product listing

Product search

View product

Add new product
**
🚀 Features**
Authentication

Login using DummyJSON authentication

Successful login stores token in Pinia + localStorage

Redirects to /products after login

Route protection for all product pages

Logout button located at the bottom of the Product List page

Products

Product list page with:

Search by title

Clean table UI with thumbnails, description, category, price & stock

View Product page with full details

Add Product page with form fields:

Title, description, category, price, stock, thumbnail URL

After adding product, store updates and user is redirected

State Management

Pinia Stores:

authStore – token, user, session persistence

productStore – fetch/add/view products

**🛠 Tech Stack**

Vue 3 (Composition API)

Vue Router

Pinia

Tailwind CSS

Fetch / Axios 

DummyJSON API


**
📦 Project Setup**

Clone the repository:

git clone <https://github.com/Vinmumo/product-manager.git>
cd <product-manager>

**
Install dependencies:**

npm install

**
Run development server:**

npm run dev


**Build for production:**

npm run build

**
Preview production build:**

npm run preview

**🔧 Environment / Config**

No .env file is required.
**
Base API URLs used:**

https://dummyjson.com/auth/login
https://dummyjson.com/products


**Routing**

/login → Login page

/products → Product list

/products/:id → View product

/products/new → Add product
**
🔐 Authentication Flow**

User logs in at /login

App sends POST request to DummyJSON login API

On success:

Token is saved in Pinia

Token persists to localStorage

Redirects to /products

Protected routes check authStore.isAuthenticated

**📄 Assumptions Made**

After login, user is redirected to /products as the home screen.

Logout simply clears the auth store + localStorage and redirects to /login.

Update and delete product are optional will be included.
