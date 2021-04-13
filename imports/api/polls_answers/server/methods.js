import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { POLLS_TYPES } from "/imports/utils/enums";

import PollsAnswers from '../polls_answers';
import Groups from '/imports/api/groups/groups';
import Polls from '/imports/api/polls/polls';

export const createPollAnswers = new ValidatedMethod({
    name: 'polls_answers.create',
    validate: new SimpleSchema({
      data: PollsAnswers.schema.omit('createdAt', 'updatedAt', 'userId'),
    }).validator({ clean: true }),
  
    run({ data }) {

      const poll = Polls.findOne({ _id: data.pollId })

      if(PollsAnswers.findOne({ pollId: data.pollId, email: data.email }) && !this.userId) {
        throw new Meteor.Error('api.polls_answers.methods.create.emailAlreadyVoted', 'api.errors.emailAlreadyVoted');
      } else if(PollsAnswers.findOne({ pollId: data.pollId, meetingSlot: data.meetingSlot, type: POLLS_TYPES.MEETING })) {
        throw new Meteor.Error('api.polls_answers.methods.create.slotAlreadyTaken', 'api.errors.slotAlreadyTaken');
      }

      if(!poll.public && this.userId) {
        const isInAGroup = Groups.findOne({ 
          _id: { $in: poll.groups }, 
          $or: [
            { admins: { $in: [this.userId] } },
            { animators: { $in: [this.userId] } },
            { members: { $in: [this.userId] } },
          ]
        }, 
        { 
          fields: { _id: 1 }
        })
        if(isInAGroup && poll.active || this.userId === poll.userId && poll.active) {
          return PollsAnswers.update({ pollId: data.pollId, email: data.email }, { $set: { ...data } }, { upsert: true });
        } else if(!poll.active) {
          throw new Meteor.Error('api.polls_answers.methods.create.notActivePoll', "api.errors.notAllowed");
        } else {
          throw new Meteor.Error('api.polls_answers.methods.create.notAllowed', "api.errors.notAllowed");
        }
      } else if((poll.public || this.userId) && poll.active){
        return PollsAnswers.update({ pollId: data.pollId, email: data.email }, { $set: { ...data } }, { upsert: true });
      } else if(!poll.public && !this.userId) {
        throw new Meteor.Error('api.polls_answers.methods.create.notPublic', "api.errors.pollNotActive");
        
      } else {
        throw new Meteor.Error('api.polls_answers.methods.create.notActivePoll', "api.errors.pollNotActive");
      }
    },
  });

  if(Meteor.isServer) {

    const methodsKeys = [
      'polls_answers.create'
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