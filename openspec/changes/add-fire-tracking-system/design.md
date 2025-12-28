# Design: Fire Tracking System

## Context
This is a greenfield project to build a fire tracking system for Cyprus. The system needs to be simple, quick to implement, and reliable. Citizens should be able to report fires instantly without friction, and firefighters need clear visibility into all active incidents.

## Goals / Non-Goals

### Goals
- Simple, fast fire reporting with minimal user friction
- Real-time visibility of all fire incidents on an interactive map
- Role-based access (regular users vs firefighters)
- Collaborative commenting on fire incidents
- Firefighter workflow: mark fires as seen and closed
- Mobile-responsive interface
- Minimal infrastructure requirements

### Non-Goals
- Complex user registration with email verification
- Mobile native apps (web-only initially)
- Real-time push notifications
- Advanced analytics or historical reporting
- Integration with emergency services systems
- Multi-language support (can be added later)

## Decisions

### Architecture: Monorepo with Separate Frontend/Backend

**Decision**: Use a monorepo structure with `/backend` (Go) and `/frontend` (Next.js) directories.

**Rationale**: 
- Clear separation of concerns
- Independent deployment possible
- Shared OpenSpec documentation
- Easy local development

**Alternatives considered**:
- Separate repositories: More complex to manage, harder to keep specs in sync
- Integrated backend in Next.js API routes: Less suitable for Go's strengths with chi and fast-app

### Database: PostgreSQL with PostGIS

**Decision**: Use PostgreSQL with PostGIS extension for geospatial queries.

**Rationale**:
- Native support for geographic data types (POINT, POLYGON)
- Efficient spatial indexing with GiST indexes
- Ability to query fires within radius, bounding box, etc.
- Production-ready and well-supported
- User requested PostGIS specifically

**Alternatives considered**:
- SQLite with SpatiaLite: Simpler setup but limited scalability
- Store lat/lng as separate columns: Would require complex distance calculations in application code

### Authentication: Simple Name + Role Selection

**Decision**: Store user sessions with just name and role, no passwords.

**Rationale**:
- Fastest path to MVP
- Emergency situations require minimal friction
- Role selection on honor system acceptable for initial version
- Can add proper auth later if needed

**Security considerations**:
- Anyone can impersonate anyone else
- Acceptable trade-off for emergency reporting
- Should add password-based auth before production deployment if data integrity is critical

**Alternatives considered**:
- OAuth (Google/Facebook): Too complex for emergency use case
- Password-based: Adds registration friction

### Backend Framework: fast-app + chi

**Decision**: Use katalabut/fast-app framework with chi router.

**Rationale**:
- fast-app provides logger, config, health checks, graceful shutdown out of the box
- chi is lightweight, idiomatic, well-maintained
- Matches user's technology preference
- Minimal boilerplate

### Frontend: Next.js App Router + shadcn/ui

**Decision**: Next.js 14+ with App Router, shadcn/ui components, Tailwind CSS.

**Rationale**:
- App Router is the modern Next.js pattern
- shadcn/ui provides copy-paste components (no npm bloat)
- Tailwind for rapid styling
- Server components for better performance

### Mapping: Mapbox GL JS

**Decision**: Use Mapbox GL JS for interactive maps.

**Rationale**:
- User requested Mapbox
- Excellent performance and UX
- Good free tier (50k requests/month)
- React wrapper available (react-map-gl)

## Data Model

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'firefighter')),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Fires Table
```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE fires (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES users(id),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'seen', 'closed')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fires_location ON fires USING GIST(location);
CREATE INDEX idx_fires_status ON fires(status);
```

### Comments Table
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    fire_id INTEGER REFERENCES fires(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_fire_id ON comments(fire_id);
```

### Sessions Table (for simple auth)
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

## API Design

### Authentication
- `POST /api/auth/login` - Create session
  - Body: `{ name: string, role: "user" | "firefighter" }`
  - Returns: `{ token: string, user: User }`
- `GET /api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user: User }`
- `POST /api/auth/logout` - Delete session
  - Headers: `Authorization: Bearer <token>`

### Fires
- `GET /api/fires` - List all fires
  - Query params: `status=reported|seen|closed`, `limit=50`, `offset=0`
  - Returns: `{ fires: Fire[], total: number }`
- `POST /api/fires` - Create fire report (auth required)
  - Body: `{ latitude: number, longitude: number, description: string }`
  - Returns: `{ fire: Fire }`
- `GET /api/fires/:id` - Get fire details
  - Returns: `{ fire: Fire }`
- `PATCH /api/fires/:id/status` - Update fire status (firefighter only)
  - Body: `{ status: "seen" | "closed" }`
  - Returns: `{ fire: Fire }`

### Comments
- `GET /api/fires/:id/comments` - Get comments for fire
  - Returns: `{ comments: Comment[] }`
- `POST /api/fires/:id/comments` - Add comment (auth required)
  - Body: `{ text: string }`
  - Returns: `{ comment: Comment }`

## Frontend Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page with map
│   ├── login/
│   │   └── page.tsx         # Login page
│   └── api/
│       └── [...proxy]/      # Proxy to backend (optional)
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── map/
│   │   ├── fire-map.tsx     # Main map component
│   │   └── fire-marker.tsx  # Custom marker
│   ├── fires/
│   │   ├── fire-list.tsx
│   │   ├── fire-detail.tsx
│   │   └── fire-form.tsx
│   └── layout/
│       ├── header.tsx
│       └── nav.tsx
├── lib/
│   ├── api.ts               # API client
│   └── types.ts             # TypeScript types
└── hooks/
    ├── use-auth.ts
    └── use-fires.ts
```

## Backend Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go          # Entry point
├── internal/
│   ├── api/
│   │   ├── router.go        # chi router setup
│   │   ├── middleware/
│   │   │   └── auth.go
│   │   └── handlers/
│   │       ├── auth.go
│   │       ├── fires.go
│   │       └── comments.go
│   ├── models/
│   │   ├── user.go
│   │   ├── fire.go
│   │   └── comment.go
│   ├── repository/
│   │   ├── users.go
│   │   ├── fires.go
│   │   └── comments.go
│   └── config/
│       └── config.go
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_fires.sql
│   ├── 003_create_comments.sql
│   └── 004_create_sessions.sql
├── go.mod
└── go.sum
```

## Risks / Trade-offs

### Risk: No Real Authentication
**Impact**: Anyone can impersonate any user, including firefighters.
**Mitigation**: Document clearly that this is MVP-only. Add password-based auth before production use if data integrity matters.

### Risk: No Real-time Updates
**Impact**: Users need to refresh to see new fires or status changes.
**Mitigation**: Implement polling on frontend (every 30s). Can add WebSocket or SSE later if needed.

### Risk: Mapbox API Limits
**Impact**: Free tier limits to 50k requests/month. Could be exceeded with moderate usage.
**Mitigation**: Implement tile caching on frontend. Monitor usage. Plan to upgrade if needed.

### Risk: PostGIS Complexity
**Impact**: Requires PostgreSQL extension, slightly more complex than standard tables.
**Mitigation**: Provide clear setup instructions. Use Docker Compose for easy local development.

### Trade-off: Simple Auth vs Security
**Rationale**: For emergency fire reporting, speed of access is more important than authentication security. Users need to report fires immediately without account creation friction. This is acceptable for MVP but should be revisited before full production deployment.

### Trade-off: REST API vs GraphQL
**Rationale**: REST is simpler to implement and debug. GraphQL would be overkill for this relatively simple data model. chi router provides excellent REST support.

## Migration Plan

This is a new system, no migration needed.

Initial setup steps:
1. Run `docker-compose up -d` to start PostgreSQL with PostGIS
2. Run database migrations from backend
3. Set environment variables (DB connection, Mapbox API key)
4. Start backend with `go run cmd/server/main.go`
5. Start frontend with `npm run dev`

Docker Compose provides:
- PostgreSQL 15 with PostGIS 3.4 extension
- Database automatically initialized with PostGIS
- Persistent volume for data
- Port 5432 exposed for local development
- pgAdmin 4 for database management (optional)

## Open Questions

1. **Mapbox API Key**: Will you provide the API key, or should I include instructions for getting one?
2. **Deployment Target**: Where will this be deployed? (Local dev only, VPS, cloud provider?)
3. **Delete Functionality**: Should users be able to delete their own fire reports? Should firefighters be able to delete any report?
4. **Profile Pictures**: Should users have avatars, or just names?
5. **Fire Images**: Should users be able to upload photos of fires?
6. **Notification System**: Do firefighters need any notification when new fires are reported? (Email, Telegram bot, etc.)
