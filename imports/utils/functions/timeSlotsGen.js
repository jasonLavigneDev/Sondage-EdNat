import moment from 'moment';

const timeSlotsGen = (startString, endString, interval = 15) => {
  const start = moment(startString);
  const end = moment(endString);
  const result = [];
  const current = moment(start);
  while (current < end) {
    result.push(current.format());
    current.add(interval, 'minutes');
  }
  return result;
};
export default timeSlotsGen;
