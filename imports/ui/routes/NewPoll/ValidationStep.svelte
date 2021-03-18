<script>
  import { _ } from "svelte-i18n";
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { ROUTES } from "/imports/utils/enums";
  import Groups from "/imports/api/groups/groups";

  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import { newPollStore } from "/imports/utils/functions/stores";
  import { onMount } from "svelte";
  export let meta;
  let selectedGroups;
  let newPoll = {};

  $: selectedGroups = useTracker(() =>
    Groups.find(
      { _id: { $in: $newPollStore.groups } },
      { sort: { name: -1 } }
    ).fetch()
  );
</script>

<svelte:head>
  <title>{$_("title")} | {$_("links.new_poll_4")}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {$_("pages.new_poll_4.title")}
    </h1>

    <div class="box">
      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label">{$_("pages.new_poll_1.title_input")}</label>
            <div class="control">
              {$newPollStore.title}
            </div>
          </div>
          <div class="field">
            <label class="label"
              >{$_("pages.new_poll_1.description_input")}</label
            >
            <div class="control">
              {$newPollStore.description}
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">{$_("pages.new_poll_1.group_input")}</label>
            {#await Meteor.subscribe("groups.memberOf")}
              {$_("pages.new_poll_1.group_loading")}
            {:then}
              <div class="tags">
                {#each $selectedGroups as group}
                  <span class="tag is-medium is-primary">
                    {group.name}
                  </span>
                {/each}
              </div>
            {/await}
          </div>

          <div class="field">
            <div class="control">
              <label class="label">{$_("pages.new_poll_1.public_input")}</label>
              {$_(
                $newPollStore.public
                  ? "pages.new_poll.yes"
                  : "pages.new_poll.no"
              )}
            </div>
          </div>
        </div>
        <div class="column is-full">
          <Divider />
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-full">
          <Divider />
        </div>
        <div class="column is-half-desktop is-full-mobile">
          <BigLink
            link={ROUTES.NEW_POLL_3}
            text={$_("pages.new_poll.previous")}
            color="is-secondary"
          />
        </div>
        <div class="column is-half-desktop is-full-mobile is-right">
          <BigLink
            disabled={!$newPollStore.title}
            text={$_("pages.new_poll.next")}
          />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .is-right {
    display: flex;
    justify-content: flex-end;
  }
</style>
