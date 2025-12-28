## ADDED Requirements

### Requirement: Fire Status Transitions
Firefighters SHALL be able to update fire status through defined state transitions.

#### Scenario: Firefighter marks fire as seen
- **WHEN** authenticated firefighter updates fire status from "reported" to "seen"
- **THEN** system updates fire status to "seen"
- **AND** system updates fire updated_at timestamp
- **AND** system returns updated fire record

#### Scenario: Firefighter marks fire as closed
- **WHEN** authenticated firefighter updates fire status from "seen" to "closed"
- **OR** authenticated firefighter updates fire status from "reported" to "closed"
- **THEN** system updates fire status to "closed"
- **AND** system updates fire updated_at timestamp
- **AND** system returns updated fire record

#### Scenario: Regular user attempts to update fire status
- **WHEN** authenticated regular user attempts to update fire status
- **THEN** system returns 403 Forbidden error
- **AND** fire status remains unchanged

#### Scenario: Unauthenticated user attempts to update fire status
- **WHEN** unauthenticated request attempts to update fire status
- **THEN** system returns 401 Unauthorized error
- **AND** fire status remains unchanged

#### Scenario: Invalid status transition attempted
- **WHEN** firefighter attempts to set fire to invalid status value
- **THEN** system returns 400 Bad Request error
- **AND** fire status remains unchanged

### Requirement: Fire Status Visibility
Fire status SHALL be visible to all users to coordinate response efforts.

#### Scenario: User views fire with status
- **WHEN** user retrieves fire details or list
- **THEN** each fire includes current status
- **AND** status is one of: "reported", "seen", or "closed"

#### Scenario: Fire list filtered by status
- **WHEN** user requests fires with specific status filter
- **THEN** only fires matching that status are returned
- **AND** firefighters can quickly identify fires needing attention

### Requirement: Status Update Tracking
System SHALL track when fire status is updated for accountability.

#### Scenario: Fire status updated
- **WHEN** firefighter changes fire status
- **THEN** system records updated_at timestamp
- **AND** timestamp reflects when status change occurred

### Requirement: Firefighter-Only Actions
Only users with firefighter role SHALL have permission to modify fire status.

#### Scenario: Verify firefighter role before status update
- **WHEN** status update request is received
- **THEN** system checks user role from session
- **AND** only proceeds if role is "firefighter"
- **AND** returns 403 Forbidden if role is "user"
