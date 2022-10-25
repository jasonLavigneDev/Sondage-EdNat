import { Meteor } from 'meteor/meteor';

Meteor.users.publicFields = {
  username: 1,
  firstName: 1,
  lastName: 1,
  structure: 1,
  emails: 1,
  'services.keycloak.email': 1,
  'services.keycloak.name': 1,
};

Meteor.users.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});
