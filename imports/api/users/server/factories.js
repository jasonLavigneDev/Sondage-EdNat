import { Factory } from 'meteor/dburles:factory';
import { faker } from '@faker-js/faker';

Factory.define('user', Meteor.users, {
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),
  emails: () => [{ address: faker.internet.email() }],
});
