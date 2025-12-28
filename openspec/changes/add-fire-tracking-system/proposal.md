# Change: Fire Tracking System for Cyprus

## Why
Create a web application to help Cyprus citizens report active fires and enable firefighters to coordinate response efforts. The system provides a simple, accessible way for anyone to report fire locations on a map and for firefighters to track, comment on, and manage fire incidents.

## What Changes
- **NEW** Fire reporting capability allowing users to submit fire locations with descriptions
- **NEW** Simple name-based authentication with role selection (regular user vs firefighter)
- **NEW** Commenting system for collaborative fire incident discussion
- **NEW** Firefighter management tools to mark fires as seen and closed
- **NEW** Interactive map interface using Mapbox to visualize all fire incidents
- **NEW** Backend API built with Go, chi router, and fast-app framework
- **NEW** Frontend built with Next.js and shadcn/ui components
- **NEW** PostGIS database for geospatial fire location storage

## Impact
- Affected specs: fire-reporting, user-auth, fire-comments, fire-management, map-integration (all new)
- Affected code: Creates new `/backend` and `/frontend` directories
- Database: New PostgreSQL database with PostGIS extension required
- External services: Mapbox API key required for map functionality
