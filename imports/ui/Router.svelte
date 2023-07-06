<script>
  import { Route, router } from 'tinro';
  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import { Accounts } from 'meteor/accounts-base';
  import { onDestroy } from 'svelte';
  import { ROUTES } from '/imports/utils/enums';
  import { settings } from '../utils/functions/stores';

  // components
  import Loader from '/imports/ui/components/common/Loader.svelte';

  // pages
  import Home from '/imports/ui/routes/Home/Home.svelte';
  import Login from '/imports/ui/routes/Login.svelte';
  import Polls from '/imports/ui/routes/Polls/Polls.svelte';

  import { currentUser, loggingIn } from '/imports/utils/functions/stores';
  import PollStepsRoutes from './routes/PollEdition/PollStepsRoutes.svelte';
  import Poll from './routes/Poll/Poll.svelte';
  import MeetingAnswerCancel from './routes/Poll/MeetingAnswerCancel.svelte';
  import MeetingAnswerEdit from './routes/Poll/MeetingAnswerEdit.svelte';
  import Transition from './components/common/Transition.svelte';
  import Logout from './routes/Logout.svelte';
  import Maintenance from './routes/Maintenance.svelte';
  import UserWarning from './components/common/UserWarning.svelte';
  import End from './routes/End.svelte';

  router.subscribe((_) => window.scrollTo(0, 0));

  $: loading = $loggingIn || $settings.maintenance === null;
  let userFailed = false;

  // detect account creation failure (i.e: if logging in from keycloak)
  const stopCallback = Accounts.onLoginFailure((details) => {
    if (details.error.error === 'api.users.createUser') userFailed = true;
  });

  onDestroy(() => {
    if (typeof stopCallback.stop == 'function') stopCallback.stop();
  });
</script>

<Transition>
  {#if loading}
    <Loader />
  {:else if userFailed === true}
    <UserWarning />
  {:else}
    <Route>
      <Route path={ROUTES.LOGOUT} let:meta>
        <Logout {meta} />
      </Route>
      {#if $settings.maintenance === true}
        <Route path={ROUTES.MAINTENANCE}>
          <Maintenance textMaintenance={$settings.textMaintenance} />
        </Route>
      {:else}
        <Route path={ROUTES.LOGIN}>
          <Login />
        </Route>
        <Route path={ROUTES.END}>
          <End />
        </Route>
        {#if $currentUser}
          <Route path={ROUTES.POLLS} let:meta>
            <Polls {meta} />
          </Route>
          <Route path={ROUTES.ADMIN} let:meta>
            <Home {meta} />
          </Route>
          <Route path={ROUTES.CANCEL_ANSWER} let:meta>
            <MeetingAnswerCancel {meta} />
          </Route>
          <Route path={ROUTES.EDIT_ANSWER} let:meta>
            <MeetingAnswerEdit {meta} />
          </Route>
          <Route path="/" redirect={ROUTES.POLLS} />
        {/if}
        <Route path={ROUTES.POLL}>
          {#if $currentUser}
            <Route path={ROUTES.EDIT_POLL} let:meta>
              <PollStepsRoutes redirect={ROUTES.ADMIN} {meta} />
            </Route>
          {/if}
          <Route path={ROUTES.NEW_POLL} let:meta>
            <PollStepsRoutes redirect={ROUTES.NEW_POLL_RM()} {meta} />
          </Route>
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
      {/if}
    </Route>
  {/if}
</Transition>
