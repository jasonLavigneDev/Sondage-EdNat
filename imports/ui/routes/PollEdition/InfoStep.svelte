<script>
  import { _ } from 'svelte-i18n';
  import { Meteor } from 'meteor/meteor';
  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import { onMount } from 'svelte';
  import { router } from 'tinro';
  //import { useQuery } from '/imports/api/utils/hook';
  import { toast } from '@zerodevx/svelte-toast';

  import { ROUTES, toasts } from '/imports/utils/enums';
  import Groups from '/imports/api/groups/groups';

  // components
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  import Divider from '/imports/ui/components/common/Divider.svelte';
  import Loader from '/imports/ui/components/common/Loader.svelte';
  import { newPollStore, EMPTY_NEW_POLL } from '/imports/utils/functions/stores';
  import Checkbox from '../../components/common/Checkbox.svelte';
  import StepBar from '../../components/common/StepBar.svelte';
  import Radios from '../../components/common/Radios.svelte';
  import { POLLS_TYPES } from '/imports/utils/enums';
  import getGroupName from '/imports/utils/functions/groups'
  import PackageJSON from '../../../../package.json';
  let version = PackageJSON.version;

  export let meta;
  let selectedGroups, groups, loading;

  const resetPollEdition = () => {
    newPollStore.set({ ...EMPTY_NEW_POLL });
  };

  onMount(() => {
    if (meta.params._id) {
      loading = true;
      Meteor.call('polls.getSinglePoll', { pollId: meta.params._id }, (e, r) => {
        loading = false;
        if (r) {
          newPollStore.set({
            _id: meta.params._id,
            ...r,
          });
        } else {
          toast.push($_('pages.new_poll.poll_not_found'), toasts.error);
          router.goto(ROUTES.ADMIN);
        }
      });
    } else if ($newPollStore._id) {
      newPollStore.set({ ...EMPTY_NEW_POLL });
    }
    const groupId = meta.query.groupId;
    if (groupId) {
      if (!$newPollStore.groups.includes(groupId)) {
        $newPollStore.groups = [...$newPollStore.groups, groupId];
      }
    }
  });

  $: groups = useTracker(() => Groups.find({}, { sort: { name: -1 } }).fetch());
  $: selectedGroups = useTracker(() =>
    Groups.find({ _id: { $in: $newPollStore ? $newPollStore.groups : [] } }, { sort: { name: -1 } }).fetch(),
  );

  const handleSelect = (event) => {
    if (event.target.value !== "null" && !$newPollStore.groups.includes(event.target.value)) {
      $newPollStore.groups = [...$newPollStore.groups, event.target.value];
    }
  };

  const handleRemoveGroup = (groupId) => {
    $newPollStore.groups = $newPollStore.groups.filter((g) => g !== groupId);
  };
</script>

<svelte:head>
  <title>{$_('title')} {version} | {$_(meta.params._id ? 'links.edit_poll_1' : 'links.new_poll_1')}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {#if $newPollStore.type === POLLS_TYPES.POLL && meta.params._id}
        {$_('pages.new_poll_1.title_edit')}
      {:else if $newPollStore.type === POLLS_TYPES.POLL}
        {$_('pages.new_poll_1.title')}
      {:else if meta.params._id}
        {$_('pages.new_poll_1.title_meeting_edit')}
      {:else}
        {$_('pages.new_poll_1.title_meeting')}
      {/if}
    </h1>

    <StepBar active={1} pollId={meta.params._id} />
    {#if loading}
      <Loader />
    {/if}

    <div class="box">
      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label">{$_('pages.new_poll_1.title_input')}</label>
            <div class="control">
              <input
                class="input"
                type="text"
                autofocus
                maxlength="32"
                bind:value={$newPollStore.title}
                placeholder={$_('pages.new_poll_1.title_input')}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">{$_('pages.new_poll_1.description_input')}</label>
            <div class="control">
              <textarea
                class="textarea"
                maxlength="256"
                rows="5"
                bind:value={$newPollStore.description}
                placeholder={$_('pages.new_poll_1.description_input')}
              />
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <label class="label">{$_('pages.new_poll_1.group_input')}</label>

            {#await Meteor.subscribe('groups.memberOf')}
              {$_('pages.new_poll_1.group_loading')}
            {:then}
              <div class="control">
                <div class="select is-fullwidth">
                  <select on:change={handleSelect} placeholder={$_('pages.new_poll_1.group_input')} value={null}>
                    <option value={null}>
                      {$_('pages.new_poll_1.group_select')}
                    </option>
                    {#each $groups as group}
                      <option value={group._id}>
                        {getGroupName(group)}
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
                {getGroupName(group)}
                <button on:click={() => handleRemoveGroup(group._id)} class="delete is-small" />
              </span>
            {/each}
          </div>
          <div class="field">
            <label class="label">{$_('pages.new_poll_1.type_input')}</label>
            <Radios
              options={Object.keys(POLLS_TYPES).map((k) => ({
                label: $_(`types.${POLLS_TYPES[k]}`),
                value: POLLS_TYPES[k],
              }))}
              bind:value={$newPollStore.type}
            />
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="field">
          <div class="control">
            <Checkbox bind:checked={$newPollStore.public} label={$_('pages.new_poll_1.public_input')} />
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
          text={$_('pages.new_poll.cancel')}
          color="is-secondary"
          action={resetPollEdition}
        />
      </div>
      <div class="column is-half-desktop is-full-mobile is-right">
        <BigLink
          disabled={!$newPollStore.title}
          link={meta.params._id ? ROUTES.EDIT_POLL_RM(meta.params._id, 2) : ROUTES.NEW_POLL_RM(2)}
          text={$_('pages.new_poll.next')}
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
