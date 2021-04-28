import { Meteor } from 'meteor/meteor';
import PollsAnswers from '../polls_answers';

Meteor.publish('polls_answers.getCount', function({ pollId }){
    Counts.publish(this, `polls_answers.get-${pollId}`, PollsAnswers.find({ pollId }));
})
Meteor.publish('polls_answers.getCurrentUser', function({ pollId }){
    return PollsAnswers.find({ pollId, userId: this.userId });
})
Meteor.publish('polls_answers.onePoll', function({ pollId }){
    const query = { pollId }
    if(this.userId){
        query.userId = { $ne: this.userId } 
    }
    Counts.publish(this, 'polls_answers.onePoll', PollsAnswers.find(query), { noReady: true });
    return PollsAnswers.find(query);
})