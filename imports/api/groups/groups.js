import { Mongo } from 'meteor/mongo';

const Groups = new Mongo.Collection('groups');

// Deny all client-side updates since we will be using methods to manage this collection
Groups.deny({
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

export default Groups;
