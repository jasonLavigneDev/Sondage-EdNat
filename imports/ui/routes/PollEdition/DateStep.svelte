<script>
  import { _ } from 'svelte-i18n';
  import { ROUTES } from '/imports/utils/enums';
  import Datepicker from './components/calendar/Datepicker.svelte';
  import SelectedDatesTable from './components/SelectedDatesTable.svelte';

  // components
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  import Divider from '/imports/ui/components/common/Divider.svelte';
  import { newPollStore } from '/imports/utils/functions/stores';
  import StepBar from '../../components/common/StepBar.svelte';
  import PackageJSON from '../../../../package.json';
  let version = PackageJSON.version;
  export let meta;

</script>

<svelte:head>
  <title>{$_('title')} {version} | {$_(meta.params._id ? 'links.edit_poll_2' : 'links.new_poll_2')}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {$_(meta.params._id ? 'pages.new_poll_2.title_edit' : 'pages.new_poll_2.title')}
    </h1>
    <StepBar active={2} pollId={meta.params._id} />
    <div class="columns is-multiline is-mobile">
      <div class="column is-half-desktop is-full-mobile">
        <Datepicker start={new Date()} bind:selected={$newPollStore.dates} />
      </div>
      <div class="column is-half-desktop is-full-mobile">
        <SelectedDatesTable bind:dates={$newPollStore.dates} />
      </div>
      <div class="column is-full">
        <Divider />
      </div>
      <div class="column is-half-desktop is-full-mobile">
        <BigLink
          link={meta.params._id ? ROUTES.EDIT_POLL_RM(meta.params._id, 1) : ROUTES.NEW_POLL_RM(1)}
          text={$_('pages.new_poll.previous')}
          color="is-secondary"
        />
      </div>
      <div class="column is-half-desktop is-full-mobile is-right">
        <BigLink
          disabled={!$newPollStore.dates.length}
          link={meta.params._id ? ROUTES.EDIT_POLL_RM(meta.params._id, 3) : ROUTES.NEW_POLL_RM(3)}
          text={$_('pages.new_poll.next')}
        />
      </div>
    </div>
  </div>
</section>

<style>
  .is-right {
    display: flex;
    justify-content: flex-end;
  }

</style>
