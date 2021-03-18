import { Meteor } from 'meteor/meteor';
import Groups from '../groups';

Meteor.publish("groups.memberOf", function(){
  console.log(this.userId)
  return Groups.find({ 
    $or: [
      { members: { $in: [this.userId] } },
      { admins: { $in: [this.userId] } },
      { animators: { $in: [this.userId] } },
    ]
  }, { 
    limit: 100, 
    sort: { name: -1 },
    fields: { _id: 1, name: 1 }
  })
})