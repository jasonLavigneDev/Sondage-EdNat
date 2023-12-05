import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { faker } from '@faker-js/faker';
import Polls from '../polls';

Factory.define('poll', Polls, {
  title: () => Random.id(),
  description: faker.lorem.sentence(),
  userId: () => Random.id(),
  groups: () => new Array(Math.floor(Math.random() * 10)).fill(0).map(() => Random.id()),
  public: () => Random.choice([true, false]),
  allDay: () => Random.choice([true, false]),
  dates: () =>
    new Array(Math.floor(Math.random() * 10)).fill({
      date: new Date(Date.now() + Math.floor(Math.random() * 7) * 1000 * 60 * 60 * 24),
      slots: new Array(Math.floor(Math.random() * 4)).fill(
        `${Math.floor(Math.random() * 23)}:${Math.floor(Math.random() * 59)}`,
      ),
    }),
});
