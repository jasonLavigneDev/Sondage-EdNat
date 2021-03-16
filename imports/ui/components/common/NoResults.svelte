<script>
  import { _ } from 'svelte-i18n';

  export let title = null;
</script>

<section class="hero is-small is-grey is-bold is-centered">
  <div class="hero-body">
    <div class="container">
      <div class="title is-4">{title || $_('components.NoResults.title')}</div>
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
  }
</style>
