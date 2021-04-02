<script>
  import { _ } from "svelte-i18n";

  import { router } from "tinro";
  import { ROUTES } from "/imports/utils/enums";

  export let active;
  export let pollId;

  const steps = [
    { name: "components.StepBar.infos", url: 1 },
    { name: "components.StepBar.dates", url: 2 },
    { name: "components.StepBar.times", url: 3 },
    { name: "components.StepBar.validation", url: 4 },
  ];
  const goToStep = (url) => {
    if (pollId) {
      router.goto(ROUTES.EDIT_POLL_RM(pollId, url));
    } else {
      router.goto(ROUTES.NEW_POLL_RM(url));
    }
  };
</script>

<ul class="list-unstyled multi-steps">
  {#each steps as step}
    <li
      on:click={() => goToStep(step.url)}
      class:is-active={active == step.url}
    >
      {$_(step.name)}
    </li>
  {/each}
</ul>

<style>
  @charset "UTF-8";
  li.is-active ~ li:before,
  li.is-active:before {
    content: counter(stepNum);
    font-family: inherit;
    font-weight: 700;
  }
  li.is-active ~ li:after,
  li.is-active:after {
    background-color: #ededed;
  }

  .multi-steps {
    display: table;
    table-layout: fixed;
    width: 100%;
    margin-bottom: 40px;
  }
  li {
    counter-increment: stepNum;
    text-align: center;
    display: table-cell;
    position: relative;
    color: var(--primary);
    cursor: pointer;
  }
  li:before {
    content: "";
    content: "✓;";
    content: "𐀃";
    content: "𐀄";
    content: "✓";
    display: block;
    margin: 0 auto 4px;
    background-color: var(--primary);
    width: 36px;
    height: 36px;
    line-height: 32px;
    text-align: center;
    font-weight: bold;
    border-width: 2px;
    border-style: solid;
    border-color: var(--primary);
    border-radius: 50%;
    color: white;
    transition: all 200ms ease-in-out;
  }
  li:after {
    content: "";
    height: 2px;
    width: 100%;
    background-color: var(--primary);
    position: absolute;
    top: 16px;
    left: 50%;
    z-index: -1;
    transition: all 200ms ease-in-out;
  }
  li:last-child:after {
    display: none;
  }
  li.is-active:before {
    background-color: #fff;
    border-color: var(--primary);
    color: var(--primary);
  }
  li.is-active ~ li {
    color: #808080;
  }
  li.is-active ~ li:before {
    background-color: #ededed;
    border-color: #ededed;
  }
</style>
