import moment from 'moment';

function slotsIncludes(slots, start) {
  let response = false;
  slots.forEach((slot) => {
    if (moment(slot).isSame(start)) {
      response = true;
    }
  });
  return response;
}

export default slotsIncludes;
