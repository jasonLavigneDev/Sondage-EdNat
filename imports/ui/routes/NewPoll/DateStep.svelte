<script>
  import { _ } from "svelte-i18n";
  import { ROUTES } from "/imports/utils/enums";
  import Datepicker from "./components/calendar/Datepicker.svelte";
  import SelectedDatesTable from "./components/SelectedDatesTable.svelte";

  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import { newPollStore } from "/imports/utils/functions/stores";
  export let meta;
</script>

<svelte:head>
  <title>{$_("title")} | {$_("links.new_poll_2")}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">{$_("pages.new_poll_2.title")}</h1>
    <div class="columns is-multiline is-mobile">
      <div class="column is-half-desktop is-full-mobile">
        <Datepicker bind:selected={$newPollStore.dates} />
      </div>
      <div class="column is-half-desktop is-full-mobile">
        <SelectedDatesTable bind:dates={$newPollStore.dates} />
      </div>
      <div class="column is-full">
        <Divider />
      </div>
      <div class="column is-half-desktop is-full-mobile">
        <BigLink
          link={ROUTES.NEW_POLL_1}
          text={$_("pages.new_poll.previous")}
          color="is-secondary"
        />
      </div>
      <div class="column is-half-desktop is-full-mobile is-right">
        <BigLink
          disabled={!$newPollStore.dates.length}
          link={ROUTES.NEW_POLL_3}
          text={$_("pages.new_poll.next")}
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
