# 🎨 Collaborative Whiteboard Application

A real-time collaborative whiteboard platform built with React and Node.js, featuring live drawing, multi-user collaboration, and persistent storage.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-61dafb.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Socket Events](#-socket-events)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality
- **Real-time Collaboration**: Multiple users can draw simultaneously with live cursor tracking
- **Drawing Tools**: Rectangle, Ellipse, Line, Arrow, Freehand, Text, Eraser, Select
- **Shape Manipulation**: Move, resize, rotate shapes with intuitive controls
- **Undo/Redo**: Full history management for drawing operations
- **Guest Mode**: Try the whiteboard without creating an account
- **Export**: Download boards as PNG images

### 👥 User Management
- **Authentication**: Email/password registration and Google OAuth
- **JWT Security**: Access and refresh token pattern with automatic renewal
- **Protected Routes**: Session-based authorization

### 🤝 Collaboration
- **Share Boards**: Invite collaborators by email
- **Role-Based Access**: Owner, Editor, and Viewer permissions
- **Live Cursors**: See where other users are drawing in real-time
- **Board Management**: Dashboard to view all owned and shared boards

### 🎨 Customization
- **Color Picker**: Choose from presets or custom colors
- **Stroke Width**: Adjustable brush size (1-20px)
- **Canvas Colors**: Change background colors on the fly
- **Editable Titles**: Rename boards inline

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.1 | UI Framework |
| **Vite** | 7.1.7 | Build Tool & Dev Server |
| **React Router** | 7.9.5 | Client-side Routing |
| **Tailwind CSS** | 4.1.17 | Utility-first Styling |
| **Konva / React-Konva** | 10.0.12 / 19.2.0 | Canvas Rendering |
| **Socket.IO Client** | 4.8.1 | WebSocket Communication |
| **Axios** | 1.13.2 | HTTP Client |
| **React Hook Form** | 7.66.1 | Form Management |
| **@react-oauth/google** | 0.12.2 | Google Authentication |
| **uuid** | 13.0.0 | Unique ID Generation |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | ≥18.0.0 | Runtime Environment |
| **Express** | 5.1.0 | Web Framework |
| **MongoDB** | - | Database |
| **Mongoose** | 8.19.2 | ODM (Object Data Modeling) |
| **Socket.IO** | 4.8.1 | WebSocket Server |
| **JWT** | 9.0.2 | Token Authentication |
| **Bcrypt** | 6.0.0 | Password Hashing |
| **Google Auth Library** | 10.5.0 | OAuth Verification |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **Cookie Parser** | 1.4.7 | Cookie Management |
| **Dotenv** | 17.2.3 | Environment Variables |

### Development Tools
- **Nodemon** - Auto-restart server on changes
---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Auth    │  │Dashboard │  │Whiteboard│  │  Share   │     │
│  │ Pages    │  │  Page    │  │  Canvas  │  │  Modal   │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │             │             │           │
│       └─────────────┴──────────────┴──────────────┘         │
│                          │                                  │
│                ┌─────────▼──────────┐                       │
│                │  Axios Interceptor  │                      │
│                │ (Auto Token Refresh)│                      │
│                └─────────┬──────────┘                       │
└──────────────────────────┼───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        │         REST API │ WebSocket        │
        │                  │ (Socket.IO)      │
        ▼                  ▼                  │
┌───────────────────────────────────────────────────────────┐
│                    Backend (Express)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   ┌──────────┐  │
│  │  Auth    │  │  User    │  │Whiteboard│   │  Socket  │  │
│  │  Routes  │  │  Routes  │  │  Routes  │   │  Handlers│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘   └────┬─────┘  │
│       │             │              │              │       │
│       └─────────────┴──────────────┴──────────────┘       │
│                          │                                │
│                ┌─────────▼──────────┐                     │
│                │   JWT Middleware   │                     │
│                └─────────┬──────────┘                     │
│                          │                                │
│                ┌─────────▼──────────┐                     │
│                │   MongoDB/Mongoose │                     │
│                │  ┌──────┐ ┌──────┐ │                     │
│                │  │Users │ │Boards│ │                     │
│                │  └──────┘ └──────┘ │                     │
│                └────────────────────┘                     │
└───────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow**:
   - User logs in → Backend validates → Issues JWT tokens → Stored in HTTP-only cookies
   - Access token expires → Axios interceptor → Calls refresh endpoint → New tokens issued

2. **Drawing Flow**:
   - User draws → Local state update → Socket emits `drawing_move` → Other clients receive
   - Mouse up → Finalize shape → Socket emits `draw_stroke` → Saved to local state
   - Save button → HTTP PUT request → MongoDB stores `elements` array

3. **Collaboration Flow**:
   - User joins board → Socket.IO `join_room` event → Subscribed to room broadcasts
   - Drawing events broadcast to room → All clients except sender receive updates

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: ≥ 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn**: Latest version
- **MongoDB**: Local or cloud instance ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Google Cloud Console Account**: For OAuth credentials ([Console](https://console.cloud.google.com/))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/collaborative-whiteboard.git
cd collaborative-whiteboard
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd server
npm install
```

#### Frontend Setup
```bash
cd ../client
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=whiteboard_db

# JWT Secrets (Generate with: openssl rand -base64 32)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

Create a `.env` file in the `client/` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api/v1

# Socket.IO URL
VITE_SOCKET_URL=http://localhost:8000

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Select **Web application** as application type
7. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - Your production URL (when deploying)
8. Copy the **Client ID** to your `.env` files

---

##  Running the Application

### Development Mode

#### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Client starts on http://localhost:5173
```

#### Option 2: Concurrent (Recommended)

Install `concurrently` in the root directory:

```bash
npm install -g concurrently

# From root directory
concurrently "cd server && npm run dev" "cd client && npm run dev"
```

### Production Mode

#### Backend:
```bash
cd server
npm start
```

#### Frontend:
```bash
cd client
npm run build
npm run preview
# Or serve the 'dist' folder with a static server
```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Socket.IO**: `ws://localhost:8000`

---

## 📁 Project Structure

```
collaborative-whiteboard/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/                 # API client functions
│   │   │   ├── auth.js          # Authentication API calls
│   │   │   ├── axios.js         # Axios instance with interceptors
│   │   │   └── whiteboard.js    # Whiteboard CRUD operations
│   │   ├── components/          # React components
│   │   │   ├── AuthLayout.jsx   # Authentication page wrapper
│   │   │   ├── GoogleLoginButton.jsx
│   │   │   ├── Input.jsx        # Form input component
│   │   │   ├── PropertiesPanel.jsx  # Drawing properties sidebar
│   │   │   ├── RequireAuth.jsx  # Protected route wrapper
│   │   │   ├── ShareModal.jsx   # Collaboration modal
│   │   │   ├── Toolbar.jsx      # Drawing tools sidebar
│   │   │   ├── UserCursor.jsx   # Live cursor component
│   │   │   └── Whiteboard.jsx   # Main canvas component
│   │   ├── context/             # React Context providers
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── pages/               # Route pages
│   │   │   ├── Dashboard.jsx    # Board listing page
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── WhiteBoardPage.jsx  # Main drawing interface
│   │   ├── shapes/              # Konva shape components
│   │   │   ├── ArrowComponent.jsx
│   │   │   ├── EllipseComponent.jsx
│   │   │   ├── LineComponent.jsx
│   │   │   ├── RectComponent.jsx
│   │   │   └── TextComponent.jsx
│   │   ├── utils/               # Utility functions
│   │   │   ├── conf.js          # Environment config
│   │   │   ├── shapeLogic.js    # Shape update strategies
│   │   │   ├── socket.js        # Socket.IO client setup
│   │   │   ├── throttle.js      # Performance utility
│   │   │   └── useHistory.js    # Undo/redo hook
│   │   ├── App.jsx              # Root component
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # React entry point
│   ├── .env.example             # Environment template
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json              # Vercel deployment config
│
├── server/                      # Backend Node.js application
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.js   # OAuth logic
│   │   ├── user.controller.js   # User CRUD & auth
│   │   └── whiteboard.controller.js  # Board operations
│   ├── middlewares/             # Express middlewares
│   │   └── verifyJwt.js         # JWT authentication
│   ├── models/                  # Mongoose schemas
│   │   ├── user.model.js        # User schema
│   │   └── whiteboard.model.js  # Board schema
│   ├── routes/                  # API route definitions
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   └── whiteboard.route.js
│   ├── utils/                   # Helper functions
│   │   ├── asyncHandler.js      # Error wrapper
│   │   ├── cookieOption.js      # Cookie config
│   │   └── generateRefreshAndAccessToken.js
│   ├── .env.example             # Environment template
│   ├── db.js                    # MongoDB connection
│   ├── index.js                 # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

##  API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "username": "username",
  "email": "you@example.com",
  "password": "SecurePass123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "username": "username",
    "email": "you@example.com"
  }
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "usernameOrEmail": "you@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "user": { ... }
}
```

#### Google OAuth
```http
POST /auth/google
Content-Type: application/json

{
  "token": "google_access_token_here"
}

Response: 200 OK
{
  "success": true,
  "message": "User logged in successfully",
  "user": { ... }
}
```

#### Refresh Token
```http
POST /users/refresh-token
Cookie: refreshToken=...

Response: 200 OK
{
  "success": true,
  "accessToken": "new_access_token",
  "message": "Access token refreshed"
}
```

#### Get Current User
```http
GET /users/current-user
Cookie: accessToken=...

Response: 200 OK
{
  "success": true,
  "message": "User fetched successfully",
  "user": { ... }
}
```

#### Logout
```http
POST /users/logout
Cookie: accessToken=...

Response: 200 OK
{
  "success": true,
  "message": "User logged out successfully"
}
```

### Whiteboard Endpoints

#### Create Board
```http
POST /whiteboards
Cookie: accessToken=...
Content-Type: application/json

{
  "title": "My Design Board"
}

Response: 201 Created
{
  "success": true,
  "message": "Whiteboard created successfully",
  "whiteboard": { ... }
}
```

#### Get All Boards
```http
GET /whiteboards
Cookie: accessToken=...

Response: 200 OK
{
  "success": true,
  "message": "Whiteboards fetched successfully",
  "whiteboards": [ ... ]
}
```

#### Get Single Board
```http
GET /whiteboards/:id
Cookie: accessToken=...

Response: 200 OK
{
  "success": true,
  "message": "Whiteboard fetched successfully",
  "whiteboard": {
    "_id": "...",
    "title": "My Board",
    "owner": { ... },
    "collaborators": [ ... ],
    "elements": [ ... ]
  }
}
```

#### Update Board
```http
PUT /whiteboards/:id
Cookie: accessToken=...
Content-Type: application/json

{
  "title": "Updated Title",
  "elements": [ ... ],
  "addCollaboratorEmail": "friend@example.com",
  "removeCollaboratorId": "user_id"
}

Response: 200 OK
{
  "success": true,
  "message": "Whiteboard updated successfully",
  "whiteboard": { ... }
}
```

#### Delete Board
```http
DELETE /whiteboards/:id
Cookie: accessToken=...

Response: 200 OK
{
  "success": true,
  "message": "Whiteboard deleted successfully"
}
```

---

## 🔌 Socket Events

### Client → Server

#### Join Room
```javascript
socket.emit('join_room', boardId);
```

#### Draw Stroke (Finalized Shape)
```javascript
socket.emit('draw_stroke', {
  boardId: 'board_id',
  shape: {
    id: 'uuid',
    tool: 'rect',
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    stroke: '#000000',
    strokeWidth: 3
  }
});
```

#### Drawing Move (Live Preview)
```javascript
socket.emit('drawing_move', {
  boardId: 'board_id',
  shape: { ... } // Same structure as draw_stroke
});
```

#### Cursor Move
```javascript
socket.emit('cursor_move', {
  boardId: 'board_id',
  userId: 'user_id',
  username: 'John',
  x: 250,
  y: 150
});
```

### Server → Client

#### Receive Stroke
```javascript
socket.on('receive_stroke', (shape) => {
  // Add finalized shape to canvas
});
```

#### Drawing Move
```javascript
socket.on('drawing_move', (shape) => {
  // Show live preview of other user's drawing
});
```

#### Cursor Move
```javascript
socket.on('cursor_move', (data) => {
  // Update cursor position for userId
});
```

---

## Deployment

### Frontend (Vercel - Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd client
vercel
```

3. **Environment Variables**: Add in Vercel dashboard
   - `VITE_API_URL`
   - `VITE_SOCKET_URL`
   - `VITE_GOOGLE_CLIENT_ID`

4. **Configure Routing**: Already set up in `vercel.json`

### Backend (Railway / Render / Heroku)

#### Railway Example:

1. Create account at [Railway.app](https://railway.app/)
2. Click **New Project** → **Deploy from GitHub**
3. Select repository
4. Set **Root Directory**: `/server`
5. Add environment variables in Railway dashboard
6. Deploy automatically on push

#### Important Production Settings:

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Database (MongoDB Atlas)

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist Railway/Render IP (or use `0.0.0.0/0` for all IPs)
4. Copy connection string to `MONGODB_URL`

---

##  Troubleshooting

### Common Issues

#### 1. CORS Errors
**Symptom**: `Access-Control-Allow-Origin` errors in browser console

**Solution**:
- Check `FRONTEND_URL` in backend `.env` matches frontend URL
- Verify CORS middleware in `server/index.js` includes your domain

#### 2. WebSocket Connection Failed
**Symptom**: Real-time features not working

**Solution**:
```javascript
// Check Socket.IO URL in client/src/utils/socket.js
const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

// Ensure backend Socket.IO CORS includes frontend URL
```

#### 3. Token Refresh Loop
**Symptom**: Constant 401 errors after login

**Solution**:
- Clear cookies in browser dev tools
- Check `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` match in backend
- Verify token expiry times in `server/models/user.model.js`

#### 4. MongoDB Connection Error
**Symptom**: `MongoServerError: Authentication failed`

**Solution**:
- Verify `MONGODB_URL` format: `mongodb+srv://user:pass@cluster.net/dbname`
- Check database user has read/write permissions
- Whitelist your IP in MongoDB Atlas

#### 5. Google OAuth Not Working
**Symptom**: OAuth popup closes immediately

**Solution**:
- Verify `GOOGLE_CLIENT_ID` matches in both `.env` files
- Check authorized redirect URIs in Google Console
- Ensure `http://localhost:5173` is added for development

---

## Testing

### Manual Testing Checklist

- [ ] User can register with email/password
- [ ] User can login with Google OAuth
- [ ] User can create a new board
- [ ] Drawing tools (rect, line, text) work correctly
- [ ] Undo/Redo functions properly
- [ ] User can share board with collaborator email
- [ ] Real-time drawing updates appear for other users
- [ ] User can export board as PNG
- [ ] Guest mode allows anonymous drawing
- [ ] Session persists after page refresh

### Automated Testing (TODO)

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Code Style Guidelines

- Use **ESLint** configuration provided
- Follow **React Hooks** best practices
- Write **descriptive commit messages**
- Add **comments** for complex logic

---

## License

This project is licensed under the **ISC License**.

---

## Author

**Yash Pandey**

- GitHub: [@yash-01907](https://github.com/yash-01907)
- Email: yashpandey1907@gmail.com

---

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/yash-01907/collaborative-whiteboard/issues)
3. Create a [new issue](https://github.com/yash-01907/collaborative-whiteboard/issues/new) with detailed description

---

## Future Roadmap

- [ ] TypeScript migration
- [ ] Mobile responsive design
- [ ] Keyboard shortcuts (Ctrl+Z, Delete, etc.)
- [ ] Layer management (bring forward/backward)
- [ ] Export to SVG/PDF
- [ ] Version history & restore points
- [ ] Image upload to canvas
- [ ] Shape templates library
- [ ] Dark mode
- [ ] Performance optimizations (virtualization)

---

**⭐ If you found this project helpful, please consider giving it a star!**