import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import PollsAnswers from '../polls_answers';
import Polls from '../../polls/polls';
import { POLLS_TYPES } from '../../../utils/enums';

Meteor.publish('polls_answers.getCount', function pollAnswersCounts({ pollId }) {
  Counts.publish(this, `polls_answers.get-${pollId}`, PollsAnswers.find({ pollId }));
});
Meteor.publish('polls_answers.getCurrentUser', function pollAnswersCurrentUser({ pollId }) {
  if (this.userId === null) return this.ready();
  return PollsAnswers.find({ pollId, userId: this.userId });
});
Meteor.publish('polls_answers.onePoll', function pollAnswersOne({ pollId }) {
  let pollOwner = false;
  const poll = Polls.findOne(pollId);
  if (poll && poll.userId === this.userId) pollOwner = true;
  const query = { pollId };
  if (this.userId) {
    query.userId = { $ne: this.userId };
  }
  Counts.publish(this, 'polls_answers.onePoll', PollsAnswers.find(query), { noReady: true });
  return PollsAnswers.find(query, pollOwner || poll.type === POLLS_TYPES.POLL ? {} : { fields: { email: 0, name: 0 } });
});
