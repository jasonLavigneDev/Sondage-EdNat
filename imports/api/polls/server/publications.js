import { Meteor } from 'meteor/meteor';
import Polls from '../polls';

Meteor.publish("polls.owner", function({ page, limit }){
    const query = { userId: this.userId }
    const options = { 
        limit, 
        skip: (page - 1) * limit ,
        sort: { createdAt: -1 },
    }
    Counts.publish(this, 'polls.owner.total', Polls.find(query, options));
    return Polls.find(query, options)
})