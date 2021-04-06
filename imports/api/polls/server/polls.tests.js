/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import faker from 'faker';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { Accounts } from 'meteor/accounts-base';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';


import {
  createPoll, updatePoll, toggleActivePoll, removePolls
} from '../methods';
import './publications';
import Polls from '../polls';
import { changeCurrentUser } from '../../../../tests/utils';

Factory.define('poll', Polls, {
    title: () => Random.id(),
    description: faker.lorem.sentence(),
    groups: () => new Array(Math.floor(Math.random() * 10)).fill(0).forEach(() => Random.id()),
    public: () => !!Math.floor(Math.random()),
    allDay: () => !!Math.floor(Math.random()),
    dates: () => new Array(Math.floor(Math.random() * 10)).fill({
        date: new Date(Date.now() + (Math.floor(Math.random() * 7) * 1000 * 60 * 60 * 24)),
        slots: new Array(Math.floor(Math.random() * 4)).fill(`${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 59)}`)
    })
});

Factory.define('user', Meteor.users, {
    name: faker.name.findName(),
});


describe('polls', function () {
    const currentUser = changeCurrentUser()
    const anotherUser = changeCurrentUser()

    describe('mutators', function () {
        it('builds correctly from factory', function () {
            const poll = Factory.create('poll');
            assert.typeOf(poll, 'object');
        });
    });

    describe('publications', function () {
        before(function () {
            Polls.remove({});
            changeCurrentUser(anotherUser)
            new Array(3).fill(0).forEach(() => {
                Factory.create('poll');
            })
            changeCurrentUser(currentUser)
            new Array(3).fill(0).forEach(() => {
                Factory.create('poll');
            })
            new Array(1).fill(0).forEach(() => {
                Factory.create('poll', { title: 'coucou' });
            })
        });

        describe('polls.owner', function () {
            it('sends all polls created by user', function (done) {
                const collector = new PublicationCollector({ userId: currentUser._id });
                collector.collect('polls.owner', { page: 1, limit: 10 }, (collections) => {
                    assert.equal(collections.polls.length, 4);
                    assert.equal(collections.counts.find(c => c._id === 'polls.owner.total' ).count, 4)
                    done();
                });
            });
            it('sends all polls with pagination', function (done) {
                    const collector = new PublicationCollector({ userId: currentUser._id });
                    collector.collect('polls.owner', { page: 2, limit: 2 }, (collections) => {
                        assert.equal(collections.polls.length, 2);
                        assert.equal(collections.counts.find(c => c._id === 'polls.owner.total' ).count, 4)
                        done();
                    });
            });
        });
    });

    describe('methods', function() {
        let pollData = {
            dates: [
                {
                    date: new Date(),
                    slots: ["11:50", "12:30"]
                },
                {
                    date: new Date(Date.now() + 1000 * 60 * 60 * 24),
                    slots: ["11:50", "12:45"]
                }
            ],
            title: "Un sondage de fou",
            description: "l'histoire de la vie",
            groups: [Random.id(), Random.id()],
            public: true,
            allDay: false,
        }
        let poll
        before(function() {
            Polls.remove({});
        })

        describe('createPoll', function () {
            it('does create a poll with a user', function () {
                createPoll._execute({ userId: currentUser._id }, { data: pollData });
                poll = Polls.findOne({ title: pollData.title, userId: currentUser._id });
                assert.typeOf(poll, 'object');
                assert.equal(poll.description === "l'histoire de la vie", true);
                assert.equal(poll.public, true);
                assert.equal(JSON.stringify(poll.dates), JSON.stringify(pollData.dates));
            });
            it("does not create a poll if you're not logged in", function () {
                assert.throws(
                () => {
                    createPoll._execute({}, { data: pollData });
                },
                Meteor.Error,
                /api.polls.methods.create.notLoggedIn/,
                );
            });
        })
        
        describe('updatePoll & toggleActive', function () {
            const newPollData = { ...pollData }
            newPollData.title = "Un nouveau titre"
            newPollData.public = false

            it('does update a poll with the owner', function () {
                updatePoll._execute({ userId: currentUser._id, }, { data: newPollData, pollId: poll._id });
                poll = Polls.findOne({ _id: poll._id, userId: currentUser._id });
                assert.equal(poll.title === "Un nouveau titre", true);
                assert.equal(poll.public, false);
            });

            it("does not update a poll if you're not the owner", function () {
                assert.throws(
                () => {
                    updatePoll._execute({ userId: Random.id() }, { data: newPollData, pollId: poll._id });
                },
                Meteor.Error,
                /api.polls.methods.update.notAllowed/,
                );
            });

            it("does not toggle a poll you are not the owner", function () {
                assert.throws(
                () => {
                    toggleActivePoll._execute({ userId: Random.id() }, { pollId: poll._id });
                },
                Meteor.Error,
                /api.polls.methods.toggle.notAllowed/,
                );
            });

            it('does toggle a poll with the owner', function () {
                toggleActivePoll._execute({ userId: currentUser._id }, { pollId: poll._id });
                poll = Polls.findOne({ _id: poll._id, userId: currentUser._id });
                assert.equal(poll.active, true);
            });

            it("does not update a poll if the poll is active", function () {
                assert.throws(
                () => {
                    updatePoll._execute({ userId: currentUser._id }, { data: newPollData, pollId: poll._id });
                },
                Meteor.Error,
                /api.polls.methods.update.active/,
                );
            });

        })

        describe('removePolls', function () {

            it("does not remove a poll if poll is active", function () {
                assert.throws(
                () => {
                    removePolls._execute({ userId: currentUser._id }, { pollId: poll._id });
                },
                Meteor.Error,
                /api.polls.methods.remove.active/,
                );
            });

            it("does not remove a poll if you're not the owner", function () {
                assert.throws(
                () => {
                    removePolls._execute({ userId: Random.id() }, { pollId: poll._id });
                },
                Meteor.Error,
                /api.polls.methods.remove.notAllowed/,
                );
            });

            it('does remove a poll if you are the owner', function () {
                toggleActivePoll._execute({ userId: currentUser._id }, { pollId: poll._id });
                removePolls._execute({ userId: currentUser._id }, { pollId: poll._id });
                poll = Polls.findOne({ _id: poll._id });
                assert.typeOf(poll, 'undefined');
            });

        })
    })
})
