<script>
  import { Meteor } from "meteor/meteor";
  import DateDisplay from "../../components/common/DateDisplay.svelte";
  import Checkbox from "../../components/common/Checkbox.svelte";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { toast } from "@zerodevx/svelte-toast";
  import { _ } from "svelte-i18n";
  import tippy from "sveltejs-tippy";
  import PollsAnswers from "../../../api/polls_answers/polls_answers";
  import moment from "moment";
  import { toasts } from "../../../utils/enums";

  export let answer = {};
  export let poll = {};
  export let loading = false;
  export let toggleChoice = () => null;
  export let grabData = () => null;
  let answers;
  $: answers = useTracker(() => {
    Meteor.subscribe("polls_answers.onePoll", { pollId: poll._id });
    return PollsAnswers.find({ pollId: poll._id }).fetch();
  });
  const confirmDate = (date) => {
    loading = true;
    Meteor.call("polls.validate", { pollId: poll._id, date }, (e, r) => {
      loading = false;
      grabData();
      if (e) {
        toast.push($_(e.reason), toasts.error);
      }
    });
  };
</script>

<div class="table-container">
  <table class="table is-striped is-fullwidth is-bordered">
    <thead>
      <tr>
        <th />
        {#each poll.dates as day}
          {#if !poll.allDay && day.slots}
            {#each day.slots as slot, i}
              <th>
                <DateDisplay date={day.date} {slot} duration={poll.duration} />
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
          {#each poll.dates as day}
            {#each day.slots as time}
              <th>
                {#if !poll.completed || moment(day.date)
                    .hour(time.split(":")[0])
                    .minute(time.split(":")[1])
                    .isSame(poll.choosenDate)}
                  <button
                    class="button is-fullwidth"
                    class:is-loading={loading}
                    class:is-primary={!poll.completed}
                    class:is-success={moment(day.date)
                      .hour(time.split(":")[0])
                      .minute(time.split(":")[1])
                      .isSame(poll.choosenDate)}
                    use:tippy={{
                      content: $_("pages.answer.confirm_date_tooltip"),
                      placement: "bottom",
                    }}
                    on:click={() =>
                      poll.completed
                        ? null
                        : confirmDate(
                            moment(day.date)
                              .hour(time.split(":")[0])
                              .minute(time.split(":")[1])
                              .format()
                          )}
                  >
                    {#if !poll.completed}
                      {$_("pages.answer.confirm_date")}
                    {:else}
                      {$_("pages.answer.choosen_date")}
                    {/if}
                  </button>
                {/if}
              </th>
            {/each}
          {/each}
        </tr>
      </tfoot>
    {/if}

    <tbody>
      <tr>
        <td>
          <b>
            {answer._id ? [...$answers, answer].length : $answers.length}
            {$_("pages.answer.participants")}
          </b>
        </td>
        {#each poll.dates as day, index}
          {#if !poll.allDay && day.slots}
            {#each day.slots as slot, i}
              <td class="total_vote">
                {[...$answers, answer].filter((a) => {
                  return a.choices[index].slots.find((s) => s === slot);
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
          {answer.email ? answer.email : $_("pages.answer.email")}
        </td>
        {#each poll.dates as day, index}
          {#if !poll.allDay && day.slots}
            {#each day.slots as slot, i}
              <td>
                <Checkbox
                  center
                  action={() => toggleChoice(index, slot)}
                  checked={answer.choices[index].slots.find((s) => s === slot)}
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
      {#each $answers as single_answer}
        <tr>
          <td>
            {single_answer.email}
          </td>
          {#each poll.dates as day, index}
            {#if !poll.allDay && day.slots}
              {#each day.slots as slot, i}
                <td>
                  <Checkbox
                    center
                    disabled
                    checked={single_answer.choices[index].slots.find(
                      (s) => s === slot
                    )}
                  />
                </td>
              {/each}
            {:else}
              <td>
                <Checkbox
                  center
                  disabled
                  checked={single_answer.choices[index] &&
                    single_answer.choices[index].present}
                />
              </td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
