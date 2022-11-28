<script>
  import { _ } from 'svelte-i18n';
  import moment from 'moment';
  import { Meteor } from 'meteor/meteor';
  import { toast } from '@zerodevx/svelte-toast';
  import { router } from 'tinro';
  import { ROUTES, toasts } from '/imports/utils/enums';
  import Checkbox from '../../components/common/Checkbox.svelte';
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  import isValideMail from '/imports/utils/functions/email';

  import PackageJSON from '../../../../package.json';
  import { onMount } from 'svelte';
  let version = PackageJSON.version;

  export let meta;
  let emailNotice = false;
  let answer = {};
  let email = '';
  let name = '';
  let loading = true;

  const answerId = meta.params._id;

  const editMeeting = () => {
    Meteor.call('polls_answers.meeting.edit', { answerId: answer._id, emailNotice, email, name }, (e) => {
      if (e) {
        console.log(e);
        toast.push($_(e.reason), toasts.error);
      } else {
        router.goto(ROUTES.ANSWER_POLL_RM(answer.pollId));
      }
    });
  };

  const grabData = () => {
    if (meta.params._id) {
      Meteor.call('polls_answers.get', { answerId }, (e, r) => {
        if (r) {
          loading = false;
          answer = r;
          email = r.email;
          name = r.name;
        } else {
          toast.push($_(e.reason), toasts.error);
          router.goto(ROUTES.ADMIN);
        }
      });
    } else {
      toast.push($_('components.MeetingAnswerEdit.answer_not_found'), toasts.error);
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
      {$_('components.MeetingAnswerEdit.title')} : {moment(answer.meetingSlot).format('LLL')}
    </h1>
    <div class="box">
      <div class="field">
        <label class="label">{$_('components.MeetingAnswerEdit.email')}</label>
        <div class="control">
          <input class="input" type="text" autofocus maxlength="256" bind:value={email} />
        </div>
      </div>
      <div class="field">
        <label class="label">{$_('components.MeetingAnswerEdit.name')}</label>
        <div class="control">
          <input class="input" type="text" maxlength="256" bind:value={name} />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <Checkbox bind:checked={emailNotice} label={$_('components.MeetingAnswerCancel.sendEmail')} />
        </div>
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
