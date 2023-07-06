<script>
  import { _ } from 'svelte-i18n';
</script>

<section class="hero is-medium is-grey is-bold is-centered">
  <div class="hero-body">
    <div class="container has-text-centered">
        <div class="title is-4">{$_('pages.end.title')}</div>
        <div class="content is-4">{$_('pages.end.content')}</div>
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
  }
</style>
