package models

import "time"

type Comment struct {
	ID        int       `json:"id"`
	FireID    int       `json:"fire_id"`
	UserID    int       `json:"user_id"`
	User      *User     `json:"user,omitempty"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"created_at"`
}
