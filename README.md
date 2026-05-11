# Explorapedia 🌍✈️

Explorapedia is an all-in-one travel planning web application that helps travelers discover attractions, organize itineraries, and share travel plans with others. The platform combines destination discovery, itinerary creation, and social trip sharing into one streamlined application.

---

## Project Goals

Travel planning is often fragmented across multiple platforms. Explorapedia aims to simplify the process by providing a single place where users can:

- Discover attractions in a city
- Create and organize trip itineraries
- Share travel plans with other users
- Explore trips created by other travelers

---

## Core Features

### User Authentication
- User registration and login
- Secure password hashing
- JWT-based authentication
- User profile page

### City Exploration
- Search for cities
- Display attractions in that city
- View attraction information
- Add attractions to trip itinerary

### Trip Planner
- Create trips
- Organize trips by day
- Add attractions to itinerary
- Add notes and times to itinerary items
- Reorder itinerary items

### Social Features
- Share trips publicly
- Trip visibility options:
  - Private
  - Friends
  - Public
- Browse trips created by other users

---

## Technology Stack

### Frontend
- React
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express
- MongoDB native driver
- dotenv
- Axios for external API calls

### Authentication
- JSON Web Tokens (JWT)
- bcrypt

### External APIs
- Foursquare API

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Team Members

### Sadia Shaikh (Frontend)
- Website layout
- Navigation bar
- Home page
- Explore page
- UI styling

### Amaya Mangul (Frontend)
- Trip planner interface
- Itinerary editor
- Profile page
- Display shared trips
- API integration

### Dhitri (Backend)
- Authentication system
- Login/register API
- Password security
- User database schema

### Harwin He (Backend)
- Trip and itinerary API
- Trip database models
- Attractions API integration
- Trip sharing functionality

---

## Setup Instructions

### Prerequisites
- Node.js 18 or newer
- npm
- A MongoDB Atlas cluster or other MongoDB instance
- A Foursquare API key for attraction search

### 1. Clone the repository
```bash
git clone https://github.com/your-username/explorapedia.git
cd explorapedia
```

### 2. Install frontend dependencies
```bash
cd frontend
npm install
```

### 3. Install backend dependencies
```bash
cd ../backend
npm install
```

### 4. Create backend environment variables
Copy `backend/.env.example` to `backend/.env` and fill in your values.

Example:
```bash
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net
MONGODB_DB_NAME=explorapedia
FOURSQUARE_API_KEY=your_foursquare_api_key
PORT=3001
```

### 5. Run the frontend
```bash
cd ../frontend
npm run dev
```

### 6. Run the backend
```bash
cd ../backend
npm run dev
```

### 7. Verify the backend
- Health check: `http://localhost:3001/health`
- Auth test route: `http://localhost:3001/api/auth/test`
- Attractions route: `http://localhost:3001/api/attractions/<city>`

Example:
```bash
http://localhost:3001/api/attractions/london
```

## Trips API & Itinerary Logic

The backend exposes comprehensive endpoints to create and manage trips with day-based itineraries and trip sharing.

### Trip Management (Protected - requires JWT token)

Base path: `/api/trips`

**Create a trip** (with optional dates)
```bash
curl -X POST http://localhost:3001/api/trips \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tokyo Summer 2026",
    "city": "Tokyo",
    "startDate": "2026-06-01",
    "endDate": "2026-06-07"
  }'
```

**List my trips**
```bash
curl http://localhost:3001/api/trips -H "Authorization: Bearer $TOKEN"
```

**Get a specific trip**
```bash
curl http://localhost:3001/api/trips/:id -H "Authorization: Bearer $TOKEN"
```

### Itinerary Management (Protected)

Organize attractions by day with time and notes.

**Add item to itinerary for a specific day**
```bash
curl -X POST http://localhost:3001/api/trips/:id/itinerary/:day \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fsq_id": "<FOURSQUARE_PLACE_ID>", "time": "14:00", "notes": "Book tickets in advance"}'
```

**Edit itinerary item** (update time/notes)
```bash
curl -X PUT http://localhost:3001/api/trips/:id/itinerary/:day/:itemId \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"time": "15:00", "notes": "Updated notes"}'
```

**Remove itinerary item**
```bash
curl -X DELETE http://localhost:3001/api/trips/:id/itinerary/:day/:itemId \
  -H "Authorization: Bearer $TOKEN"
```

### Trip Sharing (Protected)

**Update trip visibility** (private, friends, or public)
```bash
curl -X PUT http://localhost:3001/api/trips/:id/visibility \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"visibility": "public"}'
```

**Delete a trip**
```bash
curl -X DELETE http://localhost:3001/api/trips/:id -H "Authorization: Bearer $TOKEN"
```

### Browse Public Trips (No auth required)

**Get public trips feed**
```bash
curl http://localhost:3001/api/trips/shared/feed?limit=20&skip=0
```

**Get a public trip**
```bash
curl http://localhost:3001/api/trips/shared/:id
```

### Frontend Pages

- **Trips** (`/trips`) — Create, list, and manage your private trips
- **TripDetail** (`/trips/:id`) — View/edit trip itinerary with day-based organization, visibility settings, and item notes/times
- **SharedTrips** (`/shared-trips`) — Browse public trips shared by other users
- **SharedTripDetail** (`/shared-trips/:id`) — View public trip details and itinerary

### API Helpers (`frontend/src/api/trips.js`)

Functions for trips CRUD, itinerary management, visibility control, and public trips browsing:

To run the full app locally:
```bash
# backend
cd backend
cp .env.example .env
# fill values in .env (MONGODB_URI, FOURSQUARE_API_KEY, JWT_SECRET)
npm install
npm run dev

# frontend
cd ../frontend
npm install
npm run dev
```

### Notes for the team
- The backend currently uses CommonJS modules, the native MongoDB driver, and a Foursquare attraction search route.
- If you pull a branch that adds Mongoose or switches to ES modules, make sure the README and `package.json` stay aligned with that branch’s stack.
- Each developer can work on their own area after installing dependencies and setting up the `.env` file.