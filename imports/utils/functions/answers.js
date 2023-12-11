import moment from 'moment';

function slotsIncludes(slots, start) {
  return slots.some((slot) => moment(slot).isSame(start));
}

export default slotsIncludes;
