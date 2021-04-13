import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

const PollsAnswers = new Mongo.Collection('polls_answers');

// Deny all client-side updates since we will be using methods to manage this collection
PollsAnswers.deny({
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
        },
        present: {
          type: Boolean,
          label: "Full day presence",
          optional: true
        }
    }
)

PollsAnswers.schema = new SimpleSchema(
  {
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: "Owner",
      optional: true,
      autoValue: function() {
          return this.userId
      }
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      label: "Owner Email"
    },
    pollId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: "Poll ID",
    },
    meetingSlot: {
      type: Date,
      label: "Meeting date slot",
    },
    choices: {
      type: Array,
      label: "Dates",
      defaultValue: []
    },
    "choices.$": {
      type: SingleDateSchema,
    },
    createdAt: {
      type: Date,
      label: "Created date",
      autoValue() {
        if (this.isInsert || this.isUpsert) {
          return new Date();
        }
        return null;
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

PollsAnswers.publicFields = {
  userId: 1,
  createdAt: 1,
  updatedAt: 1,
  description: 1,
  dates: 1
};

PollsAnswers.attachSchema(PollsAnswers.schema);

export default PollsAnswers;
