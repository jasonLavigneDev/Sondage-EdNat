import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { POLLS_TYPES } from '../../utils/enums';

const Polls = new Mongo.Collection('polls');

// Deny all client-side updates since we will be using methods to manage this collection
Polls.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

const SingleDateSchema = new SimpleSchema({
  date: {
    type: Date,
    label: 'Date',
  },
  slots: {
    type: Array,
    label: 'Time Slots',
    optional: true,
  },
  'slots.$': {
    type: String,
  },
});

const SingleMeetingSlotSchema = new SimpleSchema({
  start: {
    type: Date,
    label: 'Start time',
  },
  end: {
    type: Date,
    label: 'End time',
  },
});

Polls.schema = new SimpleSchema(
  {
    title: {
      type: String,
      min: 1,
      label: 'Title',
    },
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: 'Owner',
      autoValue() {
        return Meteor.userId();
      },
    },
    description: {
      type: String,
      label: 'Description',
      optional: true,
    },
    duration: {
      type: String,
      label: 'Duration',
      optional: true,
    },
    public: {
      type: Boolean,
      label: 'Public',
      defaultValue: false,
    },
    allDay: {
      type: Boolean,
      label: 'Event all day',
      defaultValue: false,
    },
    active: {
      type: Boolean,
      label: 'Active',
      defaultValue: false,
    },
    completed: {
      type: Boolean,
      label: 'Completed',
      defaultValue: false,
    },
    choosenDate: {
      type: Date,
      label: 'Choosen Date',
      optional: true,
    },
    type: {
      type: String,
      label: 'Type',
      allowedValues: Object.keys(POLLS_TYPES).map((k) => POLLS_TYPES[k]),
      defaultValue: POLLS_TYPES.POLL,
    },
    groups: {
      type: Array,
      label: 'Groups polled',
      defaultValue: [],
    },
    'groups.$': {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    dates: {
      type: Array,
      label: 'Dates',
      defaultValue: [],
    },
    'dates.$': {
      type: SingleDateSchema,
    },
    meetingSlots: {
      type: Array,
      label: 'Meeting Time Slots',
      optional: true,
    },
    'meetingSlots.$': {
      type: SingleMeetingSlotSchema,
    },
    createdAt: {
      type: Date,
      label: 'Created date',
      autoValue() {
        if (this.isInsert) {
          return new Date();
        }
        return this.value;
      },
    },
    updatedAt: {
      type: Date,
      label: 'Updated date',
      autoValue() {
        return new Date();
      },
    },
  },
  { clean: { removeEmptyStrings: false }, tracker: Tracker },
);

Polls.publicFields = {
  title: 1,
  userId: 1,
  content: 1,
  groups: 1,
  public: 1,
  allDay: 1,
  createdAt: 1,
  updatedAt: 1,
  description: 1,
  dates: 1,
};

Polls.attachSchema(Polls.schema);

export default Polls;
