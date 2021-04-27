<script>
  import moment from "moment";
  import { _ } from "svelte-i18n";
  import { DURATIONS_TIME } from "../../../utils/enums";

  export let date;
  export let slot = "";
  export let duration = "";
  const FORMAT_KEY_DATE = "HH:mm";
  let endTime = moment(date)
    .hour(slot.split(":")[0])
    .minute(slot.split(":")[1])
    .add(DURATIONS_TIME[duration], "minutes")
    .format(FORMAT_KEY_DATE);
</script>

<div class="day">
  {moment(date).format($_("components.Time.dateDayPollFormat"))}
</div>
<div class="date">
  {moment(date).format($_("components.Time.dateDatePollFormat"))}
</div>
<div class="month">
  {moment(date).format($_("components.Time.dateMonthPollFormat"))}
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
