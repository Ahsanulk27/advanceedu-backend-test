# Backend Developer Technical Assignment – REST API & Stripe Integration

This project is a backend REST API built as part of a technical assignment to demonstrate skills in Node.js, Express, REST API design, authentication, Stripe payment integration, API testing, and deployment.

---

## 🚀 Live Deployment

- **Base API URL:**  
  👉 advanceedu-backend-test.onrender.com/

- **Stripe Webhook Endpoint:**  
  👉 advanceedu-backend-test.onrender.com/api/v1/webhooks/stripe

---

## 📬 Postman Collection

- **Postman Collection (Exported JSON):**  
  👉 [https://your-postman-collection-link](https://cse471-group-7-9618.postman.co/workspace/Atif's-personal-workspace~28fd11b4-34fe-4460-8825-a209aa26ace8/collection/32586019-07f49a3d-d531-426e-acbb-80de48ba883e?action=share&creator=32586019)

> The collection includes all endpoints, JWT authorization setup, and sample requests & responses.

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL (Neon)**
- **Prisma ORM**
- **Stripe (Test Mode)**
- **JWT Authentication**
- **Deployment:** Render

---

## ✨ Features Implemented

### Authentication
- User registration
- User login with JWT
- Get logged-in user profile

### Products
- Create product
- List products
- Unique product names enforced

### Orders & Payments
- Create order
- Initiate Stripe PaymentIntent
- Store payment intent reference
- Handle payment success & failure via Stripe webhooks
- Automatically update order status (`PENDING`, `PAID`, `FAILED`)

### Code Quality
- Centralized error handling
- Clean project structure
- Environment-based configuration
- Proper validation & error responses

---

## 📂 Project Structure
```
src/
├── controllers/
├── routes/
├── middlewares/
├── services/
├── generated/prisma
├── utils/
└── app.ts
```

---

## 🔐 Environment Variables

Create a `.env.development` file using the given example template:

A .env.example file is included in the repository.

⚙️ Setup Instructions (Local)
# Clone the repository
```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
# Install dependencies
```
npm install
```
# Generate Prisma Client
```
npx prisma generate
```
# Run database migrations
```
npx prisma migrate dev
```
# Start development server
```
npm run dev
```

The server will start at:

http://localhost:5000
