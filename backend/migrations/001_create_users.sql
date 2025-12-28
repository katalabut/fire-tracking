-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'firefighter')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_name ON users(name);
