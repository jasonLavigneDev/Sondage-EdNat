<script>
  import { _ } from "svelte-i18n";
  import tippy from "sveltejs-tippy";
  import { toggleActivePoll } from "/imports/api/polls/methods";
  import { ROUTES } from "/imports/utils/enums";

  export let poll;

  const tooltip = (content) => ({
    content,
    placement: "bottom",
  });
  const togglePoll = () => {
    toggleActivePoll.call({ pollId: poll._id });
  };
</script>

<tr>
  <th>
    {#if poll.active}
      <button
        class="button is-small is-success"
        value={poll._id}
        on:click={togglePoll}
        use:tippy={tooltip($_("pages.home.deactivate_tooltip"))}
      >
        <i class="fas fa-eye" />
      </button>
    {:else}
      <button
        class="button is-small is-warning"
        value={poll._id}
        on:click={togglePoll}
        use:tippy={tooltip($_("pages.home.activate_tooltip"))}
      >
        <i class="fas fa-eye-slash" />
      </button>
    {/if}

    <button
      class="button is-small is-primary"
      use:tippy={tooltip($_("pages.home.results_tooltip"))}
    >
      <i class="fas fa-list" />
    </button>

    <a href={!poll.active ? ROUTES.EDIT_POLL(poll._id) : ROUTES.ADMIN}>
      <button
        class="button is-small is-light"
        disabled={poll.active}
        use:tippy={tooltip($_("pages.home.edit_tooltip"))}
      >
        <i class="fas fa-pen" />
      </button>
    </a>

    <button
      class="button is-small is-info"
      use:tippy={tooltip($_("pages.home.link_tooltip"))}
    >
      <i class="far fa-copy" />
    </button>
    <button
      class="button is-small is-danger"
      use:tippy={tooltip($_("pages.home.delete_tooltip"))}
    >
      <i class="fas fa-trash" />
    </button>
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
  <td>
    {poll.dates.reduce((acc, v) => acc + v.slots.length, 0)}
  </td>
  <td> 0 </td>
</tr>
