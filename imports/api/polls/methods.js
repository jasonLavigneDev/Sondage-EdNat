import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Polls from './polls';

export const createPoll = new ValidatedMethod({
    name: 'polls.create',
    validate: new SimpleSchema({
      data: Polls.schema.omit('createdAt', 'updatedAt', 'userId'),
    }).validator({ clean: true }),
  
    run({ data }) {
      // check if logged in
      if (!this.userId) {
          throw new Meteor.Error('api.polls.methods.create.notLoggedIn', 'You must be logged in.');
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
          throw new Meteor.Error('api.polls.methods.create.notLoggedIn', 'You must be logged in.');
        }
        const poll = Polls.findOne(pollId)
        if(this.userId !== poll.userId){
          throw new Meteor.Error('api.polls.methods.remove.notAllowed', 'You are not allowed to do this.');
        }
      return Polls.remove({ _id: pollId });
    },
  });


if (Meteor.isServer) {
  const methodsKeys = [
    'polls.create',
    'polls.remove'
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
}
