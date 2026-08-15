import { lazy, type Component } from "solid-js";
import { render } from "solid-js/web";

// Registry of every island component available to the page. Add new components here.
const registry: Record<string, Component<any>> = {
  LikeButton: lazy(() => import("./LikeButton")),
  CommentForm: lazy(() => import("./CommentForm")),
};

// Tracks the dispose function for each mounted island so it can be cleanly
// torn down before htmx removes/replaces that element from the DOM.
const mounted = new WeakMap<Element, () => void>();

function mountIsland(el: Element) {
  if (mounted.has(el)) return;
  const name = (el as HTMLElement).dataset.island;
  if (!name || !registry[name]) return;

  const propsJson = (el as HTMLElement).dataset.props;
  const props = propsJson ? JSON.parse(propsJson) : {};

  const Comp = registry[name];
  const dispose = render(() => <Comp {...props} />, el);
  mounted.set(el, dispose);
}

function unmountIsland(el: Element) {
  const dispose = mounted.get(el);
  if (!dispose) return;
  dispose();
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

// htmx is about to discard an element — unmount its Solid render first to avoid leaks.
document.body.addEventListener("htmx:beforeCleanupElement", (e: any) => {
  unmountAll(e.target);
});
