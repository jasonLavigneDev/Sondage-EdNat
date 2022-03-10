<script>
  import { Route, router } from 'tinro';
  import { ROUTES } from '/imports/utils/enums';

  // components
  import Loader from '/imports/ui/components/common/Loader.svelte';

  // pages
  import Home from '/imports/ui/routes/Home/Home.svelte';
  import Login from '/imports/ui/routes/Login.svelte';
  import Polls from '/imports/ui/routes/Polls/Polls.svelte';

  import { currentUser, loggingIn } from '/imports/utils/functions/stores';
  import PollStepsRoutes from './routes/PollEdition/PollStepsRoutes.svelte';
  import Poll from './routes/Poll/Poll.svelte';
  import Transition from './components/common/Transition.svelte';
  import Logout from './routes/Logout.svelte';

  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Transition>
  <!--
  XXXX FIXME:
  - redirect en boucle si reconnexion depuis page de logout
  - appel à loginwithKeycloak pas toujours effectué depuis login
-->

  {#if $loggingIn}
    <Loader />
  {:else}
    <Route>
      <Route path={ROUTES.LOGOUT} let:meta>
        <Logout {meta} />
      </Route>
      <Route path={ROUTES.LOGIN}>
        <Login />
      </Route>
      {#if $currentUser}
        <Route path={ROUTES.POLLS} let:meta>
          <Polls {meta} />
        </Route>
        <Route path={ROUTES.ADMIN} let:meta>
          <Home {meta} />
        </Route>
        <Route path="/" redirect={ROUTES.POLLS} />
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
      <Route fallback redirect={$currentUser ? null : ROUTES.LOGIN}>
        {#if $currentUser}
          Error 404
        {/if}
      </Route>
    </Route>
  {/if}
</Transition>
