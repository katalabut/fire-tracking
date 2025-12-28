## ADDED Requirements

### Requirement: Interactive Map Display
System SHALL display an interactive map centered on Cyprus showing all fire locations.

#### Scenario: User opens map view
- **WHEN** user navigates to home page
- **THEN** system displays Mapbox map centered on Cyprus (latitude 34.9, longitude 33.3)
- **AND** map shows all fire reports as markers
- **AND** map supports zoom and pan interactions

#### Scenario: Map displays fire markers with status colors
- **WHEN** fires are displayed on map
- **THEN** reported fires show with red markers
- **AND** seen fires show with yellow markers
- **AND** closed fires show with green markers
- **AND** marker color immediately reflects fire status

### Requirement: Fire Marker Interaction
Users SHALL be able to interact with fire markers to view details.

#### Scenario: User clicks fire marker
- **WHEN** user clicks on fire marker
- **THEN** system displays popup or panel with fire details
- **AND** details include description, status, reporter, timestamp
- **AND** details include link to full fire view with comments

#### Scenario: Multiple fires in close proximity
- **WHEN** multiple fire markers are very close together
- **THEN** markers remain clickable and distinguishable
- **AND** user can zoom in to separate overlapping markers

### Requirement: Fire Location Selection
Authenticated users SHALL be able to select fire location by clicking on map.

#### Scenario: User creates fire report with map click
- **WHEN** authenticated user is in create fire mode
- **AND** user clicks location on map
- **THEN** system captures clicked latitude and longitude
- **AND** system displays temporary marker at selected location
- **AND** user can proceed to add description and submit report

#### Scenario: User changes selected location
- **WHEN** user has selected location but clicks elsewhere on map
- **THEN** system moves temporary marker to new location
- **AND** system updates captured coordinates

#### Scenario: User submits fire without selecting location
- **WHEN** user attempts to submit fire report without clicking map
- **THEN** system displays validation error
- **AND** fire report is not submitted

### Requirement: Map Performance
Map SHALL load and render efficiently even with many fire markers.

#### Scenario: Map loads with many fires
- **WHEN** system has hundreds of fire reports
- **THEN** map renders all markers within 3 seconds
- **AND** map interactions remain responsive
- **AND** marker clustering may be used if performance degrades

### Requirement: Mapbox API Integration
System SHALL integrate with Mapbox GL JS API for map functionality.

#### Scenario: Map initialized with Mapbox
- **WHEN** map component loads
- **THEN** system uses Mapbox GL JS library
- **AND** valid Mapbox access token is provided
- **AND** map tiles load from Mapbox CDN

#### Scenario: Mapbox API key missing or invalid
- **WHEN** Mapbox access token is missing or invalid
- **THEN** system displays error message to user
- **AND** system logs error for debugging

### Requirement: Mobile-Responsive Map
Map interface SHALL be usable on mobile devices.

#### Scenario: User accesses map on mobile
- **WHEN** user views map on mobile device
- **THEN** map fills available screen space
- **AND** touch gestures work for zoom and pan
- **AND** marker popups are touch-friendly
- **AND** fire creation interface adapts to mobile screen size
