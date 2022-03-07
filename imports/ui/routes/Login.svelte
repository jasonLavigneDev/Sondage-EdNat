<script>
  import { Meteor } from 'meteor/meteor';
  import { _ } from 'svelte-i18n';
  import { router } from 'tinro';
  import { ROUTES } from '../../utils/enums';
  import { currentUser, loggingIn, accountsConfigured } from '/imports/utils/functions/stores';

  const checkLogin = () => {
    Meteor.loginWithKeycloak((err) => console.log('Error authenticating with keycloak: ', JSON.stringify(err)));
  };

  $: if (!Meteor.userId() && !$loggingIn && $accountsConfigured === true) {
    checkLogin();
  }
  $: if ($currentUser && !$loggingIn) {
    router.goto(ROUTES.POLLS);
  }
</script>

<section class="hero is-medium is-grey is-bold is-centered">
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="title is-4">{$_('pages.login.title')}</div>
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
  }
</style>
