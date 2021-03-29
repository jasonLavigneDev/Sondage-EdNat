<script>
  import { Route } from "tinro";

  import InfoStep from "./InfoStep.svelte";
  import DateStep from "./DateStep.svelte";
  import TimeStep from "./TimeStep.svelte";
  import ValidationStep from "./ValidationStep.svelte";
  import { newPollStore } from "/imports/utils/functions/stores";

  export let redirect;
  export let meta;
</script>

<Route path="/1">
  <InfoStep {meta} />
</Route>

{#if $newPollStore.title}
  <Route path="/2">
    <DateStep {meta} />
  </Route>
{:else}
  <Route path="/2" {redirect} />
{/if}

{#if $newPollStore.dates.length}
  <Route path="/3">
    <TimeStep {meta} />
  </Route>
{:else}
  <Route path="/3" {redirect} />
{/if}

{#if $newPollStore.dates.length}
  <Route path="/4">
    <ValidationStep {meta} />
  </Route>
{:else}
  <Route path="/4" {redirect} />
{/if}

<Route path="*" {redirect} />
