<script>
  import { _ } from "svelte-i18n";
  import { fade, fly } from "svelte/transition";
  import LanguageSwitcher from "../common/LanguageSwitcher.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import { items } from "./items";
  import { currentUser } from "../../../utils/functions/stores";

  export let toggle, pathname;
</script>

<div class="modal is-active">
  <div class="modal-card" transition:fly={{ y: 200 }}>
    <header class="modal-card-head">
      <p class="modal-card-title">{$_("menu")}</p>
      <button class="delete is-large" on:click={toggle} aria-label="close" />
    </header>
    <section class="modal-card-body">
      <div class="menu">
        <ul class="menu-list">
          {#each items as { path, text }}
            <li>
              <a
                class:is-active={pathname === path}
                class="navbar-item"
                on:click={toggle}
                href={path}
              >
                {$_(text)}
                {#if pathname === path}
                  <div transition:fade class="indicator" />
                {/if}
              </a>
            </li>
          {/each}
          {#if $currentUser}
            <li>
              <Divider />
            </li>
            <li>
              <a class="navbar-item" on:click={() => Meteor.logout()}>
                {$currentUser.services.keycloak.email}
              </a>
            </li>
          {/if}
          <br />
          <li>
            <LanguageSwitcher mobile={true} />
          </li>
        </ul>
      </div>
    </section>
  </div>
</div>

<style lang="scss">
  .modal-card {
    height: 100vh;
    max-height: 100vh;
  }
  .modal-card-head {
    border-radius: 0;
    background-color: var(--primary);
  }
  .modal-card-title {
    color: var(--tertiary);
  }
  .menu {
    height: 100%;
  }
  ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    min-height: 50%;
    text-transform: uppercase;
    font-size: 20px;
  }
</style>
