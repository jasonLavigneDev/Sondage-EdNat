import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { POLLS_TYPES } from '../../../utils/enums';

import PollsAnswers from '../polls_answers';
import Groups from '../../groups/groups';
import Polls from '../../polls/polls';
import {
  createEventAgendaMeeting,
  deleteEventAgendaMeeting,
  sendEmail,
  sendCancelEmail,
  sendCancelEmailToCreator,
  sendEditEmail,
  sendEmailToCreator,
} from '../../events/server/methods';
import validateString from '../../../utils/functions/strings';
import slotsIncludes from '../../../utils/functions/answers';

export const createPollAnswers = new ValidatedMethod({
  name: 'polls_answers.create',
  validate: new SimpleSchema({
    data: PollsAnswers.schema.omit('createdAt', 'updatedAt', 'userId'),
  }).validator({ clean: true }),

  run({ data }) {
    const poll = Polls.findOne({ _id: data.pollId });

    const previousAnswer = PollsAnswers.findOne({ pollId: data.pollId, email: data.email });
    if (previousAnswer && !this.userId) {
      throw new Meteor.Error('api.polls_answers.methods.create.emailAlreadyVoted', 'api.errors.emailAlreadyVoted');
    } else if (poll.type === POLLS_TYPES.MEETING && poll.userId === this.userId) {
      throw new Meteor.Error(
        'api.polls_answers.methods.create.youCantHaveAMeetingWithYourself',
        'api.errors.youCantHaveAMeetingWithYourself',
      );
    } else if (poll.completed) {
      throw new Meteor.Error('api.polls_answers.methods.create.notAllowed', 'api.errors.notAllowed');
    } else if (poll.type === POLLS_TYPES.MEETING) {
      // check if any meeting slot is already taken
      data.meetingSlot.forEach((slot) => {
        if (PollsAnswers.findOne({ pollId: data.pollId, userId: { $ne: this.userId }, meetingSlot: slot }))
          throw new Meteor.Error('api.polls_answers.methods.create.slotAlreadyTaken', 'api.errors.slotAlreadyTaken');
      });
    }
    validateString(data.email);
    validateString(data.name);
    if (data.choices) {
      data.choices.forEach((choice) => {
        if (choice.slots) choice.slots.forEach((slot) => validateString(slot));
      });
    }
    if (!poll.public && this.userId) {
      const isInAGroup = Groups.findOne(
        {
          _id: { $in: poll.groups },
          $or: [
            { admins: { $in: [this.userId] } },
            { animators: { $in: [this.userId] } },
            { members: { $in: [this.userId] } },
          ],
        },
        {
          fields: { _id: 1 },
        },
      );
      if ((isInAGroup && poll.active) || (this.userId === poll.userId && poll.active)) {
        return PollsAnswers.update(
          { pollId: data.pollId, email: data.email },
          { $set: { ...data, userId: this.userId, confirmed: false } },
          { upsert: true },
        );
      }
      if (!poll.active) {
        throw new Meteor.Error('api.polls_answers.methods.create.notActivePoll', 'api.errors.notAllowed');
      } else {
        throw new Meteor.Error('api.polls_answers.methods.create.notAllowed', 'api.errors.notAllowed');
      }
    } else if ((poll.public || this.userId) && poll.active) {
      const result = PollsAnswers.update(
        { pollId: data.pollId, email: data.email },
        { $set: { ...data, userId: this.userId, confirmed: false } },
        { upsert: true },
      );
      if (poll.type === POLLS_TYPES.MEETING) {
        // email poll owner about new slots chosen by user
        sendEmailToCreator(poll, data, this.userId);
        if (previousAnswer && previousAnswer.confirmed) {
          // if previous answer was confirmed by poll owner
          // - delete previously created events from poll owner agenda
          // - email poll owner about cancelled meeting slots
          deleteEventAgendaMeeting(poll, previousAnswer, poll.userId);
          const initialSlots = Array.isArray(previousAnswer.meetingSlot)
            ? previousAnswer.meetingSlot
            : [previousAnswer.meetingSlot];
          initialSlots.forEach((slot) => {
            if (!slotsIncludes(data.meetingSlot, slot)) {
              sendCancelEmailToCreator(poll, { ...data, meetingSlot: [slot] }, '');
            }
          });
        }
      }
      return result;
    } else if (!poll.public && !this.userId) {
      throw new Meteor.Error('api.polls_answers.methods.create.notPublic', 'api.errors.pollNotActive');
    } else {
      throw new Meteor.Error('api.polls_answers.methods.create.notActivePoll', 'api.errors.pollNotActive');
    }
  },
});

export const validateMeetingPollAnswer = new ValidatedMethod({
  name: 'polls_answers.meeting.validate',
  validate: new SimpleSchema({
    answerId: String,
  }).validator({ clean: true }),

  run({ answerId }) {
    const answer = PollsAnswers.findOne({ _id: answerId });
    const poll = Polls.findOne({ _id: answer.pollId });

    if (answer.confirmed) {
      throw new Meteor.Error(
        'api.polls_answers.methods.validate.answerAlreadyValidated',
        'api.errors.answerAlreadyValidated',
      );
    } else if (poll.userId !== this.userId) {
      throw new Meteor.Error('api.polls_answers.methods.validate.notAllowed', 'api.errors.notAllowed');
    }
    const result = PollsAnswers.update({ _id: answerId }, { $set: { confirmed: true } });
    createEventAgendaMeeting(poll, answer, this.userId);
    sendEmail(poll, answer);
    return result;
  },
});

export const cancelMeetingPollAnswer = new ValidatedMethod({
  name: 'polls_answers.meeting.cancel',
  validate: new SimpleSchema({
    answerId: String,
    emailNotice: Boolean,
    emailContent: String,
  }).validator(),

  run({ answerId, emailNotice, emailContent }) {
    const answer = PollsAnswers.findOne({ _id: answerId });
    if (!answer) {
      throw new Meteor.Error('api.polls_answers.methods.cancel.notFound', 'api.errors.answerNotFound');
    }
    const poll = Polls.findOne({ _id: answer.pollId });
    if (poll.userId !== this.userId || poll.type !== POLLS_TYPES.MEETING) {
      throw new Meteor.Error('api.polls_answers.methods.cancel.notAllowed', 'api.errors.notAllowed');
    }
    const result = PollsAnswers.remove({ _id: answerId });
    if (emailNotice) sendCancelEmail(poll, answer, emailContent);
    deleteEventAgendaMeeting(poll, answer, this.userId);
    return result;
  },
});

export const editMeetingPollAnswer = new ValidatedMethod({
  name: 'polls_answers.meeting.edit',
  validate: new SimpleSchema({
    answerId: String,
    emailNotice: Boolean,
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
    },
    name: String,
    meetingSlot: Array,
    'meetingSlot.$': {
      type: Date,
    },
    initialSlots: Array,
    'initialSlots.$': {
      type: Date,
    },
  }).validator(),

  run({ answerId, emailNotice, email, name, meetingSlot, initialSlots }) {
    const answer = PollsAnswers.findOne({ _id: answerId });
    if (!answer) {
      throw new Meteor.Error('api.polls_answers.methods.edit.notFound', 'api.errors.answerNotFound');
    }
    const poll = Polls.findOne({ _id: answer.pollId });
    if (poll.userId !== this.userId || poll.type !== POLLS_TYPES.MEETING) {
      throw new Meteor.Error('api.polls_answers.methods.edit.notAllowed', 'api.errors.notAllowed');
    }
    validateString(email);
    validateString(name);
    const result = PollsAnswers.update({ _id: answerId }, { $set: { email, name, meetingSlot } });
    if (emailNotice) {
      // email user if user information has changed
      if (answer.email !== email || answer.name !== name) sendEditEmail(poll, email, name);
      // email user if new meeting created
      meetingSlot.forEach((slot) => {
        if (answer.confirmed && !slotsIncludes(initialSlots, slot)) {
          createEventAgendaMeeting(poll, { ...answer, name, email, meetingSlot: [slot] }, this.userId);
          sendEmail(poll, { ...answer, name, email, meetingSlot: [slot] });
        }
      });
      // email user if meeting cancelled
      initialSlots.forEach((slot) => {
        if (!slotsIncludes(meetingSlot, slot)) {
          deleteEventAgendaMeeting(poll, { ...answer, name, email, meetingSlot: [slot] }, this.userId);
          sendCancelEmail(poll, { ...answer, name, email, meetingSlot: [slot] }, '');
        }
      });
    }
    return result;
  },
});

export const getPollAnswer = new ValidatedMethod({
  name: 'polls_answers.get',
  validate: new SimpleSchema({
    answerId: String,
  }).validator({ clean: true }),
  run({ answerId }) {
    const answer = PollsAnswers.findOne(answerId);
    if (!answer) {
      throw new Meteor.Error('api.polls_answers.methods.get.notFound', 'api.errors.answerNotFound');
    }
    const poll = Polls.findOne(answer.pollId);
    if (poll.userId !== this.userId) {
      throw new Meteor.Error('api.polls_answers.methods.get.notAllowed', 'api.errors.notAllowed');
    }
    return answer;
  },
});

const methodsKeys = ['polls_answers.create', 'polls_answers.meeting.validate'];
DDPRateLimiter.addRule(
  {
    name(name) {
      return methodsKeys.find((m) => m === name);
    },
    connectionId() {
      return true;
    },
  },
  1,
  300,
);
