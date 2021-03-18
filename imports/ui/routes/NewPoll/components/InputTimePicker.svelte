<script>
  import { onMount } from "svelte";

  import { _ } from "svelte-i18n";

  import TimePicker from "svelte-time-picker";
  import { formatDate } from "timeUtils";
  import { newPollStore } from "/imports/utils/functions/stores";

  export let date;
  export let formatedDate;
  export let value;
  export let key;
  export let duration;
  let currentValue = new Date(
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    value ? value.split(":")[0] : "00",
    value ? value.split(":")[1] : "00"
  );
  let endTime = formatDate(
    new Date(
      currentValue.getYear(),
      currentValue.getMonth(),
      currentValue.getDate(),
      value
        ? value.split(":")[0] + Number(duration.split(":")[0])
        : Number(duration.split(":")[0]),
      value
        ? value.split(":")[1] + Number(duration.split(":")[1])
        : Number(duration.split(":")[1])
    ),
    FORMAT_KEY_DATE
  );
  const FORMAT_KEY_DATE = "#{H}:#{i}";

  let open = false;
  const toggleModal = () => {
    open = !open;
  };
  const handleChange = (e) => {
    const newDate = e.detail;
    $newPollStore.dates.forEach((day, i) => {
      if (day.date === date) {
        $newPollStore.dates[i].slots[key] = formatDate(
          newDate,
          FORMAT_KEY_DATE
        );
      }
    });
  };
  const options = {
    bgColor: "#011caa",
    is24h: true,
    hasButtons: true,
    buttonOk: "OK",
    buttonNow: "",
    buttonCancel: $_("pages.new_poll.cancel"),
    buttonClassName: "button is-light",
  };

  $: endTime = formatDate(
    new Date(
      currentValue.getYear(),
      currentValue.getMonth(),
      currentValue.getDate(),
      value
        ? Number(value.split(":")[0]) + Number(duration.split(":")[0])
        : Number(duration.split(":")[0]),
      value
        ? Number(value.split(":")[1]) + Number(duration.split(":")[1])
        : Number(duration.split(":")[1])
    ),
    FORMAT_KEY_DATE
  );
</script>

<button class="button is-light is-fullwidth" on:click={toggleModal}
  >{$_("components.InputTimePicker.from")}
  {value}
  {$_("components.InputTimePicker.to")}
  {endTime}</button
>

<div class="modal" class:is-active={open}>
  <div class="modal-background" />
  <div class="modal-content">
    <TimePicker
      {options}
      date={currentValue}
      on:cancel={toggleModal}
      on:change={handleChange}
      on:ok={toggleModal}
    />
  </div>
  <button
    class="modal-close is-large"
    on:click={toggleModal}
    aria-label="close"
  />
</div>

<style>
  .modal-content {
    display: flex;
    justify-content: center;
  }
</style>
