import { Meteor } from 'meteor/meteor';
import PollsAnswers from '../polls_answers';

Meteor.publish('polls_answers.getCount', function({ pollId }){
    Counts.publish(this, `polls_answers.get-${pollId}`, PollsAnswers.find({ pollId }));
})