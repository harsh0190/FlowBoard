# 🚀 FlowBoard - Project Management SaaS

FlowBoard is a full-stack project management platform built with the MERN stack.  
It helps teams manage workspaces, projects, tasks, members, and real-time collaboration using a Kanban workflow.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT based authentication
- Protected routes
- Password update functionality

### 🏢 Workspace Management
- Create multiple workspaces
- Switch between workspaces
- Workspace based data isolation
- Admin/member roles

### 👥 Team Collaboration
- Invite members by email
- Role based permissions
- Admin restricted actions
- Member management

### 📁 Project Management
- Create projects inside workspaces
- Track project progress
- Project deadlines
- Workspace specific projects

### 📌 Kanban Task Board
- Create and manage tasks
- Drag and drop task status updates
- Todo / In Progress / Review / Completed workflow
- Task priority levels
- Task comments

### 🔔 Real-Time Notifications
- Socket.IO powered notifications
- Task movement alerts
- Notification center
- Clear notifications

### 📊 Dashboard Analytics
- Workspace overview
- Project statistics
- Task progress
- Charts and analytics

### ⚙️ Settings
- Secure password update
- Profile information
- Workspace overview

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Recharts
- DND Kit
- Socket.IO Client
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- Bcrypt

---

## 📂 Project Structure


FlowBoard/

├── frontend/
│
├── src/
│ ├── components/
│ ├── pages/
│ ├── features/
│ ├── hooks/
│ ├── api/
│ └── App.tsx
│
│
├── backend/
│
├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── config/
│ ├── app.ts
│ └── server.ts


---