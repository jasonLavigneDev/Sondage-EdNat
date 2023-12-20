<script>
  import { _ } from 'svelte-i18n';
  import moment from 'moment';
  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import { ROUTES } from '/imports/utils/enums';
  import copy from 'copy-to-clipboard';
  import { toast } from '@zerodevx/svelte-toast';
  import { POLLS_TYPES } from '../../../utils/enums';
  import PollsAnswers from '../../../api/polls_answers/polls_answers';

  export let poll;
  let typeDataVote;

  const tooltip = (content) => ({
    content,
    placement: 'bottom',
  });
  $: typeDataVote = useTracker(() => {
    if (poll.type === POLLS_TYPES.POLL) {
      Meteor.subscribe('polls_answers.getCount', { pollId: poll._id });
      return Counts.get(`polls_answers.get-${poll._id}`);
    } else if (poll.type === POLLS_TYPES.MEETING) {
      Meteor.subscribe('polls_answers.getCurrentUser', { pollId: poll._id });
      const answer = PollsAnswers.findOne({ pollId: poll._id });
      // convert meetingSlot to array for old pollAnswers
      if (answer) answer.meetingSlot = Array.isArray(answer.meetingSlot) ? answer.meetingSlot : [answer.meetingSlot];
      return answer;
    }
  });
  const copyToClipboard = () => {
    const url = `${Meteor.absoluteUrl()}${ROUTES.ANSWER_POLL_RM(poll._id).replace('/', '')}`;
    copy(url);
    toast.push($_('components.SinglePollLine.copied'));
  };
</script>

<tr>
  <th>
    <div class="buttons">
      <button class="button is-small is-info" title={$_('pages.home.link_tooltip')} on:click={copyToClipboard}>
        <i class="far fa-copy" />
      </button>
      <a
        href={ROUTES.ANSWER_POLL_RM(poll._id)}
        class="button is-small is-primary"
        title={$_('pages.home.open_tooltip')}
      >
        <i class="fas fa-external-link-alt" />
      </a>
    </div>
  </th>
  <td>
    {poll.title}
  </td>
  <td>
    {poll.groups.length}
  </td>
  <td>
    {$_(`polls_datas.${poll.public}`)}
  </td>
  <td>
    {poll.allDay ? $_(`polls_datas.allDay`) : poll.duration}
  </td>
  {#if poll.type === POLLS_TYPES.POLL}
    <td> {$typeDataVote} </td>
  {:else if poll.type === POLLS_TYPES.MEETING}
    {#if $typeDataVote}
      <td>
        {#each $typeDataVote.meetingSlot as slot}
          {moment(slot).format('LLL')}<br />
        {/each}
      </td>
    {:else}
      <td> {$_('polls_datas.noAnswer')} </td>
    {/if}
  {/if}
</tr>
