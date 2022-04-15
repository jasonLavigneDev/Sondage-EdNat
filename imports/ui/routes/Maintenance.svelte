<script>
  import { _ } from 'svelte-i18n';

  export let textMaintenance = '';
</script>

<section class="hero is-medium is-grey is-bold is-centered">
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="title is-4">{$_('pages.maintenance.title')}</div>
      <div class="title is-5">{$_(textMaintenance)}</div>
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
  }
</style>
