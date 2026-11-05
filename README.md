# LearnSphere – Learning Management System

LearnSphere is a full-stack Learning Management System (LMS) built with React, Node.js, Express, and MongoDB. It provides a learning platform where students can explore courses, enroll, access lessons, track learning progress, and submit course reviews.

## Features

### Authentication and Account Management
- User registration and login
- JWT-based authentication
- Access and refresh token handling
- Protected API routes
- Profile editing
- Password management

### Course Management
- Browse and explore published courses
- Search courses
- Instructor course management
- Course details and information

### Student Learning
- Enroll in courses
- View enrolled courses
- Access course lessons
- Mark lessons as completed
- Track course completion progress

### Reviews
- Submit course ratings and comments
- View course reviews
- Update and delete personal reviews
- Automatic course rating aggregation

### Dashboard and Settings
- Learning dashboard
- Enrollment and progress overview
- Profile settings
- Help and Support page

## Technology Stack

**Frontend**
- React 19
- Vite
- JavaScript
- Axios
- React Router
- Lucide React
- Recharts

**Backend**
- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- Helmet
- Express Rate Limit

**API Documentation and Testing**
- Swagger / OpenAPI
- Jest
- Supertest

## Project Structure

```text
learnsphere-lms/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── docs/
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Community Server or MongoDB Atlas
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd learnsphere-lms
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file by copying `.env.example` and configure your MongoDB URI and JWT secrets.

Example:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/learnsphere
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
```

Backend API:

`http://localhost:5000/api`

### 3. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file using `.env.example`.

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, typically:

`http://localhost:5173`

## API Documentation

Swagger documentation is available at:

`http://localhost:5000/api/docs`

### Main API Modules

| Module | Base endpoint |
|---|---|
| Authentication | `/api/auth` |
| Courses | `/api/courses` |
| Enrollments | `/api/enrollments` |
| Lessons | `/api/lessons` |
| Progress | `/api/progress` |
| Reviews | `/api/reviews` |

Refer to Swagger for the documented endpoints, request bodies, and responses.

## Available Scripts

### Backend

```bash
npm run dev
npm start
npm test
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Security

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes
- HTTP security headers using Helmet
- API rate limiting
- Request validation
- Environment-based secret configuration

## Future Improvements

- Instructor dashboard and advanced course management
- FAQ and support ticket functionality
- Course content expansion
- Deployment and production configuration
- Automated integration test coverage

## Author

**Dipanjali Bhujbal**

Software Developer | Computer Engineering Graduate

## License

This project is currently available for portfolio and educational purposes. Add a license file if you intend to distribute it under a specific open-source license.