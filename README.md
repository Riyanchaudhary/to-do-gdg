# To-Do App ✅

A modern **To-Do List application** built using **React.js**, **Supabase (PostgreSQL backend)**, and **Auth0 authentication**.  
Deployed on **Vercel**.

---

## 🚀 Features

- 🔐 **Authentication** using Auth0  
  - Login / Logout with Auth0 provider  
  - User-specific tasks stored securely in Supabase  

- 📝 **Task Management**  
  - Add, edit, delete tasks  
  - Mark tasks as complete/incomplete  
  - Optional **deadline date** for each task  

- 📊 **Daily Debrief**  
  - View completed vs not completed tasks at the end of the day  

- 🎨 **UI Features**  
  - Dark/Light theme toggle  
  - Deadline shown alongside each task  
  - Simple and clean layout  

- ☁️ **Supabase Database**  
  - `todos` table with fields:  
    ```sql
    id (uuid) PRIMARY KEY
    text (text)
    date (text)
    last_date (date)
    completed (boolean)
    user_email (text)
    created_at (timestamp)
    ```

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite)  
- **Database & API:** Supabase (PostgreSQL)  
- **Authentication:** Auth0  
- **Hosting:** Vercel  

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Riyanchaudhary/to-do-gdg.git
   cd to-do-gdg
