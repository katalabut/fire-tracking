# Implementation Tasks

## 1. Project Setup
- [x] 1.1 Create Docker Compose file for PostgreSQL 15 with PostGIS 3.4
- [x] 1.2 Create .env.example files for backend and frontend
- [x] 1.3 Initialize Go module in `/backend` directory
- [x] 1.4 Install fast-app, chi, and PostgreSQL driver (pgx)
- [x] 1.5 Initialize Next.js project in `/frontend` directory with TypeScript
- [x] 1.6 Set up Tailwind CSS and shadcn/ui

## 2. Database Setup
- [x] 2.1 Start PostgreSQL with Docker Compose
- [x] 2.2 Create database migration files structure
- [x] 2.3 Implement 001_create_users.sql migration
- [x] 2.4 Implement 002_create_fires.sql with PostGIS GEOGRAPHY type
- [x] 2.5 Implement 003_create_comments.sql
- [x] 2.6 Implement 004_create_sessions.sql
- [x] 2.7 Add spatial index on fires.location
- [x] 2.8 Create migration runner in backend using golang-migrate or custom solution

## 3. Backend - Core Infrastructure
- [x] 3.1 Set up fast-app application with logger and config
- [x] 3.2 Configure chi router with CORS middleware
- [x] 3.3 Implement database connection pool
- [x] 3.4 Create repository interfaces (users, fires, comments)
- [x] 3.5 Implement health check endpoints
- [x] 3.6 Add request logging middleware

## 4. Backend - Models and Repository
- [x] 4.1 Define User, Fire, Comment, Session models
- [x] 4.2 Implement users repository with CRUD operations
- [x] 4.3 Implement fires repository with PostGIS queries
- [x] 4.4 Implement comments repository
- [x] 4.5 Implement sessions repository with expiry logic

## 5. Backend - Authentication
- [x] 5.1 Implement POST /api/auth/login handler
- [x] 5.2 Implement GET /api/auth/me handler
- [x] 5.3 Implement POST /api/auth/logout handler
- [x] 5.4 Create auth middleware to extract user from session token
- [x] 5.5 Create role-checking middleware for firefighter endpoints

## 6. Backend - Fires API
- [x] 6.1 Implement GET /api/fires (list all fires)
- [x] 6.2 Implement POST /api/fires (create fire report)
- [x] 6.3 Implement GET /api/fires/:id (get fire details)
- [x] 6.4 Implement PATCH /api/fires/:id/status (update status)
- [x] 6.5 Add query parameter filtering (status, limit, offset)
- [x] 6.6 Add validation for latitude/longitude ranges

## 7. Backend - Comments API
- [x] 7.1 Implement GET /api/fires/:id/comments (list comments)
- [x] 7.2 Implement POST /api/fires/:id/comments (create comment)
- [x] 7.3 Add comment validation (min/max length)

## 8. Frontend - Project Setup
- [x] 8.1 Install and configure shadcn/ui components (Button, Card, Input, Textarea, Dialog)
- [x] 8.2 Install Mapbox dependencies (mapbox-gl, react-map-gl)
- [x] 8.3 Set up API client with fetch wrapper
- [x] 8.4 Create TypeScript types matching backend models
- [x] 8.5 Set up React Context for auth state

## 9. Frontend - Authentication
- [x] 9.1 Create login page with name input and role selector
- [x] 9.2 Implement useAuth hook for auth state management
- [x] 9.3 Store session token in localStorage
- [x] 9.4 Add protected route wrapper
- [x] 9.5 Create header with user info and logout button

## 10. Frontend - Map Integration
- [x] 10.1 Create FireMap component with Mapbox GL JS
- [x] 10.2 Fetch and display fire markers on map
- [x] 10.3 Implement custom marker styling (colors based on status)
- [x] 10.4 Add marker click handler to show fire details
- [x] 10.5 Center map on Cyprus (34.9, 33.3)
- [x] 10.6 Add location picker for creating new fires

## 11. Frontend - Fire Reporting
- [x] 11.1 Create FireForm component with description textarea
- [x] 11.2 Implement click-on-map to select location
- [x] 11.3 Show selected location marker
- [x] 11.4 Submit fire report to backend API
- [x] 11.5 Add form validation
- [x] 11.6 Show success/error messages

## 12. Frontend - Fire Details
- [x] 12.1 Create FireDetail component showing fire info
- [x] 12.2 Display fire location, description, reporter, status
- [x] 12.3 Show comments list
- [x] 12.4 Add comment form (auth required)
- [x] 12.5 Implement status update buttons (firefighters only)
- [x] 12.6 Add loading and error states

## 13. Frontend - Fire List View
- [x] 13.1 Create FireList component showing all fires
- [x] 13.2 Add filtering by status (all/reported/seen/closed)
- [x] 13.3 Show fire cards with key info
- [x] 13.4 Make fire cards clickable to show details
- [x] 13.5 Add pagination controls

## 14. Frontend - Layout and Navigation
- [x] 14.1 Create root layout with header
- [x] 14.2 Add navigation (Map view, List view)
- [x] 14.3 Show current user info in header
- [x] 14.4 Add logout button
- [x] 14.5 Style with Tailwind for responsive design

## 15. Polish and Testing
- [x] 15.1 Add loading spinners for async operations
- [x] 15.2 Implement error boundaries
- [x] 15.3 Add toast notifications for actions
- [x] 15.4 Test all user flows manually
- [x] 15.5 Test firefighter flows manually
- [x] 15.6 Verify responsive design on mobile
- [x] 15.7 Add README with setup instructions

## 16. Deployment Preparation
- [x] 16.1 Create Dockerfile for backend
- [x] 16.2 Create Dockerfile for frontend
- [x] 16.3 Update docker-compose.yml for full stack
- [x] 16.4 Document environment variables
- [x] 16.5 Create deployment guide
