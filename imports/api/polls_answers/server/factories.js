import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import PollsAnswers from '../polls_answers';

Factory.define('poll_answer', PollsAnswers, {
  pollId: () => Random.id(),
  choices: () =>
    new Array(Math.floor(Math.random() * 4)).fill({
      date: new Date(Date.now() + Math.floor(Math.random() * 7) * 1000 * 60 * 60 * 24),
      slots: new Array(Math.floor(Math.random() * 4)).fill(
        `${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 59)}`,
      ),
      present: Random.choice([true, false]),
    }),
  userId: () => Random.id(),
});
