# Implementation Tasks

## 1. Project Setup
- [ ] 1.1 Create Docker Compose file for PostgreSQL 15 with PostGIS 3.4
- [ ] 1.2 Create .env.example files for backend and frontend
- [ ] 1.3 Initialize Go module in `/backend` directory
- [ ] 1.4 Install fast-app, chi, and PostgreSQL driver (pgx)
- [ ] 1.5 Initialize Next.js project in `/frontend` directory with TypeScript
- [ ] 1.6 Set up Tailwind CSS and shadcn/ui

## 2. Database Setup
- [ ] 2.1 Start PostgreSQL with Docker Compose
- [ ] 2.2 Create database migration files structure
- [ ] 2.3 Implement 001_create_users.sql migration
- [ ] 2.4 Implement 002_create_fires.sql with PostGIS GEOGRAPHY type
- [ ] 2.5 Implement 003_create_comments.sql
- [ ] 2.6 Implement 004_create_sessions.sql
- [ ] 2.7 Add spatial index on fires.location
- [ ] 2.8 Create migration runner in backend using golang-migrate or custom solution

## 3. Backend - Core Infrastructure
- [ ] 3.1 Set up fast-app application with logger and config
- [ ] 3.2 Configure chi router with CORS middleware
- [ ] 3.3 Implement database connection pool
- [ ] 3.4 Create repository interfaces (users, fires, comments)
- [ ] 3.5 Implement health check endpoints
- [ ] 3.6 Add request logging middleware

## 4. Backend - Models and Repository
- [ ] 4.1 Define User, Fire, Comment, Session models
- [ ] 4.2 Implement users repository with CRUD operations
- [ ] 4.3 Implement fires repository with PostGIS queries
- [ ] 4.4 Implement comments repository
- [ ] 4.5 Implement sessions repository with expiry logic

## 5. Backend - Authentication
- [ ] 5.1 Implement POST /api/auth/login handler
- [ ] 5.2 Implement GET /api/auth/me handler
- [ ] 5.3 Implement POST /api/auth/logout handler
- [ ] 5.4 Create auth middleware to extract user from session token
- [ ] 5.5 Create role-checking middleware for firefighter endpoints

## 6. Backend - Fires API
- [ ] 6.1 Implement GET /api/fires (list all fires)
- [ ] 6.2 Implement POST /api/fires (create fire report)
- [ ] 6.3 Implement GET /api/fires/:id (get fire details)
- [ ] 6.4 Implement PATCH /api/fires/:id/status (update status)
- [ ] 6.5 Add query parameter filtering (status, limit, offset)
- [ ] 6.6 Add validation for latitude/longitude ranges

## 7. Backend - Comments API
- [ ] 7.1 Implement GET /api/fires/:id/comments (list comments)
- [ ] 7.2 Implement POST /api/fires/:id/comments (create comment)
- [ ] 7.3 Add comment validation (min/max length)

## 8. Frontend - Project Setup
- [ ] 8.1 Install and configure shadcn/ui components (Button, Card, Input, Textarea, Dialog)
- [ ] 8.2 Install Mapbox dependencies (mapbox-gl, react-map-gl)
- [ ] 8.3 Set up API client with fetch wrapper
- [ ] 8.4 Create TypeScript types matching backend models
- [ ] 8.5 Set up React Context for auth state

## 9. Frontend - Authentication
- [ ] 9.1 Create login page with name input and role selector
- [ ] 9.2 Implement useAuth hook for auth state management
- [ ] 9.3 Store session token in localStorage
- [ ] 9.4 Add protected route wrapper
- [ ] 9.5 Create header with user info and logout button

## 10. Frontend - Map Integration
- [ ] 10.1 Create FireMap component with Mapbox GL JS
- [ ] 10.2 Fetch and display fire markers on map
- [ ] 10.3 Implement custom marker styling (colors based on status)
- [ ] 10.4 Add marker click handler to show fire details
- [ ] 10.5 Center map on Cyprus (34.9, 33.3)
- [ ] 10.6 Add location picker for creating new fires

## 11. Frontend - Fire Reporting
- [ ] 11.1 Create FireForm component with description textarea
- [ ] 11.2 Implement click-on-map to select location
- [ ] 11.3 Show selected location marker
- [ ] 11.4 Submit fire report to backend API
- [ ] 11.5 Add form validation
- [ ] 11.6 Show success/error messages

## 12. Frontend - Fire Details
- [ ] 12.1 Create FireDetail component showing fire info
- [ ] 12.2 Display fire location, description, reporter, status
- [ ] 12.3 Show comments list
- [ ] 12.4 Add comment form (auth required)
- [ ] 12.5 Implement status update buttons (firefighters only)
- [ ] 12.6 Add loading and error states

## 13. Frontend - Fire List View
- [ ] 13.1 Create FireList component showing all fires
- [ ] 13.2 Add filtering by status (all/reported/seen/closed)
- [ ] 13.3 Show fire cards with key info
- [ ] 13.4 Make fire cards clickable to show details
- [ ] 13.5 Add pagination controls

## 14. Frontend - Layout and Navigation
- [ ] 14.1 Create root layout with header
- [ ] 14.2 Add navigation (Map view, List view)
- [ ] 14.3 Show current user info in header
- [ ] 14.4 Add logout button
- [ ] 14.5 Style with Tailwind for responsive design

## 15. Polish and Testing
- [ ] 15.1 Add loading spinners for async operations
- [ ] 15.2 Implement error boundaries
- [ ] 15.3 Add toast notifications for actions
- [ ] 15.4 Test all user flows manually
- [ ] 15.5 Test firefighter flows manually
- [ ] 15.6 Verify responsive design on mobile
- [ ] 15.7 Add README with setup instructions

## 16. Deployment Preparation
- [ ] 16.1 Create Dockerfile for backend
- [ ] 16.2 Create Dockerfile for frontend
- [ ] 16.3 Update docker-compose.yml for full stack
- [ ] 16.4 Document environment variables
- [ ] 16.5 Create deployment guide
