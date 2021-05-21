<script>
  import { _ } from 'svelte-i18n';
  import moment from 'moment';
  import { ROUTES } from '/imports/utils/enums';

  // components
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  import Divider from '/imports/ui/components/common/Divider.svelte';
  import { newPollStore } from '/imports/utils/functions/stores';
  import InputTimePicker from './components/InputTimePicker.svelte';
  import Checkbox from '../../components/common/Checkbox.svelte';
  import StepBar from '../../components/common/StepBar.svelte';
  import { DURATIONS } from '../../../utils/enums';
  import PackageJSON from '../../../../package.json';
  let version = PackageJSON.version;

  export let meta;
  let timecolumns = 1;

  $: $newPollStore.dates.forEach((date) => {
    if (date.slots) {
      let dateSlotsSize = date.slots.length;
      if (dateSlotsSize > timecolumns) {
        timecolumns = dateSlotsSize;
      }
    }
  });

  const addTimeSlot = (date) => {
    $newPollStore.dates.forEach((day, i) => {
      if (day.date === date) {
        $newPollStore.dates[i].slots = [...$newPollStore.dates[i].slots, '00:00'];
      }
    });
  };

  const removeSlot = (date, index) => {
    const newSlots = [];

    $newPollStore.dates.forEach((day, i) => {
      if (day.date === date) {
        day.slots.forEach((t, i) => {
          if (index !== i) {
            newSlots.push(t);
          }
        });
        $newPollStore.dates[i].slots = newSlots;
      }
    });
  };

  const applyEverywhere = (time, index) => {
    $newPollStore.dates.forEach((day, i) => {
      if (!day.slots) {
        $newPollStore.dates[i].slots = [];
      }
      if (day.slots.length < index + 1) {
        $newPollStore.dates[i].slots.length = index + 1;
      }
      $newPollStore.dates[i].slots[index] = time;
    });
  };

</script>

<svelte:head>
  <title>{$_('title')} {version} | {$_(meta.params._id ? 'links.edit_poll_3' : 'links.new_poll_3')}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {$_(meta.params._id ? 'pages.new_poll_3.title_edit' : 'pages.new_poll_3.title')}
    </h1>
    <StepBar active={3} pollId={meta.params._id} />
    <div class="box">
      <div class="columns is-multiline">
        <div class="column is-full">
          <label class="label">{$_('pages.new_poll_3.duration')}</label>
          <div class="field has-addons">
            <div class="control">
              <div class="select is-fullwidth">
                <select
                  bind:value={$newPollStore.duration}
                  placeholder={$_('pages.new_poll_3.duration')}
                  disabled={$newPollStore.allDay}
                >
                  {#each DURATIONS as duration}
                    <option value={duration}>
                      {duration}
                    </option>
                  {/each}
                </select>
              </div>
            </div>
            <div class="control">
              <div class="button is-light">
                {$_('pages.new_poll_3.hour')}
              </div>
            </div>
          </div>
        </div>
        <div class="column is-full">
          <div class="field">
            <div class="control">
              <Checkbox bind:checked={$newPollStore.allDay} label={$_('pages.new_poll_3.allDay_input')} />
            </div>
          </div>
        </div>
        <div class="column is-full">
          <div class="table-container">
            <table class="table is-striped is-fullwidth is-bordered">
              {#if !$newPollStore.allDay}
                <thead>
                  <tr>
                    <th />
                    {#each new Array(timecolumns) as column, i}
                      <th>{`${$_('pages.new_poll_3.timeslot')} ${i + 1}`}</th>
                    {/each}
                  </tr>
                </thead>
              {/if}

              <tbody>
                {#each $newPollStore.dates as day}
                  <tr>
                    <th>
                      {moment(day.date).format($_('components.Time.dateFormat'))}
                    </th>
                    {#if !$newPollStore.allDay && day.slots}
                      {#each day.slots as slot, i}
                        <td>
                          <div class="single-time">
                            <InputTimePicker date={day.date} key={i} bind:value={slot} />
                            <span class="icon is-small" on:click={() => applyEverywhere(slot, i)}>
                              <i class="fas fa-sort" />
                            </span>
                            <span class="icon is-small" on:click={() => removeSlot(day.date, i)}>
                              <i class="fas fa-trash" />
                            </span>
                          </div>
                        </td>
                      {/each}
                    {/if}
                    {#if !$newPollStore.allDay}
                      <td>
                        <BigLink action={() => addTimeSlot(day.date)} text={$_('pages.new_poll_3.new_slot')} />
                      </td>
                    {/if}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-multiline">
      <div class="column is-full">
        <Divider />
      </div>
      <div class="column is-half-desktop is-full-mobile">
        <BigLink
          link={meta.params._id ? ROUTES.EDIT_POLL_RM(meta.params._id, 2) : ROUTES.NEW_POLL_RM(2)}
          text={$_('pages.new_poll.previous')}
          color="is-secondary"
        />
      </div>
      <div class="column is-half-desktop is-full-mobile is-right">
        <BigLink
          disabled={$newPollStore.allDay ? false : !($newPollStore.dates[0] && $newPollStore.dates[0].slots.length)}
          link={meta.params._id ? ROUTES.EDIT_POLL_RM(meta.params._id, 4) : ROUTES.NEW_POLL_RM(4)}
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
