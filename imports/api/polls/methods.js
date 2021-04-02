import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Polls from './polls';

export const udaptePoll = new ValidatedMethod({
  name: 'polls.update',
  validate: new SimpleSchema({
    data: Polls.schema,
    pollId: String
  }).validator({ clean: true }),

  run({ data, pollId }) {
    // check if logged in
    if (!this.userId) {
        throw new Meteor.Error('api.polls.methods.update.notLoggedIn', "api.errors.notLoggedIn");
      }

    if(this.userId !== data.userId){
      throw new Meteor.Error('api.polls.methods.update.notAllowed', "api.errors.notAllowed");
    } else if(data.active){
      throw new Meteor.Error('api.polls.methods.update.notActive', "api.errors.notAllowed");
    }
    if(Meteor.isServer && data.groups.length) {
      const { sendnotif } = require('../notifications/server/notifSender')
      sendnotif({ groups: data.groups, title: data.title })
    }

    return Polls.update({ _id: pollId }, { $set: { ...data } });
  },
});

export const createPoll = new ValidatedMethod({
    name: 'polls.create',
    validate: new SimpleSchema({
      data: Polls.schema.omit('createdAt', 'updatedAt', 'userId'),
    }).validator({ clean: true }),
  
    run({ data }) {
      // check if logged in
      if (!this.userId) {
        throw new Meteor.Error('api.polls.methods.create.notLoggedIn', "api.errors.notLoggedIn");
      }
      if(Meteor.isServer && data.groups.length) {
        const { sendnotif } = require('../notifications/server/notifSender')
        sendnotif({ groups: data.groups, title: data.title })
      }
      return Polls.insert(data);
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
        throw new Meteor.Error('api.polls.methods.remove.notLoggedIn', "api.errors.notLoggedIn");
      }
      const poll = Polls.findOne(pollId)
      if(this.userId !== poll.userId){
        throw new Meteor.Error('api.polls.methods.remove.notAllowed', "api.errors.notAllowed");
      } else if(poll.active){
        throw new Meteor.Error('api.polls.methods.remove.notAllowed', "api.errors.notAllowed");
      }
      return Polls.remove({ _id: pollId });
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
          throw new Meteor.Error('api.polls.methods.create.notLoggedIn', "api.errors.notLoggedIn");
        }
        const poll = Polls.findOne(pollId)
        if(this.userId !== poll.userId){
          throw new Meteor.Error('api.polls.methods.remove.notAllowed', "api.errors.notAllowed");
        }
      return Polls.update({ _id: pollId }, { $set: { active: !poll.active } });
    },
  });