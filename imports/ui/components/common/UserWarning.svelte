<script>
  import { _ } from 'svelte-i18n';
  import { Meteor } from 'meteor/meteor';
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  const { laboiteHost } = Meteor.settings.public;
</script>

<div>
  <section class="box-transparent">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-full">
          <p>
            {$_('components.UserWarning.loginMsg')}<a href="#" on:click={Meteor.loginWithKeycloak}
              >{$_('components.UserWarning.loginLink')}
            </a>
          </p>
        </div>
        <div class="column is-full">
          <BigLink
            text={$_('components.UserWarning.loginLaboite')}
            color="is-primary"
            action={() => window.open(`${laboiteHost}/signin`, '_blank')}
          />
        </div>
      </div>
    </div>
  </section>
</div>

<style>
</style>
