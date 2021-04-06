<script>
  import { _ } from "svelte-i18n";
  import { Meteor } from "meteor/meteor";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import { ROUTES, toasts } from "/imports/utils/enums";
  import Groups from "/imports/api/groups/groups";
  import { createPoll, updatePoll } from "/imports/api/polls/methods";
  import { toast } from "@zerodevx/svelte-toast";

  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import {
    newPollStore,
    EMPTY_NEW_POLL,
  } from "/imports/utils/functions/stores";
  import { formatDate } from "timeUtils";
  import InputTimePicker from "./components/InputTimePicker.svelte";
  import { router } from "tinro";
  import StepBar from "../../components/common/StepBar.svelte";

  export let meta;
  let selectedGroups;
  let newPoll = {};
  const FORMAT_KEY_DATE = "#{j}-#{m}-#{Y}";

  $: selectedGroups = useTracker(() =>
    Groups.find(
      { _id: { $in: $newPollStore.groups } },
      { sort: { name: -1 } }
    ).fetch()
  );

  const validatePollEdition = () => {
    const method = meta.params._id ? updatePoll : createPoll;
    method.call(
      {
        data: {
          ...$newPollStore,
          dates: $newPollStore.dates.sort((a, b) => a.date - b.date),
        },
        pollId: meta.params._id,
      },
      (error, result) => {
        if (error) {
          toast.push($_(error.reason), toasts.error);
        } else {
          toast.push(
            $_(
              meta.params._id
                ? "pages.new_poll_4.poll_modified"
                : "pages.new_poll_4.poll_created"
            )
          );
          router.goto(ROUTES.ADMIN);
          newPollStore.set(EMPTY_NEW_POLL);
        }
      }
    );
  };
</script>

<svelte:head>
  <title
    >{$_("title")} | {$_(
      meta.params._id ? "links.edit_poll_4" : "links.new_poll_4"
    )}</title
  >
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {$_(
        meta.params._id
          ? "pages.new_poll_4.title_edit"
          : "pages.new_poll_4.title"
      )}
    </h1>
    <StepBar active={4} pollId={meta.params._id} />
    <div class="box">
      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label title is-4">
              {$_("pages.new_poll_1.title_input")}
            </label>
            <div class="control">
              {$newPollStore.title}
            </div>
          </div>
          <div class="field">
            <label class="label title is-4">
              {$_("pages.new_poll_1.description_input")}
            </label>
            <div class="control">
              {$newPollStore.description}
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label title is-4"
              >{$_("pages.new_poll_1.group_input")}</label
            >
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
              <label class="label title is-4">
                {$_("pages.new_poll_1.public_input")}
              </label>
              {$_(
                $newPollStore.public
                  ? "pages.new_poll.yes"
                  : "pages.new_poll.no"
              )}
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <div class="control">
              <label class="label title is-4">
                {$_("pages.new_poll_3.allDay_input")}
              </label>
              {$_(
                $newPollStore.allDay
                  ? "pages.new_poll.yes"
                  : "pages.new_poll.no"
              )}
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <div class="control">
              <label class="label title is-4">
                {$_("pages.new_poll_3.duration")}
              </label>
              {#if $newPollStore.allDay}
                {$_("pages.new_poll_3.allDay_input")}
              {:else}
                {$newPollStore.duration}
              {/if}
            </div>
          </div>
        </div>
        <div class="column is-full">
          <Divider />
        </div>

        <div class="column is-full">
          <div class="title is-4">{$_("pages.new_poll_4.proposed_times")}</div>
        </div>

        {#each $newPollStore.dates as day}
          <div class="column is-one-quarter">
            <div class="block">
              <div class="title is-6">
                {formatDate(day.date, $_("components.Time.dateFormat"))}
              </div>
              <div class="buttons">
                {#if $newPollStore.allDay}
                  {$_("pages.new_poll_3.allDay_input")}
                {:else}
                  {#each day.slots as slot}
                    <InputTimePicker
                      date={day.date}
                      duration={$newPollStore.duration}
                      value={slot}
                      disabled={true}
                    />
                  {/each}
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="columns is-multiline">
        <div class="column is-full">
          <Divider />
        </div>
        <div class="column is-half-desktop is-full-mobile">
          <BigLink
            link={meta.params._id
              ? ROUTES.EDIT_POLL_RM(meta.params._id, 3)
              : ROUTES.NEW_POLL_RM(3)}
            text={$_("pages.new_poll.previous")}
            color="is-secondary"
          />
        </div>
        <div class="column is-half-desktop is-full-mobile is-right">
          <BigLink
            disabled={!$newPollStore.dates}
            action={validatePollEdition}
            text={$_("pages.new_poll.validate")}
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
