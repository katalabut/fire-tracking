package api

import (
	"fire-tracker/internal/api/handlers"
	"fire-tracker/internal/api/middleware"
	"fire-tracker/internal/config"
	"fire-tracker/internal/repository"
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

func NewRouter(db *pgxpool.Pool, cfg *config.Config, logger *zap.Logger) http.Handler {
	r := chi.NewRouter()

	// Middleware
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// Repositories
	usersRepo := repository.NewUsersRepository(db)
	sessionsRepo := repository.NewSessionsRepository(db)
	firesRepo := repository.NewFiresRepository(db)
	commentsRepo := repository.NewCommentsRepository(db)

	// Handlers
	authHandler := handlers.NewAuthHandler(usersRepo, sessionsRepo, cfg)
	firesHandler := handlers.NewFiresHandler(firesRepo)
	commentsHandler := handlers.NewCommentsHandler(commentsRepo)

	// Middleware
	authMiddleware := middleware.NewAuthMiddleware(sessionsRepo, usersRepo)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// API routes
	r.Route("/api", func(r chi.Router) {
		// Auth routes
		r.Post("/auth/login", authHandler.Login)
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.Authenticate)
			r.Get("/auth/me", authHandler.Me)
			r.Post("/auth/logout", authHandler.Logout)
		})

		// Fires routes
		r.Get("/fires", firesHandler.List)
		r.Get("/fires/{id}", firesHandler.Get)
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.Authenticate)
			r.Post("/fires", firesHandler.Create)

			r.Group(func(r chi.Router) {
				r.Use(authMiddleware.RequireFirefighter)
				r.Patch("/fires/{id}/status", firesHandler.UpdateStatus)
			})
		})

		// Comments routes
		r.Get("/fires/{id}/comments", commentsHandler.List)
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.Authenticate)
			r.Post("/fires/{id}/comments", commentsHandler.Create)
		})
	})

	return r
}
