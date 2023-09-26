import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Polls from './polls';
import PollsAnswers from '../polls_answers/polls_answers';
import validateString from '../../utils/functions/strings';

export const validatePoll = (data) => {
  validateString(data.title);
  if (data.description) validateString(data.description);
  if (data.duration) validateString(data.duration);
  if (data.dates) {
    data.dates.forEach((date) => {
      if (date.slots) date.slots.forEach((slot) => validateString(slot));
    });
  }
};

export const createPoll = new ValidatedMethod({
  name: 'polls.create',
  validate: new SimpleSchema({
    data: Polls.schema.omit('createdAt', 'updatedAt', 'userId'),
  }).validator({ clean: true }),

  run({ data }) {
    // check if logged in
    if (!this.userId) {
      throw new Meteor.Error('api.polls.methods.create.notLoggedIn', 'api.errors.notLoggedIn');
    }
    validatePoll(data);
    console.log('createPoll', data.dates);
    return Polls.insert({ ...data, userId: this.userId });
  },
});
export const removePolls = new ValidatedMethod({
  name: 'polls.remove',
  validate: new SimpleSchema({
    pollId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator({ clean: true }),

  run({ pollId }) {
    // check if logged in
    if (!this.userId) {
      throw new Meteor.Error('api.polls.methods.remove.notLoggedIn', 'api.errors.notLoggedIn');
    }
    const poll = Polls.findOne(pollId);
    if (this.userId !== poll.userId) {
      throw new Meteor.Error('api.polls.methods.remove.notAllowed', 'api.errors.notAllowed');
    } else if (poll.active) {
      throw new Meteor.Error('api.polls.methods.remove.active', 'api.errors.notAllowed');
    }
    Polls.remove({ _id: pollId });
    return PollsAnswers.remove({ pollId });
  },
});

export const toggleActivePoll = new ValidatedMethod({
  name: 'polls.toggleActivePoll',
  validate: new SimpleSchema({
    pollId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator({ clean: true }),

  run({ pollId }) {
    // check if logged in
    if (!this.userId) {
      throw new Meteor.Error('api.polls.methods.toggle.notLoggedIn', 'api.errors.notLoggedIn');
    }
    const poll = Polls.findOne(pollId);
    if (this.userId !== poll.userId || poll.completed) {
      throw new Meteor.Error('api.polls.methods.toggle.notAllowed', 'api.errors.notAllowed');
    }

    if (Meteor.isServer && poll.groups.length && !Meteor.isTest && !poll.active) {
      // eslint-disable-next-line global-require
      const sendnotif = require('../notifications/server/notifSender').default;

      sendnotif({
        groups: poll.groups,
        title: 'Nouveau sondage',
        content: `Le sondage ${poll.title} a été créé pour votre groupe`,
        pollId: poll._id,
      });
    }
    return Polls.update({ _id: pollId }, { $set: { active: !poll.active } });
  },
});
