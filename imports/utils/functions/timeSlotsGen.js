import moment from "moment";

export const timeSlotsGen = (startString, endString, interval = 15) => {
    var start = moment(startString);
    var end = moment(endString);
    var result = [];
    var current = moment(start);
    while (current < end) {
        result.push(current.format());
        current.add(interval, 'minutes');
    }
    return result;
}