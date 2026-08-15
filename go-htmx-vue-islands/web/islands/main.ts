import { createApp, defineAsyncComponent, type App } from "vue";

// Registry of every island component available to the page. Add new components here.
const registry: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  LikeButton: defineAsyncComponent(() => import("./LikeButton.vue")),
  CommentForm: defineAsyncComponent(() => import("./CommentForm.vue")),
};

// Tracks the mounted Vue app for each host element so it can be cleanly
// unmounted before htmx removes/replaces that element from the DOM.
const mounted = new WeakMap<Element, App>();

function mountIsland(el: Element) {
  if (mounted.has(el)) return;
  const name = (el as HTMLElement).dataset.island;
  if (!name || !registry[name]) return;

  const propsJson = (el as HTMLElement).dataset.props;
  const props = propsJson ? JSON.parse(propsJson) : {};

  const app = createApp(registry[name], props);
  app.mount(el);
  mounted.set(el, app);
}

function unmountIsland(el: Element) {
  const app = mounted.get(el);
  if (!app) return;
  app.unmount();
  mounted.delete(el);
}

function mountAll(root: ParentNode) {
  const els =
    root instanceof Element && root.matches("[data-island]")
      ? [root]
      : Array.from(root.querySelectorAll("[data-island]"));
  els.forEach(mountIsland);
}

function unmountAll(root: ParentNode) {
  const els =
    root instanceof Element && root.matches("[data-island]")
      ? [root]
      : Array.from(root.querySelectorAll("[data-island]"));
  els.forEach(unmountIsland);
}

// Initial page load.
mountAll(document.body);

// htmx swaps in new server-rendered fragments — mount any islands they contain.
document.body.addEventListener("htmx:afterSwap", (e: any) => {
  mountAll(e.detail.target);
});

// htmx is about to discard an element — unmount its Vue app first to avoid leaks.
document.body.addEventListener("htmx:beforeCleanupElement", (e: any) => {
  unmountAll(e.target);
});
