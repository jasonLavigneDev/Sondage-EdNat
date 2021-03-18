<script>
  import { _ } from "svelte-i18n";

  import TimePicker from "svelte-time-picker";
  import { formatDate } from "timeUtils";
  import { newPollStore } from "/imports/utils/functions/stores";

  export let date;
  export let formatedDate;
  export let value;
  export let key;
  const FORMAT_KEY_DATE = "#{H}:#{i}";

  let open = false;
  const toggleModal = () => {
    open = !open;
  };
  const handleChange = (e) => {
    const newDate = e.detail;
    $newPollStore.times[formatedDate][key] = formatDate(
      newDate,
      FORMAT_KEY_DATE
    );
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
  const currentValue = new Date(
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    value.split(":")[0],
    value.split(":")[1]
  );
</script>

<button class="button is-light is-fullwidth" on:click={toggleModal}
  >{value}</button
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
