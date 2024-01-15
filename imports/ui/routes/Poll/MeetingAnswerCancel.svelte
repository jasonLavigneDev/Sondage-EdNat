<script>
  import { _ } from 'svelte-i18n';
  import { Meteor } from 'meteor/meteor';
  import { toast } from '@zerodevx/svelte-toast';
  import { router } from 'tinro';
  import { ROUTES, toasts } from '/imports/utils/enums';
  import Checkbox from '../../components/common/Checkbox.svelte';
  import BigLink from '/imports/ui/components/common/BigLink.svelte';

  import PackageJSON from '../../../../package.json';
  import { onMount } from 'svelte';
  let version = PackageJSON.version;

  export let meta;
  let emailNotice = true;
  let emailMsg = '';
  let answer = {};
  let cancelling = false;
  const answerId = meta.params._id;

  const cancelMeeting = () => {
    cancelling = true;
    Meteor.call('polls_answers.meeting.cancel', { answerId: answer._id, emailNotice, emailContent: emailMsg }, (e) => {
      if (e) {
        console.log(e);
        toast.push($_(e.reason), toasts.error);
        cancelling = false;
      } else {
        toast.push($_(`components.MeetingAnswerCancel.${emailNotice ? 'userNotified' : 'userNotNotified'}`));
        cancelling = false;
        router.goto(ROUTES.ANSWER_POLL_RM(answer.pollId));
      }
    });
  };

  const grabData = () => {
    if (meta.params._id) {
      Meteor.call('polls_answers.get', { answerId }, (e, r) => {
        if (r) {
          answer = r;
        } else {
          toast.push($_(e.reason), toasts.error);
          router.goto(ROUTES.ADMIN);
        }
      });
    } else {
      toast.push($_('components.MeetingAnswerCancel.answer_not_found'), toasts.error);
      router.goto(ROUTES.ADMIN);
    }
  };
  onMount(grabData);
</script>

<svelte:head>
  <title>{$_('title')} {version} | {$_('links.meeting_cancel')}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {$_('components.MeetingAnswerCancel.title')} : {answer.name}
    </h1>
    <div class="box">
      <div class="field">
        <div class="control">
          <Checkbox bind:checked={emailNotice} label={$_('components.MeetingAnswerCancel.sendEmail')} />
        </div>
      </div>
      <div class="field">
        <label class="label">{$_('components.MeetingAnswerCancel.emailMsg')}</label>
        <div class="control">
          <textarea disabled={!emailNotice} class="textarea" maxlength="2048" rows="5" bind:value={emailMsg} />
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
            action={cancelMeeting}
            loading={cancelling}
            text={$_('components.MeetingAnswerCancel.delete')}
            color="is-danger"
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
