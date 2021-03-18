<script>
  import { _ } from "svelte-i18n";
  import { formatDate } from "timeUtils";
  import { ROUTES } from "/imports/utils/enums";

  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import { newPollStore } from "/imports/utils/functions/stores";
  import InputTimePicker from "./components/InputTimePicker.svelte";
  export let meta;
  let timecolumns = 1;
  const FORMAT_KEY_DATE = "#{j}-#{m}-#{Y}";

  $: $newPollStore.dates.forEach((date) => {
    if ($newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]) {
      let dateSlotsSize =
        $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)].length;
      if (dateSlotsSize > timecolumns) {
        timecolumns = dateSlotsSize;
      }
    }
  });

  const addTimeSlot = (date) => {
    if (!$newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]) {
      $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)] = [];
    }
    const slotNumber = Object.keys(
      $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]
    ).length;
    if (!$newPollStore.times[formatDate(date, FORMAT_KEY_DATE)]) {
      $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)] = ["00:00"];
    } else {
      $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)][slotNumber] =
        "00:00";
    }
  };

  const removeSlot = (date, index) => {
    const newSlots = [];
    $newPollStore.times[date].forEach((t, i) => {
      if (index !== i) {
        newSlots.push(t);
      }
    });
    $newPollStore.times[date] = newSlots;
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
                {#each $newPollStore.times[formatDate(date, FORMAT_KEY_DATE)] as column, i}
                  <td>
                    <div class="single-time">
                      <InputTimePicker
                        {date}
                        formatedDate={formatDate(date, FORMAT_KEY_DATE)}
                        key={i}
                        value={$newPollStore.times[
                          formatDate(date, FORMAT_KEY_DATE)
                        ][i]}
                      />
                      <span
                        class="icon is-small"
                        on:click={() =>
                          removeSlot(formatDate(date, FORMAT_KEY_DATE), i)}
                      >
                        <i class="fas fa-trash" />
                      </span>
                    </div>
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
  .single-time {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon {
    margin-right: 8px;
    margin-left: 8px;
    cursor: pointer;
  }
  .fa-trash {
    color: red;
  }
</style>
