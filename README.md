# 🎒 Campus Lost & Found System

**Module:** IT2234 – Web Services and Technology
**Assignment:** ICA-03 Final Project
**Level:** 2nd Year IT

---

## Project Title

**Campus Lost & Found System** — A smart, full-stack web application to report, track, and recover lost items on a university campus.

---

## Problem Description

Every semester, hundreds of items are lost across university campuses — in labs, libraries, canteens, and lecture halls. Students and staff currently have no organized digital system to report or track these items. They rely on WhatsApp groups or physical notice boards, which are:

- Easily missed and unstructured
- Unable to verify ownership before returning an item
- Not searchable or filterable
- Temporary and not archived

This results in lost items going unclaimed and eventually being discarded, causing unnecessary loss to students.

---

## Proposed Solution

A full-stack web application that provides a centralized portal for reporting lost and found items on campus. The system connects item reporters with finders through a structured claims verification workflow, ensuring items are returned to their rightful owners safely.

**Target Users:**
- University Students
- Academic and Administrative Staff
- Campus Security Personnel

---

## Features

- Report lost or found items with title, description, category, location, date, and contact details
- Browse and search all active item reports
- Filter items by type (lost/found), category, and keyword search
- Submit ownership claims with proof description
- Admin dashboard to approve or reject claims (auto-resolves item on approval)
- Live stats dashboard showing total lost, found, and resolved items
- View count tracking per item
- Pagination support for large item lists
- Full input validation with meaningful error messages
- Global error handling middleware

---

## Technologies Used

| Layer | Technology |
|-------|-----------|
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| API Testing | Postman |
| Frontend (Bonus) | React.js |
| HTTP Client | Axios |
| Routing (React) | React Router v6 |
| Version Control | Git & GitHub |

---

## API Endpoints (with Examples)

Base URL: `http://localhost:8000/api`

---

### Items — `/api/items`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items (supports filters) |
| GET | `/api/items/stats` | Get dashboard statistics |
| GET | `/api/items/:id` | Get single item by ID |
| POST | `/api/items` | Report a new lost or found item |
| PUT | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |

**Query Parameters for GET /api/items:**
```
?type=lost          → filter by lost or found
?category=Electronics  → filter by category
?search=calculator  → full-text search
?page=1&limit=10    → pagination
```

**Example — POST /api/items (Report a lost item):**

Request Body:
```json
{
  "title": "Blue Casio FX-991ES Calculator",
  "description": "Blue Casio scientific calculator with stickers on the back. Has my name written inside the case.",
  "category": "Electronics",
  "type": "lost",
  "location": "Main Library, 2nd Floor",
  "dateOccurred": "2024-11-20",
  "contactName": "Amara Perera",
  "contactEmail": "amara@student.edu.lk",
  "contactPhone": "+94 77 123 4567",
  "tags": ["blue", "casio", "calculator"]
}
```

Response:
```json
{
  "success": true,
  "message": "Item reported as lost successfully",
  "data": {
    "_id": "6749a1b2c3d4e5f678901234",
    "title": "Blue Casio FX-991ES Calculator",
    "type": "lost",
    "status": "active",
    "category": "Electronics",
    "location": "Main Library, 2nd Floor",
    "viewCount": 0,
    "createdAt": "2024-11-20T10:30:00.000Z"
  }
}
```

**Example — GET /api/items/stats:**

Response:
```json
{
  "success": true,
  "data": {
    "totalLost": 12,
    "totalFound": 8,
    "totalResolved": 5,
    "byCategory": [
      { "_id": "Electronics", "count": 7 },
      { "_id": "Keys", "count": 4 }
    ]
  }
}
```

---

### Claims — `/api/claims`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/claims` | Get all claims |
| GET | `/api/claims/:id` | Get single claim |
| POST | `/api/claims` | Submit a new claim |
| PATCH | `/api/claims/:id` | Approve or reject a claim |
| DELETE | `/api/claims/:id` | Delete a claim |

**Example — POST /api/claims (Submit a claim):**

Request Body:
```json
{
  "item": "6749a1b2c3d4e5f678901234",
  "claimerName": "Nimal Silva",
  "claimerEmail": "nimal@student.edu.lk",
  "claimerPhone": "+94 76 987 6543",
  "proofDescription": "It has my student ID number written in marker on the back. Also has a Physics 2023 sticker."
}
```

Response:
```json
{
  "success": true,
  "message": "Claim submitted successfully. The reporter will contact you.",
  "data": {
    "_id": "6749b2c3d4e5f67890123456",
    "status": "pending",
    "createdAt": "2024-11-21T09:00:00.000Z"
  }
}
```

**Example — PATCH /api/claims/:id (Approve a claim):**

Request Body:
```json
{
  "status": "approved",
  "adminNote": "Proof verified. Item returned to owner on 22/11/2024."
}
```

---

### Users — `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get single user |
| POST | `/api/users` | Register a new user |
| PUT | `/api/users/:id` | Update user details |
| DELETE | `/api/users/:id` | Deactivate a user |

**Example — POST /api/users (Register a user):**

Request Body:
```json
{
  "name": "Amara Perera",
  "email": "amara@student.edu.lk",
  "studentId": "IT/2022/043",
  "phone": "+94 77 123 4567",
  "role": "student"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "6749c3d4e5f6789012345678",
    "name": "Amara Perera",
    "email": "amara@student.edu.lk",
    "role": "student",
    "isActive": true
  }
}
```

---

## Setup Instructions

### Prerequisites

Make sure the following are installed on your machine:

- **Node.js** v18 or higher — https://nodejs.org
- **MongoDB** (local) or a **MongoDB Atlas** account (free) — https://mongodb.com
- **Postman** (for API testing) — https://postman.com
- **Git** — https://git-scm.com

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/campus-lost-found.git
cd campus-lost-found
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open the `.env` file and configure:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/campus_lost_found
NODE_ENV=development
```

If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus_lost_found
```

---

### 3. Frontend Setup (Optional Bonus)

```bash
cd ../frontend
npm install
```

---

## How to Run the Project

### Step 1 — Start MongoDB

**Mac:**
```bash
brew services start mongodb-community@6.0
```

**Windows (Admin CMD):**
```cmd
net start MongoDB
```

**Using Atlas:** No action needed — it's cloud-hosted.

---

### Step 2 — Start the Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:8000
```

---

### Step 3 — Test with Postman

1. Open Postman
2. Click **Import** → select `postman-collection.json`
3. Set the `base_url` variable to `http://localhost:8000/api`
4. Start with **GET /api/health** to confirm the server is alive
5. Test all CRUD operations for Items, Claims, and Users

---

### Step 4 — Start the Frontend (Optional Bonus)

Open a **second terminal**:

```bash
cd frontend
npm start
```

The React app opens automatically at:
```
http://localhost:3000
```

---

### Project Folder Structure

```
campus-lost-found/
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── package.json
│   ├── models/
│   │   ├── Item.js
│   │   ├── Claim.js
│   │   └── User.js
│   ├── controllers/
│   │   ├── itemController.js
│   │   ├── claimController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── itemRoutes.js
│   │   ├── claimRoutes.js
│   │   └── userRoutes.js
│   └── middleware/
│       └── errorHandler.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── api.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Items.js
│       │   ├── ItemDetail.js
│       │   ├── ReportItem.js
│       │   └── Claims.js
│       └── components/
│           └── ItemCard.js
├── postman-collection.json
└── README.md
```

---

## Database Collections

| Collection | Purpose |
|------------|---------|
| `items` | All lost and found item reports |
| `claims` | Ownership claims submitted by users |
| `users` | Registered students and staff |

---

*Built for IT2234 Web Services and Technology — ICA-03 Final Project*
