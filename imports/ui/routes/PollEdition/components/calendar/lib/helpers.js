const getCalendarPage = (month, year, dayProps, weekStart = 0) => {
  const date = new Date(year, month, 1);
  date.setDate(date.getDate() - date.getDay() + weekStart);
  const nextMonth = month === 11 ? 0 : month + 1;
  // ensure days starts on Sunday
  // and end on saturday
  const weeks = [];
  while (date.getMonth() !== nextMonth || date.getDay() !== weekStart || weeks.length !== 6) {
    if (date.getDay() === weekStart) weeks.unshift({ days: [], id: `${year}${month}${year}${weeks.length}` });
    const updated = {
      partOfMonth: date.getMonth() === month,
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      date: new Date(date),
      ...dayProps(date),
    };
    weeks[0].days.push(updated);
    date.setDate(date.getDate() + 1);
  }
  weeks.reverse();
  return { month, year, weeks };
};

const getDayPropsHandler = (start, end, selectableCallback) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (date) => {
    const isInRange = date >= start && date <= end;
    return {
      isInRange,
      selectable: isInRange && (!selectableCallback || selectableCallback(date)),
      isToday: date.getTime() === today.getTime(),
    };
  };
};

export function getMonths(start, end, selectableCallback = null, weekStart = 0) {
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const endDate = new Date(end.getFullYear(), end.getMonth() + 1, 1);
  const months = [];
  const date = new Date(start.getFullYear(), start.getMonth(), 1);
  const dayPropsHandler = getDayPropsHandler(start, end, selectableCallback);
  while (date < endDate) {
    months.push(getCalendarPage(date.getMonth(), date.getFullYear(), dayPropsHandler, weekStart));
    date.setMonth(date.getMonth() + 1);
  }
  return months;
}

export const isDateSelected = (a, array = []) =>
  array.length
    ? array.find(
        (b) =>
          a.getDate() === b.date.getDate() &&
          a.getMonth() === b.date.getMonth() &&
          a.getFullYear() === b.date.getFullYear(),
      )
    : false;
