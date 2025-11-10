<script lang="ts">
  import { getId } from './id.remote.js';
</script>

<h1>Hello SvelteKit!</h1>
<p>{new Date().toString()} - {await getId()} </p>
