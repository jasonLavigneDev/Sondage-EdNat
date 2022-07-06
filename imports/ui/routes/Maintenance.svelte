<script>
  import { _ } from 'svelte-i18n';

  export let textMaintenance = '';
</script>

<section class="hero is-centered has-text-white">
  <div class="container">
    <div class="content has-text-centered">
      <h1 class="title is-4">{$_('pages.maintenance.title')}</h1>
      <p class="title is-5">{$_(textMaintenance)}</p>
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
  }
  .container {
    border: rgba(255, 0, 0, 0.7) solid 5px;
    padding: 3vh;
    border-radius: 15px;
    background-color: white;
  }
  .content {
    justify-content: center;
  }
</style>
