<script>
  import { _ } from "svelte-i18n";
  import { formatDate } from "timeUtils";
  import { ROUTES } from "/imports/utils/enums";

  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import { newPollStore } from "/imports/utils/functions/stores";
  import { onMount } from "svelte";
  import App from "../../App.svelte";
  export let meta;
  let timecolumns = 1;
  const FORMAT_KEY_DATE = "#{j}-#{m}-#{Y}";

  $: $newPollStore.dates.forEach((date) => {
    if ($newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]) {
      let dateSlotsSize = Object.keys(
        $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]
      ).length;
      if (dateSlotsSize > timecolumns) {
        timecolumns = dateSlotsSize;
      }
    }
  });

  onMount(() => {
    $newPollStore.dates.forEach((date) => {
      $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)] = {};
    });
  });

  const addTimeSlot = (date) => {
    const slotNumber = Object.keys(
      $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]
    ).length;
    $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)][
      `slot${slotNumber + 1}`
    ] = "";
  };
</script>

<svelte:head>
  <title>{$_("title")} | {$_("links.new_poll_3")}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">{$_("pages.new_poll_3.title")}</h1>
    <div class="box">
      <table class="table is-striped is-fullwidth is-bordered is-narrow">
        <thead>
          <tr>
            <th />
            {#each new Array(timecolumns) as column, i}
              <th>{`${$_("pages.new_poll_3.timeslot")} ${i + 1}`}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each $newPollStore.dates as date}
            <tr>
              <th>
                {formatDate(date, $_("components.Time.dateFormat"))}
              </th>
              {#if $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]}
                {#each Object.keys($newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]) as column, i}
                  <td>
                    <input
                      class="input"
                      bind:value={$newPollStore.times[
                        formatDate(date, FORMAT_KEY_DATE)
                      ][column]}
                      placeholder={`${$_("pages.new_poll_3.timeslot")} ${
                        i + 1
                      }`}
                    />
                  </td>
                {/each}
              {/if}
              <td>
                <BigLink
                  action={() => addTimeSlot(date)}
                  text={$_("pages.new_poll_3.new_slot")}
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="columns is-multiline">
      <div class="column is-full">
        <Divider />
      </div>
      <div class="column is-half-desktop is-full-mobile">
        <BigLink
          link={ROUTES.NEW_POLL_2}
          text={$_("pages.new_poll.previous")}
          color="is-secondary"
        />
      </div>
      <div class="column is-half-desktop is-full-mobile is-right">
        <BigLink
          disabled={!$newPollStore.times}
          link={ROUTES.NEW_POLL_4}
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
