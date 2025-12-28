package repository

import (
	"context"
	"fire-tracker/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type CommentsRepository struct {
	db *pgxpool.Pool
}

func NewCommentsRepository(db *pgxpool.Pool) *CommentsRepository {
	return &CommentsRepository{db: db}
}

func (r *CommentsRepository) Create(ctx context.Context, fireID, userID int, text string) (*models.Comment, error) {
	comment := &models.Comment{User: &models.User{}}
	err := r.db.QueryRow(ctx,
		`INSERT INTO comments (fire_id, user_id, text)
		 VALUES ($1, $2, $3)
		 RETURNING id, fire_id, user_id, text, created_at`,
		fireID, userID, text,
	).Scan(&comment.ID, &comment.FireID, &comment.UserID, &comment.Text, &comment.CreatedAt)
	if err != nil {
		return nil, err
	}
	return comment, nil
}

func (r *CommentsRepository) GetByFireID(ctx context.Context, fireID int) ([]*models.Comment, error) {
	rows, err := r.db.Query(ctx,
		`SELECT c.id, c.fire_id, c.user_id, c.text, c.created_at,
		        u.id, u.name, u.role, u.created_at
		 FROM comments c
		 LEFT JOIN users u ON c.user_id = u.id
		 WHERE c.fire_id = $1
		 ORDER BY c.created_at ASC`,
		fireID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	comments := []*models.Comment{}
	for rows.Next() {
		comment := &models.Comment{User: &models.User{}}
		err := rows.Scan(
			&comment.ID, &comment.FireID, &comment.UserID, &comment.Text, &comment.CreatedAt,
			&comment.User.ID, &comment.User.Name, &comment.User.Role, &comment.User.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	return comments, nil
}
