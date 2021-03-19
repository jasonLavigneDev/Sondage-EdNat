<script>
  import { _ } from "svelte-i18n";
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import Polls from "/imports/api/polls/polls";
  import { toggleActivePoll } from "/imports/api/polls/methods";
  import tippy from "sveltejs-tippy";

  import { ROUTES } from "/imports/utils/enums";
  import Pagination from "../../components/common/Pagination.svelte";

  export let meta;
  let page = 1;
  let polls;
  let ready;
  let total;
  let limit = 10;
  $: ready = useTracker(() => {
    const handler = Meteor.subscribe("polls.owner", { page, limit });
    return handler.ready();
  });
  $: polls = useTracker(() =>
    Polls.find({}, { sort: { createdAt: -1 } }).fetch()
  );
  $: total = useTracker(() => Counts.get("polls.owner.total"));

  const tooltip = (content) => ({
    content,
    placement: "bottom",
  });
  const togglePoll = (pollId) => {
    console.log(pollId);
    toggleActivePoll.call({ pollId: pollId });
  };
</script>

<svelte:head>
  <title>{$_("title")} | {$_("links.home")}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-full">
        <h1 class="title is-3">{$_("pages.home.title")}</h1>
      </div>
      <div class="column is-full">
        <div class="box">
          <table
            class="table table is-striped is-hoverable is-fullwidth is-bordered"
          >
            <thead>
              <tr>
                <th>Actions</th>
                <th>{$_("pages.home.title_label")}</th>
                <th>{$_("pages.home.groups_label")}</th>
                <th>{$_("pages.home.public_label")}</th>
                <th>{$_("pages.home.duration_label")}</th>
                <th>{$_("pages.home.dates_label")}</th>
                <th>{$_("pages.home.votes_label")}</th>
              </tr>
            </thead>
            <tbody>
              {#if $ready}
                {#each $polls as poll}
                  <tr>
                    <th>
                      <button
                        class:is-success={poll.active}
                        class:is-warning={!poll.active}
                        class="button is-small"
                        value={poll._id}
                        on:click={() => togglePoll(poll._id)}
                        use:tippy={tooltip(
                          poll.active
                            ? $_("pages.home.deactivate_tooltip")
                            : $_("pages.home.activate_tooltip")
                        )}
                      >
                        {#if poll.active}
                          <i class="fas fa-eye" />
                        {:else}
                          <i class="fas fa-eye-slash" />
                        {/if}
                      </button>

                      <button
                        class="button is-small is-primary"
                        use:tippy={tooltip($_("pages.home.results_tooltip"))}
                      >
                        <i class="fas fa-list" />
                      </button>

                      <button
                        class="button is-small is-light"
                        disabled={poll.active}
                        use:tippy={tooltip($_("pages.home.edit_tooltip"))}
                      >
                        <i class="fas fa-pen" />
                      </button>

                      <button
                        class="button is-small is-info"
                        use:tippy={tooltip($_("pages.home.link_tooltip"))}
                      >
                        <i class="far fa-copy" />
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
                      {poll.duration}
                    </td>
                    <td>
                      {poll.dates.reduce((acc, v) => acc + v.slots.length, 0)}
                    </td>
                    <td> 0 </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
          {#await $ready then ready}
            <Pagination bind:page total={$total} bind:limit />
          {/await}
        </div>
      </div>
    </div>
  </div>
</section>
