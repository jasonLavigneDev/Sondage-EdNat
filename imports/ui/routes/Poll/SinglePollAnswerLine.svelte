<script>
  import { _ } from 'svelte-i18n';
  import moment from 'moment';
  import { toast } from '@zerodevx/svelte-toast';
  import { toasts, ROUTES } from '../../../utils/enums';

  export let answer;
  let loading = false;

  const tooltip = (content) => ({
    content,
    placement: 'bottom',
  });

  const validateMeeting = () => {
    loading = true;
    Meteor.call('polls_answers.meeting.validate', { answerId: answer._id }, (e) => {
      loading = false;
      if (e) {
        toast.push($_(e.reason), toasts.error);
      }
    });
  };
</script>

<tr>
  <th>
    <div class="buttons">
      <button
        class="button"
        class:is-loading={loading}
        class:is-success={answer.confirmed}
        class:is-primary={!answer.confirmed}
        on:click={validateMeeting}
        title={answer.confirmed
          ? $_('components.SinglePollAnswerLine.validated_tooltip')
          : $_('components.SinglePollAnswerLine.validate_tooltip')}
      >
        <span class="icon">
          <i class="fas" class:fa-calendar-check={answer.confirmed} class:fa-paper-plane={!answer.confirmed} />
        </span>
        <span>
          {#if answer.confirmed}
            {$_('components.SinglePollAnswerLine.validated')}
          {:else}
            {$_('components.SinglePollAnswerLine.validate')}
          {/if}
        </span>
      </button>
      <a class="button is-primary" href={ROUTES.EDIT_ANSWER_RM(answer.pollId, answer._id)}>
        <span class="icon">
          <i class="fas fa-pen" />
        </span>
        <span>
          {$_('components.SinglePollAnswerLine.edit')}
        </span>
      </a>
      <a class="button is-danger" href={ROUTES.CANCEL_ANSWER_RM(answer._id)}>
        <span class="icon">
          <i class="fas fa-trash" />
        </span>
        <span>
          {$_('components.SinglePollAnswerLine.cancel')}
        </span>
      </a>
    </div>
  </th>
  <td>
    {answer.name}
  </td>
  <td>
    {#each answer.meetingSlot as slot}
      {moment(slot).format('LLL')}<br />
    {/each}
  </td>
</tr>
