## ADDED Requirements

### Requirement: Comment Creation
Authenticated users SHALL be able to add comments to fire reports.

#### Scenario: User adds comment to existing fire
- **WHEN** authenticated user submits comment with non-empty text to existing fire
- **THEN** system creates comment record linked to fire and user
- **AND** system returns created comment with ID and timestamp
- **AND** comment includes author information

#### Scenario: User attempts to comment on non-existent fire
- **WHEN** authenticated user submits comment to non-existent fire ID
- **THEN** system returns 404 Not Found error
- **AND** no comment is created

#### Scenario: Unauthenticated user attempts to add comment
- **WHEN** unauthenticated user attempts to submit comment
- **THEN** system returns 401 Unauthorized error
- **AND** no comment is created

#### Scenario: User submits empty comment
- **WHEN** authenticated user submits comment with empty or whitespace-only text
- **THEN** system returns 400 Bad Request error
- **AND** no comment is created

#### Scenario: User submits excessively long comment
- **WHEN** authenticated user submits comment exceeding 5000 characters
- **THEN** system returns 400 Bad Request error
- **AND** no comment is created

### Requirement: Comment Retrieval
Users SHALL be able to view all comments associated with a fire report.

#### Scenario: User requests comments for existing fire
- **WHEN** user makes GET request to /api/fires/:id/comments
- **THEN** system returns array of all comments for that fire
- **AND** each comment includes author name and role
- **AND** comments are ordered by created_at ascending (oldest first)

#### Scenario: User requests comments for fire with no comments
- **WHEN** user requests comments for fire that has no comments
- **THEN** system returns empty array
- **AND** HTTP status is 200 OK

#### Scenario: User requests comments for non-existent fire
- **WHEN** user requests comments for non-existent fire ID
- **THEN** system returns 404 Not Found error

### Requirement: Comment Author Information
Comments SHALL include information about the author to provide context.

#### Scenario: Comment displayed with author details
- **WHEN** comment is retrieved from API
- **THEN** response includes author name
- **AND** response includes author role (user or firefighter)
- **AND** firefighter comments are distinguishable from regular users

### Requirement: Comment Cascade Deletion
Comments SHALL be automatically deleted when their associated fire is deleted.

#### Scenario: Fire is deleted with comments
- **WHEN** fire report with comments is deleted from system
- **THEN** all associated comments are automatically deleted
- **AND** database maintains referential integrity
