#  Rating Platform

A full-stack Rating & Review Platform where users can sign up, log in, rate items/services, and view analytics dashboards. Built with a modern tech stack focusing on clean UI, secure authentication, and scalable APIs.

---

## Live Demo

 **Frontend Live Link:** *Add your Vercel link here*

---

## 🛠️ Tech Stack

### **Frontend**

* React + Vite
* Tailwind CSS
* React Router
* Axios
* Zustand / Context (if used for state management)

### **Backend**

* Node.js
* Express.js
* MongoDB / PostgreSQL (whichever you used)
* JWT Authentication
* Bcrypt for password security

---

##  Features

### ** Authentication**

* User Signup
* Login with JWT
* Protected Routes
* Role-Based Features (Admin/User)

### ** Rating System**

* Submit Ratings
* Edit/Delete Ratings
* View Rating History

### ** Dashboards**

* Personalized user dashboard
* Admin dashboard with:

  * Total users
  * Total ratings
  * Recent activity
  * Category-based analytics

### ** Responsive UI**

* Tailwind-powered clean layout
* Mobile-friendly
* Modern component structure

---

##  Folder Structure

```
project-root/
│── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
│── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
│
└── README.md
```

---

##  Installation & Setup

### **1️ Clone the Repository**

```bash
git clone https://github.com/Mayenk037/rating-platform.git
cd rating-platform
```

---

### **2️ Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

---

### **3️ Backend Setup**

```bash
cd backend
npm install
npm start
```

---

##  Environment Variables

### **Backend `.env`**

```
PORT=5000
MONGO_URI=
JWT_SECRET=
```

### **Frontend `.env`**

```
VITE_API_URL=http://localhost:5173
```

---

##  API Endpoints

### **Auth**

| Method | Endpoint           | Description |
| ------ | ------------------ | ----------- |
| POST   | `/api/auth/signup` | User signup |
| POST   | `/api/auth/login`  | User login  |

### **Ratings**

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| POST   | `/api/rating/add`      | Submit rating             |
| GET    | `/api/rating/all`      | Get all ratings           |
| GET    | `/api/rating/user/:id` | Get user-specific ratings |

---

##  Testing

Use Postman or Thunder Client to test protected routes.
Remember to include:

```
Authorization: Bearer <token>
```

---

##  Deployment

### **Frontend**

* Vercel (Recommended)


## 👨 Author

**Mayenk Chanore**
Engineering Student | Full Stack Developer
GitHub: [@Mayenk037](https://github.com/Mayenk037)