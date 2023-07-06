/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';
import Groups from '../groups';

Meteor.publish('groups.memberOf', function () {
  return Groups.find(
    {
      $or: [
        { $and: [{ admins: { $in: [this.userId] } }, { type: 15 }] },
        {
          $and: [
            { type: { $ne: 15 } },
            {
              $or: [
                { members: { $in: [this.userId] } },
                { admins: { $in: [this.userId] } },
                { animators: { $in: [this.userId] } },
              ],
            },
          ],
        },
      ],
    },
    {
      limit: 100,
      sort: { name: -1 },
      fields: { _id: 1, name: 1, type: 1 },
    },
  );
});
