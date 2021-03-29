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
  let poll = {};
  let loading = false;
  let answer = {
    email: "",
    userId: Meteor.userId(),
    choices: {},
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
            poll = r;
          } else {
            toast.push($_("pages.new_poll.poll_not_found"), toasts.error);
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
      email: Meteor.user().emails[0].address,
      userId: Meteor.userId(),
      choices: {},
    };
  }

  const toggleChoice = (date, slot) => {
    if (typeof answer.choices[date] === "boolean") {
      answer.choices[date] = !answer.choices[date];
    } else if (!answer.choices[date]) {
      answer.choices[date] = poll.allDay ? true : [slot];
    } else if (answer.choices[date].find((s) => s === slot)) {
      answer.choices[date] = answer.choices[date].filter((s) => s !== slot);
    } else {
      answer.choices[date] = [...answer.choices[date], slot];
    }
  };
  $: console.log(answer);
</script>

<svelte:head>
  <title>{$_("title")} | {poll.title}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {poll.title ? poll.title : $_("loading")}
    </h1>
    {#if loading}
      <Loader />
    {/if}

    {#if poll._id}
      <div class="box">
        <div class="columns is-multiline">
          <div class="column is-one-third">
            <div class="field">
              <label class="label">{$_("pages.answer.email")}</label>
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
                            <DateDisplay date={day.date} {slot} />
                          </th>
                        {/each}
                      {:else}
                        <th>
                          <DateDisplay date={day.date} />
                        </th>
                      {/if}
                    {/each}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      {answer.email}
                    </td>
                    {#each poll.dates as day}
                      {#if !poll.allDay && day.slots}
                        {#each day.slots as slot, i}
                          <td>
                            <Checkbox
                              center
                              action={() => toggleChoice(day.date, slot)}
                              checked={answer.choices[day.date] &&
                                answer.choices[day.date].find(
                                  (s) => s === slot
                                )}
                            />
                          </td>
                        {/each}
                      {:else}
                        <td>
                          <Checkbox
                            center
                            action={() => toggleChoice(day.date)}
                            checked={answer.choices[day.date]}
                          />
                        </td>
                      {/if}
                    {/each}
                  </tr>
                </tbody>
              </table>
            </div>
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
</style>
