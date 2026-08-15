package main

import (
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"sync"
)

type Post struct {
	ID    int
	Title string
	Likes int
}

type Comment struct {
	PostID int
	Author string
	Body   string
}

// in-memory "database" — fine for a demo, not for production.
var (
	mu       sync.Mutex
	posts    = []*Post{{ID: 1, Title: "Islands architecture", Likes: 3}, {ID: 2, Title: "htmx + Solid", Likes: 1}}
	comments = map[int][]Comment{
		1: {{PostID: 1, Author: "Ada", Body: "Great overview!"}},
	}
)

var tmpl = template.Must(template.ParseGlob("templates/*.html"))

func findPost(id int) *Post {
	for _, p := range posts {
		if p.ID == id {
			return p
		}
	}
	return nil
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if err := tmpl.ExecuteTemplate(w, "layout.html", map[string]any{"Posts": posts}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// commentsHandler renders the htmx fragment for a post's comment list + the Solid CommentForm island.
func commentsHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "bad id", http.StatusBadRequest)
		return
	}
	if err := tmpl.ExecuteTemplate(w, "comments.html", map[string]any{
		"PostID":   id,
		"Comments": comments[id],
	}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// likeHandler is called directly by the Solid LikeButton island via fetch (not htmx).
func likeHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "bad id", http.StatusBadRequest)
		return
	}
	mu.Lock()
	post := findPost(id)
	if post == nil {
		mu.Unlock()
		http.NotFound(w, r)
		return
	}
	post.Likes++
	likes := post.Likes
	mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"likes": likes})
}

// addCommentHandler is called by the Solid CommentForm island via fetch, then tells htmx
// (via HX-Trigger) to refresh the comment list fragment for this post.
func addCommentHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "bad id", http.StatusBadRequest)
		return
	}
	var body struct {
		Author string `json:"author"`
		Body   string `json:"body"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "bad json", http.StatusBadRequest)
		return
	}
	if body.Author == "" || body.Body == "" {
		http.Error(w, "author and body are required", http.StatusBadRequest)
		return
	}

	mu.Lock()
	comments[id] = append(comments[id], Comment{PostID: id, Author: body.Author, Body: body.Body})
	mu.Unlock()

	w.Header().Set("HX-Trigger", "comment-added")
	w.WriteHeader(http.StatusNoContent)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", indexHandler)
	mux.HandleFunc("GET /posts/{id}/comments", commentsHandler)
	mux.HandleFunc("POST /posts/{id}/like", likeHandler)
	mux.HandleFunc("POST /posts/{id}/comments", addCommentHandler)
	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	addr := ":8080"
	log.Printf("listening on http://localhost%s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
