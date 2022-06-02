<script>
  import { _ } from 'svelte-i18n';
  import { fade } from 'svelte/transition';
  import { router } from 'tinro';
  import { Meteor } from 'meteor/meteor';

  import { items } from './items';
  import MobileMenu from './MobileMenu.svelte';
  import { currentUser } from '/imports/utils/functions/stores';
  import LanguageSwitcher from '/imports/ui/components/common/LanguageSwitcher.svelte';
  import { ROUTES } from '../../../utils/enums';
  import UserAvatar from '../common/UserAvatar.svelte';
  import { globalState } from '/imports/utils/functions/stores';

  let mobileMenu = false;

  const toggleMobileMenu = () => {
    mobileMenu = !mobileMenu;
  };

  const { state } = globalState();

  const SMALL_LOGO = '/puce_eole.png';
  const LONG_LOGO = '/Sondage.png';

</script>

<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a href="/" rel="prefetch">
      <img src={ $state.mobile ? SMALL_LOGO : LONG_LOGO} alt="LaBoite - Blog" class="image-app" height="40" />
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
          <a class:is-active={$router.path.indexOf(path) === 0} class="navbar-item" href={path}>
            {$_(text)}
            {#if $router.path.indexOf(path) === 0}
              <div transition:fade class="indicator" />
            {/if}
          </a>
        {/each}
      {/if}
    </div>
    <div class="navbar-end">
      {#if $currentUser}
        <div class="navbar-item avatar">
          {$currentUser.firstName}
          <UserAvatar />
        </div>
        <a href={ROUTES.LOGOUT} class="navbar-item avatar" on:click={() => Meteor.logout()}>
          <span class="icon is-large">
            <i class="fas fa-sign-out-alt" />
          </span>
        </a>
      {/if}
      <LanguageSwitcher />
    </div>
  </div>
</nav>

{#if mobileMenu}
  <MobileMenu toggle={toggleMobileMenu} pathname={$router.path} />
{/if}

<style>
  .navbar-menu {
    width: 80%;
    padding-left: 13%;
    justify-items: center;
  }
  .navbar {
    box-shadow: var(--box-shadow);
    max-height: 40px;
  }
  .avatar {
    text-transform: none !important;
    color: var(--primary);
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
  .image-app {
    max-height: 40px;
    height: 40px;
    margin-top: 5px;
    padding-left: 16px;
  }

</style>
