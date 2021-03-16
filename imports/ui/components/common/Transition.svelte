<!-- Transition.svelte -->
<script>
  import { fade } from "svelte/transition";
</script>

<div in:fade={{ duration: 300 }}>
  <slot />
</div>
