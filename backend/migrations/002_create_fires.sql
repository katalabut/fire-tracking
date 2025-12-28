-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create fires table with PostGIS GEOGRAPHY type
CREATE TABLE IF NOT EXISTS fires (
    id SERIAL PRIMARY KEY,
    reporter_id INTEGER REFERENCES users(id),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'seen', 'closed')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create spatial index on location
CREATE INDEX idx_fires_location ON fires USING GIST(location);
CREATE INDEX idx_fires_status ON fires(status);
CREATE INDEX idx_fires_reporter_id ON fires(reporter_id);
