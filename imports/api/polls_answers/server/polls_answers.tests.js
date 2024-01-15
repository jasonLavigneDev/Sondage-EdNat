/* eslint-disable func-names */
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import { faker } from '@faker-js/faker';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { POLLS_TYPES } from '../../../utils/enums';

import {
  createPollAnswers,
  validateMeetingPollAnswer,
  cancelMeetingPollAnswer,
  editMeetingPollAnswer,
  getPollAnswer,
} from './methods';
import './publications';
import PollsAnswers from '../polls_answers';
import Polls from '../../polls/polls';

import './factories';
import '../../users/server/factories';
import '../../polls/server/factories';
import { EventsAgenda } from '../../events/events';

const randomAnswer = (p, userId = {}) => ({
  email: faker.internet.email(),
  pollId: p._id,
  userId,

  choices: p.dates.map((d) => ({
    date: d.date,
    slots: d.slots.filter(() => Random.choice([true, false])),
    present: Random.choice([true, false]),
  })),
});

describe('polls_answers', function () {
  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const ownerPollUser = Factory.create('user');
      const pollAnswer = Factory.create('poll_answer', {
        userId: ownerPollUser._id,
        email: ownerPollUser.emails[0].address,
      });
      assert.typeOf(pollAnswer, 'object');
    });
  });

  describe('publications', function () {
    let anotherUser;
    let ownerPollUser;
    let poll;
    let pollTypePoll;
    let pollTypePollHideParticipants;
    let meetingPoll;

    beforeEach(function () {
      PollsAnswers.remove({});
      Polls.remove({});
      Meteor.users.remove({});
      anotherUser = Factory.create('user');
      ownerPollUser = Factory.create('user');
      poll = Factory.create('poll', { active: true, userId: ownerPollUser._id });
      _.times(5, () => {
        Factory.create('poll_answer', { pollId: poll._id, email: ownerPollUser.emails[0].address });
      });
      Factory.create('poll_answer', {
        userId: anotherUser._id,
        email: anotherUser.emails[0].address,
        pollId: poll._id,
      });
      // variables for poll type poll
      pollTypePoll = Factory.create('poll', { active: true, userId: ownerPollUser._id, type: 'POLL' });
      _.times(7, () => {
        Factory.create('poll_answer', { pollId: pollTypePoll._id, email: anotherUser.emails[0].address });
      });
      Factory.create('poll_answer', {
        pollId: pollTypePoll._id,
        email: ownerPollUser.emails[0].address,
        userId: ownerPollUser._id,
      });
      // variables for poll type poll with hide participants
      pollTypePollHideParticipants = Factory.create('poll', {
        active: true,
        userId: ownerPollUser._id,
        type: 'POLL',
        hideParticipantsList: true,
      });
      _.times(7, () => {
        Factory.create('poll_answer', {
          pollId: pollTypePollHideParticipants._id,
          email: anotherUser.emails[0].address,
        });
      });
      // variables for poll type meeting
      meetingPoll = Factory.create('poll', { active: true, userId: ownerPollUser._id, type: 'MEETING' });
      _.times(3, () => {
        Factory.create('poll_answer', { pollId: meetingPoll._id, email: anotherUser.emails[0].address });
      });
      Factory.create('poll_answer', {
        pollId: meetingPoll._id,
        email: ownerPollUser.emails[0].address,
        userId: ownerPollUser._id,
      });
    });

    describe('polls_answers.getCount', function () {
      it('does return total count of pollAnswers', function (done) {
        const collector = new PublicationCollector({ userId: ownerPollUser._id });
        collector.collect('polls_answers.getCount', { pollId: poll._id }, (collections) => {
          assert.equal(collections.counts[0].count, 6);
          done();
        });
      });
    });

    describe('polls_answers.getCurrentUser', function () {
      it('does return pollAnswer of current user', function (done) {
        const collector = new PublicationCollector({ userId: anotherUser._id });
        collector.collect('polls_answers.getCurrentUser', { pollId: poll._id }, (collections) => {
          assert.equal(collections.polls_answers.length, 1);
          done();
        });
      });
    });

    describe('polls_answers.onePoll', function () {
      describe('pollsAnswer type poll', function () {
        it('does return all pollanswers exclude our own pollAnswer with user account ', function (done) {
          const collector = new PublicationCollector({ userId: ownerPollUser._id });
          collector.collect('polls_answers.onePoll', { pollId: pollTypePoll._id }, (collections) => {
            assert.equal(collections.counts[0].count, 7);
            assert.containsAllKeys(collections.polls_answers[0], ['name', 'email', 'userId']);
            done();
          });
        });
        it('does return all pollanswers exclude name and email', function (done) {
          const collector = new PublicationCollector({});
          collector.collect('polls_answers.onePoll', { pollId: pollTypePollHideParticipants._id }, (collections) => {
            assert.equal(collections.counts[0].count, 7);
            assert.doesNotHaveAnyKeys(collections.polls_answers[0], ['name', 'email']);
            done();
          });
        });
        it('does return all pollanswers include our own pollAnswer without user account ', function (done) {
          const collector = new PublicationCollector({});
          collector.collect('polls_answers.onePoll', { pollId: pollTypePoll._id }, (collections) => {
            assert.equal(collections.counts[0].count, 8);
            assert.containsAllKeys(collections.polls_answers[0], ['name', 'email', 'userId']);
            done();
          });
        });
        it('does return all pollanswers include our own pollAnswer without pollOwner user ', function (done) {
          const collector = new PublicationCollector({ userId: anotherUser._id });
          collector.collect('polls_answers.onePoll', { pollId: pollTypePoll._id }, (collections) => {
            assert.equal(collections.counts[0].count, 8);
            assert.containsAllKeys(collections.polls_answers[0], ['name', 'email', 'userId']);
            done();
          });
        });
      });

      describe('pollsAnswer type meeting', function () {
        it('does return all pollAnswers with user account', function (done) {
          const collector = new PublicationCollector({ userId: ownerPollUser._id });
          collector.collect('polls_answers.onePoll', { pollId: meetingPoll._id }, (collections) => {
            assert.equal(collections.counts[0].count, 3);
            assert.containsAllKeys(collections.polls_answers[0], ['name', 'email', 'userId']);
            done();
          });
        });
        it('does return all pollAnswers without specific fields without user account', function (done) {
          const collector = new PublicationCollector({});
          collector.collect('polls_answers.onePoll', { pollId: meetingPoll._id }, (collections) => {
            assert.equal(collections.counts[0].count, 4);
            assert.doesNotHaveAnyKeys(collections.polls_answers[0], ['name', 'email']);
            done();
          });
        });
        it('does return all pollAnswers without specific fields without pollOwner user', function (done) {
          const collector = new PublicationCollector({ userId: anotherUser._id });
          collector.collect('polls_answers.onePoll', { pollId: meetingPoll._id }, (collections) => {
            assert.equal(collections.counts[0].count, 4);
            assert.doesNotHaveAnyKeys(collections.polls_answers[0], ['name', 'email']);
            done();
          });
        });
      });
    });
  });

  describe('methods', function () {
    let anotherUser;
    let ownerPollUser;

    beforeEach(function () {
      PollsAnswers.remove({});
      Polls.remove({});
      Meteor.users.remove({});
      anotherUser = Factory.create('user');
      ownerPollUser = Factory.create('user');
    });

    describe('createPollAnswers', function () {
      it('does not create an answer poll is not active', function () {
        const poll = Factory.create('poll', { active: false, public: true, userId: ownerPollUser._id });
        const pollAnswer = randomAnswer(poll, anotherUser._id);
        assert.throws(
          () => {
            createPollAnswers._execute({ userId: anotherUser._id }, { data: pollAnswer });
          },
          Meteor.Error,
          /api.polls_answers.methods.create.notActivePoll/,
        );
      });
      it("does not create an answer if you're not logged in and poll is not public", function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, public: false });
        const pollAnswer = randomAnswer(poll, anotherUser._id);
        assert.throws(
          () => {
            createPollAnswers._execute({}, { data: pollAnswer });
          },
          Meteor.Error,
          /api.polls_answers.methods.create.notPublic/,
        );
      });
      it('does create an answer to a public poll with a user account', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, active: true, public: true });
        const pollAnswer = randomAnswer(poll, anotherUser._id);
        createPollAnswers._execute({ userId: anotherUser._id }, { data: pollAnswer });
        const resultPollAnswer = PollsAnswers.findOne({ pollId: pollAnswer.pollId });
        assert.typeOf(resultPollAnswer, 'object');
      });
      it('does create an answer to a public poll without a user account', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, active: true, public: true });
        const pollAnswer = randomAnswer(poll, anotherUser._id);
        createPollAnswers._execute({}, { data: pollAnswer });
        const resultPollAnswer = PollsAnswers.findOne({ email: pollAnswer.email, pollId: poll._id });
        assert.typeOf(resultPollAnswer, 'object');
      });
    });
    describe('validateMeetingPollanswer', function () {
      it('should throw error if answer is confirmed', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, active: true, public: true });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          confirmed: true,
          pollId: poll._id,
        });
        assert.throws(
          () => {
            validateMeetingPollAnswer._execute({ userId: ownerPollUser._id }, { answerId: pollAnswer._id });
          },
          Meteor.Error,
          /api.polls_answers.methods.validate.answerAlreadyValidated/,
        );
      });
      it('should throw error if user is not pollOwner', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, active: true, public: true });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          confirmed: false,
          pollId: poll._id,
        });
        assert.throws(
          () => {
            validateMeetingPollAnswer._execute({ userId: anotherUser._id }, { answerId: pollAnswer._id });
          },
          Meteor.Error,
          /api.polls_answers.methods.validate.notAllowed/,
        );
      });
      it('should create an event', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, title: 'Pour le test' });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          pollId: poll._id,
          meetingSlot: [new Date()],
        });
        validateMeetingPollAnswer._execute({ userId: ownerPollUser._id }, { answerId: pollAnswer._id });
        const eventResult = EventsAgenda.findOne({ title: `${poll.title} (${pollAnswer.name})` });
        assert.equal(eventResult.title, `Pour le test (${pollAnswer.name})`);
      });
      it('should update pollAnswer', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          pollId: poll._id,
          meetingSlot: [new Date()],
        });
        validateMeetingPollAnswer._execute({ userId: ownerPollUser._id }, { answerId: pollAnswer._id });
        const resultPollAnswer = PollsAnswers.findOne({ _id: pollAnswer._id });
        assert.isTrue(resultPollAnswer.confirmed);
      });
    });
    describe('cancelMeetingPollanswer', function () {
      it('should throw error if user is not pollOwner', function () {
        const poll = Factory.create('poll', {
          userId: ownerPollUser._id,
          active: true,
          public: true,
          type: POLLS_TYPES.MEETING,
        });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          confirmed: true,
          pollId: poll._id,
        });
        assert.throws(
          () => {
            cancelMeetingPollAnswer._execute(
              { userId: anotherUser._id },
              { answerId: pollAnswer._id, emailNotice: false, emailContent: '' },
            );
          },
          Meteor.Error,
          /api.polls_answers.methods.cancel.notAllowed/,
        );
      });
      it('should delete pollAnswer', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, type: POLLS_TYPES.MEETING });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          confirmed: true,
          pollId: poll._id,
        });
        cancelMeetingPollAnswer._execute(
          { userId: ownerPollUser._id },
          { answerId: pollAnswer._id, emailNotice: false, emailContent: '' },
        );
        const resultPollAnswer = PollsAnswers.findOne({ _id: pollAnswer._id });
        assert.equal(resultPollAnswer, null);
      });
    });
    describe('editMeetingPollanswer', function () {
      it('should throw error if user is not pollOwner', function () {
        const poll = Factory.create('poll', {
          userId: ownerPollUser._id,
          active: true,
          public: true,
          type: POLLS_TYPES.MEETING,
        });
        const slot = new Date();
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: 'toto',
          confirmed: true,
          pollId: poll._id,
          meetingSlot: [slot],
        });
        assert.throws(
          () => {
            editMeetingPollAnswer._execute(
              { userId: anotherUser._id },
              {
                answerId: pollAnswer._id,
                emailNotice: false,
                email: 'newmail@test.fr',
                name: 'titi',
                meetingSlot: [slot],
                initialSlots: [slot],
              },
            );
          },
          Meteor.Error,
          /api.polls_answers.methods.edit.notAllowed/,
        );
      });
      it('should modify pollAnswer', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, type: POLLS_TYPES.MEETING });
        const newSlot = new Date();
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: 'toto',
          confirmed: true,
          pollId: poll._id,
          meetingSlot: [],
        });
        editMeetingPollAnswer._execute(
          { userId: ownerPollUser._id },
          {
            answerId: pollAnswer._id,
            emailNotice: false,
            email: 'newmail@test.fr',
            name: 'titi',
            meetingSlot: [newSlot],
            initialSlots: [],
          },
        );
        const resultPollAnswer = PollsAnswers.findOne({ _id: pollAnswer._id });
        assert.equal(resultPollAnswer.name, 'titi');
        assert.equal(resultPollAnswer.email, 'newmail@test.fr');
        assert.equal(resultPollAnswer.meetingSlot[0].toString(), newSlot.toString());
      });
    });
    describe('getPollanswer', function () {
      it('should throw error if user is not pollOwner', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, active: true, public: true });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          confirmed: true,
          pollId: poll._id,
        });
        assert.throws(
          () => {
            getPollAnswer._execute({ userId: anotherUser._id }, { answerId: pollAnswer._id });
          },
          Meteor.Error,
          /api.polls_answers.methods.get.notAllowed/,
        );
      });
      it('should throw error if poll answer does not exist', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id, active: true, public: true });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          confirmed: true,
          pollId: poll._id,
        });
        assert.throws(
          () => {
            getPollAnswer._execute({ userId: ownerPollUser._id }, { answerId: `xxx${pollAnswer._id}` });
          },
          Meteor.Error,
          /api.polls_answers.methods.get.notFound/,
        );
      });
      it('should send poll answer to poll owner', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id });
        const pollAnswer = Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          name: `${ownerPollUser.firstName} ${ownerPollUser.lastName}`,
          confirmed: true,
          pollId: poll._id,
        });
        const result = getPollAnswer._execute({ userId: ownerPollUser._id }, { answerId: pollAnswer._id });
        assert.equal(result._id, pollAnswer._id);
        assert.equal(result.pollId, poll._id);
        assert.equal(result.email, ownerPollUser.emails[0].address);
        assert.equal(result.userId, ownerPollUser._id);
      });
    });
  });
});
