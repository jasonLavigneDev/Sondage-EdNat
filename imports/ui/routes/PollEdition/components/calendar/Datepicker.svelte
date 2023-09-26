<script>
  import { _ } from "svelte-i18n";
  import moment from "moment";
  import Month from "./Month.svelte";
  import NavBar from "./NavBar.svelte";
  import { getMonths, isDateSelected } from "./lib/helpers";
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const today = new Date();
  const oneYear = 1000 * 60 * 60 * 24 * 365;

  export let format = "	L";
  export let start = new Date(Date.now() - oneYear);
  export let end = new Date(Date.now() + oneYear);
  export let selected = today;
  export let dateChosen = false;
  export let trigger = null;
  export let selectableCallback = null;
  export let weekStart = 0;
  export let style = "";

  let daysOfWeek = JSON.parse($_("components.Time.daysOfWeek"));
  let monthsOfYear = JSON.parse($_("components.Time.monthsOfYear"));
  $: daysOfWeek = JSON.parse($_("components.Time.daysOfWeek"));
  $: monthsOfYear = JSON.parse($_("components.Time.monthsOfYear"));

  let highlighted = [];
  let shouldShakeDate = false;
  let shakeHighlightTimeout;
  let month = today.getMonth();
  let year = today.getFullYear();

  let isOpen = true;
  let isClosing = false;
  let sortedDaysOfWeek;
  $: sortedDaysOfWeek =
    weekStart === 0
      ? daysOfWeek
      : (() => {
          let dow = daysOfWeek.slice();
          dow.push(dow.shift());
          return dow;
        })();
  today.setHours(0, 0, 0, 0);

  function assignmentHandler(formatted) {
    if (!trigger) return;
    trigger.innerHTML = formatted;
  }

  $: months = getMonths(start, end, selectableCallback, weekStart);

  let monthIndex = 0;
  $: {
    monthIndex = 0;
    for (let i = 0; i < months.length; i += 1) {
      if (months[i].month === month && months[i].year === year) {
        monthIndex = i;
      }
    }
  }
  $: visibleMonth = months[monthIndex];

  $: visibleMonthId = year + month / 100;
  $: canIncrementMonth = monthIndex < months.length - 1;
  $: canDecrementMonth = monthIndex > 0;

  export let formattedSelected;
  $: {
    formattedSelected =
      typeof format === "function"
        ? selected.map(format)
        : selected.map((s) => s.date)
  }

  onMount(() => {
    month = today.getMonth();
    year = today.getFullYear();
  });

  function changeMonth(selectedMonth) {
    month = selectedMonth;
    highlighted = new Date(year, month, 1);
  }

  function incrementMonth(direction, day = 1) {
    if (direction === 1 && !canIncrementMonth) return;
    if (direction === -1 && !canDecrementMonth) return;
    let current = new Date(year, month, 1);
    current.setMonth(current.getMonth() + direction);
    month = current.getMonth();
    year = current.getFullYear();
    highlighted = new Date(year, month, day);
  }

  function assignValueToTrigger(formatted) {
    assignmentHandler(formatted);
  }

  function registerSelection(chosen) {
    if (chosen > start && chosen < end) {
      // eslint-disable-next-line
      if (isDateSelected(chosen, selected)) {
        selected = selected.filter((s) => s.date !== chosen);
      } else {
        selected = [...selected, { date: chosen, slots: [] }];
      }
      dateChosen = true;
      assignValueToTrigger(formattedSelected);
      return dispatch("dateSelected", { date: selected });
    }
  }
</script>

<div class="box">
  <div class="datepicker" class:open={isOpen} class:closing={isClosing}>
    <div class="calendar">
      <NavBar
        {month}
        {year}
        {canIncrementMonth}
        {canDecrementMonth}
        {start}
        {end}
        {monthsOfYear}
        on:monthSelected={(e) => changeMonth(e.detail)}
        on:incrementMonth={(e) => incrementMonth(e.detail)}
      />
      <div class="legend">
        {#each sortedDaysOfWeek as day}
          <span>{day[1]}</span>
        {/each}
      </div>
      <Month
        {visibleMonth}
        {selected}
        {highlighted}
        {shouldShakeDate}
        id={visibleMonthId}
        on:dateSelected={(e) => registerSelection(e.detail)}
      />
    </div>
  </div>
</div>

<style>
  .box {
    display: flex;
    justify-content: center;
  }
  .datepicker {
    display: inline-block;
    margin: 0 auto;
    text-align: center;
    overflow: visible;
    background-color: white;
  }

  .calendar-button {
    padding: 10px 20px;
    border: 1px solid var(--primary);
    display: block;
    text-align: center;
    width: 300px;
    text-decoration: none;
    cursor: pointer;
    background: var(--primary);
    color: var(--tertiary);
    border-radius: 7px;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.1);
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  .calendar {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    user-select: none;
    padding: 10px;
    padding-top: 0;
  }

  @media (min-width: 480px) {
    .calendar {
      height: auto;
      width: 340px;
      max-width: 100%;
    }
  }

  .legend {
    color: #4a4a4a;
    padding: 10px 0;
    margin-bottom: 5px;
  }

  .legend span {
    width: 14.285714%;
    display: inline-block;
    text-align: center;
  }
</style>
