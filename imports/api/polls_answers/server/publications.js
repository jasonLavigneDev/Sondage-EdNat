import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import PollsAnswers from '../polls_answers';

Meteor.publish('polls_answers.getCount', function pollAnswersCounts({ pollId }) {
  Counts.publish(this, `polls_answers.get-${pollId}`, PollsAnswers.find({ pollId }));
});
Meteor.publish('polls_answers.getCurrentUser', function pollAnswersCurrentUser({ pollId }) {
  return PollsAnswers.find({ pollId, userId: this.userId });
});
Meteor.publish('polls_answers.onePoll', function pollAnswersOne({ pollId }) {
  const query = { pollId };
  if (this.userId) {
    query.userId = { $ne: this.userId };
  }
  Counts.publish(this, 'polls_answers.onePoll', PollsAnswers.find(query), { noReady: true });
  return PollsAnswers.find(query);
});
