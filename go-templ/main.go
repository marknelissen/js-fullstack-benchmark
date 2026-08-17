package main

import (
	"fmt"
	"net/http"
	"runtime"

	"github.com/a-h/templ"
	"github.com/google/uuid"
)

func main() {
	runtime.GOMAXPROCS(1)
	fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))
	http.Handle("/", templ.Handler(hello()))
	http.HandleFunc("/dynamic", func(w http.ResponseWriter, r *http.Request) {
		dynamic(uuid.New().String()).Render(r.Context(), w)
	})
	fmt.Println("Listening on :3000")
	http.ListenAndServe(":3000", nil)
}
