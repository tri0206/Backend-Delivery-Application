# 📦 Delivery App - Backend

This is the backend service for the Delivery App, supporting users, restaurants, and delivery drivers with real-time order tracking, user authentication, image uploads, and push notifications.

## 🚀 Technologies Used

- **Node.js** & **Express** — Fast and flexible framework for building RESTful APIs.
- **PostgreSQL** — Powerful and reliable relational database.
- **Passport.js** with **JWT** — Secure user authentication using JSON Web Tokens.
- **Multer** — Middleware to handle image uploads from clients.
- **Google Cloud Storage** — Cloud storage for files and images.
- **Firebase Admin SDK** — Send push notifications to users and drivers.
- **Socket.io** — Enables real-time communication between clients and server.

---

## 📁 Project Structure

```
delivery-backend/
├── controllers/        # Route logic (auth, user, order, etc.)
├── middlewares/        # Authentication, error handling, etc.
├── models/             # Database models and queries
├── routes/             # API endpoints
├── services/           # Firebase, GCS, Notification, etc.
├── utils/              # Helper functions
├── uploads/            # Temporary uploads
├── config/             # Configs for DB, Firebase, Cloud Storage
├── index.js            # Server entry point
└── .env                # Environment variables
```

## ⚙️ Setup Instructions

### 1. Clone and install dependencies

```bash
git clone https://github.com/yourusername/delivery-backend.git
cd delivery-backend
npm install
```

### 2. Create `.env` file

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/deliverydb
JWT_SECRET=your_jwt_secret_key
GCS_BUCKET_NAME=your_google_cloud_storage_bucket
GOOGLE_APPLICATION_CREDENTIALS=path/to/gcloud-key.json
FIREBASE_SERVICE_ACCOUNT=path/to/firebase-service-account.json
```

### 3. Start the server

```bash
npm start
```

## 🔐 Authentication

Using JWT, clients must send the token in the header:

```
Authorization: Bearer <token>
```

## 🔔 Push Notification

Uses Firebase Admin SDK to send notifications for:

- New orders (to restaurants)
- Delivery status (to users)
- Order updates (to delivery drivers)

## 📡 Socket.io Events

| Event             | Description                        |
|------------------|------------------------------------|
| `order:created`   | When a new order is placed         |
| `order:updated`   | When an order status is updated    |
| `location:update` | Shipper's location update          |

## 🖼️ Image Upload

Uses Multer to handle image uploads and stores them in **Google Cloud Storage**. Image URLs are saved in PostgreSQL.

## 📬 API Endpoints (Examples)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
POST   /api/orders
PATCH  /api/orders/:id/status
POST   /api/upload/image
```

