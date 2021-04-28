<script>
  import { Meteor } from "meteor/meteor";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { router } from "tinro";
  import { toast } from "@zerodevx/svelte-toast";

  import { ROUTES, toasts } from "/imports/utils/enums";
  import { currentUser } from "/imports/utils/functions/stores";
  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import Loader from "/imports/ui/components/common/Loader.svelte";
  import CalendarPoll from "./CalendarPoll.svelte";
  import PollDateTable from "./PollDateTable.svelte";
  import { POLLS_TYPES } from "../../../utils/enums";
  import Login from "../Login.svelte";
  import MeetingAnswersList from "./MeetingAnswersList.svelte";

  export let meta;
  let selectedGroups;
  let poll = {};
  let loading = false;
  let askToConnect = false;
  let answer = {
    email: "",
    meetingSlot: null,
    userId: Meteor.userId(),
    choices: [],
  };

  const grabData = () => {
    if (meta.params._id) {
      loading = true;
      Meteor.call(
        "polls.getSinglePollToAnswer",
        { pollId: meta.params._id },
        (e, r) => {
          loading = false;
          if (r) {
            poll = r.poll;
            selectedGroups = r.selectedGroups;
            if (r.answer) {
              answer = r.answer;
            } else {
              answer = {
                ...answer,
                pollId: r.poll._id,
                choices: r.poll.dates.map((d) => ({
                  date: d.date,
                  slots: [],
                  present: false,
                })),
              };
            }
          } else {
            toast.push($_(e.reason), toasts.error);
            if (e.reason === "api.errors.notApublicPoll" && !Meteor.userId()) {
              askToConnect = true;
            } else {
              router.goto(ROUTES.ADMIN);
            }
          }
        }
      );
    } else {
      toast.push($_("pages.new_poll.poll_not_found"), toasts.error);
      router.goto(ROUTES.ADMIN);
    }
  };

  onMount(grabData);

  $: if ($currentUser && !answer.email) {
    answer = {
      ...answer,
      email: $currentUser.services.keycloak
        ? $currentUser.services.keycloak.email
        : $currentUser.emails[0].address,
      userId: $currentUser._id,
    };
  }

  const toggleChoice = (indexOrDate, slot) => {
    if (poll.type === POLLS_TYPES.POLL) {
      if (poll.allDay) {
        answer.choices[indexOrDate].present = !answer.choices[indexOrDate]
          .present;
      } else {
        const isToggled = answer.choices[indexOrDate].slots.find(
          (s) => s === slot
        );
        if (isToggled) {
          answer.choices[indexOrDate].slots = answer.choices[
            indexOrDate
          ].slots.filter((s) => s !== slot);
        } else {
          answer.choices[indexOrDate].slots = [
            ...answer.choices[indexOrDate].slots,
            slot,
          ];
        }
      }
    } else {
      answer.meetingSlot = indexOrDate;
    }
  };

  const sendAnswer = () => {
    loading = true;
    Meteor.call("polls_answers.create", { data: answer }, (error, result) => {
      loading = false;
      if (error) {
        toast.push($_(error.reason), toasts.error);
      } else {
        toast.push($_("pages.answer.poll_answered"));
      }
    });
  };
</script>

<svelte:head>
  <title>{$_("title")} | {poll.title}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {poll.title
        ? poll.title
        : askToConnect
        ? $_("pages.answer.askToConnect")
        : $_("loading")}
      {#if !poll.active}
        <span class="icon is-small">
          <i class="fas fa-lock" />
        </span>
      {/if}
    </h1>
    {#if loading}
      <Loader />
    {/if}

    {#if poll._id}
      <div class="box">
        <div class="columns is-multiline">
          <div class="column is-full">
            <div class="field">
              <label class="label">{$_("pages.answer.description")}</label>
              {poll.description}
            </div>
          </div>
          <div class="column is-half">
            <div class="field">
              <div class="control">
                <label class="label">
                  {$_("pages.answer.duration")}
                </label>
                {#if poll.allDay}
                  {$_("pages.answer.allDay")}
                {:else}
                  {poll.duration}
                {/if}
              </div>
            </div>
          </div>

          {#if selectedGroups.length}
            <div class="column is-half">
              <div class="field">
                <label class="label title is-4"
                  >{$_("pages.new_poll_1.group_input")}</label
                >
                <div class="tags">
                  {#each selectedGroups as group}
                    <span class="tag is-medium is-primary">
                      {group.name}
                    </span>
                  {/each}
                </div>
              </div>
            </div>
          {/if}

          <div class="column is-full">
            <Divider />
          </div>
          <div class="column is-half">
            <label class="label">{$_("pages.answer.email")}</label>
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  disabled={Meteor.userId()}
                  bind:value={answer.email}
                  placeholder={$_("pages.answer.email")}
                />
              </div>
            </div>
          </div>
          <div class="column is-half">
            {#if !Meteor.userId()}
              <label class="label">{$_("pages.answer.login_with_lb")}</label>
              <div class="control">
                <BigLink
                  action={Meteor.loginWithKeycloak}
                  text={$_("pages.login.signin")}
                />
              </div>
            {/if}
          </div>
          <div class="column is-full">
            {#if poll.type === POLLS_TYPES.POLL}
              <PollDateTable {toggleChoice} {answer} {poll} {grabData} />
            {:else}
              <CalendarPoll {toggleChoice} {answer} {poll} />
            {/if}
          </div>
          <div class="column is-half-desktop is-full-mobile" />
          <div class="column is-half-desktop is-full-mobile is-right">
            {#if Meteor.userId() === poll.userId && poll.type !== POLLS_TYPES.POLL}
              <BigLink link={ROUTES.ADMIN} text={$_("pages.new_poll.back")} />
            {:else}
              <BigLink
                disabled={!answer.email || loading}
                action={sendAnswer}
                text={$_("pages.new_poll.validate")}
              />
            {/if}
          </div>
        </div>
      </div>
      {#if Meteor.userId() === poll.userId && poll.type !== POLLS_TYPES.POLL}
        <MeetingAnswersList pollId={poll._id} />
      {/if}
    {/if}
  </div>
</section>

<style>
  .is-right {
    display: flex;
    justify-content: flex-end;
  }
  .total_vote {
    text-align: center;
    font-weight: bold;
    font-size: 18px;
    color: var(--primary);
  }
</style>