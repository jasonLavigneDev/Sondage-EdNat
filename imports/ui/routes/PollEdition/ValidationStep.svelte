<script>
  import { _ } from 'svelte-i18n';
  import { Meteor } from 'meteor/meteor';
  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import { ROUTES, toasts } from '/imports/utils/enums';
  import Groups from '/imports/api/groups/groups';
  import { toast } from '@zerodevx/svelte-toast';

  // components
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  import Divider from '/imports/ui/components/common/Divider.svelte';
  import { newPollStore, EMPTY_NEW_POLL } from '/imports/utils/functions/stores';
  import moment from 'moment';
  import InputTimePicker from './components/InputTimePicker.svelte';
  import { router } from 'tinro';
  import StepBar from '../../components/common/StepBar.svelte';
  import { POLLS_TYPES } from '../../../utils/enums';
  import getGroupName from '/imports/utils/functions/groups';
  import PackageJSON from '../../../../package.json';
  let version = PackageJSON.version;

  export let meta;
  let selectedGroups;
  let titleOk = false;
  let dateOk = false;
  let slotsOk = $newPollStore.allDay ? true : false;

  $: selectedGroups = useTracker(() =>
    Groups.find({ _id: { $in: $newPollStore.groups } }, { sort: { name: -1 } }).fetch(),
  );

  // check that at least title and 1 date or meetingslots are defined
  $: titleOk = !!$newPollStore.title;
  dateOk =
    $newPollStore.type === POLLS_TYPES.POLL
      ? $newPollStore.dates.length <= 0
        ? false
        : $newPollStore.allDay
        ? true
        : $newPollStore.dates.filter((date) => date.slots.length === 0).length === 0
      : $newPollStore.meetingSlots.length > 0;
  // check that there are no duplicates in time slots
  if (!$newPollStore.allDay) {
    let datesOk = true;
    $newPollStore.dates.forEach((day) => {
      let uniqSlots = new Set(day.slots);
      if (uniqSlots.size != day.slots.length) datesOk = false;
    });
    if (datesOk) slotsOk = true;
  }

  const validatePollEdition = () => {
    if (!titleOk) toast.push($_('pages.new_poll_4.missingTitle'), toasts.error);
    if (!dateOk) toast.push($_('pages.new_poll_4.missingDate'), toasts.error);
    if (!slotsOk) toast.push($_('pages.new_poll_4.duplicateSlots'), toasts.error);
    if (titleOk && dateOk && slotsOk) {

      const newPollStoreDates = $newPollStore.dates.sort((a, b) => a.date - b.date).map((obj) => {
        const newdate = obj.date
        const newslots = obj.slots.map(slot => new Date(newdate.setHours(slot.split(":")[0],slot.split(":")[1])))
        return {
          date: newdate,
          slots: newslots.sort(),
        };        
      })
      
console.log('AVANT', JSON.stringify($newPollStore.dates, null, 4))
console.log($newPollStore.dates)
console.log('APRES', JSON.stringify(newPollStoreDates, null, 4))
console.log(newPollStoreDates)
      // Meteor.call(
      //   meta.params._id ? 'polls.update' : 'polls.create',
      //   {
      //     data: {
      //       ...$newPollStore,
      //       dates:
      //         $newPollStore.type === POLLS_TYPES.POLL
      //           ? $newPollStore.dates
      //               .sort((a, b) => a.date - b.date)
      //               .map((date) => {
      //                 return {
      //                   date: date.date,
      //                   slots: date.slots.sort(),
      //                 };
      //               })
      //           : [],
      //       meetingSlots:
      //         $newPollStore.type === POLLS_TYPES.MEETING
      //           ? $newPollStore.meetingSlots.sort((a, b) => a.start - b.start)
      //           : [],
      //     },
      //     pollId: meta.params._id,
      //   },
      //   (error) => {
      //     if (error) {
      //       if (error.details) {
      //         messages = error.details.map((err) => err.message);
      //         toast.push(messages.join('<br/>'), toasts.error);
      //       } else {
      //         toast.push($_(error.reason || error.message || 'pages.new_poll_4.creationError'), toasts.error);
      //       }
      //     } else {
      //       toast.push($_(meta.params._id ? 'pages.new_poll_4.poll_modified' : 'pages.new_poll_4.poll_created'));
      //       router.goto(ROUTES.ADMIN);
      //       newPollStore.set({ ...EMPTY_NEW_POLL });
      //     }
      //   },
      // );
    }
  };
</script>

<svelte:head>
  <title>{$_('title')} {version} | {$_(meta.params._id ? 'links.edit_poll_4' : 'links.new_poll_4')}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {$_(meta.params._id ? 'pages.new_poll_4.title_edit' : 'pages.new_poll_4.title')}
    </h1>
    <StepBar active={4} pollId={meta.params._id} />
    <div class="box">
      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label title is-4">
              {$_('pages.new_poll_1.title_input')}
            </label>
            <div class="control">
              {$newPollStore.title}
            </div>
          </div>
          <div class="field">
            <label class="label title is-4">
              {$_('pages.new_poll_1.description_input')}
            </label>
            <div class="control">
              {$newPollStore.description}
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label title is-4">{$_('pages.new_poll_1.group_input')}</label>
            {#await Meteor.subscribe('groups.memberOf')}
              {$_('pages.new_poll_1.group_loading')}
            {:then}
              <div class="tags">
                {#each $selectedGroups as group}
                  <span class="tag is-medium is-primary">
                    {getGroupName(group)}
                  </span>
                {/each}
              </div>
            {/await}
          </div>
          <div class="field">
            <div class="control">
              <label class="label title is-4">
                {$_('pages.new_poll_1.public_input')}
              </label>
              {$_($newPollStore.public ? 'pages.new_poll.yes' : 'pages.new_poll.no')}
            </div>
          </div>
          <div class="field">
            <div class="control">
              <label class="label title is-4">
                {$_('pages.new_poll_1.hideParticipantsList_input')}
              </label>
              {$_($newPollStore.hideParticipantsList ? 'pages.new_poll.yes' : 'pages.new_poll.no')}
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <div class="control">
              <label class="label title is-4">
                {$_('pages.new_poll_3.allDay_input')}
              </label>
              {$_($newPollStore.allDay ? 'pages.new_poll.yes' : 'pages.new_poll.no')}
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <div class="control">
              <label class="label title is-4">
                {$_('pages.new_poll_3.duration')}
              </label>
              {#if $newPollStore.allDay}
                {$_('pages.new_poll_3.allDay_input')}
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
          <div class="title is-4">{$_('pages.new_poll_4.proposed_times')}</div>
        </div>
        {#if $newPollStore.type === POLLS_TYPES.MEETING}
          {#each $newPollStore.meetingSlots as day}
            <div class="column is-one-quarter">
              <div class="block">
                <div class="title is-6">
                  {moment(day.start).format($_('components.Time.dateFormat'))}
                </div>
                {moment(day.start).format('HH:mm')}
                -
                {moment(day.end).format('HH:mm')}
              </div>
            </div>
          {/each}
        {:else}
          {#each $newPollStore.dates.sort((a, b) => a.date - b.date) as day}
            <div class="column is-one-quarter">
              <div class="block">
                <div class="title is-6">
                  {moment(day.date).format($_('components.Time.dateFormat'))}
                </div>
                <div class="buttons">
                  {#if $newPollStore.allDay}
                    {$_('pages.new_poll_3.allDay_input')}
                  {:else}
                    {#each day.slots.sort() as slot}
                      <InputTimePicker date={day.date} duration={$newPollStore.duration} value={slot} disabled={true} />
                    {/each}
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>

      <div class="columns is-multiline">
        <div class="column is-full">
          <Divider />
        </div>
        <div class="column is-half-desktop is-full-mobile">
          <BigLink
            link={meta.params._id
              ? ROUTES.EDIT_POLL_RM(meta.params._id, $newPollStore.type === POLLS_TYPES.MEETING ? 2 : 3)
              : ROUTES.NEW_POLL_RM($newPollStore.type === POLLS_TYPES.MEETING ? 2 : 3)}
            text={$_('pages.new_poll.previous')}
            color="is-secondary"
          />
        </div>
        <div class="column is-half-desktop is-full-mobile is-right">
          <BigLink action={validatePollEdition} text={$_('pages.new_poll.validate')} />
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
