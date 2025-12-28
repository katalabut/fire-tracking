package repository

import (
	"context"
	"fire-tracker/internal/models"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SessionsRepository struct {
	db *pgxpool.Pool
}

func NewSessionsRepository(db *pgxpool.Pool) *SessionsRepository {
	return &SessionsRepository{db: db}
}

func (r *SessionsRepository) Create(ctx context.Context, userID int, expiry time.Duration) (*models.Session, error) {
	session := &models.Session{
		ID:        uuid.New().String(),
		UserID:    userID,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(expiry),
	}

	_, err := r.db.Exec(ctx,
		`INSERT INTO sessions (id, user_id, created_at, expires_at)
		 VALUES ($1, $2, $3, $4)`,
		session.ID, session.UserID, session.CreatedAt, session.ExpiresAt,
	)
	if err != nil {
		return nil, err
	}
	return session, nil
}

func (r *SessionsRepository) GetByID(ctx context.Context, sessionID string) (*models.Session, error) {
	session := &models.Session{}
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, created_at, expires_at
		 FROM sessions
		 WHERE id = $1 AND expires_at > NOW()`,
		sessionID,
	).Scan(&session.ID, &session.UserID, &session.CreatedAt, &session.ExpiresAt)
	if err != nil {
		return nil, err
	}
	return session, nil
}

func (r *SessionsRepository) Delete(ctx context.Context, sessionID string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM sessions WHERE id = $1`, sessionID)
	return err
}

func (r *SessionsRepository) DeleteExpired(ctx context.Context) error {
	_, err := r.db.Exec(ctx, `DELETE FROM sessions WHERE expires_at < NOW()`)
	return err
}
