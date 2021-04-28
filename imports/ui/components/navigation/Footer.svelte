<script>
  import { _ } from "svelte-i18n";
  import { footer } from "./items";
</script>

<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
  <div class="navbar-menu is-active">
    <div class="navbar-start">
      {#each footer as { path, text }}
        <a
          class="navbar-item"
          target="_blank"
          href="{path}"
        >
          {$_(text)}
        </a>
      {/each}
    </div>
    <div class="navbar-end" />
  </div>
</nav>

<style>
  .navbar {
    height: 64px;
  }
  .navbar-menu {
    background-color: var(--primary) !important;
  }
  .navbar-item {
    margin-left: 10px;
    margin-right: 10px;
    font-weight: bolder;
    font-size: 14px;
    color: var(--tertiary);
    
  }
  .navbar-item.is-active {
      color: var(--tertiary);
    }
</style>
