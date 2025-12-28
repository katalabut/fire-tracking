## ADDED Requirements

### Requirement: Fire Report Creation
Authenticated users SHALL be able to create fire reports by specifying a geographic location and description.

#### Scenario: User creates fire report with valid data
- **WHEN** authenticated user submits fire report with latitude, longitude, and description
- **THEN** system creates fire record with status "reported"
- **AND** system assigns current user as reporter
- **AND** system returns created fire with generated ID

#### Scenario: Anonymous user attempts to create fire report
- **WHEN** unauthenticated user attempts to submit fire report
- **THEN** system returns 401 Unauthorized error
- **AND** no fire record is created

#### Scenario: User submits invalid coordinates
- **WHEN** user submits fire report with latitude outside -90 to 90 range
- **OR** longitude outside -180 to 180 range
- **THEN** system returns 400 Bad Request with validation error
- **AND** no fire record is created

#### Scenario: User submits empty description
- **WHEN** user submits fire report with empty or whitespace-only description
- **THEN** system returns 400 Bad Request with validation error
- **AND** no fire record is created

### Requirement: Fire Report Listing
Users SHALL be able to view all fire reports with optional filtering by status.

#### Scenario: User requests all fires
- **WHEN** user makes GET request to /api/fires
- **THEN** system returns array of all fire reports
- **AND** each fire includes id, location, description, status, reporter info, timestamps
- **AND** results are ordered by created_at descending

#### Scenario: User filters fires by status
- **WHEN** user requests fires with status parameter (reported, seen, or closed)
- **THEN** system returns only fires matching the specified status
- **AND** results are ordered by created_at descending

#### Scenario: User requests fires with pagination
- **WHEN** user provides limit and offset parameters
- **THEN** system returns specified number of fires starting from offset
- **AND** response includes total count of fires

### Requirement: Fire Report Details
Users SHALL be able to view detailed information about a specific fire report.

#### Scenario: User requests existing fire by ID
- **WHEN** user makes GET request to /api/fires/:id with valid fire ID
- **THEN** system returns complete fire details
- **AND** details include reporter information
- **AND** details include current status
- **AND** details include creation and update timestamps

#### Scenario: User requests non-existent fire
- **WHEN** user makes GET request to /api/fires/:id with non-existent ID
- **THEN** system returns 404 Not Found error

### Requirement: Fire Location Storage
System SHALL store fire locations using PostGIS GEOGRAPHY type for accurate geospatial queries.

#### Scenario: Fire location stored in database
- **WHEN** fire report is created with latitude and longitude
- **THEN** system stores location as PostGIS GEOGRAPHY(POINT, 4326)
- **AND** spatial index is used for efficient queries
- **AND** location is returned as separate latitude and longitude in API responses

#### Scenario: Query fires within radius
- **WHEN** system needs to find fires near a location
- **THEN** PostGIS ST_DWithin function can be used
- **AND** queries use spatial index for performance
