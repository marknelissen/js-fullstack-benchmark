# go-htmx-vue-islands

A minimal example of embedding small, interactive Vue 3 components ("islands")
into a server-rendered htmx app backed by a Go HTTP server.

## Architecture

- **Go (`main.go`)** renders full pages and htmx fragments with `html/template`.
  It also exposes small JSON APIs (`/posts/{id}/like`, `/posts/{id}/comments`)
  that the Vue islands call directly via `fetch`.
- **htmx** handles page-level interactivity: swapping in the comments fragment,
  and reloading it when a `comment-added` event fires (via the `HX-Trigger`
  response header).
- **Vue (`web/islands/`)** provides two small components:
  - `LikeButton.vue` — a self-contained counter that calls the Go API directly.
  - `CommentForm.vue` — a form that posts a comment, then relies on htmx to
    refresh the comment list (it doesn't manage that list itself).
    Both are built by Vite into a single bundle (`static/islands/main.js`) that
    the Go server serves as a static file — no server-side Node process needed.
- **`web/islands/main.ts`** scans the DOM for `data-island="ComponentName"`
  elements, mounts the matching Vue component with `data-props` as props, and
  re-mounts/unmounts islands as htmx swaps content in and out
  (`htmx:afterSwap` / `htmx:beforeCleanupElement`).

## Running

```sh
# 1. Build the Vue islands bundle (outputs to ../static/islands)
cd web
npm install
npm run build     # or `npm run dev` to rebuild on change

# 2. Run the Go server
cd ..
go run .
```

Then open http://localhost:8080.

## Adding a new island

1. Create a new SFC under `web/islands/`.
2. Register it in `web/islands/main.ts`'s `registry` map.
3. Rebuild (`npm run build`).
4. Render `<div data-island="YourComponent" data-props='{"...": ...}'></div>`
   from any Go template — on initial load or inside an htmx fragment.
