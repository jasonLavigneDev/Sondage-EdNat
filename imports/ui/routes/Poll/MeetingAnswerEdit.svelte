<script>
  import { _ } from 'svelte-i18n';
  import moment from 'moment';
  import { Meteor } from 'meteor/meteor';
  import { toast } from '@zerodevx/svelte-toast';
  import { router } from 'tinro';
  import { ROUTES, toasts } from '/imports/utils/enums';
  import CalendarPoll from './CalendarPoll.svelte';
  import Checkbox from '../../components/common/Checkbox.svelte';
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  import isValideMail from '/imports/utils/functions/email';

  import PackageJSON from '../../../../package.json';
  import { onMount } from 'svelte';
  import slotsIncludes from '../../../utils/functions/answers';
  let version = PackageJSON.version;

  export let meta;
  let emailNotice = true;
  let answer = {};
  let poll = {};
  let email = '';
  let name = '';
  let loading = true;
  let pollLoaded = false;
  let answerLoaded = false;
  let initialSlots = [];
  let editing = false;

  const answerId = meta.params._id;
  const pollId = meta.params.pollId;

  const editMeeting = () => {
    editing = true;
    Meteor.call(
      'polls_answers.meeting.edit',
      { answerId: answer._id, emailNotice, email, name, meetingSlot: answer.meetingSlot, initialSlots },
      (e) => {
        if (e) {
          console.log(e);
          toast.push($_(e.reason), toasts.error);
          editing = false;
        } else {
          toast.push($_(`components.MeetingAnswerEdit.${emailNotice ? 'userNotified' : 'userNotNotified'}`));
          editing = false;
          router.goto(ROUTES.ANSWER_POLL_RM(answer.pollId));
        }
      },
    );
  };

  const toggleChoice = (indexOrDate) => {
    let newSlots = [];
    if (slotsIncludes(answer.meetingSlot, indexOrDate)) {
      newSlots = answer.meetingSlot.filter((s) => !moment(s).isSame(indexOrDate));
    } else {
      newSlots = [...answer.meetingSlot, indexOrDate].sort();
    }
    // if slots are changed, consider that all chosen slots are no longer confirmed
    answer.meetingSlot = newSlots;
  };

  const grabData = () => {
    if (meta.params._id) {
      Meteor.call('polls_answers.get', { answerId }, (e, r) => {
        answerLoaded = true;
        if (pollLoaded) loading = false;
        if (r) {
          answer = r;
          email = r.email;
          name = r.name;
          answer.meetingSlot = Array.isArray(r.meetingSlot) ? r.meetingSlot : [r.meetingSlot];
          initialSlots = [...answer.meetingSlot];
        } else {
          toast.push($_(e.reason), toasts.error);
          router.goto(ROUTES.ADMIN);
        }
      });
    } else {
      toast.push($_('components.MeetingAnswerEdit.answer_not_found'), toasts.error);
      router.goto(ROUTES.ADMIN);
    }
    if (meta.params.pollId) {
      Meteor.call('polls.getSinglePollToAnswer', { pollId }, (e, r) => {
        pollLoaded = true;
        if (answerLoaded) loading = false;
        if (r) {
          poll = r.poll;
        } else {
          toast.push($_(e.reason), toasts.error);
          router.goto(ROUTES.ADMIN);
        }
      });
    } else {
      toast.push($_('pages.new_poll.poll_not_found'), toasts.error);
      router.goto(ROUTES.ADMIN);
    }
  };
  onMount(grabData);
</script>

<svelte:head>
  <title>{$_('title')} {version} | {$_('links.meeting_edit')}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {$_('components.MeetingAnswerEdit.title')} : {name}
    </h1>
    <div class="box">
      <div class="field">
        <div class="control">
          <Checkbox bind:checked={emailNotice} label={$_('components.MeetingAnswerCancel.sendEmail')} />
        </div>
      </div>
      <div class="field">
        <label class="label">{$_('components.MeetingAnswerEdit.email')}</label>
        <div class="control">
          <input
            disabled={answer.userId !== null}
            class="input"
            type="text"
            autofocus
            maxlength="256"
            bind:value={email}
          />
        </div>
      </div>
      <div class="field">
        <label class="label">{$_('components.MeetingAnswerEdit.name')}</label>
        <div class="control">
          <input disabled={answer.userId !== null} class="input" type="text" maxlength="256" bind:value={name} />
        </div>
      </div>
      <label class="label">{$_('components.MeetingAnswerEdit.slot')}</label>
      <div class="column is-full">
        {#if pollLoaded}
          <CalendarPoll {answer} {poll} {toggleChoice} currentAnswer={answer} editMode={true} />
        {/if}
      </div>
      <div class="columns is-multiline">
        <div class="column is-half-desktop is-full-mobile">
          <BigLink
            link={ROUTES.ANSWER_POLL_RM(answer.pollId)}
            text={$_('components.MeetingAnswerCancel.goBack')}
            color="is-secondary"
          />
        </div>
        <div class="column is-half-desktop is-full-mobile is-right">
          <BigLink
            loading={editing}
            disabled={!isValideMail(email) || !name || loading || answer.meetingSlot.length === 0}
            action={editMeeting}
            text={$_('components.MeetingAnswerEdit.submit')}
          />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .is-right {
    display: flex;
    justify-content: flex-end;
  }
</style>
