<script>
  import { _, locale } from "svelte-i18n";
  import FullCalendar from "svelte-fullcalendar";
  import moment from "moment";
  import { useTracker } from "meteor/rdb:svelte-meteor-data";
  import allLocales from "@fullcalendar/core/locales-all";
  import interactionPlugin from "@fullcalendar/interaction"; // for selectable
  import timeGridPlugin from "@fullcalendar/timegrid";
  import listView from "@fullcalendar/list";
  import PollsAnswers from "../../../api/polls_answers/polls_answers";

  export let answer = {};
  export let poll = {};
  export let toggleChoice = () => null;
  let answers;
  let options;
  let events;

  $: answers = useTracker(() => {
    Meteor.subscribe("polls_answers.onePoll", { pollId: poll._id });
    return PollsAnswers.find({ pollId: poll._id }).fetch();
  });

  const selectSlot = ({ event }) => {
    if (Meteor.userId() === poll.userId) {
      return;
    }
    if (!$answers.find((a) => moment(a.meetingSlot).isSame(event.start))) {
      if (moment(answer.meetingSlot).isSame(event.start)) {
        toggleChoice(null);
      } else {
        toggleChoice(event.start);
      }
    }
  };

  $: events = poll.meetingSlots.map(({ start, end }) => {
    const answerToSlot = $answers.find((a) =>
      moment(a.meetingSlot).isSame(start)
    );
    if (moment(answer.meetingSlot).isSame(start)) {
      return {
        start,
        end,
        title: answer.email,
        className: "fc-slot-current",
      };
    } else if (answerToSlot) {
      return {
        start,
        end,
        title: answerToSlot.email,
        className: answerToSlot.confirmed
          ? "fc-slot-confirmed"
          : "fc-slot-taken",
      };
    } else {
      return {
        start,
        end,
      };
    }
  });

  $: options = {
    initialView: "timeGridWeek",
    plugins: [timeGridPlugin, interactionPlugin, listView],
    firstDay: 1,
    allDaySlot: false,
    nowIndicator: true,
    initialDate: poll.meetingSlots.sort((a, b) =>
      moment(a.start).isBefore(b.start)
    )[0].start,
    dayHeaderFormat: {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      omitCommas: true,
    },
    buttonText: {
      today: $_("today"),
      listWeek: $_("pages.answer.listWeek"),
      timeGridWeek: $_("pages.answer.timeGridWeek"),
    },
    headerToolbar: {
      left: "listWeek timeGridWeek",
    },
    locale: $locale,
    timeZone: "local",
    // date handling
    slotDuration: poll.duration === "00:15" ? "00:15:00" : "00:30:00",
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
      startTime: "05:00",
      endTime: "22:00",
    },
    // events handling
    events,
    eventClick: selectSlot,
    // theme handling
    themeSystem: "bootstrap",
  };
</script>

<FullCalendar {options} />