## ADDED Requirements

### Requirement: Simple Name-Based Login
Users SHALL be able to log in by providing their name and selecting a role without password authentication.

#### Scenario: User logs in with valid name and role
- **WHEN** user submits login request with non-empty name and valid role (user or firefighter)
- **THEN** system creates or retrieves user record
- **AND** system generates session token with 30-day expiration
- **AND** system returns session token and user information

#### Scenario: User submits empty name
- **WHEN** user submits login request with empty or whitespace-only name
- **THEN** system returns 400 Bad Request error
- **AND** no session is created

#### Scenario: User submits invalid role
- **WHEN** user submits login request with role other than "user" or "firefighter"
- **THEN** system returns 400 Bad Request error
- **AND** no session is created

### Requirement: Session Management
System SHALL manage user sessions with token-based authentication and automatic expiration.

#### Scenario: Valid session token provided
- **WHEN** authenticated request includes valid session token in Authorization header
- **THEN** system identifies user from session
- **AND** system allows access to protected resources
- **AND** user information is available in request context

#### Scenario: Expired session token provided
- **WHEN** authenticated request includes expired session token
- **THEN** system returns 401 Unauthorized error
- **AND** system deletes expired session from database

#### Scenario: Invalid session token provided
- **WHEN** authenticated request includes non-existent or malformed token
- **THEN** system returns 401 Unauthorized error

#### Scenario: No session token provided for protected resource
- **WHEN** user attempts to access protected resource without Authorization header
- **THEN** system returns 401 Unauthorized error

### Requirement: User Identity Retrieval
Authenticated users SHALL be able to retrieve their current user information.

#### Scenario: User requests their profile
- **WHEN** authenticated user makes GET request to /api/auth/me
- **THEN** system returns current user information
- **AND** response includes user ID, name, role, and created timestamp

#### Scenario: Unauthenticated user requests profile
- **WHEN** unauthenticated request is made to /api/auth/me
- **THEN** system returns 401 Unauthorized error

### Requirement: Logout
Authenticated users SHALL be able to log out and invalidate their session.

#### Scenario: User logs out successfully
- **WHEN** authenticated user makes POST request to /api/auth/logout
- **THEN** system deletes session from database
- **AND** system returns success response
- **AND** session token is no longer valid

#### Scenario: User logs out with invalid token
- **WHEN** user makes logout request with invalid or expired token
- **THEN** system returns 401 Unauthorized error
- **AND** no sessions are deleted

### Requirement: Role-Based Access Control
System SHALL enforce role-based permissions for firefighter-specific actions.

#### Scenario: Firefighter accesses firefighter-only resource
- **WHEN** authenticated firefighter makes request to firefighter-only endpoint
- **THEN** system allows access
- **AND** action is performed

#### Scenario: Regular user attempts to access firefighter-only resource
- **WHEN** authenticated regular user makes request to firefighter-only endpoint
- **THEN** system returns 403 Forbidden error
- **AND** no action is performed

#### Scenario: Unauthenticated user attempts to access firefighter-only resource
- **WHEN** unauthenticated request is made to firefighter-only endpoint
- **THEN** system returns 401 Unauthorized error
