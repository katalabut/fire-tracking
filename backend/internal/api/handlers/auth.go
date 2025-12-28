package handlers

import (
	"encoding/json"
	"fire-tracker/internal/api/middleware"
	"fire-tracker/internal/config"
	"fire-tracker/internal/repository"
	"net/http"

	"github.com/jackc/pgx/v5"
)

type AuthHandler struct {
	usersRepo    *repository.UsersRepository
	sessionsRepo *repository.SessionsRepository
	config       *config.Config
}

func NewAuthHandler(usersRepo *repository.UsersRepository, sessionsRepo *repository.SessionsRepository, config *config.Config) *AuthHandler {
	return &AuthHandler{
		usersRepo:    usersRepo,
		sessionsRepo: sessionsRepo,
		config:       config,
	}
}

type LoginRequest struct {
	Name string `json:"name"`
	Role string `json:"role"`
}

type LoginResponse struct {
	Token string                `json:"token"`
	User  interface{}           `json:"user"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Name == "" {
		http.Error(w, "Name is required", http.StatusBadRequest)
		return
	}

	if req.Role != "user" && req.Role != "firefighter" {
		http.Error(w, "Role must be 'user' or 'firefighter'", http.StatusBadRequest)
		return
	}

	// Try to find existing user
	user, err := h.usersRepo.GetByName(r.Context(), req.Name)
	if err == pgx.ErrNoRows {
		// Create new user
		user, err = h.usersRepo.Create(r.Context(), req.Name, req.Role)
		if err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Create session
	session, err := h.sessionsRepo.Create(r.Context(), user.ID, h.config.SessionExpiry())
	if err != nil {
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	response := LoginResponse{
		Token: session.ID,
		User:  user,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

type MeResponse struct {
	User interface{} `json:"user"`
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := h.usersRepo.GetByID(r.Context(), userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	response := MeResponse{User: user}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	token := authHeader[7:] // Remove "Bearer " prefix
	err := h.sessionsRepo.Delete(r.Context(), token)
	if err != nil {
		http.Error(w, "Failed to logout", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
