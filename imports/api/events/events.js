import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

export const EventsAgenda = new Mongo.Collection('eventsAgenda');

EventsAgenda.deny({
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

const settingsGroup = new SimpleSchema({
  _id: {
    type: String,
    optional: false,
  },
  name: {
    type: String,
    optional: false,
  },
});

const settingsParticipant = new SimpleSchema({
  _id: {
    type: String,
    optional: false,
  },
  email: {
    type: String,
    optional: false,
  },
  status: {
    type: Number,
    allowedValues: [0, 1, 2], // 0: refused - 1: waiting - 2: accepted
    defaultValue: 1,
    optional: false,
  },
  groupId: {
    type: String,
    optional: true,
  },
});

EventsAgenda.schema = new SimpleSchema(
  {
    eventType: {
      type: String,
      optional: true,
      defaultValue: 'rdv',
    },
    title: {
      type: String,
      optional: false,
    },
    location: {
      type: String,
      optional: true,
    },
    description: {
      type: String,
      optional: true,
    },
    start: {
      type: Date,
      optional: false,
    },
    end: {
      type: Date,
      optional: false,
    },
    allDay: {
      type: Boolean,
      optional: false,
    },
    recurrent: {
      type: Boolean,
      defaultValue: false,
    },
    groups: {
      type: Array,
      optional: true,
    },
    'groups.$': {
      type: settingsGroup,
      optional: true,
    },
    participants: {
      type: Array,
      optional: true,
    },
    'participants.$': {
      type: settingsParticipant,
      optional: true,
    },
    guests: {
      type: Array,
      optional: true,
    },
    'guests.$': {
      type: String,
      optional: true,
    },
    userId: {
      type: String,
      optional: false,
    },
    createdAt: {
      type: Date,
      optional: true,
      autoValue() {
        if (this.isInsert) {
          return new Date();
        }
        return this.value;
      },
    },
    updatedAt: {
      type: Date,
      autoValue() {
        return new Date();
      },
    },
  },
  { tracker: Tracker },
);

EventsAgenda.publicFields = {
  title: 1,
  location: 1,
  description: 1,
  eventType: 1,
  start: 1,
  end: 1,
  allDay: 1,
  group: 1,
  participants: 1,
  guests: 1,
  userId: 1,
};

EventsAgenda.attachSchema(EventsAgenda.schema);

export default EventsAgenda;
