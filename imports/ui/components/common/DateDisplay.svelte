<script>
  import { formatDate } from "timeUtils";
  import { _ } from "svelte-i18n";

  export let date;
  export let slot = "";
</script>

<div class="day">
  {formatDate(date, $_("components.Time.dateDayPollFormat"))}
</div>
<div class="date">
  {formatDate(date, $_("components.Time.dateDatePollFormat"))}
</div>
<div class="month">
  {formatDate(date, $_("components.Time.dateMonthPollFormat"))}
</div>
<div class="year">
  {formatDate(date, $_("components.Time.dateYearPollFormat"))}
</div>
{#if slot}
  <div class="slot">
    {slot}
  </div>
{/if}

<style>
  div {
    text-align: center;
    font-size: 14px;
  }
  .date {
    color: var(--primary);
    font-size: 22px;
  }
  .slot {
    color: var(--primary);
    font-size: 20px;
  }
</style>
