<script>
  import { fade, fly } from "svelte/transition";

  export let toggle = () => null;
  export let active = false;
  export let title = "title";
  export let validButton = "Save";
  export let cancelButton = "Cancel";
  export let validClass = "is-primary";
  export let cancelClass = "is-light";
</script>

{#if active}
  <div class="modal is-active">
    <div class="modal-background" transition:fade />
    <div
      class="modal-card"
      transition:fly={{ delay: 250, duration: 300, y: 500, opacity: 0.5 }}
    >
      <header class="modal-card-head">
        <p class="modal-card-title">{title}</p>
        <button class="delete" aria-label="close" on:click={toggle} />
      </header>
      <section class="modal-card-body">
        <slot />
      </section>
      <footer class="modal-card-foot">
        <button class={`button ${cancelClass}`} on:click={toggle}
          >{cancelButton}</button
        >
        <button class={`button ${validClass}`} on:click={toggle}
          >{validButton}</button
        >
      </footer>
    </div>
  </div>
{/if}

<style>
  .modal-card-head {
    background-color: var(--primary);
  }
  .modal-card-title {
    color: white;
  }
  .modal-card-foot {
    display: flex;
    justify-content: space-between;
  }
</style>
