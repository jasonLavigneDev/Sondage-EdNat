<script>
  import { Route } from 'tinro';

  import { ROUTES } from '/imports/utils/enums';
  import InfoStep from './InfoStep.svelte';
  import DateStep from './DateStep.svelte';
  import TimeStep from './TimeStep.svelte';
  import ValidationStep from './ValidationStep.svelte';
  import { newPollStore } from '/imports/utils/functions/stores';
  import { POLLS_TYPES } from '/imports/utils/enums';
  import CalendarStep from './CalendarStep.svelte';
  import { currentUser, loggingIn, accountsConfigured } from '/imports/utils/functions/stores';

  export let redirect;
  export let meta;

  $: if (!$currentUser && !$loggingIn && $accountsConfigured === true) {
    Meteor.loginWithKeycloak();
  }
</script>

{#if $currentUser}
  <Route path="/1">
    <InfoStep {meta} />
  </Route>

  <Route path="/2">
    {#if $newPollStore.type === POLLS_TYPES.POLL}
      <DateStep {meta} />
    {:else}
      <CalendarStep {meta} />
    {/if}
  </Route>

  <Route path="/3">
    {#if $newPollStore.type === POLLS_TYPES.POLL}
      <TimeStep {meta} />
    {:else}
      <ValidationStep {meta} />
    {/if}
  </Route>

  <Route path="/4">
    <ValidationStep {meta} />
  </Route>

  <Route path="*" {redirect} />
{/if}
