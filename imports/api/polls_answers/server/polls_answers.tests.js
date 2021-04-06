/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import faker from 'faker';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';


import {
    createPollAnswers
} from './methods';
import './publications';
import PollsAnswers from '../polls_answers';
import Polls from '../../polls/polls';
import { changeCurrentUser } from '../../../../tests/utils';

Factory.define('poll_answer', PollsAnswers, {
    pollId: () => Random.id(),
    email: faker.internet.email(),
    choices: () => new Array(Math.floor(Math.random() * 4)).fill({
        date: new Date(Date.now() + (Math.floor(Math.random() * 7) * 1000 * 60 * 60 * 24)),
        slots: new Array(Math.floor(Math.random() * 4)).fill(`${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 59)}`),
        present: !!Math.floor(Math.random())
    })
});

const randomAnswer = p => ({
    email: faker.internet.email(),
    pollId: p._id,
    choices: p.dates.map(d => ({
        date: d.date,
        slots: d.slots.filter(() => !!Math.floor(Math.random())),
        present: !!Math.floor(Math.random())
    }))
})


describe('polls_answers', function () {
    const currentUser = changeCurrentUser()
    const anotherUser = changeCurrentUser()

    describe('mutators', function () {
        it('builds correctly from factory', function () {
            const poll_answer = Factory.create('poll_answer');
            assert.typeOf(poll_answer, 'object');
        });
    })

    describe('methods', function() {
        beforeEach(function() {
            PollsAnswers.remove({});
            Polls.remove({});
        })

        describe('createPollAnswers', function () {
            it("does not create an answer poll is not active", function () {
                const poll = Factory.create('poll', { active: false, public: true })

                assert.throws(
                () => {
                    createPollAnswers._execute({ userId: currentUser._id }, { data: randomAnswer(poll) });
                },
                Meteor.Error,
                /api.polls_answers.methods.create.notActivePoll/,
                );
            });

            it("does not create an answer if you're not logged in and poll is not public", function () {
                const poll = Factory.create('poll', { public: false })

                assert.throws(
                () => {
                    createPollAnswers._execute({}, { data: randomAnswer(poll) });
                },
                Meteor.Error,
                /api.polls_answers.methods.create.notPublic/,
                );
            });

            it('does create an answer to a public poll with a user account', function () {
                const poll = Factory.create('poll', { active: true, public: true })
                const data = randomAnswer(poll)
                createPollAnswers._execute({ userId: currentUser._id }, { data });
                const pollanswer = PollsAnswers.findOne({ pollId: data.pollId });
                assert.typeOf(pollanswer, 'object');
            });

            it('does create an answer to a public poll without a user account', function () {
                const poll = Factory.create('poll', { active: true, public: true })
                const data = randomAnswer(poll)
                createPollAnswers._execute({}, { data });
                const pollanswer = PollsAnswers.findOne({ email: data.email, pollId: poll._id });
                assert.typeOf(pollanswer, 'object');
            });

        })
    })
})
