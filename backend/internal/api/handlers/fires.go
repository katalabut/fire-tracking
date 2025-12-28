package handlers

import (
	"encoding/json"
	"fire-tracker/internal/api/middleware"
	"fire-tracker/internal/repository"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type FiresHandler struct {
	firesRepo *repository.FiresRepository
}

func NewFiresHandler(firesRepo *repository.FiresRepository) *FiresHandler {
	return &FiresHandler{firesRepo: firesRepo}
}

type CreateFireRequest struct {
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Description string  `json:"description"`
}

type CreateFireResponse struct {
	Fire interface{} `json:"fire"`
}

func (h *FiresHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req CreateFireRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate latitude and longitude
	if req.Latitude < -90 || req.Latitude > 90 {
		http.Error(w, "Latitude must be between -90 and 90", http.StatusBadRequest)
		return
	}
	if req.Longitude < -180 || req.Longitude > 180 {
		http.Error(w, "Longitude must be between -180 and 180", http.StatusBadRequest)
		return
	}

	if req.Description == "" {
		http.Error(w, "Description is required", http.StatusBadRequest)
		return
	}

	fire, err := h.firesRepo.Create(r.Context(), userID, req.Latitude, req.Longitude, req.Description)
	if err != nil {
		http.Error(w, "Failed to create fire report", http.StatusInternalServerError)
		return
	}

	response := CreateFireResponse{Fire: fire}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

type ListFiresResponse struct {
	Fires []interface{} `json:"fires"`
	Total int           `json:"total"`
}

func (h *FiresHandler) List(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	limit := 50
	offset := 0

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	if offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
			offset = o
		}
	}

	fires, total, err := h.firesRepo.GetAll(r.Context(), status, limit, offset)
	if err != nil {
		http.Error(w, "Failed to fetch fires", http.StatusInternalServerError)
		return
	}

	firesInterface := make([]interface{}, len(fires))
	for i, fire := range fires {
		firesInterface[i] = fire
	}

	response := ListFiresResponse{
		Fires: firesInterface,
		Total: total,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

type GetFireResponse struct {
	Fire interface{} `json:"fire"`
}

func (h *FiresHandler) Get(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid fire ID", http.StatusBadRequest)
		return
	}

	fire, err := h.firesRepo.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Fire not found", http.StatusNotFound)
		return
	}

	response := GetFireResponse{Fire: fire}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

type UpdateStatusRequest struct {
	Status string `json:"status"`
}

type UpdateStatusResponse struct {
	Fire interface{} `json:"fire"`
}

func (h *FiresHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid fire ID", http.StatusBadRequest)
		return
	}

	var req UpdateStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Status != "seen" && req.Status != "closed" && req.Status != "reported" {
		http.Error(w, "Status must be 'seen' or 'closed'", http.StatusBadRequest)
		return
	}

	fire, err := h.firesRepo.UpdateStatus(r.Context(), id, req.Status)
	if err != nil {
		http.Error(w, "Failed to update fire status", http.StatusInternalServerError)
		return
	}

	response := UpdateStatusResponse{Fire: fire}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
