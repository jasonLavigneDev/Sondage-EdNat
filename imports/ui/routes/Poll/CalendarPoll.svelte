<script>
  import { _, locale } from "svelte-i18n";
  import FullCalendar from "svelte-fullcalendar";
  import moment from "moment";
  import allLocales from "@fullcalendar/core/locales-all";
  import interactionPlugin from "@fullcalendar/interaction"; // for selectable
  import timeGridPlugin from "@fullcalendar/timegrid";

  export let answers = [];
  export let answer = {};
  export let poll = {};
  export let toggleChoice = () => null;
  let options;
  let events;

  const selectSlot = ({ event }) => {
    if (!answers.find((a) => moment(a.meetingSlot).isSame(event.start))) {
      toggleChoice(event.start);
    }
  };

  $: events = poll.meetingSlots.map(({ start, end }) => {
    const answerToSlot = answers.find((a) =>
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
        className: "fc-slot-taken",
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
    plugins: [timeGridPlugin, interactionPlugin],
    firstDay: 1,
    allDaySlot: false,
    nowIndicator: true,
    dayHeaderFormat: {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      omitCommas: true,
    },
    buttonText: {
      today: $_("today"),
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
