<script>
  import moment from 'moment';
  import { _ } from 'svelte-i18n';

  import Divider from '/imports/ui/components/common/Divider.svelte';
  import NoResults from '/imports/ui/components/common/NoResults.svelte';

  export let dates = null;
  export let meetingSlots = false;

  const removeDate = (date) => {
    dates = dates.filter((d) => d !== date);
  };
</script>

<div class="box">
  <h3 class="title is-5">{$_('pages.new_poll_2.selected_dates')}</h3>
  <Divider />
  {#if dates.length}
    <table class="table is-striped is-fullwidth" style="margin-top: -3vh;">
      <tbody>
        {#each dates as date}
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
              <button on:click={() => removeDate(date)} class="button is-rounded is-primary is-small mt-2">
                <span class="icon is-small">
                  <i class="fas fa-trash" />
                </span>
              </button>
            </th>
          </tr>
        {/each}
      </tbody>
    </table>
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
