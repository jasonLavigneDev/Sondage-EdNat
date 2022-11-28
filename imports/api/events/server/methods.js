import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import ical from 'ical-generator';
import PollsAnswers from '../../polls_answers/polls_answers';
import Polls from '../../polls/polls';
import Groups from '../../groups/groups';
import { DURATIONS_TIME, POLLS_TYPES, ROUTES } from '../../../utils/enums';
import {
  meetingTemplate,
  eventTemplate,
  adminMeetingTemplate,
  meetingCancelTemplate,
  meetingEditTemplate,
} from './email_template';
import { EventsAgenda } from '../events';

export const sendEmail = new ValidatedMethod({
  name: 'events.sendEmail',
  validate: new SimpleSchema({
    answer: PollsAnswers.schema,
    poll: Polls.schema,
  }).validator({ clean: true }),

  run({ poll, answer }) {
    const cal = ical({ domain: process.env.ROOT_URL, name: 'sondage iCal' });
    cal.createEvent({
      start: moment(answer.meetingSlot),
      end: moment(answer.meetingSlot).add(DURATIONS_TIME[poll.duration], 'minute'),
      summary: poll.title,
      description: poll.description,
      url: new URL(ROUTES.ANSWER_POLL_RM(poll._id), process.env.ROOT_URL).href,
    });
    const template = poll.type === POLLS_TYPES.POLL ? eventTemplate : meetingTemplate;
    const html = template({
      title: poll.title,
      sender: Meteor.users.findOne(poll.userId),
      date: moment(answer.meetingSlot).format('LLL'),
    });
    Email.send({
      to: answer.email,
      from: Meteor.settings.smtp.fromEmail,
      subject: `Sondage - Votre rdv du ${moment(answer.meetingSlot).format('L')}`,
      icalEvent: cal.toString(),
      inReplyTo: Meteor.settings.smtp.toEmail,
      html,
    });
  },
});
export function sendEmailToCreator(poll, answer, userId) {
  const template = adminMeetingTemplate;
  const connected = userId !== null && userId !== undefined;
  let answerer;
  if (connected) {
    answerer = Meteor.users.findOne(userId);
  } else {
    answerer = answer;
  }

  const admin = Meteor.users.findOne(poll.userId);
  const html = template({
    title: poll.title,
    sender: answerer,
    date: moment(answer.meetingSlot).format('LLL'),
    url: `${Meteor.settings.public.services.sondagesUrl}/poll/answer/${poll._id} `,
    connected,
  });
  Email.send({
    to: admin.emails[0].address,
    from: Meteor.settings.smtp.fromEmail,
    subject: `Rendez-vous - nouveau créneau sélectionné pour le rendez-vous ${poll.title}`,
    inReplyTo: Meteor.settings.smtp.toEmail,
    html,
  });
}

export function sendCancelEmail(poll, answer, content) {
  const template = meetingCancelTemplate;

  const html = template({ date: moment(answer.meetingSlot).format('LLL'), content });
  Email.send({
    to: answer.email,
    from: Meteor.settings.smtp.fromEmail,
    subject: `Sondage - annulation de votre rendez-vous pour ${poll.title}`,
    inReplyTo: Meteor.settings.smtp.toEmail,
    html,
  });
}

export function sendEditEmail(poll, answer, email, name) {
  const template = meetingEditTemplate;

  const html = template({ date: moment(answer.meetingSlot).format('LLL'), email, name });
  Email.send({
    to: email,
    from: Meteor.settings.smtp.fromEmail,
    subject: `Sondage - Edition de votre rendez-vous pour ${poll.title}`,
    inReplyTo: Meteor.settings.smtp.toEmail,
    html,
  });
}

export const createEventAgendaMeeting = new ValidatedMethod({
  name: 'events.createMeeting',
  validate: new SimpleSchema({
    answer: PollsAnswers.schema,
    poll: Polls.schema,
  }).validator({ clean: true }),

  run({ poll, answer }) {
    const participantUser = Accounts.findUserByEmail(answer.email);
    EventsAgenda.insert({
      title: poll.title,
      location: '',
      start: moment(answer.meetingSlot).format(),
      end: moment(answer.meetingSlot).add(DURATIONS_TIME[poll.duration], 'minute').format(),
      allDay: poll.allDay,
      participants: participantUser
        ? [
            {
              _id: participantUser._id,
              email: answer.email,
            },
          ]
        : [],
      guests: participantUser ? [] : [answer.email],
      description: poll.description,
      groups: [],
      userId: this.userId,
    });
  },
});
export const createEventAgenda = new ValidatedMethod({
  name: 'events.create',
  validate: new SimpleSchema({
    date: Date,
    poll: Polls.schema,
  }).validator({ clean: true }),

  run({ poll, date }) {
    let answers = [];
    if (poll.public) {
      answers = PollsAnswers.find({ userId: null, pollId: poll._id }).fetch();
    }
    const groups = Groups.find({ _id: { $in: poll.groups } }).fetch();
    const participants = groups
      .map(({ _id, admins, animators, members }) =>
        Meteor.users
          .find({ _id: { $in: [...admins, ...animators, ...members] } })
          .fetch()
          .map((user) => ({
            _id: user._id,
            email: user.emails[0].address,
            groupId: _id,
            status: 1,
          })),
      )
      .flat(1)
      .filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i); // remove duplicate participants based on _id prop
    EventsAgenda.insert({
      title: poll.title,
      location: '',
      start: moment(date).format(),
      end: moment(date).add(DURATIONS_TIME[poll.duration], 'minute').format(),
      allDay: poll.allDay,
      participants,
      guests: answers.map(({ email }) => email),
      description: poll.description,
      groups: groups.map(({ _id, name }) => ({ _id, name })),
      userId: this.userId,
    });
  },
});
