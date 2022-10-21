import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

Factory.define('user', Meteor.users, {
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  emails: () => [{ address: faker.internet.email() }],
});
