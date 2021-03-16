<script>
  import { _ } from "svelte-i18n";
  import { ROUTES } from "/imports/utils/enums";

  // components
  import BigLink from "/imports/ui/components/common/BigLink.svelte";
  import Divider from "/imports/ui/components/common/Divider.svelte";
  import {
    newPollStore,
    EMPTY_NEW_POLL,
  } from "/imports/utils/functions/stores";
  import Checkbox from "../../components/common/Checkbox.svelte";
  export let meta;

  const resetNewPoll = () => {
    newPollStore.set(EMPTY_NEW_POLL);
  };

  const handleSelect = (event) => {
    console.log("selected item", event.detail);
    $newPollStore.groups = event.detail;
  };

  const handleChangePublic = (e) => {
    const { checked } = e.detail;
    $newPollStore.public = checked;
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
        </div>
        <div class="column is-half">
          <div class="field">
            <label class="label">{$_("pages.new_poll_1.group_input")}</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select placeholder={$_("pages.new_poll_1.group_input")}>
                  <option>Select dropdown</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
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
