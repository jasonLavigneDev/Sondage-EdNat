<script>
  import { Meteor } from "meteor/meteor";
  import { _ } from "svelte-i18n";
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
</script>

<section class="hero is-medium is-grey is-bold is-centered">
  <div class="hero-body">
    <div class="container has-text-centered">
      <div class="title is-4">{$_("pages.login.title")}</div>
      <BigLink
        action={Meteor.loginWithKeycloak}
        text={$_("pages.login.signin")}
      />
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
  }
</style>
