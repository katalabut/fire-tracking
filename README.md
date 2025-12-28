# Cyprus Fire Tracker

A web application for reporting and tracking fires in Cyprus, built with Go backend and Next.js frontend.

## Features

- Simple name-based authentication with user/firefighter roles
- Interactive map interface using Mapbox GL JS
- Fire reporting with location selection on map
- Real-time fire status tracking (reported, seen, closed)
- Commenting system for collaborative discussion
- Firefighter management tools
- Mobile-responsive design

## Tech Stack

### Backend
- Go with chi router and fast-app framework
- PostgreSQL 15 with PostGIS 3.4
- pgx driver for PostgreSQL

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Mapbox GL JS / react-map-gl

## Prerequisites

- Docker and Docker Compose (for PostgreSQL)
- Go 1.21+ (for backend)
- Node.js 18+ (for frontend)
- Mapbox API key (free tier available at https://www.mapbox.com/)

## Setup Instructions

### 1. Start PostgreSQL with PostGIS

```bash
docker-compose up -d
```

This will start PostgreSQL 15 with PostGIS 3.4 on port 5432.

### 2. Backend Setup

```bash
cd backend

# Copy environment variables
cp .env.example .env

# Edit .env if needed (default values should work for local development)

# Install dependencies
go mod download

# Run the server (migrations will run automatically)
go run cmd/server/main.go
```

The backend will start on port 8080.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local and add your Mapbox token
# NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# Run the development server
npm run dev
```

The frontend will start on port 3000.

### 4. Access the Application

Open http://localhost:3000 in your browser.

## Usage

### First Time Login
1. Click "Login" in the header
2. Enter your name
3. Select your role (Regular User or Firefighter)
4. Click "Sign in"

### Reporting a Fire (Any User)
1. Click the "+ Report Fire" button on the map page
2. Click on the map to select the fire location
3. Enter a description
4. Click "Report Fire"

### Managing Fires (Firefighters Only)
1. Navigate to a fire detail page
2. Use "Mark as Seen" or "Mark as Closed" buttons
3. Add comments to communicate with other firefighters

### Viewing Fires
- **Map View** (homepage): See all fires on an interactive map
- **List View** (/fires): Browse fires in a list, filter by status

## API Endpoints

### Authentication
- `POST /api/auth/login` - Create session
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Delete session

### Fires
- `GET /api/fires` - List all fires (with optional status filter)
- `POST /api/fires` - Create fire report (auth required)
- `GET /api/fires/:id` - Get fire details
- `PATCH /api/fires/:id/status` - Update fire status (firefighter only)

### Comments
- `GET /api/fires/:id/comments` - Get comments for fire
- `POST /api/fires/:id/comments` - Add comment (auth required)

## Database Schema

### Users
- `id`: Primary key
- `name`: User name
- `role`: 'user' or 'firefighter'
- `created_at`: Timestamp

### Fires
- `id`: Primary key
- `reporter_id`: Foreign key to users
- `location`: PostGIS GEOGRAPHY(POINT)
- `description`: Fire description
- `status`: 'reported', 'seen', or 'closed'
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Comments
- `id`: Primary key
- `fire_id`: Foreign key to fires
- `user_id`: Foreign key to users
- `text`: Comment text
- `created_at`: Timestamp

### Sessions
- `id`: UUID primary key
- `user_id`: Foreign key to users
- `created_at`: Timestamp
- `expires_at`: Timestamp

## Development Notes

### Authentication
This system uses a simple name-based authentication without passwords. This is designed for quick MVP deployment in emergency situations. For production use, consider implementing proper authentication with passwords or OAuth.

### Real-time Updates
The application does not currently have real-time push notifications. Users need to refresh or navigate to see new updates. Consider adding WebSocket or Server-Sent Events for production deployment.

### Mapbox API Limits
The free tier of Mapbox provides 50,000 map loads per month. Monitor usage and upgrade if necessary.

## License

MIT
