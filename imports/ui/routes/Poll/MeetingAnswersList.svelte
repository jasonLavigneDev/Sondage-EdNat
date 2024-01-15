<script>
  import moment from 'moment';
  import { _ } from 'svelte-i18n';
  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import SinglePollAnswerLine from './SinglePollAnswerLine.svelte';
  import PollsAnswers from '../../../api/polls_answers/polls_answers';
  export let pollId;
  let answers;
  $: answers = useTracker(() => {
    return PollsAnswers.find({ pollId })
      .fetch()
      .map((a) => {
        // change meetingSlot to array for old pollAnswers
        a.meetingSlot = Array.isArray(a.meetingSlot) ? a.meetingSlot : [a.meetingSlot];
        return a;
      });
  });
</script>

<div class="box">
  <h3 class="title is-5">{$_('components.MeetingAnswersList.title')}</h3>

  <div class="table-container">
    <table class="table is-striped is-fullwidth is-bordered">
      <thead>
        <tr>
          <th>Actions</th>
          <th>{$_('name')}</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {#each $answers as answer}
          <SinglePollAnswerLine {answer} />
        {/each}
      </tbody>
    </table>
  </div>
</div>
