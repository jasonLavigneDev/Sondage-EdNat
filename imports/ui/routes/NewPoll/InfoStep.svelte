<script>
  import { _ } from "svelte-i18n";
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { ROUTES } from "/imports/utils/enums";
  import Groups from "/imports/api/groups/groups";

  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import {
    newPollStore,
    EMPTY_NEW_POLL,
  } from "/imports/utils/functions/stores";
  import Checkbox from "../../components/common/Checkbox.svelte";
  export let meta;
  let selectedGroups, groups;

  const resetNewPoll = () => {
    newPollStore.set(EMPTY_NEW_POLL);
  };

  $: groups = useTracker(() => Groups.find({}, { sort: { name: -1 } }).fetch());
  $: selectedGroups = useTracker(() =>
    Groups.find(
      { _id: { $in: $newPollStore.groups } },
      { sort: { name: -1 } }
    ).fetch()
  );

  const handleSelect = (event) => {
    $newPollStore.groups = [...$newPollStore.groups, event.target.value];
  };

  const handleRemoveGroup = (groupId) => {
    $newPollStore.groups = $newPollStore.groups.filter((g) => g !== groupId);
  };
</script>

<svelte:head>
  <title>{$_("title")} | {$_("links.new_poll_1")}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {$_("pages.new_poll_1.title")}
    </h1>

    <div class="box">
      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label">{$_("pages.new_poll_1.title_input")}</label>
            <div class="control">
              <input
                class="input"
                type="text"
                bind:value={$newPollStore.title}
                placeholder={$_("pages.new_poll_1.title_input")}
              />
            </div>
          </div>
          <div class="field">
            <label class="label"
              >{$_("pages.new_poll_1.description_input")}</label
            >
            <div class="control">
              <textarea
                class="textarea"
                rows="5"
                bind:value={$newPollStore.description}
                placeholder={$_("pages.new_poll_1.description_input")}
              />
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <label class="label">{$_("pages.new_poll_1.group_input")}</label>

            {#await Meteor.subscribe("groups.memberOf")}
              {$_("pages.new_poll_1.group_loading")}
            {:then}
              <div class="control">
                <div class="select is-fullwidth">
                  <select
                    on:change={handleSelect}
                    placeholder={$_("pages.new_poll_1.group_input")}
                    value={null}
                  >
                    <option value={null}>
                      {$_("pages.new_poll_1.group_select")}
                    </option>
                    {#each $groups as group}
                      <option value={group._id}>
                        {group.name}
                      </option>
                    {/each}
                  </select>
                </div>
              </div>
            {/await}
          </div>
          <div class="tags">
            {#each $selectedGroups as group}
              <span class="tag is-medium is-primary">
                {group.name}
                <button
                  on:click={() => handleRemoveGroup(group._id)}
                  class="delete is-small"
                />
              </span>
            {/each}
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="field">
          <div class="control">
            <Checkbox
              bind:checked={$newPollStore.public}
              label={$_("pages.new_poll_1.public_input")}
            />
          </div>
        </div>
      </div>
    </div>

    <div class="columns is-multiline">
      <div class="column is-full">
        <Divider />
      </div>
      <div class="column is-half-desktop is-full-mobile">
        <BigLink
          link={ROUTES.ADMIN}
          text={$_("pages.new_poll.cancel")}
          color="is-secondary"
          action={resetNewPoll}
        />
      </div>
      <div class="column is-half-desktop is-full-mobile is-right">
        <BigLink
          disabled={!$newPollStore.title}
          link={ROUTES.NEW_POLL_2}
          text={$_("pages.new_poll.next")}
        />
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
