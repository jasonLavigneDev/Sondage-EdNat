import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Polls from '../polls';
import Groups from '/imports/api/groups/groups'
import PollsAnswers from '../../polls_answers/polls_answers';

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
    if(!poll.active && this.userId !== poll.userId) {
      throw new Meteor.Error('api.polls.methods.get.notActive', "api.errors.pollNotActive");
    }
    if(!isInAGroup && !poll.public) {
      throw new Meteor.Error('api.polls.methods.get.notPublic', "api.errors.notApublicPoll");
    }
    return {
      poll,
      answers: PollsAnswers.find({
        pollId,
        $or: [
          { userId: { $ne: this.userId } },
          { userId: null }
        ]
      }).fetch(),
      selectedGroups: Groups.find({ _id: { $in: poll.groups } }).fetch(),
      answer: this.userId ? PollsAnswers.findOne({  pollId, userId: this.userId }) : null
    }
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
