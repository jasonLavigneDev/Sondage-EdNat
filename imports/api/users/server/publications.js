import { Meteor } from 'meteor/meteor';

// automatically publish additional fields for current user
Meteor.publish(null, function publishUserData() {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: Meteor.users.selfFields,
      },
    );
  }
  return this.ready();
});
