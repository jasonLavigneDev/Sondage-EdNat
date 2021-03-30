<script>
  import { formatDate } from "timeUtils";
  import { _ } from "svelte-i18n";

  export let date;
  export let slot = "";
  export let duration = "";
  const FORMAT_KEY_DATE = "#{H}:#{i}";
  let currentValue = new Date(date);
  let endTime = formatDate(
    new Date(
      currentValue.getYear(),
      currentValue.getMonth(),
      currentValue.getDate(),
      Number(slot.split(":")[0]) + Number(duration.split(":")[0]),
      Number(slot.split(":")[1]) + Number(duration.split(":")[1])
    ),
    FORMAT_KEY_DATE
  );
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
{#if slot}
  <div class="slot">
    {slot} - {endTime}
  </div>
{/if}

<style>
  div {
    text-align: center;
    font-size: 14px;
  }
  .date {
    color: var(--primary);
    font-size: 20px;
  }
  .slot {
    color: var(--primary);
    font-size: 16px;
  }
</style>
