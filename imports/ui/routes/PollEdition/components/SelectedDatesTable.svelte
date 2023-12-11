<script>
  import moment from 'moment';
  import { _ } from 'svelte-i18n';

  import Divider from '/imports/ui/components/common/Divider.svelte';
  import NoResults from '/imports/ui/components/common/NoResults.svelte';

  export let dates = null;
  export let meetingSlots = false;
  export let answers;

  $: isSlotTaken = (date) => Boolean(answers?.find((a) => moment(a.meetingSlot).isSame(date.start)));

  const removeDate = (date) => {
    dates = dates.filter((d) => d !== date);
  };
</script>

<div class="box">
  <h3 class="title is-5">{$_('pages.new_poll_2.selected_dates')}</h3>
  <Divider />
  {#if dates.length}
    <div style="height:{meetingSlots ? '84vh' : '37vh'}; overflow-y: auto">
      <table class="table is-striped is-fullwidth">
        <tbody>
          {#each dates.sort((a, b) => a.date - b.date) as date}
            <tr>
              <th>
                {#if meetingSlots}
                  {moment(date.start).format($_('components.Time.dateFormat'))} /
                  {moment(date.start).format('HH:mm')}
                  -
                  {moment(date.end).format('HH:mm')}
                {:else}
                  {moment(date.date).format($_('components.Time.dateFormat'))}
                {/if}
              </th>
              <th>
                <button
                  disabled={isSlotTaken(date)}
                  on:click={() => removeDate(date)}
                  class="button is-rounded is-primary is-small mt-2"
                >
                  <span class="icon is-small">
                    <i class="fas fa-trash" />
                  </span>
                </button>
              </th>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <NoResults title={$_('pages.new_poll_2.no_selected_dates')} />
  {/if}
</div>

<style>
  td {
    display: flex;
    justify-content: flex-end;
  }
</style>
