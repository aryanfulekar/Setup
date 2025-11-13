# 🌐 MERN Social Media & Chat App

A full-stack **Social Media and Real-Time Chat Application** built with the **MERN Stack (MongoDB, Express, React, Node.js)** and **Socket.IO**.  
This project allows users to connect, share posts, follow each other, and communicate instantly in real time.

---

## 🚀 Features

### 👤 User Authentication & Authorization
- Secure **signup**, **login**, and **logout** using JWT tokens.
- Passwords are securely hashed before saving to the database.

### 📝 Posts
- Users can **create**, **view**, **like**, **comment**, and **delete** posts.
- Only the **author** of a post can delete it.
- Users can **bookmark** posts for later.

### 💬 Real-Time Chat
- One-to-one **real-time messaging** using **WebSocket (Socket.IO)**.
- Online/offline user status tracking.

### 👥 Social Features
- **Follow** and **unfollow** other users.
- View followers and following lists.
- Personalized **profile pages** with user details and all their posts.

### 🧑‍💻 Profile Management
- Update **profile picture**, **bio**, **gender**, and **password**.
- View your own posts under the profile section.

---

## 🛠️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| **Frontend** | React, Vite, Redux Toolkit, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-Time** | Socket.IO |
| **File Uploads** | Multer & Cloudinary |
| **Authentication** | JSON Web Tokens (JWT) |
| **Other Tools** | Axios, dotenv, bcrypt, cors |

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
