import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Polls from './polls';
import PollsAnswers from '../polls_answers/polls_answers';

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
    return Polls.insert({ ...data, userId: this.userId });
  },
});
export const removePolls = new ValidatedMethod({
  name: 'polls.remove',
  validate: new SimpleSchema({
    pollId: String,
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
    pollId: String,
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
