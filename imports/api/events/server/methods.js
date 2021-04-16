import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import SimpleSchema from 'simpl-schema';
import moment from 'moment'
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import ical from 'ical-generator'
import PollsAnswers from '../../polls_answers/polls_answers';
import Polls from '../../polls/polls';
import { DURATIONS_TIME, ROUTES } from '../../../utils/enums';
import { meeting_template } from './email_template';

export const sendEmail = new ValidatedMethod({
    name: 'events.sendEmail',
    validate: new SimpleSchema({
      answer: PollsAnswers.schema,
      poll: Polls.schema
    }).validator({ clean: true }),
  
    run({ poll, answer }) {
        const cal = ical({domain: process.env.ROOT_URL, name: 'sondage iCal'});
        cal.createEvent({
            start: moment(answer.meetingSlot),
            end: moment(answer.meetingSlot).add(DURATIONS_TIME[poll.duration], 'minute'),
            summary: poll.title,
            description: poll.description,
            url: ROUTES.ANSWER_POLL_RM(poll._id)
        });
        const html = meeting_template({
            sender: Meteor.users.findOne(poll.userId).services.keycloak.email,
            date: moment(answer.meetingSlot).format('LLL')
        })

        Email.send({ 
            to: answer.email,
            from: Meteor.settings.private.smtp.fromEmail,
            subject: `Sondage - Votre rdv du ${moment(answer.meetingSlot).format("L")}`,
            icalEvent: cal.toString(),
            inReplyTo: Meteor.settings.private.smtp.toEmail,
            html
        });
    },
  });