<!-- Transition.svelte -->
<script>
  import { router } from "tinro";
  import { blur } from "svelte/transition";
</script>

{#key $router.path}
  <div in:blur={{ duration: 400 }}>
    <slot />
  </div>
{/key}
