import { Meteor } from 'meteor/meteor';
import Polls from '../polls';
import PollsAnswers from '/imports/api/polls_answers/polls_answers'
import Groups from '/imports/api/groups/groups'

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

Meteor.publish("polls.member", function({ page, limit }) {
    const answers = PollsAnswers.find({ userId: this.userId }, { fields: { pollId: 1 } }).fetch()
    const groups = Groups.find({ 
        $or: [
          { members: { $in: [this.userId] } },
          { admins: { $in: [this.userId] } },
          { animators: { $in: [this.userId] } },
        ]
      }, { fields: { _id: 1 } })
    const query = { 
      active: true, 
      $or: [
        { userId: this.userId },
        { groups: { $in: groups.map(({ _id }) => _id) }},
        { _id: { $in: answers.map(({ pollId }) => pollId) }}
    ]}
    console.log(JSON.stringify(query, 2))
    const options = { 
        limit, 
        skip: (page - 1) * limit ,
        sort: { createdAt: -1 },
    }
    Counts.publish(this, 'polls.member.total', Polls.find(query, options));
    return Polls.find(query, options)
})