package repository

import (
	"context"
	"fire-tracker/internal/models"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type FiresRepository struct {
	db *pgxpool.Pool
}

func NewFiresRepository(db *pgxpool.Pool) *FiresRepository {
	return &FiresRepository{db: db}
}

func (r *FiresRepository) Create(ctx context.Context, reporterID int, latitude, longitude float64, description string) (*models.Fire, error) {
	fire := &models.Fire{}
	err := r.db.QueryRow(ctx,
		`INSERT INTO fires (reporter_id, location, description, status)
		 VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography, $4, 'reported')
		 RETURNING id, reporter_id, ST_Y(location::geometry) as latitude, ST_X(location::geometry) as longitude,
		           description, status, created_at, updated_at`,
		reporterID, longitude, latitude, description,
	).Scan(&fire.ID, &fire.ReporterID, &fire.Latitude, &fire.Longitude,
		&fire.Description, &fire.Status, &fire.CreatedAt, &fire.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return fire, nil
}

func (r *FiresRepository) GetAll(ctx context.Context, status string, limit, offset int) ([]*models.Fire, int, error) {
	query := `
		SELECT f.id, f.reporter_id, ST_Y(f.location::geometry) as latitude, ST_X(f.location::geometry) as longitude,
		       f.description, f.status, f.created_at, f.updated_at,
		       u.id, u.name, u.role, u.created_at
		FROM fires f
		LEFT JOIN users u ON f.reporter_id = u.id
	`
	countQuery := `SELECT COUNT(*) FROM fires`

	args := []interface{}{}
	argIndex := 1

	if status != "" {
		query += fmt.Sprintf(" WHERE f.status = $%d", argIndex)
		countQuery += fmt.Sprintf(" WHERE status = $%d", argIndex)
		args = append(args, status)
		argIndex++
	}

	query += " ORDER BY f.created_at DESC"
	query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, limit, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	fires := []*models.Fire{}
	for rows.Next() {
		fire := &models.Fire{Reporter: &models.User{}}
		err := rows.Scan(
			&fire.ID, &fire.ReporterID, &fire.Latitude, &fire.Longitude,
			&fire.Description, &fire.Status, &fire.CreatedAt, &fire.UpdatedAt,
			&fire.Reporter.ID, &fire.Reporter.Name, &fire.Reporter.Role, &fire.Reporter.CreatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		fires = append(fires, fire)
	}

	var total int
	countArgs := args[:len(args)-2] // Remove limit and offset
	err = r.db.QueryRow(ctx, countQuery, countArgs...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	return fires, total, nil
}

func (r *FiresRepository) GetByID(ctx context.Context, id int) (*models.Fire, error) {
	fire := &models.Fire{Reporter: &models.User{}}
	err := r.db.QueryRow(ctx,
		`SELECT f.id, f.reporter_id, ST_Y(f.location::geometry) as latitude, ST_X(f.location::geometry) as longitude,
		        f.description, f.status, f.created_at, f.updated_at,
		        u.id, u.name, u.role, u.created_at
		 FROM fires f
		 LEFT JOIN users u ON f.reporter_id = u.id
		 WHERE f.id = $1`,
		id,
	).Scan(
		&fire.ID, &fire.ReporterID, &fire.Latitude, &fire.Longitude,
		&fire.Description, &fire.Status, &fire.CreatedAt, &fire.UpdatedAt,
		&fire.Reporter.ID, &fire.Reporter.Name, &fire.Reporter.Role, &fire.Reporter.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return fire, nil
}

func (r *FiresRepository) UpdateStatus(ctx context.Context, id int, status string) (*models.Fire, error) {
	fire := &models.Fire{}
	err := r.db.QueryRow(ctx,
		`UPDATE fires
		 SET status = $1, updated_at = NOW()
		 WHERE id = $2
		 RETURNING id, reporter_id, ST_Y(location::geometry) as latitude, ST_X(location::geometry) as longitude,
		           description, status, created_at, updated_at`,
		status, id,
	).Scan(&fire.ID, &fire.ReporterID, &fire.Latitude, &fire.Longitude,
		&fire.Description, &fire.Status, &fire.CreatedAt, &fire.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return fire, nil
}
