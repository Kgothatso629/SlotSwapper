# SlotSwapper
Peer-to-peer time-slot swapping application with React frontend and Node.js/MongoDB backend.
# SlotSwapper

## Overview
SlotSwapper is a peer-to-peer time-slot swapping application. Users can mark busy slots as swappable, view other users' swappable slots, and request swaps.

## Features
- User Authentication (JWT)
- Calendar management (BUSY, SWAPPABLE, SWAP_PENDING)
- Swappable slots marketplace
- Swap request system (Accept/Reject)
- Frontend React interface

## Setup Instructions

### Backend
1. Go to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` based on `.env.example` and set `MONGO_URI`
4. Start server: `npm start` (Port 5000)

### Frontend
1. Go to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start frontend: `npm start` (Port 3000)

### API Endpoints
- `POST /api/users/signup` – Sign up
- `POST /api/users/login` – Login
- `GET /api/events` – Get my events
- `POST /api/events` – Create event
- `PATCH /api/events/:id` – Update event status
- `GET /api/swaps/swappable-slots` – Get swappable slots
- `POST /api/swaps/swap-request` – Send swap request
- `POST /api/swaps/swap-response/:id` – Accept/Reject swap

# SlotSwapper
## Setup Instructions (Local)

### Backend
1. Go to backend folder: `cd backend`
2. Install dependencies:  
   ```bash
   npm install
