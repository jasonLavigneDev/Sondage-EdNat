<script>
  import { Meteor } from 'meteor/meteor';
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { router } from 'tinro';
  import { toast } from '@zerodevx/svelte-toast';
  import moment from 'moment';

  import { ROUTES, toasts } from '/imports/utils/enums';
  import { currentUser, loggingIn, accountsConfigured } from '/imports/utils/functions/stores';
  import isValideMail from '/imports/utils/functions/email';
  // components
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  import Divider from '/imports/ui/components/common/Divider.svelte';
  import Loader from '/imports/ui/components/common/Loader.svelte';
  import CalendarPoll from './CalendarPoll.svelte';
  import PollDateTable from './PollDateTable.svelte';
  import { POLLS_TYPES } from '../../../utils/enums';
  import MeetingAnswersList from './MeetingAnswersList.svelte';
  import PackageJSON from '../../../../package.json';
  import Modal from '../../components/common/Modal.svelte';

  let version = PackageJSON.version;

  $: mobile = () => window.innerWidth < 600;

  export let meta;
  let selectedGroups;
  let poll = {};
  let loading = false;
  let askToConnect = false;
  let answer = {
    email: '',
    name: '',
    meetingSlot: null,
    userId: Meteor.userId(),
    choices: [],
  };
  let showModal = false;
  const toggleShowModal = () => (showModal = !showModal);
  const toggleRedirectModal = () => {
    toggleShowModal();
    if (answer.userId) {
      router.goto(ROUTES.POLLS);
    }
  };

  const grabData = () => {
    if (meta.params._id) {
      loading = true;
      Meteor.call('polls.getSinglePollToAnswer', { pollId: meta.params._id }, (e, r) => {
        loading = false;
        if (r) {
          poll = r.poll;
          selectedGroups = r.selectedGroups;
          if (r.answer) {
            answer = r.answer;
          } else {
            answer = {
              ...answer,
              pollId: r.poll._id,
              choices: r.poll.dates.map((d) => ({
                date: d.date,
                slots: [],
                present: false,
              })),
            };
          }
        } else {
          toast.push($_(e.reason), toasts.error);
          if (e.reason === 'api.errors.notApublicPoll' && !Meteor.userId()) {
            askToConnect = true;
          } else {
            router.goto(ROUTES.ADMIN);
          }
        }
      });
    } else {
      toast.push($_('pages.new_poll.poll_not_found'), toasts.error);
      router.goto(ROUTES.ADMIN);
    }
  };

  $: if (meta.query.autologin && !$currentUser && !$loggingIn && $accountsConfigured === true) {
    Meteor.loginWithKeycloak();
  }

  onMount(grabData);

  $: if ($currentUser && (!answer.email || !answer.name)) {
    answer = {
      ...answer,
      email: $currentUser.services.keycloak ? $currentUser.services.keycloak.email : $currentUser.emails[0].address,
      name: $currentUser.services.keycloak
        ? $currentUser.services.keycloak.name
        : `${$currentUser.firstName} ${$currentUser.lastName}`,
      userId: $currentUser._id,
    };
  }

  const toggleChoice = (indexOrDate, slot) => {
    if (poll.type === POLLS_TYPES.POLL) {
      if (poll.allDay) {
        answer.choices[indexOrDate].present = !answer.choices[indexOrDate].present;
      } else {
        const isToggled = answer.choices[indexOrDate].slots.find((s) => s === slot);
        if (isToggled) {
          answer.choices[indexOrDate].slots = answer.choices[indexOrDate].slots.filter((s) => s !== slot);
        } else {
          answer.choices[indexOrDate].slots = [...answer.choices[indexOrDate].slots, slot];
        }
      }
    } else {
      answer.meetingSlot = indexOrDate;
    }
  };

  const sendAnswer = () => {
    loading = true;
    Meteor.call('polls_answers.create', { data: answer }, (error, result) => {
      loading = false;
      if (error) {
        toast.push($_(error.reason), toasts.error);
      } else {
        poll.type === POLLS_TYPES.MEETING ? toggleShowModal() : null;
        toast.push($_('pages.answer.poll_answered'));
      }
    });
  };
</script>

<svelte:head>
  <title>{$_('title')} {version} | {poll.title}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {#if poll.title}
        {poll.title}
        {#if !poll.active}
          <span class="icon is-small">
            <i class="fas fa-lock" />
          </span>
        {/if}
      {:else if askToConnect}
        <label class="label">{$_('pages.answer.askToConnect')}</label>
        <div class="control">
          <BigLink action={Meteor.loginWithKeycloak} text={$_('pages.login.signin')} />
        </div>
      {:else}
        {$_('loading')}
      {/if}
    </h1>
    {#if loading}
      <Loader />
    {/if}

    {#if poll._id}
      <div class="box">
        <div class="columns is-multiline">
          <div class="column is-full">
            <div class="field">
              <label class="label">{$_('pages.answer.description')}</label>
              {poll.description || ''}
            </div>
          </div>
          <div class="column is-half">
            <div class="field">
              <div class="control">
                <label class="label">
                  {$_('pages.answer.duration')}
                </label>
                {#if poll.allDay}
                  {$_('pages.answer.allDay')}
                {:else}
                  {poll.duration}
                {/if}
              </div>
            </div>
          </div>

          {#if selectedGroups.length}
            <div class="column is-half">
              <div class="field">
                <label class="label title is-4">{$_('pages.new_poll_1.group_input')}</label>
                <div class="tags">
                  {#each selectedGroups as group}
                    <span class="tag is-medium is-primary">
                      {group.name}
                    </span>
                  {/each}
                </div>
              </div>
            </div>
          {/if}

          <div class="column is-full">
            <Divider />
          </div>
          <div class="column is-two-fifths">
            <label class="label">{$_('pages.answer.details')}</label>
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="email"
                  disabled={Meteor.userId()}
                  bind:value={answer.email}
                  placeholder={$_('pages.answer.email')}
                />
                <input
                  class="input"
                  type="text"
                  disabled={Meteor.userId()}
                  bind:value={answer.name}
                  placeholder={$_('pages.answer.name')}
                />
              </div>
            </div>
          </div>
          {#if window.innerWidth < 600}
            <div class="column is-full">
              <Divider />
            </div>
          {:else}
            <div id="Vdivider" class="column is-one-fifths" />
          {/if}
          <div class="column is-two-fifths">
            {#if !Meteor.userId()}
              <label class="label">{$_('pages.answer.login_with_lb')}</label>
              <div class="control">
                <BigLink action={Meteor.loginWithKeycloak} text={$_('pages.login.signin')} />
              </div>
            {/if}
          </div>
          <div class="column is-full">
            <h3 class="title is-3">{$_('api.tags.titleValidation')} :</h3>
            {#if poll.type === POLLS_TYPES.POLL}
              <PollDateTable {toggleChoice} {answer} {poll} {grabData} />
            {:else}
              <CalendarPoll {toggleChoice} {answer} {poll} currentAnswer={answer} />
            {/if}
          </div>
          <div class="column is-half-desktop is-full-mobile" />
          <div class="column is-half-desktop is-full-mobile is-right">
            {#if Meteor.userId() === poll.userId && poll.type !== POLLS_TYPES.POLL}
              <BigLink link={ROUTES.ADMIN} text={$_('pages.new_poll.back')} />
            {:else if !poll.completed}
              <BigLink
                disabled={!isValideMail(answer.email) || !answer.name || loading}
                action={sendAnswer}
                text={$_('pages.new_poll.validate')}
              />
            {:else}
              <BigLink link={ROUTES.ADMIN} text={$_('pages.new_poll.back')} />
            {/if}
          </div>
        </div>
      </div>
      {#if Meteor.userId() === poll.userId && poll.type !== POLLS_TYPES.POLL}
        <MeetingAnswersList pollId={poll._id} />
      {/if}
    {/if}
  </div>
</section>

<Modal
  toggle={toggleShowModal}
  active={showModal}
  action={toggleRedirectModal}
  title={$_('pages.answer.resume')}
  validButton={$_('components.SinglePollAnswerLine.validate')}
  validClass="is-success"
  cancelClass="is-warning"
  cancelButton={$_('pages.answer.modify')}
>
  <p><b>{poll.title}</b></p>
  <p>{$_('pages.answer.take_meeting')} {moment(answer.meetingSlot).format('LLL')}</p>
</Modal>

<style>
  .is-right {
    display: flex;
    justify-content: flex-end;
  }
  #Vdivider {
    border-left: 1px solid var(--lightgrey);
    margin-left: 10%;
    margin-top: 1vw;
    margin-bottom: 1vw;
  }
</style>
