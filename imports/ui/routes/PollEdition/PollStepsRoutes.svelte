<script>
  import { Route } from "tinro";

  import InfoStep from "./InfoStep.svelte";
  import DateStep from "./DateStep.svelte";
  import TimeStep from "./TimeStep.svelte";
  import ValidationStep from "./ValidationStep.svelte";
  import { newPollStore } from "/imports/utils/functions/stores";
  import { POLLS_TYPES } from "/imports/utils/enums";
  import CalendarStep from "./CalendarStep.svelte";

  export let redirect;
  export let meta;
</script>

<Route path="/1">
  <InfoStep {meta} />
</Route>

{#if $newPollStore.title}
  <Route path="/2">
    {#if $newPollStore.type === POLLS_TYPES.POLL}
      <DateStep {meta} />
    {:else}
      <CalendarStep {meta} />
    {/if}
  </Route>
{:else}
  <Route path="/2" {redirect} />
{/if}

{#if $newPollStore.dates.length || $newPollStore.meetingSlots.length}
  <Route path="/3">
    {#if $newPollStore.type === POLLS_TYPES.POLL}
      <TimeStep {meta} />
    {:else}
      <ValidationStep {meta} />
    {/if}
  </Route>
{:else}
  <Route path="/3" {redirect} />
{/if}

{#if $newPollStore.dates.length && $newPollStore.type === POLLS_TYPES.POLL}
  <Route path="/4">
    <ValidationStep {meta} />
  </Route>
{:else}
  <Route path="/4" {redirect} />
{/if}

<Route path="*" {redirect} />
