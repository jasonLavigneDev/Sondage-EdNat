<script>
  // import { Meteor } from 'meteor/meteor';
  import { _ } from 'svelte-i18n';
  import { router } from 'tinro';
  import { ROUTES } from '../../utils/enums';
  import { currentUser } from '../../utils/functions/stores';
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
</script>

<section class="hero is-medium is-grey is-bold is-centered">
  <div class="hero-body">
    <div class="container has-text-centered">
      {#if !$currentUser}
        <div class="title is-4">{$_('pages.logout.title')}</div>
        <BigLink action={() => router.goto(ROUTES.LOGIN)} text={$_('pages.login.signin')} />
      {:else}
        <div class="title is-4">{$_('pages.logout.title2')}</div>
        <BigLink link={ROUTES.POLL} text={$_('pages.logout.go_home')} />
      {/if}
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
  }
</style>
