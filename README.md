📘 FRONTEND README (frontend/README.md)
# 🧠 Memory Vault – Frontend

Memory Vault is a modern web application that allows users to upload, store, and manage personal memories with images, location, and date information.

This frontend is built using React and integrates directly with Supabase for database and file storage.

---

## 🌟 Features

- 📸 Upload multiple images
- 📝 Add title and description
- 📍 Store location details
- 📅 Save memory date
- 🔍 View and search memories
- ☁️ Cloud image storage (Supabase Storage)
- 🗄️ Cloud database (Supabase PostgreSQL)
- 🎨 Responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- Supabase (Database + Storage)
- React Hooks (useState, useEffect)

---

## 📂 Project Structure


src/
├── pages/
│ ├── Login.jsx
│ ├── Dashboard.jsx
│ ├── MemoryUpload.jsx
│ └── SearchMemories.jsx
├── lib/
│ └── supabase.js
├── App.jsx
└── main.jsx


---

## 🚀 Getting Started

### 1️⃣ Clone Repository


git clone https://github.com/your-username/memory-vault.git

cd memory-vault/frontend


---

### 2️⃣ Install Dependencies


npm install


---

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root of the frontend folder:


VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


You can find these in:

Supabase Dashboard → Project Settings → API

---

### 4️⃣ Run Development Server


npm run dev


App runs at:


http://localhost:5173


---

## 🗄️ Supabase Setup

### 📌 1. Create Database Table

Create a table named:


memories


Columns:

- id (Primary Key, UUID or bigint)
- title (text, required)
- description (text)
- image_url (text)
- location (text)
- date (date or text)
- created_at (timestamp, default now())

---

### 📌 2. Enable Row Level Security (RLS)

Go to:

Database → Table Editor → memories → Policies

Add policies:

INSERT:

true


SELECT:

true


---

### 📌 3. Create Storage Bucket

Go to:

Storage → Create Bucket

Bucket Name:

memory-images


Enable:
- Public bucket = ON

Add policies:

INSERT → true  
SELECT → true  

---

## 🔐 Authentication (Optional)

If authentication is enabled, Supabase Auth can be used to manage users and secure data access.

---

## 📦 Build for Production


npm run build


Production files will be generated in the `dist` folder.

---

## 🌍 Deployment

You can deploy the frontend using:

- Vercel
- Netlify
- Firebase Hosting

Make sure environment variables are added in the deployment platform.

---

## 🧩 Future Improvements

- User authentication
- Memory categories
- Edit/Delete memories
- Voice notes
- Media attachments
- Advanced search & filtering

---

## 👨‍💻 Author

Your Name  
Built as a full-stack cloud-based memory management system using Supabase.