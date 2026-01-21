# Real Estate Management System (MERN)

A full-stack real-estate marketplace built with the **MERN** stack where **Sellers** submit properties, **Admins** review/approve, and **Buyers** browse approved listings and save favorites.

🌐 Live Demo: https://syntaxestate.vercel.app

---

## Key Features

### Role-based platform
- **Buyer / Seller / Admin** roles
- Protected routes + authorization middleware
- Secure authentication with JWT

### Property workflow
- Sellers can **add/manage** properties
- Listings start as **Pending**
- Admin can **approve/reject**
- Only **approved** properties are visible to buyers

### Buyer experience
- Browse properties with dedicated listing & details pages
- Favorites (save/unsave)
- Inquiry + review modules (present in code structure)

### Account features
- Login / Register
- Forgot password / Reset password (UI present)

---

## Tech Stack

**Frontend:** React (Vite), Redux Toolkit, React Router, Tailwind CSS  
**Backend:** Node.js, Express  
**Database:** MongoDB, Mongoose  
**Uploads/Email:** Multer-style uploads + email utility (see `server/utils/email.js`)

---

## Project Structure

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
│   │   │   └── properties/
│   │   ├── features/            # Redux slices / feature modules
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
│   │   │   └── apiBase.js       # API base config
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js                # Mongo connection
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/                 # local uploads (recommended: ignore in git)
│   ├── utils/
│   │   └── email.js
│   └── server.js
│
├── .env
├── .gitignore
└── LICENSE
