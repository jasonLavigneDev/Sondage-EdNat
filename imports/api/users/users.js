import { Meteor } from 'meteor/meteor';

Meteor.users.publicFields = {
  username: 1,
  firstName: 1,
  lastName: 1,
  structure: 1,
  // don't publish emails and put a public email field in Mezig ?
  emails: 1,
  articlesCount: 1,
  avatar: 1,
};

Meteor.users.selfFields = {
  ...Meteor.users.publicFields,
  username: 1,
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
