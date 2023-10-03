<script>
  import { _ } from 'svelte-i18n';
</script>

<section class="hero is-medium is-grey is-bold is-centered">
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="title is-4">{$_('pages.end.title')}<i class="fas fa-check-circle ml-4" color="green" /></div>
      <span class="content is-4 is-italic">{$_('pages.end.content')}</span>
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
  }
</style>
