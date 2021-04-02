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
  import DateDisplay from "../components/common/DateDisplay.svelte";
  import Checkbox from "../components/common/Checkbox.svelte";

  export let meta;
  let selectedGroups;
  let poll = {};
  let loading = false;
  let answers = [];
  let answer = {
    email: "",
    userId: Meteor.userId(),
    choices: [],
  };

  onMount(() => {
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
            answers = r.answers;
          } else {
            toast.push($_(e.reason), toasts.error);
            router.goto(ROUTES.ADMIN);
          }
        }
      );
    } else {
      toast.push($_("pages.new_poll.poll_not_found"), toasts.error);
      router.goto(ROUTES.ADMIN);
    }
  });

  $: if ($currentUser && !answer.email) {
    answer = {
      ...answer,
      email: $currentUser.services.keycloak
        ? $currentUser.services.keycloak.email
        : $currentUser.emails[0].address,
      userId: $currentUser._id,
    };
  }

  const toggleChoice = (index, slot) => {
    if (poll.allDay) {
      answer.choices[index].present = !answer.choices[index].present;
    } else {
      const isToggled = answer.choices[index].slots.find((s) => s === slot);
      if (isToggled) {
        answer.choices[index].slots = answer.choices[index].slots.filter(
          (s) => s !== slot
        );
      } else {
        answer.choices[index].slots = [...answer.choices[index].slots, slot];
      }
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
      {poll.title ? poll.title : $_("loading")}
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

          <div class="column is-full">
            <Divider />
          </div>
          <div class="column is-half">
            <label class="label">{$_("pages.answer.email")}</label>
            <div class="field" class:has-addons={!Meteor.userId()}>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  disabled={Meteor.userId()}
                  bind:value={answer.email}
                  placeholder={$_("pages.answer.email")}
                />
              </div>

              {#if !Meteor.userId()}
                <div class="control">
                  <BigLink
                    action={Meteor.loginWithKeycloak}
                    text={$_("pages.login.signin")}
                  />
                </div>
              {/if}
            </div>
          </div>
          <div class="column is-full">
            <div class="table-container">
              <table class="table is-striped is-fullwidth is-bordered">
                <thead>
                  <tr>
                    <th />
                    {#each poll.dates as day}
                      {#if !poll.allDay && day.slots}
                        {#each day.slots as slot, i}
                          <th>
                            <DateDisplay
                              date={day.date}
                              {slot}
                              duration={poll.duration}
                            />
                          </th>
                        {/each}
                      {:else}
                        <th>
                          <DateDisplay
                            date={day.date}
                            duration={poll.duration}
                          />
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
                              return a.choices[index].slots.find(
                                (s) => s === slot
                              );
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
                              checked={answer.choices[index].slots.find(
                                (s) => s === slot
                              )}
                            />
                          </td>
                        {/each}
                      {:else}
                        <td>
                          <Checkbox
                            center
                            action={() => toggleChoice(index)}
                            checked={answer.choices[index] &&
                              answer.choices[index].present}
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
                                checked={single_answer.choices[
                                  index
                                ].slots.find((s) => s === slot)}
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
          </div>
          <div class="column is-half-desktop is-full-mobile" />
          <div class="column is-half-desktop is-full-mobile is-right">
            <BigLink
              disabled={!answer.email || loading}
              action={sendAnswer}
              text={$_("pages.new_poll.validate")}
            />
          </div>
        </div>
      </div>
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
