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

## Payment Flow

This API integrates with **Stripe** for payment processing using the Payment Intent API.

### Payment Flow Steps:

1. **User creates an order** - `POST /api/v1/orders`
   - Send authenticated request with `productId`
   - Backend fetches product and creates a Stripe `PaymentIntent`
   - Order is created in database with status `PENDING`
   - Response includes `clientSecret`, `orderId`, and payment details

2. **Payment is confirmed** 
   - In test mode: Payment is instantly confirmed with test card `pm_card_visa`
   - In production: Customer would complete payment on frontend using `clientSecret`

3. **Stripe sends webhook notification** - `POST /api/v1/webhooks/stripe`
   - Stripe notifies backend of payment outcome
   - Backend validates webhook signature using `STRIPE_WEBHOOK_SECRET`
   
4. **Order status is automatically updated** based on webhook event:
   - **`payment_intent.succeeded`** → Order status changes from `PENDING` to `PAID` ✅
   - **`payment_intent.payment_failed`** → Order status changes to `FAILED` ❌
   - **`payment_intent.canceled`** → Order status changes to `FAILED` ❌

5. **Order is ready for fulfillment** - Get order details via `GET /api/v1/orders/:id`
   - Check order status to confirm payment
   - Process the order based on status

### Testing with Stripe Test Mode:
- Test card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3-digit number (e.g., 123)
- Webhook events fire automatically in test mode

### Important Notes:
- Webhook endpoint must be registered in Stripe Dashboard: `https://your-domain.com/api/v1/webhooks/stripe`
- All requests require JWT authentication (except auth endpoints)
- Orders are stored in PostgreSQL with Prisma ORM
