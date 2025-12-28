package handlers

import (
	"encoding/json"
	"fire-tracker/internal/api/middleware"
	"fire-tracker/internal/repository"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type CommentsHandler struct {
	commentsRepo *repository.CommentsRepository
}

func NewCommentsHandler(commentsRepo *repository.CommentsRepository) *CommentsHandler {
	return &CommentsHandler{commentsRepo: commentsRepo}
}

type CreateCommentRequest struct {
	Text string `json:"text"`
}

type CreateCommentResponse struct {
	Comment interface{} `json:"comment"`
}

func (h *CommentsHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	fireIDStr := chi.URLParam(r, "id")
	fireID, err := strconv.Atoi(fireIDStr)
	if err != nil {
		http.Error(w, "Invalid fire ID", http.StatusBadRequest)
		return
	}

	var req CreateCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Text == "" {
		http.Error(w, "Comment text is required", http.StatusBadRequest)
		return
	}

	if len(req.Text) > 5000 {
		http.Error(w, "Comment text must be less than 5000 characters", http.StatusBadRequest)
		return
	}

	comment, err := h.commentsRepo.Create(r.Context(), fireID, userID, req.Text)
	if err != nil {
		http.Error(w, "Failed to create comment", http.StatusInternalServerError)
		return
	}

	response := CreateCommentResponse{Comment: comment}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

type ListCommentsResponse struct {
	Comments []interface{} `json:"comments"`
}

func (h *CommentsHandler) List(w http.ResponseWriter, r *http.Request) {
	fireIDStr := chi.URLParam(r, "id")
	fireID, err := strconv.Atoi(fireIDStr)
	if err != nil {
		http.Error(w, "Invalid fire ID", http.StatusBadRequest)
		return
	}

	comments, err := h.commentsRepo.GetByFireID(r.Context(), fireID)
	if err != nil {
		http.Error(w, "Failed to fetch comments", http.StatusInternalServerError)
		return
	}

	commentsInterface := make([]interface{}, len(comments))
	for i, comment := range comments {
		commentsInterface[i] = comment
	}

	response := ListCommentsResponse{Comments: commentsInterface}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
