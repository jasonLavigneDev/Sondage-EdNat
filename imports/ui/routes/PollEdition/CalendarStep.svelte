<script>
  import { _, locale } from 'svelte-i18n';
  import { ROUTES } from '/imports/utils/enums';
  import FullCalendar from 'svelte-fullcalendar';
  import moment from 'moment';
  import allLocales from '@fullcalendar/core/locales-all';
  import interactionPlugin from '@fullcalendar/interaction'; // for selectable
  import timeGridPlugin from '@fullcalendar/timegrid';
  import SelectedDatesTable from './components/SelectedDatesTable.svelte';

  // components
  import BigLink from '/imports/ui/components/common/BigLink.svelte';
  import Divider from '/imports/ui/components/common/Divider.svelte';
  import { newPollStore } from '/imports/utils/functions/stores';
  import StepBar from '../../components/common/StepBar.svelte';
  import timeSlotsGen from '../../../utils/functions/timeSlotsGen';
  import { DURATIONS, DURATIONS_TIME } from '../../../utils/enums';
  export let meta;

  let options;

  const selectTimeSlot = ({ start, end }) => {
    if (start < new Date()) {
      return null;
    }
    const generated = timeSlotsGen(start, end, DURATIONS_TIME[$newPollStore.duration]);
    const newTimesSlots = [];
    generated.forEach((t) => {
      if (
        $newPollStore.meetingSlots.find(
          (s) =>
            moment(t).isBetween(moment(s.start), moment(s.end)) ||
            moment(t).add(DURATIONS_TIME[$newPollStore.duration], 'minutes').isBetween(moment(s.start), moment(s.end)),
        )
      ) {
        return null;
      }

      newTimesSlots.push({
        start: new Date(t),
        end: new Date(moment(t).add(DURATIONS_TIME[$newPollStore.duration], 'minutes')),
      });
    });
    $newPollStore.meetingSlots = [...$newPollStore.meetingSlots, ...newTimesSlots];
  };
  const resetSlots = () => {
    $newPollStore.meetingSlots = [];
  };
  const removeEvent = ({ event }) => {
    const newEvents = [];
    $newPollStore.meetingSlots.forEach((e) => {
      if (moment(e.start).isSame(event.start)) {
        return;
      }
      newEvents.push(e);
    });
    $newPollStore.meetingSlots = newEvents;
  };

  $: options = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, interactionPlugin],
    firstDay: 1,
    allDaySlot: false,
    nowIndicator: true,
    initialDate:
      ($newPollStore.meetingSlots &&
        $newPollStore.meetingSlots.length &&
        $newPollStore.meetingSlots.sort((a, b) => moment(a.start).isBefore(b.start))[0].start) ||
      new Date(),
    dayHeaderFormat: {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
      omitCommas: true,
    },
    buttonText: {
      today: $_('today'),
    },
    locale: $locale,
    timeZone: 'local',
    // date handling
    slotDuration: $newPollStore.duration === '00:15' ? '00:15:00' : '00:30:00',
    selectable: true,
    select: selectTimeSlot,
    selectOverlap: false,
    selectConstraint: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      startTime: '00:00',
      endTime: '23:59',
    },
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      startTime: '05:00',
      endTime: '22:00',
    },
    // events handling
    events: $newPollStore.meetingSlots,
    eventClick: removeEvent,
    // theme handling
    themeSystem: 'bootstrap',
  };

</script>

<svelte:head>
  <title>{$_('title')} | {$_(meta.params._id ? 'links.edit_poll_2' : 'links.new_poll_2')}</title>
</svelte:head>

<section class="box-transparent">
  <div class="container">
    <h1 class="title is-3">
      {#if meta.params._id}
        {$_('pages.new_poll_2.title_meeting_edit')}
      {:else}
        {$_('pages.new_poll_2.title_meeting')}
      {/if}
    </h1>
    <StepBar active={2} pollId={meta.params._id} />
    <div class="columns is-multiline is-mobile">
      <div class="column is-two-thirds-desktop is-full-mobile">
        <div class="box">
          <h3 class="title is-5">
            {$_('pages.new_poll_2.selected_time_slots')}
          </h3>
          <Divider />
          <div class="column is-full">
            <label class="label">{$_('pages.new_poll_2.duration')}</label>
            <div class="field has-addons">
              <div class="control">
                <div class="select is-fullwidth">
                  <select
                    bind:value={$newPollStore.duration}
                    placeholder={$_('pages.new_poll_3.duration')}
                    disabled={$newPollStore.allDay}
                    on:change={resetSlots}
                  >
                    {#each DURATIONS as duration}
                      <option value={duration}>
                        {duration}
                      </option>
                    {/each}
                  </select>
                </div>
              </div>
              <div class="control">
                <div class="button is-light">
                  {$_('pages.new_poll_3.hour')}
                </div>
              </div>
            </div>
          </div>
          <FullCalendar {options} />
        </div>
      </div>
      <div class="column is-one-third-desktop is-full-mobile">
        <SelectedDatesTable bind:dates={$newPollStore.meetingSlots} meetingSlots={true} />
      </div>
      <div class="column is-full">
        <Divider />
      </div>
      <div class="column is-half-desktop is-full-mobile">
        <BigLink
          link={meta.params._id ? ROUTES.EDIT_POLL_RM(meta.params._id, 1) : ROUTES.NEW_POLL_RM(1)}
          text={$_('pages.new_poll.previous')}
          color="is-secondary"
        />
      </div>
      <div class="column is-half-desktop is-full-mobile is-right">
        <BigLink
          disabled={!$newPollStore.meetingSlots.length}
          link={meta.params._id ? ROUTES.EDIT_POLL_RM(meta.params._id, 3) : ROUTES.NEW_POLL_RM(3)}
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
