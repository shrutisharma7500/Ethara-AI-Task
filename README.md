# Team Task Management Web Application

A full-stack collaborative task management application where teams can create projects, assign tasks, and track their progress efficiently. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Authentication:** Secure signup and login functionality using JWT.
- **Project Management:** Users can create projects and become the Admin. Admins can dynamically add or remove team members.
- **Task Kanban Board:** Create, assign, and update tasks across "To Do", "In Progress", and "Done" statuses.
- **Role-Based Access (RBAC):**
  - **Admin:** Full rights to manage tasks and users within their project.
  - **Member:** Can view the project board and update the status of tasks assigned specifically to them.
- **Dashboard Metrics:** Visual overview of total tasks, completion rates, and overdue tasks.
- **Modern Dark Theme UI:** Custom-built responsive UI with glassmorphism and subtle animations.

## Tech Stack
- **Frontend:** React.js (Vite), React Router, Axios, Custom Vanilla CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ORM).
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs.

---

## Local Setup Instructions

### Prerequisites
- Node.js installed on your machine.
- MongoDB running locally (default port 27017) or a MongoDB Atlas URI.

### 1. Setup the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env` file in the `backend` folder has the following variables (modify if using MongoDB Atlas):
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/task-manager
   JWT_SECRET=your_super_secret_key_here
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will start on http://localhost:5000*

### 2. Setup the Frontend
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder (if it doesn't exist) and add your backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the React development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on http://localhost:5173*

---

## Deployment Instructions (Railway)

This application is configured to be easily deployed on [Railway.app](https://railway.app/).

### 1. Database (MongoDB)
For production, it is highly recommended to use **MongoDB Atlas**.
1. Create a free cluster on MongoDB Atlas.
2. Set up a database user and allow network access from anywhere (`0.0.0.0/0`).
3. Copy your MongoDB connection string.

### 2. Deploying the Backend
1. Push this entire repository to your GitHub account.
2. Go to Railway, click **New Project** -> **Deploy from GitHub repo** and select your repository.
3. In the Railway service settings, set the **Root Directory** to `/backend`.
4. Go to the **Variables** tab and add:
   - `PORT` = `5000`
   - `MONGO_URI` = `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET` = `<Your Secret Key>`
5. Go to the **Settings** tab and click **Generate Domain**. Copy this backend URL.

### 3. Deploying the Frontend
1. In the same Railway project dashboard, click **New** -> **GitHub Repo** and select your repository again to create a second service.
2. In the settings for this new service, set the **Root Directory** to `/frontend`.
3. Go to the **Variables** tab and add:
   - `VITE_API_URL` = `<Your Backend URL from step 2>/api`
4. Go to the **Settings** tab and click **Generate Domain**.
5. Your frontend domain is now live and successfully connected to your backend!
