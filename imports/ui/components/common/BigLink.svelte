<script>
  import { globalState } from "/imports/utils/functions/stores";

  const { state } = globalState();
  export let link = "",
    text = "",
    action = null,
    color = "is-primary",
    disabled = false;
  const onClick = () => (action ? action() : null);
</script>

<a
  class:is-fullwidth={$state.mobile}
  class:disabled
  class={`button ${color}`}
  rel="prefetch"
  href={disabled ? "" : link}
  on:click={disabled ? null : onClick}
>
  {text}</a
>

<style>
  a {
    font-size: 16px;
    transition: all 0.2s ease-in-out;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
  }
  .disabled {
    opacity: 0.6;
  }
  a:not(.disabled):hover {
    color: var(--primary) !important;
    background-color: var(--tertiary) !important;
  }
</style>
