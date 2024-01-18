<script>
  import { _ } from 'svelte-i18n';
  import { settings } from '../../../utils/functions/stores';

  $: footer = [
    {
      text: 'links.legal',
      path: $settings.legal.external ? $settings.legal.link : `${Meteor.settings.public.laboiteHost}/legal/legalnotice`,
    },
    {
      text: 'links.accessibility',
      path: $settings.accessibility.external
        ? $settings.accessibility.link
        : `${Meteor.settings.public.laboiteHost}/legal/accessibility`,
    },
    {
      text: 'links.gcu',
      path: $settings.gcu.external ? $settings.gcu.link : `${Meteor.settings.public.laboiteHost}/legal/conditions`,
    },
    {
      text: 'links.personalData',
      path: $settings.personalData.external
        ? $settings.personalData.link
        : `${Meteor.settings.public.laboiteHost}/legal/personal-data`,
    },
    {
      text: 'links.about',
      path: '/about',
    },
  ];
</script>

<nav class="navbar is-primary" aria-label="main navigation">
  <div class="navbar-menu is-active">
    <div class="navbar-start">
      {#each footer as { path, text }}
        <a class="navbar-item" target="_blank" href={path} rel="noreferrer noopener">
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
