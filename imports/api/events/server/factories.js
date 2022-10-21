import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { EventsAgenda } from '../events';

Factory.define('eventsAgenda', EventsAgenda, {
  title: () => Random.id(),
  start: () => new Date(),
  end: () => new Date(Date.now() + 1000 * 60 * 60 * 24),
  allDay: () => Math.random() >= 0.5,
  recurrent: () => Math.random() >= 0.5,
  userId: () => Random.id(),
});
