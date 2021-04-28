import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { POLLS_TYPES } from "/imports/utils/enums";

import PollsAnswers from '../polls_answers';
import Groups from '/imports/api/groups/groups';
import Polls from '/imports/api/polls/polls';
import { createEventAgendaMeeting, sendEmail } from '../../events/server/methods';

export const createPollAnswers = new ValidatedMethod({
    name: 'polls_answers.create',
    validate: new SimpleSchema({
      data: PollsAnswers.schema.omit('createdAt', 'updatedAt', 'userId'),
    }).validator({ clean: true }),
  
    run({ data }) {

      const poll = Polls.findOne({ _id: data.pollId })

      if(PollsAnswers.findOne({ pollId: data.pollId, email: data.email }) && !this.userId) {
        throw new Meteor.Error('api.polls_answers.methods.create.emailAlreadyVoted', 'api.errors.emailAlreadyVoted');
      } else if(poll.type === POLLS_TYPES.MEETING && PollsAnswers.findOne({ pollId: data.pollId, meetingSlot: data.meetingSlot })) {
        throw new Meteor.Error('api.polls_answers.methods.create.slotAlreadyTaken', 'api.errors.slotAlreadyTaken');
      } else if(poll.type === POLLS_TYPES.MEETING && poll.userId === this.userId){
        throw new Meteor.Error('api.polls_answers.methods.create.youCantHaveAMeetingWithYourself', 'api.errors.youCantHaveAMeetingWithYourself');
      } else if(poll.completed) {
        throw new Meteor.Error('api.polls_answers.methods.create.notAllowed', 'api.errors.notAllowed');
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

  export const validateMeetingPollAnswer = new ValidatedMethod({
    name: 'polls_answers.meeting.validate',
    validate: new SimpleSchema({
      answerId: String,
    }).validator({ clean: true }),
  
    run({ answerId }) {

      const answer = PollsAnswers.findOne({ _id: answerId })
      const poll = Polls.findOne({ _id: answer.pollId })

      if(answer.confirmed) {
        throw new Meteor.Error('api.polls_answers.methods.validate.answerAlreadyValidated', 'api.errors.answerAlreadyValidated');
      } else if(poll.userId !== this.userId) {
        throw new Meteor.Error('api.polls_answers.methods.validate.notAllowed', 'api.errors.notAllowed');
      }
      
      sendEmail.call({ poll, answer })
      createEventAgendaMeeting.call({ poll, answer })

      return PollsAnswers.update({ _id: answerId }, { $set: { confirmed: true } })
    },
  });

    const methodsKeys = [
      'polls_answers.create',
      'polls_answers.meeting.validate'
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