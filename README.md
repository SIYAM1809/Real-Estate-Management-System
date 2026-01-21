Real Estate Management System (MERN)
A full-stack real-estate marketplace where Sellers submit properties, Admins approve listings, and Buyers browse and save favorites.

🌐 Live Demo: https://syntaxestate.vercel.app

🔥 Key Features
RBAC: Distinct roles for Buyer, Seller, and Admin.

Workflow: Seller submits → Admin approves → Public listing.

Security: JWT authentication + Protected Routes.

Interactions: Inquiries, Reviews, and Favorites management.

Uploads: Multer (Local) / Cloudinary support.

## 📸 Screenshots

| Home Page | Admin Dashboard |
|:---:|:---:|
| ![Home Page](./UI/Homepage(SyntaxEstate).png) | ![Admin Dashboard](./UI/Admin%20Dashboard(SyntaxEstate).png) |

---

🛠 Tech Stack
Frontend: React (Vite), Redux Toolkit, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Tools: Multer, Nodemailer

📂 Project Structure


```text
Real-Estate-Management-System/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/                 # Redux store setup
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── map/
│   │   │   ├── properties/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Spinner.jsx
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── favorites/
│   │   │   ├── inquiries/
│   │   │   ├── properties/
│   │   │   └── reviews/
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── AddProperty.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── utils/
│   │   │   └── apiBase.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── inquiryController.js
│   │   ├── propertyController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Inquiry.js
│   │   ├── Log.js
│   │   ├── Property.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── inquiryRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/                 # local uploads (ignored in git)
│   ├── utils/
│   │   └── email.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── package.json                 # monorepo scripts (root)
├── .gitignore
└── LICENSE
```

---

## 🚀 Getting Started

### 1. Installation

Install dependencies for root, client, and server:

```bash
# If you have a root install script:
npm run install:all

# OR install manually:
cd client && npm install
cd ../server && npm install
```

### 2. Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000

# Email Config
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Run Locally

```bash
# Run both client and server (from root)
npm run dev

# Note: If on Windows, try: npm run dev:win
```

---

## 📝 License

MIT © [SIYAM1809](https://github.com/SIYAM1809)
