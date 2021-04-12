<script>
  import { _ } from "svelte-i18n";
  import moment from "moment";

  import TimePicker from "svelte-time-picker";
  import { newPollStore } from "/imports/utils/functions/stores";
  import { DURATIONS_TIME } from "../../../../utils/enums";

  export let date;
  export let disabled = false;
  export let value;
  const FORMAT_KEY_DATE = "HH:mm";
  let currentValue = new Date(
    moment(date)
      .set("hour", value ? value.split(":")[0] : "00")
      .set("minute", value ? value.split(":")[1] : "00")
      .set("millisecond", 0)
  );
  let endTime;
  $: endTime = moment(currentValue)
    .add(DURATIONS_TIME[$newPollStore.duration], "minutes")
    .format(FORMAT_KEY_DATE);
  let open = false;
  const toggleModal = () => {
    if (disabled) return;
    open = !open;
  };
  const handleChange = (e) => {
    const newDate = e.detail;
    value = moment(newDate).format(FORMAT_KEY_DATE);
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
</script>

<button class="button is-light" on:click={toggleModal}
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
