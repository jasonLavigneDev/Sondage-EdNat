import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Polls from '../polls';
import Groups from '/imports/api/groups/groups'

export const getSinglePoll = new ValidatedMethod({
  name: 'polls.getSinglePoll',
  validate: new SimpleSchema({
    pollId: String,
  }).validator({ clean: true }),

  run({ pollId }) {
    return Polls.findOne({ _id: pollId, userId: this.userId })
  },
});

export const getSinglePollToAnswer = new ValidatedMethod({
  name: 'polls.getSinglePollToAnswer',
  validate: new SimpleSchema({
    pollId: String,
  }).validator({ clean: true }),

  run({ pollId }) {
    const poll = Polls.findOne({ _id: pollId })
    const isInAGroup = Groups.findOne({ _id: { $in: poll.groups }, 
      $or: [
        { admins: { $in: [this.userId] } },
        { animators: { $in: [this.userId] } },
        { members: { $in: [this.userId] } },
      ] 
    }, { fields: { _id: 1 }})
    if(!isInAGroup && !poll.public) {
      return null
    }
    return poll
  },
});


const methodsKeys = [
  'polls.create',
  'polls.remove',
  'polls.getSinglePoll',
  'polls.update',
  'polls.getSinglePollToAnswer'
]
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
  300
);
