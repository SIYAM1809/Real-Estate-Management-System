# Real Estate Management System (MERN)

A full-stack real-estate marketplace built with the **MERN** stack where:

- **Sellers** create property listings (submitted for approval)
- **Admins** review and approve/reject listings
- **Buyers** browse approved properties, filter/search, and save favorites

🌐 Live: https://syntaxestate.vercel.app

---

## Features

### Core workflow
- Role-based access: **Buyer / Seller / Admin**
- Seller property submission → **Pending** → Admin approval → **Public listing**
- Property browsing with search/filter (location, price, category, etc.)
- Favorites (save/unsave properties)

### Security & quality
- JWT authentication
- Protected routes + role guards
- Input validation + basic error handling

---

## Tech Stack

**Frontend:** React, Redux Toolkit (state), React Router  
**Backend:** Node.js, Express  
**Database:** MongoDB + Mongoose  
**Media:** Cloudinary (image upload)

---

## Project Structure

