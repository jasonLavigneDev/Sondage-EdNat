<script>
  import { _, locale } from 'svelte-i18n';
  import FullCalendar from 'svelte-fullcalendar';
  import moment from 'moment';
  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import allLocales from '@fullcalendar/core/locales-all';
  import interactionPlugin from '@fullcalendar/interaction'; // for selectable
  import timeGridPlugin from '@fullcalendar/timegrid';
  import listView from '@fullcalendar/list';
  import PollsAnswers from '../../../api/polls_answers/polls_answers';
  import slotsIncludes from '../../../utils/functions/answers';

  export let answer = {};
  export let poll = {};
  export let toggleChoice = () => null;
  export let currentAnswer = {};
  export let editMode = false;

  let answers;
  let options;
  let events;

  $: answers = useTracker(() => {
    // load all answers for this poll, except current user's answer
    Meteor.subscribe('polls_answers.onePoll', { pollId: poll._id });
    return PollsAnswers.find({ pollId: poll._id })
      .fetch()
      .map((a) => {
        // change meetingSlot to array for old pollAnswers
        a.meetingSlot = Array.isArray(a.meetingSlot) ? a.meetingSlot : [a.meetingSlot];
        return a;
      });
  });

  function canSeeEmail(myemail, email) {
    return Meteor.userId() === poll.userId || myemail === email;
  }

  const selectSlot = ({ event }) => {
    if (Meteor.userId() === poll.userId && !editMode) {
      return;
    }
    if (!$answers.find((a) => slotsIncludes(a.meetingSlot, event.start) && a._id !== answer._id)) {
      toggleChoice(event.start);
    }
  };

  $: events = poll.meetingSlots.map(({ start, end }) => {
    const answerToSlot = slotsIncludes(answer.meetingSlot, start)
      ? answer
      : $answers.find((a) => {
          if (editMode && a.email === answer.email) return false;
          return slotsIncludes(a.meetingSlot, start);
        });
    if (slotsIncludes(answer.meetingSlot, start)) {
      return {
        start,
        end,
        title: currentAnswer.name,
        className:
          answerToSlot && answerToSlot.confirmed && answerToSlot.email === currentAnswer.email
            ? 'fc-slot-confirmed'
            : 'fc-slot-current',
      };
    } else if (answerToSlot) {
      return {
        start,
        end,
        title: canSeeEmail(currentAnswer.email, answerToSlot.email)
          ? answerToSlot.name
          : $_('pages.answer.unavailable'),
        className: !canSeeEmail(currentAnswer.email, answerToSlot.email)
          ? 'fc-slot-unavailable'
          : answerToSlot.confirmed
            ? 'fc-slot-confirmed'
            : 'fc-slot-taken',
      };
    } else {
      return {
        start,
        end,
      };
    }
  });

  $: options = {
    initialView: 'timeGridWeek',
    plugins: [timeGridPlugin, interactionPlugin, listView],
    firstDay: 1,
    allDaySlot: false,
    nowIndicator: true,
    initialDate: poll.meetingSlots.sort((a, b) => moment(a.start).isBefore(b.start))[0].start,
    dayHeaderFormat: {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
      omitCommas: true,
    },
    buttonText: {
      today: $_('today'),
      listYear: $_('pages.answer.listYear'),
      timeGridWeek: $_('pages.answer.timeGridWeek'),
    },
    headerToolbar: {
      left: 'timeGridWeek listYear',
    },
    locale: $locale,
    timeZone: 'local',
    // date handling
    slotDuration: poll.duration === '00:10' ? '00:10:00' : poll.duration === '00:15' ? '00:15:00' : '00:30:00',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      startTime: '05:00',
      endTime: '22:00',
    },
    // events handling
    events,
    eventClick: selectSlot,
    // theme handling
    themeSystem: 'bootstrap',
    height: 500,
  };
</script>

<FullCalendar {options} />
