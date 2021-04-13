<script>
  import { _ } from "svelte-i18n";
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import Polls from "/imports/api/polls/polls";

  import Pagination from "../../components/common/Pagination.svelte";
  import SinglePollLine from "./SinglePollLine.svelte";

  export let meta;
  let page = 1;
  let polls;
  let total;
  let limit = 10;

  $: polls = useTracker(() => {
    Meteor.subscribe("polls.owner", { page, limit });
    return Polls.find({}, { sort: { createdAt: -1 } }).fetch();
  });

  $: total = useTracker(() => Counts.get("polls.owner.total"));
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
          <div class="table-container">
            <table
              class="table table is-striped is-hoverable is-fullwidth is-bordered"
            >
              <thead>
                <tr>
                  <th>Actions</th>
                  <th>{$_("pages.home.title_label")}</th>
                  <th>{$_("pages.home.type_label")}</th>
                  <th>{$_("pages.home.groups_label")}</th>
                  <th>{$_("pages.home.public_label")}</th>
                  <th>{$_("pages.home.duration_label")}</th>
                  <th>{$_("pages.home.dates_label")}</th>
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
          <Pagination bind:page total={$total} bind:limit />
        </div>
      </div>
    </div>
  </div>
</section>
