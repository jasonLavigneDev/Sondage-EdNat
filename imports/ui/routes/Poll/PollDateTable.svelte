<script>
  import { Meteor } from 'meteor/meteor';
  import DateDisplay from '../../components/common/DateDisplay.svelte';
  import Checkbox from '../../components/common/Checkbox.svelte';
  import Modal from '../../components/common/Modal.svelte';
  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import { toast } from '@zerodevx/svelte-toast';
  import { _ } from 'svelte-i18n';
  import PollsAnswers from '../../../api/polls_answers/polls_answers';
  import moment from 'moment';
  import { toasts } from '../../../utils/enums';

  export let answer = {};
  export let poll = {};
  export let loading = false;
  export let toggleChoice = () => null;
  export let grabData = () => null;
  let confirmDateModal = false;
  let chosenDateModal;
  let answers;
  $: answers = useTracker(() => {
    Meteor.subscribe('polls_answers.onePoll', { pollId: poll._id });
    return PollsAnswers.find({ pollId: poll._id }).fetch();
  });
  const toggleModal = (date) => {
    confirmDateModal = !confirmDateModal;
    chosenDateModal = date;
  };
  const confirmDate = (date) => {
    loading = true;
    Meteor.call('polls.validate', { pollId: poll._id, date }, (e, r) => {
      loading = false;
      grabData();
      if (e) {
        toast.push($_(e.reason), toasts.error);
      }
    });
    confirmDateModal = false;
  };
</script>

<div class="table-container">
  <table class="table is-striped is-fullwidth is-bordered">
    <thead>
      <tr>
        <th />
        {#each poll.dates as day}
          {#if !poll.allDay && day.slots}
            {#each day.slots as slo, i}
              <th>
                <DateDisplay date={day.date} slot={slo} duration={poll.duration} />
              </th>
            {/each}
          {:else}
            <th>
              <DateDisplay date={day.date} duration={poll.duration} />
            </th>
          {/if}
        {/each}
      </tr>
    </thead>
    {#if Meteor.userId() === poll.userId}
      <tfoot>
        <tr>
          <th />
          <!-- {#each poll.dates as day} -->
          {#if !poll.allDay}
            {#each poll.dates as day}
              {#each day.slots as time}
                <th>
                  {#if !poll.completed || moment(day.date)
                      .hour(time.split(':')[0])
                      .minute(time.split(':')[1])
                      .isSame(poll.choosenDate)}
                    <button
                      disabled={poll.completed}
                      class="button is-fullwidth"
                      class:is-loading={loading}
                      class:is-primary={!poll.completed}
                      class:is-success={moment(day.date)
                        .hour(time.split(':')[0])
                        .minute(time.split(':')[1])
                        .isSame(poll.choosenDate)}
                      title={$_('pages.answer.confirm_date_tooltip')}
                      on:click={() =>
                        poll.completed
                          ? null
                          : toggleModal(moment(day.date).hour(time.split(':')[0]).minute(time.split(':')[1]).format())}
                    >
                      {#if !poll.completed}
                        {$_('pages.answer.confirm_date')}
                      {:else}
                        {$_('pages.answer.choosen_date')}
                      {/if}
                    </button>
                  {/if}
                </th>
              {/each}
            {/each}
          {:else}
            {#each poll.dates as day}
              <th>
                {#if !poll.completed || moment(day.date).isSame(poll.choosenDate)}
                  <button
                    disabled={poll.completed}
                    class="button is-fullwidth"
                    class:is-loading={loading}
                    class:is-primary={!poll.completed}
                    class:is-success={moment(day.date).isSame(poll.choosenDate)}
                    title={$_('pages.answer.confirm_date_tooltip')}
                    on:click={() => (poll.completed ? null : toggleModal(moment(day.date).format()))}
                  >
                    {#if !poll.completed}
                      {$_('pages.answer.confirm_date')}
                    {:else}
                      {$_('pages.answer.choosen_date')}
                    {/if}
                  </button>
                {/if}
              </th>
            {/each}
          {/if}
          <!-- {/each} -->
        </tr>
      </tfoot>
    {/if}

    <tbody>
      <tr>
        <td>
          <b>
            {answer._id ? [...$answers, answer].length : $answers.length}
            {$_('pages.answer.participants')}
          </b>
        </td>
        {#each poll.dates as day, index}
          {#if !poll.allDay && day.slots}
            {#each day.slots as slo, i}
              <td class="total_vote">
                {[...$answers, answer].filter((a) => {
                  return a.choices[index].slots.find((s) => s === slo);
                }).length}
              </td>
            {/each}
          {:else}
            <td class="total_vote">
              {[...$answers, answer].filter((a) => {
                return a.choices[index].present;
              }).length}
            </td>
          {/if}
        {/each}
      </tr>

      <tr class="is-selected">
        <td>
          {answer.name ? answer.name : $_('pages.answer.name')}
        </td>
        {#each poll.dates as day, index}
          {#if !poll.allDay && day.slots}
            {#each day.slots as slo, i}
              <td>
                <Checkbox
                  center
                  action={() => toggleChoice(index, slo)}
                  checked={answer.choices[index].slots.find((s) => s === slo)}
                />
              </td>
            {/each}
          {:else}
            <td>
              <Checkbox
                center
                action={() => toggleChoice(index)}
                checked={answer.choices[index] && answer.choices[index].present}
              />
            </td>
          {/if}
        {/each}
      </tr>
      {#if !poll.hideParticipantsList}
        {#each $answers as single_answer}
          <tr>
            <td>
              {single_answer.name}
            </td>
            {#each poll.dates as day, index}
              {#if !poll.allDay && day.slots}
                {#each day.slots as slo, i}
                  <td>
                    <Checkbox center disabled checked={single_answer.choices[index].slots.find((s) => s === slo)} />
                  </td>
                {/each}
              {:else}
                <td>
                  <Checkbox
                    center
                    disabled
                    checked={single_answer.choices[index] && single_answer.choices[index].present}
                  />
                </td>
              {/if}
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<Modal
  toggle={toggleModal}
  active={confirmDateModal}
  action={() => confirmDate(chosenDateModal)}
  title={$_('pages.answer.modal_title')}
  validButton={$_('pages.answer.modal_valid')}
  validClass="is-success"
  cancelButton={$_('pages.answer.modal_cancel')}
  cancelClass="is-white"
>
  <p>{$_('pages.answer.modal_text')}</p>
  {#if poll.allDay}
    <DateDisplay date={chosenDateModal} duration={poll.duration} />
  {:else}
    <DateDisplay date={chosenDateModal} slot={moment(chosenDateModal).format('LT')} duration={poll.duration} />
  {/if}
</Modal>
