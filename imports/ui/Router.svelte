<script>
  import { Route, router } from "tinro";
  import { ROUTES } from "/imports/utils/enums";

  // components
  import Loader from "/imports/ui/components/common/Loader.svelte";

  // pages
  import Home from "/imports/ui/routes/Home/Home.svelte";
  import Login from "/imports/ui/routes/Login.svelte";
  import Polls from "/imports/ui/routes/Polls/Polls.svelte";

  import { currentUser, loggingIn } from "/imports/utils/functions/stores";
  import PollStepsRoutes from "./routes/PollEdition/PollStepsRoutes.svelte";
  import Poll from "./routes/Poll/Poll.svelte";
  import Transition from "./components/common/Transition.svelte";

  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Transition>
  {#if $loggingIn}
    <Loader />
  {:else if $currentUser}
    <Route path={ROUTES.ADMIN} let:meta>
      <Home {meta} />
    </Route>

    <Route path={ROUTES.POLLS} let:meta>
      <Polls {meta} />
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
    <Route fallback>Error 404</Route>
  {/if}

  <Route path={ROUTES.POLL}>
    {#if $currentUser}
      <Route path={ROUTES.NEW_POLL} let:meta>
        <PollStepsRoutes redirect={ROUTES.NEW_POLL_RM()} {meta} />
      </Route>

      <Route path={ROUTES.EDIT_POLL} let:meta>
        <PollStepsRoutes redirect={ROUTES.ADMIN} {meta} />
      </Route>
    {/if}

    <Route path={ROUTES.ANSWER_POLL} let:meta>
      <Poll {meta} />
    </Route>

    <Route path="*" redirect={ROUTES.LOGIN} />
  </Route>
</Transition>
