# go-htmx-solid-islands

A minimal example of embedding small, interactive SolidJS components ("islands")
into a server-rendered htmx app backed by a Go HTTP server.

## Architecture

- **Go (`main.go`)** renders full pages and htmx fragments with `html/template`.
  It also exposes small JSON APIs (`/posts/{id}/like`, `/posts/{id}/comments`)
  that the Solid islands call directly via `fetch`.
- **htmx** handles page-level interactivity: swapping in the comments fragment,
  and reloading it when a `comment-added` event fires (via the `HX-Trigger`
  response header).
- **Solid (`web/islands/`)** provides two small components:
  - `LikeButton.tsx` — a self-contained counter that calls the Go API directly.
  - `CommentForm.tsx` — a form that posts a comment, then relies on htmx to
    refresh the comment list (it doesn't manage that list itself).
    Both are built by Vite into a single bundle (`static/islands/main.js`) that
    the Go server serves as a static file — no server-side Node process needed.
- **`web/islands/main.tsx`** scans the DOM for `data-island="ComponentName"`
  elements, mounts the matching Solid component with `solid-js/web`'s `render`
  (passing `data-props` as props), and re-mounts/disposes islands as htmx swaps
  content in and out (`htmx:afterSwap` / `htmx:beforeCleanupElement`).

## Running

```sh
# 1. Build the Solid islands bundle (outputs to ../static/islands)
cd web
npm install
npm run build     # or `npm run dev` to rebuild on change

# 2. Run the Go server
cd ..
go run .
```

Then open http://localhost:8080.

## Adding a new island

1. Create a new component under `web/islands/` (a `.tsx` file with a default export).
2. Register it in `web/islands/main.tsx`'s `registry` map.
3. Rebuild (`npm run build`).
4. Render `<div data-island="YourComponent" data-props='{"...": ...}'></div>`
   from any Go template — on initial load or inside an htmx fragment.
