/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import { createPoll, toggleActivePoll, removePolls } from '../methods';
import { getSinglePoll, updatePoll, validatePollAnswer, getSinglePollToAnswer } from './methods';
import './publications';
import Polls from '../polls';
import './factories';
import '../../users/server/factories';
import '../../groups/server/factories';
import '../../polls_answers/server/factories';

import { EventsAgenda } from '../../events/events';
import Groups from '../../groups/groups';

describe('polls', function () {
  beforeEach(function () {
    Meteor.users.remove({});
  });
  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const ownerPollUser = Factory.create('user');
      const poll = Factory.create('poll', { userId: ownerPollUser._id });
      assert.typeOf(poll, 'object');
    });
  });

  describe('publications', function () {
    let ownerPollUser;
    let anotherUser;

    beforeEach(function () {
      Polls.remove({});
      Meteor.users.remove({});
      ownerPollUser = Factory.create('user');
      anotherUser = Factory.create('user');

      new Array(3).fill(0).map(() => {
        return Factory.create('poll', { userId: ownerPollUser._id });
      });
      new Array(3).fill(0).map(() => {
        return Factory.create('poll', { userId: anotherUser._id });
      });
      new Array(1).fill(0).map(() => {
        return Factory.create('poll', { userId: ownerPollUser._id, title: 'coucou' });
      });
    });

    describe('polls.owner', function () {
      it('sends all polls created by user', function (done) {
        const collector = new PublicationCollector({ userId: ownerPollUser._id });
        collector.collect('polls.owner', { page: 1, limit: 10 }, (collections) => {
          assert.equal(collections.polls.length, 4);
          assert.equal(collections.counts.find((c) => c._id === 'polls.owner.total').count, 4);
          done();
        });
      });
      it('sends all polls with pagination', function (done) {
        const collector = new PublicationCollector({ userId: ownerPollUser._id });
        collector.collect('polls.owner', { page: 2, limit: 2 }, (collections) => {
          assert.equal(collections.polls.length, 2);
          assert.equal(collections.counts.find((c) => c._id === 'polls.owner.total').count, 4);
          done();
        });
      });
    });
    describe('polls.member', function () {
      beforeEach(function () {
        Polls.remove({});
        Meteor.users.remove({});
        // 1 pollOwner
        Factory.create('poll', { userId: ownerPollUser._id, active: true, type: 'POLL' });
        // 1 poll not Owner
        const poll2 = Factory.create('poll', { userId: anotherUser._id, active: true, type: 'POLL' });
        // 1 answer to poll Not Owner
        Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          pollId: poll2._id,
        });
        // 1 group where user is admin
        const group = Factory.create('group', { admins: [ownerPollUser._id] });
        // 1 poll attached to group where user is admin
        Factory.create('poll', {
          userId: anotherUser._id,
          active: true,
          type: 'POLL',
          groups: [group._id],
        });
        // 1 group where user is animator
        const group2 = Factory.create('group', { animators: [ownerPollUser._id] });
        // 1 poll attached to group where user is animator
        Factory.create('poll', {
          userId: anotherUser._id,
          active: true,
          type: 'POLL',
          groups: [group2._id],
        });
        // 1 group where user is member
        const group3 = Factory.create('group', { members: [ownerPollUser._id] });
        // 1 poll attached to group where user is member
        Factory.create('poll', {
          userId: anotherUser._id,
          active: true,
          type: 'POLL',
          groups: [group3._id],
        });
        // 1 poll type MEETING
        Factory.create('poll', {
          userId: anotherUser._id,
          active: true,
          type: 'MEETING',
          groups: [group3._id],
        });
      });
      describe('sends all polls in relation with this user', function () {
        it('should return 5', function (done) {
          const collector = new PublicationCollector({ userId: ownerPollUser._id });
          collector.collect('polls.member', { page: 1, limit: 10 }, (collections) => {
            assert.equal(collections.polls.length, 5);
            assert.equal(collections.counts.find((c) => c._id === 'polls.member.total').count, 5);
            done();
          });
        });
      });
    });

    describe('polls.meetings.member', function () {
      beforeEach(function () {
        Polls.remove({});
        Meteor.users.remove({});
        // 1 pollOwner
        Factory.create('poll', { userId: ownerPollUser._id, active: true, type: 'MEETING' });
        // 1 poll not Owner
        const poll2 = Factory.create('poll', { userId: anotherUser._id, active: true, type: 'MEETING' });
        // 1 answer to poll Not Owner
        Factory.create('poll_answer', {
          userId: ownerPollUser._id,
          email: ownerPollUser.emails[0].address,
          pollId: poll2._id,
        });
        // 1 group where user is admin
        const group = Factory.create('group', { admins: [ownerPollUser._id] });
        // 1 poll attached to group where user is admin
        Factory.create('poll', {
          userId: anotherUser._id,
          active: true,
          type: 'MEETING',
          groups: [group._id],
        });
        // 1 group where user is animator
        const group2 = Factory.create('group', { animators: [ownerPollUser._id] });
        // 1 poll attached to group where user is animator
        Factory.create('poll', {
          userId: anotherUser._id,
          active: true,
          type: 'MEETING',
          groups: [group2._id],
        });
        // 1 group where user is member
        const group3 = Factory.create('group', { members: [ownerPollUser._id] });
        // 1 poll attached to group where user is member
        Factory.create('poll', {
          userId: anotherUser._id,
          active: true,
          type: 'MEETING',
          groups: [group3._id],
        });
        // 1 poll type POLL
        Factory.create('poll', {
          userId: anotherUser._id,
          active: true,
          type: 'POLL',
          groups: [group3._id],
        });
      });
      describe('sends all polls in relation with this user', function () {
        it('should return 5', function (done) {
          const collector = new PublicationCollector({ userId: ownerPollUser._id });
          collector.collect('polls.meetings.member', { page: 1, limit: 10 }, (collections) => {
            assert.equal(collections.polls.length, 5);
            assert.equal(collections.counts.find((c) => c._id === 'polls.member.meetings.total').count, 5);
            done();
          });
        });
      });
    });
  });

  describe('methods', function () {
    let ownerPollUser;
    let anotherUser;
    let pollData;
    before(function () {
      Polls.remove({});
      Meteor.users.remove({});
      ownerPollUser = Factory.create('user');
      anotherUser = Factory.create('user');
      pollData = {
        dates: [
          {
            date: new Date(),
            slots: ['11:50', '12:30'],
          },
          {
            date: new Date(Date.now() + 1000 * 60 * 60 * 24),
            slots: ['11:50', '12:45'],
          },
        ],
        title: 'Un sondage de fou',
        description: "l'histoire de la vie",
        groups: [Random.id(), Random.id()],
        public: true,
        allDay: false,
      };
    });

    describe('createPoll', function () {
      it('should create a poll with a user', function () {
        createPoll._execute({ userId: ownerPollUser._id }, { data: pollData });
        const resultPoll = Polls.findOne({ title: pollData.title, userId: ownerPollUser._id });
        assert.typeOf(resultPoll, 'object');
        assert.equal(resultPoll.description === "l'histoire de la vie", true);
        assert.equal(resultPoll.public, true);
        assert.equal(JSON.stringify(resultPoll.dates), JSON.stringify(pollData.dates));
      });
      it("should not create a poll if you're not logged in", function () {
        assert.throws(
          () => {
            createPoll._execute({}, { data: pollData });
          },
          Meteor.Error,
          /api.polls.methods.create.notLoggedIn/,
        );
      });
    });

    describe('updatePoll & toggleActive', function () {
      let pollFind;
      beforeEach(function () {
        Polls.remove({});
        createPoll._execute({ userId: ownerPollUser._id }, { data: pollData });
        pollFind = Polls.findOne({ title: pollData.title, userId: ownerPollUser._id });
      });
      it('should update a poll with the owner', function () {
        const newPollData = { ...pollFind };
        newPollData.title = 'Un nouveau titre';
        newPollData.public = false;
        updatePoll._execute({ userId: ownerPollUser._id }, { data: newPollData, pollId: pollFind._id });
        const resultPoll = Polls.findOne({ _id: pollFind._id, userId: ownerPollUser._id });
        assert.equal(resultPoll.title === 'Un nouveau titre', true);
        assert.equal(resultPoll.public, false);
      });
      it("should not update a poll if you're not the owner", function () {
        assert.throws(
          () => {
            updatePoll._execute(
              { userId: anotherUser._id },
              { data: { ...pollData, userId: ownerPollUser._id }, pollId: pollFind._id },
            );
          },
          Meteor.Error,
          /api.polls.methods.update.notAllowed/,
        );
      });
      it('should not toggle a poll you are not the owner', function () {
        assert.throws(
          () => {
            toggleActivePoll._execute({ userId: anotherUser._id }, { pollId: pollFind._id });
          },
          Meteor.Error,
          /api.polls.methods.toggle.notAllowed/,
        );
      });
      it('should toggle a poll with the owner', function () {
        toggleActivePoll._execute({ userId: ownerPollUser._id }, { pollId: pollFind._id });
        const resultPoll = Polls.findOne({ _id: pollFind._id, userId: ownerPollUser._id });
        assert.equal(resultPoll.active, true);
      });
      it('should not update a poll if the poll is active', function () {
        toggleActivePoll._execute({ userId: ownerPollUser._id }, { pollId: pollFind._id });
        const resultPoll = Polls.findOne({ _id: pollFind._id, userId: ownerPollUser._id });
        assert.equal(resultPoll.active, true);
        assert.throws(
          () => {
            updatePoll._execute(
              { userId: ownerPollUser._id },
              { data: { ...pollData, userId: ownerPollUser._id }, pollId: resultPoll._id },
            );
          },
          Meteor.Error,
          /api.polls.methods.update.active/,
        );
      });
    });

    describe('removePolls', function () {
      let pollFind;
      beforeEach(function () {
        Polls.remove({});
        createPoll._execute({ userId: ownerPollUser._id }, { data: pollData });
        pollFind = Polls.findOne({ title: pollData.title, userId: ownerPollUser._id });
      });
      it('should not remove a poll if poll is active', function () {
        toggleActivePoll._execute({ userId: ownerPollUser._id }, { pollId: pollFind._id });
        assert.throws(
          () => {
            removePolls._execute({ userId: ownerPollUser._id }, { pollId: pollFind._id });
          },
          Meteor.Error,
          /api.polls.methods.remove.active/,
        );
      });
      it("should not remove a poll if you're not the owner", function () {
        assert.throws(
          () => {
            removePolls._execute({ userId: anotherUser._id }, { pollId: pollFind._id });
          },
          Meteor.Error,
          /api.polls.methods.remove.notAllowed/,
        );
      });
      it('should remove a poll if you are the owner', function () {
        removePolls._execute({ userId: ownerPollUser._id }, { pollId: pollFind._id });
        const resultPoll = Polls.findOne({ _id: pollFind._id });
        assert.typeOf(resultPoll, 'undefined');
      });
    });

    describe('getSinglePoll', function () {
      it('should return correct poll if user is pollOwner', function () {
        const poll = Factory.create('poll', { userId: ownerPollUser._id });
        const resultPoll = getSinglePoll._execute({ userId: ownerPollUser._id }, { pollId: poll._id });
        assert.typeOf(resultPoll, 'object');
        assert.equal(resultPoll.userId, poll.userId);
      });
      it('should return undefined if user is not pollOwner', function () {
        const poll = Factory.create('poll');
        const resultPoll = getSinglePoll._execute({ userId: anotherUser._id }, { pollId: poll._id });
        assert.typeOf(resultPoll, 'undefined');
      });
    });

    describe('getSinglePollToAnswer', function () {
      beforeEach(function () {
        Polls.remove({});
        Groups.remove({});
      });
      describe('should throw error', function () {
        it('if poll is not public and user is not connected ', function () {
          const pollNotPublicActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            active: true,
            public: false,
          });
          assert.throws(
            () => {
              getSinglePollToAnswer._execute({}, { pollId: pollNotPublicActive._id });
            },
            Meteor.Error,
            /api.polls.methods.get.notPublic/,
          );
        });
        it('if poll is not public and not in group and user is not pollOwner', function () {
          const pollNotPublicActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            active: true,
            public: false,
          });
          assert.throws(
            () => {
              getSinglePollToAnswer._execute({ userId: anotherUser._id }, { pollId: pollNotPublicActive._id });
            },
            Meteor.Error,
            /api.polls.methods.get.notPublic/,
          );
        });
        it('if poll is in group and user is not pollOwner and not adminGroup', function () {
          const groupWithPollOwnerIsGroupAdmin = Factory.create('group', { admins: [ownerPollUser._id] });
          const pollNotPublicActiveWithGroupAdmin = Factory.create('poll', {
            userId: ownerPollUser._id,
            active: true,
            public: false,
            groups: [groupWithPollOwnerIsGroupAdmin._id],
          });
          assert.throws(
            () => {
              getSinglePollToAnswer._execute(
                { userId: anotherUser._id },
                { pollId: pollNotPublicActiveWithGroupAdmin._id },
              );
            },
            Meteor.Error,
            /api.polls.methods.get.notPublic/,
          );
        });
        it('if poll is in group and user is not pollOwner and not animatorsGroup', function () {
          const groupWithPollOwnerIsGroupAnimator = Factory.create('group', { animators: [ownerPollUser._id] });
          const pollNotPublicActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            active: true,
            public: false,
            groups: [groupWithPollOwnerIsGroupAnimator._id],
          });
          assert.throws(
            () => {
              getSinglePollToAnswer._execute({ userId: anotherUser._id }, { pollId: pollNotPublicActive._id });
            },
            Meteor.Error,
            /api.polls.methods.get.notPublic/,
          );
        });
        it('if poll is in group and user is not pollOwner and not membersGroup', function () {
          const groupWithPollOwnerIsGroupMember = Factory.create('group', { members: [ownerPollUser._id] });
          const pollNotPublicActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            active: true,
            public: false,
            groups: [groupWithPollOwnerIsGroupMember._id],
          });
          assert.throws(
            () => {
              getSinglePollToAnswer._execute({ userId: anotherUser._id }, { pollId: pollNotPublicActive._id });
            },
            Meteor.Error,
            /api.polls.methods.get.notPublic/,
          );
        });
        it('if poll is public not active and user is not pollOwner', function () {
          const pollPublicNotActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            active: false,
            public: true,
          });
          assert.throws(
            () => {
              getSinglePollToAnswer._execute({ userId: anotherUser._id }, { pollId: pollPublicNotActive._id });
            },
            Meteor.Error,
            /api.polls.methods.get.notActive/,
          );
        });
      });
      describe('should return data', function () {
        it('without answer if user have not account ', function () {
          const groupWithPollOwnerIsGroupAdmin = Factory.create('group', { admins: [ownerPollUser._id] });
          const pollPublicActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            groups: [groupWithPollOwnerIsGroupAdmin._id],
            active: true,
            public: true,
          });
          Factory.create('poll_answer', {
            userId: ownerPollUser._id,
            email: ownerPollUser.emails[0].address,
            pollId: pollPublicActive._id,
          });

          const result = getSinglePollToAnswer._execute({}, { pollId: pollPublicActive._id });
          assert.typeOf(result, 'object');
          assert.equal(result.poll._id, pollPublicActive._id);
          assert.equal(result.selectedGroups[0]._id, groupWithPollOwnerIsGroupAdmin._id);
          assert.isNull(result.answer);
        });
        it('with answer if user is pollOwner ', function () {
          const groupWithPollOwnerIsGroupAdmin = Factory.create('group', { admins: [ownerPollUser._id] });
          const pollPublicActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            groups: [groupWithPollOwnerIsGroupAdmin._id],
            active: true,
            public: true,
          });
          const pollAnswerPollPublic = Factory.create('poll_answer', {
            userId: ownerPollUser._id,
            email: ownerPollUser.emails[0].address,
            pollId: pollPublicActive._id,
          });
          const resultPollPublic = getSinglePollToAnswer._execute(
            { userId: ownerPollUser._id },
            { pollId: pollPublicActive._id },
          );
          assert.typeOf(resultPollPublic, 'object');
          assert.equal(resultPollPublic.poll._id, pollPublicActive._id);
          assert.equal(resultPollPublic.selectedGroups[0]._id, groupWithPollOwnerIsGroupAdmin._id);
          assert.equal(resultPollPublic.answer.userId, pollAnswerPollPublic.userId);

          const pollNotPublicActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            groups: [groupWithPollOwnerIsGroupAdmin._id],
            active: true,
            public: false,
          });
          const pollAnswerPollNotPublic = Factory.create('poll_answer', {
            userId: ownerPollUser._id,
            email: ownerPollUser.emails[0].address,
            pollId: pollNotPublicActive._id,
          });
          const resultPollNotPublic = getSinglePollToAnswer._execute(
            { userId: ownerPollUser._id },
            { pollId: pollNotPublicActive._id },
          );
          assert.typeOf(resultPollNotPublic, 'object');
          assert.equal(resultPollNotPublic.poll._id, pollNotPublicActive._id);
          assert.equal(resultPollNotPublic.selectedGroups[0]._id, groupWithPollOwnerIsGroupAdmin._id);
          assert.equal(resultPollNotPublic.answer.userId, pollAnswerPollNotPublic.userId);

          const pollPublicNotActive = Factory.create('poll', {
            userId: ownerPollUser._id,
            groups: [groupWithPollOwnerIsGroupAdmin._id],
            active: false,
            public: true,
          });
          const pollAnswerPollPublicNotActive = Factory.create('poll_answer', {
            userId: ownerPollUser._id,
            email: ownerPollUser.emails[0].address,
            pollId: pollPublicNotActive._id,
          });
          const resultPollPublicNotActive = getSinglePollToAnswer._execute(
            { userId: ownerPollUser._id },
            { pollId: pollPublicNotActive._id },
          );
          assert.typeOf(resultPollPublicNotActive, 'object');
          assert.equal(resultPollPublicNotActive.poll._id, pollPublicNotActive._id);
          assert.equal(resultPollPublicNotActive.selectedGroups[0]._id, groupWithPollOwnerIsGroupAdmin._id);
          assert.equal(resultPollPublicNotActive.answer.userId, pollAnswerPollPublicNotActive.userId);
        });
      });
    });

    describe('validatePollAnswer', function () {
      let pollFind;
      beforeEach(function () {
        Polls.remove({});
        createPoll._execute({ userId: ownerPollUser._id }, { data: pollData });
        pollFind = Polls.findOne({ title: pollData.title, userId: ownerPollUser._id });
      });
      it('should throw error if user is not pollOwner', function () {
        assert.throws(
          () => {
            validatePollAnswer._execute(
              { userId: anotherUser._id },
              { pollId: pollFind._id, date: new Date(Date.now() + 1000 * 60 * 60 * 24) },
            );
          },
          Meteor.Error,
          /api.polls_answers.methods.validate.notAllowed/,
        );
      });
      it('should throw error if poll is completed', function () {
        const newPollData = { ...pollFind };
        newPollData.completed = true;
        updatePoll._execute({ userId: ownerPollUser._id }, { data: newPollData, pollId: pollFind._id });
        assert.throws(
          () => {
            validatePollAnswer._execute(
              { userId: ownerPollUser._id },
              { pollId: newPollData._id, date: new Date(Date.now() + 1000 * 60 * 60 * 24) },
            );
          },
          Meteor.Error,
          /api.polls_answers.methods.validate.notAllowed/,
        );
      });
      it('should create an event if poll have group', function () {
        const dateTomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
        validatePollAnswer._execute({ userId: ownerPollUser._id }, { pollId: pollFind._id, date: dateTomorrow });
        const eventResult = EventsAgenda.findOne({ title: pollFind.title });
        assert.typeOf(eventResult, 'object');
      });
      it('should update poll with chosen date', function () {
        const dateTomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
        validatePollAnswer._execute({ userId: ownerPollUser._id }, { pollId: pollFind._id, date: dateTomorrow });
        const pollresult = Polls.findOne({ _id: pollFind._id });
        assert.equal(pollresult.choosenDate.getTime(), dateTomorrow.getTime());
        assert.isTrue(pollresult.completed);
        assert.isFalse(pollresult.active);
      });
    });
  });
});
