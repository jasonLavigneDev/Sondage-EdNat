<script>
  import { formatDate } from "timeUtils";
  import { _ } from "svelte-i18n";

  import Divider from "/imports/ui/components/common/Divider.svelte";
  import NoResults from "/imports/ui/components/common/NoResults.svelte";

  export let dates;

  const removeDate = (date) => {
    dates = dates.filter((d) => d.date !== date.date);
  };
</script>

<div class="box">
  <h3 class="title is-5">{$_("pages.new_poll_2.selected_dates")}</h3>
  <Divider />
  {#if dates.length}
    <table class="table is-striped is-fullwidth">
      <tbody>
        {#each dates as date}
          <tr>
            <th>{formatDate(date.date, $_("components.Time.dateFormat"))}</th>
            <td>
              <button
                on:click={() => removeDate(date)}
                class="button is-rounded is-primary is-small"
              >
                <span class="icon is-small">
                  <i class="fas fa-trash" />
                </span>
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <NoResults title={$_("pages.new_poll_2.no_selected_dates")} />
  {/if}
</div>

<style>
  td {
    display: flex;
    justify-content: flex-end;
  }
</style>
