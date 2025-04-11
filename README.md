# 🧠 Job Tracker App

A full-stack job tracking application to help you stay on top of your job applications. Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Radix UI**, **Express.js**, and **MongoDB**.

## 📁 Project Structure

This project is divided into two main parts:

- **Client** – Built with Next.js + TailwindCSS + TypeScript + Radix UI.
- **Server** – Built with Express.js + MongoDB (Mongoose ORM).

### 🔧 Core Features

- Add new job applications with relevant details.
- View a list of all jobs you’ve applied to.
- Filter jobs based on status and application date.
- Update job status or details.
- Delete jobs from your tracker.
---

## 🚀 Live Demo

- **Frontend (Vercel)**: [https://student-job-tracker-drab.vercel.app](https://student-job-tracker-drab.vercel.app/)
- **Backend (Render)**: [https://studentjobtracker-yhh9.onrender.com](https://studentjobtracker-yhh9.onrender.com)

---

## 🛠️ Tech Stack

### Frontend

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Axios](https://axios-http.com/)

### Backend

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [CORS](https://www.npmjs.com/package/cors)
- [Nodemon](https://www.npmjs.com/package/nodemon)

---

## 🧪 Features

- Add, update, delete and view job applications.
- Filter by application status and date.
- Sort by date or company.
- Pagination & Field limiting.
- Frontend + backend deployed separately (Vercel + Render).
- Environment-based CORS handling.

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/job-tracker.git
cd job-tracker
```
2. Set up backend
```
cd server
npm install
```
Create a .env file in the server folder:
PORT=8000
MONGO_URI=your_mongo_connection_string
CLIENT_URL=http://localhost:3000

Run the server:
```
npm run dev
```
3. Set up frontend
```
cd client
npm install

```
Create a .env.local file in the client folder:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

```
npm run dev
```

🌐 Deployment
Backend (Render)
Push the server/ folder to a GitHub repo.

Go to Render, create a new Web Service.

Set root directory as server.

Add environment variables (MONGO_URI, CLIENT_URL).

Use the start command:

```
npm start
```
Frontend (Vercel)
Push the client/ folder to GitHub.

Go to Vercel, import project from GitHub.

Add NEXT_PUBLIC_API_BASE_URL in Vercel project settings:
```
https://your-backend.onrender.com
```
