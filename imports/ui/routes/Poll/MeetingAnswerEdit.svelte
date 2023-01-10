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
  let version = PackageJSON.version;

  export let meta;
  let emailNotice = true;
  let answer = {};
  let poll = {};
  let email = '';
  let name = '';
  let meetingSlot = '';
  let initialDate = '';
  let loading = true;
  let pollLoaded = false;
  let answerLoaded = false;

  const answerId = meta.params._id;
  const pollId = meta.params.pollId;

  const editMeeting = () => {
    Meteor.call('polls_answers.meeting.edit', { answerId: answer._id, emailNotice, email, name, meetingSlot }, (e) => {
      if (e) {
        console.log(e);
        toast.push($_(e.reason), toasts.error);
      } else {
        router.goto(ROUTES.ANSWER_POLL_RM(answer.pollId));
      }
    });
  };

  const toggleChoice = (indexOrDate) => {
    meetingSlot = indexOrDate || initialDate;
    answer.meetingSlot = indexOrDate;
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
          meetingSlot = r.meetingSlot;
          initialDate = r.meetingSlot;
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
      {$_('components.MeetingAnswerEdit.title')} : {moment(initialDate).format('LLL')}
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
          <CalendarPoll {answer} {poll} {loading} {toggleChoice} currentAnswer={answer} editMode={true} />
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
            disabled={!isValideMail(email) || !name || loading}
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
