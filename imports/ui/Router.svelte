<script>
  import { Route, router } from "tinro";
  import { ROUTES } from "/imports/utils/enums";

  // components
  import Loader from "/imports/ui/components/common/Loader.svelte";

  // pages
  import Home from "/imports/ui/routes/Home/Home.svelte";
  import DateStep from "/imports/ui/routes/NewPoll/DateStep.svelte";
  import Login from "/imports/ui/routes/Login.svelte";
  import Poll from "/imports/ui/routes/Poll.svelte";

  import {
    currentUser,
    loggingIn,
    newPollStore,
  } from "/imports/utils/functions/stores";
  import InfoStep from "./routes/NewPoll/InfoStep.svelte";
  import TimeStep from "./routes/NewPoll/TimeStep.svelte";
  import ValidationStep from "./routes/NewPoll/ValidationStep.svelte";

  router.subscribe((_) => window.scrollTo(0, 0));
</script>

{#if $loggingIn}
  <Loader />
{:else if $currentUser}
  <Route path={ROUTES.ADMIN} let:meta>
    <Home {meta} />
  </Route>
  <Route path={ROUTES.NEW_POLL}>
    <Route path="/1" let:meta>
      <InfoStep {meta} />
    </Route>

    {#if $newPollStore.title}
      <Route path="/2" let:meta>
        <DateStep {meta} />
      </Route>
    {:else}
      <Route path="/2" redirect={ROUTES.NEW_POLL_1} />
    {/if}

    {#if $newPollStore.dates.length}
      <Route path="/3" let:meta>
        <TimeStep {meta} />
      </Route>
    {:else}
      <Route path="/3" redirect={ROUTES.NEW_POLL_1} />
    {/if}

    {#if $newPollStore.dates.length}
      <Route path="/4" let:meta>
        <ValidationStep {meta} />
      </Route>
    {:else}
      <Route path="/4" redirect={ROUTES.NEW_POLL_1} />
    {/if}

    <Route path="*" redirect={ROUTES.NEW_POLL_1} />
  </Route>

  <Route path={ROUTES.POLLS} let:meta>
    <Poll {meta} />
  </Route>

  <Route path={ROUTES.LOGIN} redirect={ROUTES.POLLS} />
  <Route path="/" redirect={ROUTES.POLLS} />

  <Route fallback>Error 404</Route>
{:else}
  <Route path={ROUTES.LOGIN} let:meta>
    <Login {meta} />
  </Route>
  <Route path={ROUTES.POLLS} redirect={ROUTES.LOGIN} />
  <Route path={ROUTES.ADMIN} redirect={ROUTES.LOGIN} />
  <Route path={ROUTES.NEW_POLL} redirect={ROUTES.LOGIN} />
  <Route path="/" redirect={ROUTES.LOGIN} />
{/if}
