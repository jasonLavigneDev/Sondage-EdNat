/* eslint-disable func-names */
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import PollsAnswers from '../../polls_answers/polls_answers';
import Polls from '../../polls/polls';
import Groups from '../../groups/groups';

import { createEventAgendaMeeting, createEventAgenda } from './methods';
import { EventsAgenda } from '../events';

import './factories';
import '../../users/server/factories';
import '../../polls/server/factories';
import '../../polls_answers/server/factories';

describe('events', function () {
  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const user = Factory.create('user');
      const poll = Factory.create('poll');
      const pollAnswer = Factory.create('poll_answer', { email: user.emails[0].address });
      const event = Factory.create('eventsAgenda');
      assert.typeOf(user, 'object');
      assert.typeOf(poll, 'object');
      assert.typeOf(pollAnswer, 'object');
      assert.typeOf(event, 'object');
    });
  });
  let anotherUser;
  let ownerPollUser;
  let poll;
  let pollAnswer;

  beforeEach(function () {
    PollsAnswers.remove({});
    Polls.remove({});
    Meteor.users.remove({});
    anotherUser = Factory.create('user');
    ownerPollUser = Factory.create('user');
    poll = Factory.create('poll', { active: false, public: true, userId: ownerPollUser._id });
    pollAnswer = Factory.create('poll_answer', { userId: anotherUser._id, email: anotherUser.emails[0].address });
  });

  describe('createEventAgendaMeeting', function () {
    it('should create an event meeting into agenda with a connected user', function () {
      createEventAgendaMeeting._execute({ userId: ownerPollUser._id }, { poll, answer: pollAnswer });
      const resultEvent = EventsAgenda.findOne({ title: poll.title });
      assert.typeOf(resultEvent, 'object');
      assert.typeOf(resultEvent.start, 'date');
      assert.typeOf(resultEvent.end, 'date');
      assert.notEqual(resultEvent.start, resultEvent.end);
      assert.equal(resultEvent.participants[0]._id, anotherUser._id);
      assert.isEmpty(resultEvent.guests);
    });
    it('should create an event meeting into agenda with a guest user', function () {
      const anotherPollAnswer = Factory.create('poll_answer', { email: 'toto@test.com' });
      createEventAgendaMeeting._execute({ userId: ownerPollUser._id }, { poll, answer: anotherPollAnswer });
      const resultEvent = EventsAgenda.findOne({ title: poll.title });
      assert.typeOf(resultEvent, 'object');
      assert.typeOf(resultEvent.start, 'date');
      assert.typeOf(resultEvent.end, 'date');
      assert.notEqual(resultEvent.start, resultEvent.end);
      assert.isEmpty(resultEvent.participants);
      assert.equal(resultEvent.guests[0], 'toto@test.com');
    });
  });
  describe('createEventAgenda', function () {
    it('should create an event poll into agenda with a connected user', function () {
      Groups.insert({
        name: 'testGroup',
        slug: 'testgroup',
        owner: ownerPollUser._id,
        members: [ownerPollUser._id, anotherUser._id],
        admins: [],
        animators: [],
      });
      const groupId = Groups.findOne({ name: 'testGroup' })._id;
      const pollGroup = Factory.create('poll', {
        active: false,
        public: true,
        userId: ownerPollUser._id,
        groups: [groupId],
      });
      Factory.create('poll_answer', { userId: null, pollId: pollGroup._id, email: 'toto@test.com' });
      const date = new Date(Date.now() + 1000 * 60 * 60 * 24);
      createEventAgenda._execute({ userId: ownerPollUser._id }, { poll: pollGroup, date });
      const resultEvent = EventsAgenda.findOne({ title: pollGroup.title });
      assert.typeOf(resultEvent, 'object');
      assert.typeOf(resultEvent.start, 'date');
      assert.typeOf(resultEvent.end, 'date');
      assert.notEqual(resultEvent.start, resultEvent.end);
      const participantsIds = resultEvent.participants.map((participant) => participant._id);
      assert.isTrue(participantsIds.includes(anotherUser._id));
      assert.isTrue(participantsIds.includes(ownerPollUser._id));
      assert.equal(resultEvent.guests[0], 'toto@test.com');
    });
  });
});
