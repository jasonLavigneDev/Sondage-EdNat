import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

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


const SingleDateSchema = new SimpleSchema(
    {
        date: {
          type: Date,
          label: "Date",
        },
        slots: {
          type: Array,
          label: "Time Slots",
          optional: true
        },
        "slots.$": {
          type: String,
        }
    }
)

Polls.schema = new SimpleSchema(
  {
    title: {
      type: String,
      min: 1,
      label: "Title",
    },
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: "Owner",
      autoValue: function() {
          return Meteor.userId()
      }
    },
    description: { 
        type: String, 
        label: "Description",
        optional: true
    },
    duration: { 
        type: String, 
        label: "Duration",
        optional: true
    },
    public: {
      type: Boolean,
      label: "Public",
      defaultValue: false
    },
    allDay: {
      type: Boolean,
      label: "Event all day",
      defaultValue: false
    },
    active: {
      type: Boolean,
      label: "Active",
      defaultValue: false
    },
    groups: {
      type: Array,
      label: "Groups polled",
      defaultValue: []
    },
    "groups.$": {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    dates: {
      type: Array,
      label: "Dates",
      defaultValue: []
    },
    "dates.$": {
      type: SingleDateSchema,
    },
    createdAt: {
      type: Date,
      label: "Created date",
      autoValue() {
        if (this.isInsert) {
          return new Date();
        }
        return this.value;
      },
    },
    updatedAt: {
      type: Date,
      label: "Updated date",
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
  dates: 1
};

Polls.attachSchema(Polls.schema);

export default Polls;
