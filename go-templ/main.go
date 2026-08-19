package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"

	"github.com/a-h/templ"
	"github.com/google/uuid"
)

type idResponse struct {
	Id string `json:"id"`
}

func main() {
	runtime.GOMAXPROCS(1)
	fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))
	http.Handle("/", templ.Handler(hello()))
	http.HandleFunc("/api/id", func(w http.ResponseWriter, r *http.Request) {
		id := uuid.New().String()
		resp := idResponse{Id: id}
		jsonData, err := json.Marshal(resp)
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if _, err := w.Write(jsonData); err != nil {
			log.Println("write error:", err)
		}
	})
	http.HandleFunc("/dynamic", func(w http.ResponseWriter, r *http.Request) {
		dynamic(uuid.New().String()).Render(r.Context(), w)
	})
	fmt.Println("Listening on :3000")
	http.ListenAndServe(":3000", nil)
}
