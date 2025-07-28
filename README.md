# Learning Management System (LMS)

This is a full-stack Learning Management System built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User Authentication (Register, Login, JWT-based)
- Workspace Management
- Project and Folder Organization
- Pathway Creation and Editing (Links, Videos, Markdown Documents)
- Universal Search
- Admin Panel (User and Workspace Management)
- Responsive Design with Tailwind CSS

## Project Structure

```
lms-project/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Workspace.js
│   │   ├── Project.js
│   │   ├── Folder.js
│   │   ├── Pathway.js
│   │   ├── Link.js
│   │   ├── Video.js
│   │   └── Document.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── workspace.routes.js
│   │   ├── project.routes.js
│   │   ├── pathway.routes.js
│   │   └── search.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── workspace.controller.js
│   │   ├── project.controller.js
│   │   ├── pathway.controller.js
│   │   └── search.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── errorResponse.js
│   └── .env
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── workspace/
│   │   │   │   ├── WorkspaceList.jsx
│   │   │   │   └── WorkspaceDetail.jsx
│   │   │   ├── project/
│   │   │   │   ├── ProjectTree.jsx
│   │   │   │   ├── ProjectDetail.jsx
│   │   │   │   └── FolderTree.jsx
│   │   │   ├── pathway/
│   │   │   │   ├── PathwayList.jsx
│   │   │   │   ├── PathwayDetail.jsx
│   │   │   │   └── PathwayEditor.jsx
│   │   │   ├── search/
│   │   │   │   └── SearchBar.jsx
│   │   │   └── common/
│   │   │       ├── Loading.jsx
│   │   │       └── Error.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PublicView.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── user.js
│   │   │   ├── workspace.js
│   │   │   ├── project.js
│   │   │   └── pathway.js
│   │   └── utils/
│   │       └── helpers.js
│   └── public/
│       └── assets/
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)

### 1. Clone the repository

```bash
git clone <repository-url>
cd lms-project
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=mongodb://localhost:27017/lms
```

**Note:** Replace `your_jwt_secret_key_here` with a strong, random string. If you are using a cloud MongoDB instance, replace `mongodb://localhost:27017/lms` with your MongoDB connection string.

Start the backend server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will run on `http://localhost:5173` (or another available port).

### 4. Accessing the Application

Open your web browser and go to `http://localhost:5173` to access the LMS application.

## API Endpoints

**Auth Routes:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**User Routes:**
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`

**Workspace Routes:**
- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/workspaces/:id`
- `PUT /api/workspaces/:id`
- `DELETE /api/workspaces/:id`
- `POST /api/workspaces/:id/members`

**Project Routes:**
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/projects/:id/tree`

**Pathway Routes:**
- `GET /api/pathways`
- `POST /api/pathways`
- `GET /api/pathways/:id`
- `PUT /api/pathways/:id`
- `DELETE /api/pathways/:id`
- `POST /api/pathways/:id/items`

**Search Routes:**
- `GET /api/search?q=<query>`

## Contributing

Feel free to contribute to this project. Please follow the existing code style and conventions.

## License

This project is licensed under the MIT License.
