<script>
  import DateDisplay from "../../components/common/DateDisplay.svelte";
  import Checkbox from "../../components/common/Checkbox.svelte";
  import { _ } from "svelte-i18n";

  export let answers = [];
  export let answer = {};
  export let poll = {};
  export let toggleChoice = () => null;
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

    <tbody>
      <tr>
        <td>
          <b>
            {answers.length}
            {$_("pages.answer.participants")}
          </b>
        </td>
        {#each poll.dates as day, index}
          {#if !poll.allDay && day.slots}
            {#each day.slots as slot, i}
              <td class="total_vote">
                {[...answers, answer].filter((a) => {
                  return a.choices[index].slots.find((s) => s === slot);
                }).length}
              </td>
            {/each}
          {:else}
            <td class="total_vote">
              {[...answers, answer].filter((a) => {
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
      {#each answers as single_answer}
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
