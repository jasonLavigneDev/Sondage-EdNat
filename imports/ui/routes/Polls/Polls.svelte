<script>
  import { _ } from "svelte-i18n";
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import Polls from "/imports/api/polls/polls";

  import { ROUTES } from "/imports/utils/enums";
  import Pagination from "/imports/ui/components/common/Pagination.svelte";
  import SinglePollLine from "./SinglePollLine.svelte";
  import { POLLS_TYPES } from "../../../utils/enums";

  export let meta;
  let page = 1;
  let polls;
  let meetings;
  let total;
  let limit = 10;

  $: polls = useTracker(() => {
    Meteor.subscribe("polls.member", { page, limit });
    return Polls.find(
      { type: POLLS_TYPES.POLL },
      { sort: { createdAt: -1 } }
    ).fetch();
  });
  $: meetings = useTracker(() => {
    Meteor.subscribe("polls.meetings.member", { page, limit });
    return Polls.find(
      { type: POLLS_TYPES.MEETING },
      { sort: { createdAt: -1 } }
    ).fetch();
  });

  $: totalPolls = useTracker(() => Counts.get("polls.member.total"));
  $: totalMeetings = useTracker(() =>
    Counts.get("polls.member.meetings.total")
  );
</script>

<svelte:head>
  <title>{$_("title")} | {$_("links.polls")}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-full">
        <h1 class="title is-3">{$_("pages.polls.title")}</h1>
      </div>
      <div class="column is-full">
        <div class="box">
          <h4 class="title is-4">{$_("types.POLL")}</h4>
          <div class="table-container">
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
                  <th>{$_("pages.home.votes_label")}</th>
                </tr>
              </thead>
              <tbody>
                {#each $polls as poll}
                  <SinglePollLine {poll} />
                {/each}
              </tbody>
            </table>
          </div>
          <Pagination bind:page total={$totalPolls} bind:limit />
        </div>
      </div>

      <div class="column is-full">
        <div class="box">
          <h4 class="title is-4">{$_("types.MEETING")}</h4>
          <div class="table-container">
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
                  <th>{$_("pages.home.meetingSlot_label")}</th>
                </tr>
              </thead>
              <tbody>
                {#each $meetings as poll}
                  <SinglePollLine {poll} />
                {/each}
              </tbody>
            </table>
          </div>
          <Pagination bind:page total={$totalMeetings} bind:limit />
        </div>
      </div>
    </div>
  </div>
</section>
