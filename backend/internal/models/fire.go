package models

import "time"

type Fire struct {
	ID          int       `json:"id"`
	ReporterID  int       `json:"reporter_id"`
	Reporter    *User     `json:"reporter,omitempty"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	Description string    `json:"description"`
	Status      string    `json:"status"` // "reported", "seen", "closed"
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type FireWithDistance struct {
	Fire
	Distance float64 `json:"distance"` // Distance in meters
}
