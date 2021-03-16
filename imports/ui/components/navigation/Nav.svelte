<script>
  import { _ } from "svelte-i18n";
  import { fade } from "svelte/transition";
  import { router } from "tinro";

  import { items } from "./items";
  import MobileMenu from "./MobileMenu.svelte";
  import { currentUser } from "/imports/utils/functions/stores";
  import LanguageSwitcher from "/imports/ui/components/common/LanguageSwitcher.svelte";

  let mobileMenu = false;

  const toggleMobileMenu = () => {
    mobileMenu = !mobileMenu;
  };
</script>

<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/" rel="prefetch">
      <img src="/apps-logo-sansfond.svg" alt="LaBoite - Blog" height="40" />
    </a>

    <div
      role="button"
      class="navbar-burger"
      aria-label="menu"
      aria-expanded="false"
      data-target="navbarMenu"
      on:click={toggleMobileMenu}
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </div>
  </div>
  <div id="navbarMenu" class="navbar-menu">
    <div class="navbar-start">
      {#if $currentUser}
        {#each items as { path, text }}
          <a
            rel="prefetch"
            class:is-active={$router.path.indexOf(path) === 0}
            class="navbar-item"
            href={path}
          >
            {$_(text)}
            {#if $router.path.indexOf(path) === 0}
              <div transition:fade class="indicator" />
            {/if}
          </a>
        {/each}
      {/if}
    </div>
    <div class="navbar-end">
      <LanguageSwitcher />
    </div>
  </div>
</nav>

{#if mobileMenu}
  <MobileMenu toggle={toggleMobileMenu} pathname={$router.path} />
{/if}

<style>
  .navbar {
    box-shadow: var(--box-shadow);
  }
  .navbar-start {
    margin-left: auto;
  }
  .navbar-item {
    text-transform: uppercase;
    margin-left: 10px;
    margin-right: 10px;
  }
  .navbar-item.is-active {
    color: var(--primary);
  }
  .indicator {
    position: absolute;
    width: 100%;
    height: 3px;
    background-color: var(--secondary);
    bottom: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    left: 0;
    right: 0;
  }
</style>
