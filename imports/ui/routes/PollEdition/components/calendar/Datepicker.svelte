<script>
  import { _ } from "svelte-i18n";
  import Month from "./Month.svelte";
  import NavBar from "./NavBar.svelte";
  import { getMonths, isDateSelected } from "./lib/helpers";
  import { formatDate, internationalize } from "timeUtils";
  import { keyCodes, keyCodesArray } from "./lib/keyCodes";
  import { onMount, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const today = new Date();
  const oneYear = 1000 * 60 * 60 * 24 * 365;

  export let format = "#{m}/#{d}/#{Y}";
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

  $: internationalize({ daysOfWeek, monthsOfYear });
  let sortedDaysOfWeek =
    weekStart === 0
      ? daysOfWeek
      : (() => {
          let dow = daysOfWeek.slice();
          dow.push(dow.shift());
          return dow;
        })();

  let highlighted = [];
  let shouldShakeDate = false;
  let shakeHighlightTimeout;
  let month = today.getMonth();
  let year = today.getFullYear();

  let isOpen = true;
  let isClosing = false;

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
  $: lastVisibleDate =
    visibleMonth.weeks[visibleMonth.weeks.length - 1].days[6].date;
  $: firstVisibleDate = visibleMonth.weeks[0].days[0].date;
  $: canIncrementMonth = monthIndex < months.length - 1;
  $: canDecrementMonth = monthIndex > 0;

  export let formattedSelected;
  $: {
    formattedSelected =
      typeof format === "function"
        ? selected.map(format)
        : selected.map((s) => formatDate(s.date, format));
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

  function getDefaultHighlighted() {
    return new Date(selected);
  }

  const getDay = (m, d, y) => {
    let theMonth = months.find(
      (aMonth) => aMonth.month === m && aMonth.year === y
    );
    if (!theMonth) return null;
    // eslint-disable-next-line
    for (let i = 0; i < theMonth.weeks.length; ++i) {
      // eslint-disable-next-line
      for (let j = 0; j < theMonth.weeks[i].days.length; ++j) {
        let aDay = theMonth.weeks[i].days[j];
        if (aDay.month === m && aDay.day === d && aDay.year === y) return aDay;
      }
    }
    return null;
  };

  function incrementDayHighlighted(amount) {
    let proposedDate = new Date(highlighted);
    proposedDate.setDate(highlighted.getDate() + amount);
    let correspondingDayObj = getDay(
      proposedDate.getMonth(),
      proposedDate.getDate(),
      proposedDate.getFullYear()
    );
    if (!correspondingDayObj || !correspondingDayObj.isInRange) return;
    highlighted = proposedDate;
    if (amount > 0 && highlighted > lastVisibleDate) {
      incrementMonth(1, highlighted.getDate());
    }
    if (amount < 0 && highlighted < firstVisibleDate) {
      incrementMonth(-1, highlighted.getDate());
    }
  }

  function assignValueToTrigger(formatted) {
    assignmentHandler(formatted);
  }

  function registerSelection(chosen) {
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

  function handleKeyPress(evt) {
    if (keyCodesArray.indexOf(evt.keyCode) === -1) return;
    evt.preventDefault();
    switch (evt.keyCode) {
      case keyCodes.left:
        incrementDayHighlighted(-1);
        break;
      case keyCodes.up:
        incrementDayHighlighted(-7);
        break;
      case keyCodes.right:
        incrementDayHighlighted(1);
        break;
      case keyCodes.down:
        incrementDayHighlighted(7);
        break;
      case keyCodes.pgup:
        incrementMonth(-1);
        break;
      case keyCodes.pgdown:
        incrementMonth(1);
        break;
      case keyCodes.enter:
        registerSelection(highlighted);
        break;
      default:
        break;
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
