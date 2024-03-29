import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import ical from 'ical-generator';
import PollsAnswers from '../../polls_answers/polls_answers';
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

export function sendEmail(poll, answer) {
  const slots = !Array.isArray(answer.meetingSlot) ? [answer.meetingSlot] : answer.meetingSlot;
  slots.forEach((slot) => {
    const cal = ical({ domain: process.env.ROOT_URL, name: 'sondage iCal' });
    cal.createEvent({
      start: moment(slot),
      end: moment(slot).add(DURATIONS_TIME[poll.duration], 'minute'),
      summary: poll.title,
      description: poll.description,
      url: new URL(ROUTES.ANSWER_POLL_RM(poll._id), process.env.ROOT_URL).href,
    });
    const template = poll.type === POLLS_TYPES.POLL ? eventTemplate : meetingTemplate;
    const html = template({
      title: poll.title,
      sender: Meteor.users.findOne(poll.userId),
      date: moment(slot).format('LLL (Z)'),
    });
    try {
      Email.send({
        to: answer.email,
        from: Meteor.settings.smtp.fromEmail,
        subject: `Sondage - Votre rdv du ${moment(slot).format('L')}`,
        icalEvent: cal.toString(),
        inReplyTo: Meteor.settings.smtp.toEmail,
        html,
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error('api.events.methods.sendEmail', 'api.errors.cannotSendEmail');
    }
  });
}

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
  const slots = !Array.isArray(answer.meetingSlot) ? [answer.meetingSlot] : answer.meetingSlot;
  slots.forEach((slot) => {
    const html = template({
      title: poll.title,
      sender: answerer,
      date: moment(slot).format('LLL (Z)'),
      url: `${Meteor.settings.public.services.sondagesUrl}/poll/answer/${poll._id} `,
      connected,
    });
    try {
      Email.send({
        to: admin.emails[0].address,
        from: Meteor.settings.smtp.fromEmail,
        subject: `Rendez-vous - nouveau créneau sélectionné pour le rendez-vous ${poll.title}`,
        inReplyTo: Meteor.settings.smtp.toEmail,
        html,
      });
    } catch (error) {
      console.log(error);
      throw new Meteor.Error('api.events.methods.sendEmailToCreator', 'api.errors.cannotSendEmailToCreator');
    }
  });
}

function _sendCancelEmail(email, poll, slot, meetWith, content) {
  const template = meetingCancelTemplate;
  const html = template({ date: moment(slot).format('LLL (Z)'), meetWith, content });
  try {
    Email.send({
      to: email,
      from: Meteor.settings.smtp.fromEmail,
      subject: `Sondage - annulation de votre rendez-vous pour ${poll.title}`,
      inReplyTo: Meteor.settings.smtp.toEmail,
      html,
    });
  } catch (error) {
    console.log(error);
    throw new Meteor.Error('api.events.methods.sendCancelEmail', 'api.errors.cannotSendEmail');
  }
}

export function sendCancelEmail(poll, answer, content) {
  const pollOwner = Meteor.users.findOne(poll.userId);
  const ownerEmail = pollOwner?.emails[0].address;
  const meetWith = `${pollOwner.firstName} ${pollOwner.lastName} (${ownerEmail})`;
  answer.meetingSlot.forEach((slot) => {
    _sendCancelEmail(answer.email, poll, slot, meetWith, content);
  });
}

export function sendCancelEmailToCreator(poll, answer, content) {
  const pollOwner = Meteor.users.findOne(poll.userId);
  const ownerEmail = pollOwner?.emails[0].address;
  if (ownerEmail) {
    const meetWith = `${answer.name} (${answer.email})`;
    answer.meetingSlot.forEach((slot) => {
      _sendCancelEmail(ownerEmail, poll, slot, meetWith, content);
    });
  }
}

export function sendEditEmail(poll, email, name) {
  const template = meetingEditTemplate;

  const html = template({ email, name });
  try {
    Email.send({
      to: email,
      from: Meteor.settings.smtp.fromEmail,
      subject: `Sondage - Edition de votre rendez-vous pour ${poll.title}`,
      inReplyTo: Meteor.settings.smtp.toEmail,
      html,
    });
  } catch (error) {
    console.log(error);
    throw new Meteor.Error('api.events.methods.sendEditEmail', 'api.errors.cannotSendEmail');
  }
}

export function createEventAgendaMeeting(poll, answer, userId) {
  const participantUser = Accounts.findUserByEmail(answer.email);
  const slots = !Array.isArray(answer.meetingSlot) ? [answer.meetingSlot] : answer.meetingSlot;
  slots.forEach((slot) => {
    const title = `${poll.title} (${answer.name})`;
    const description = `Rendez vous avec ${answer.name}`;
    EventsAgenda.insert({
      title,
      location: '',
      start: moment(slot).format(),
      end: moment(slot).add(DURATIONS_TIME[poll.duration], 'minute').format(),
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
      description,
      groups: [],
      userId,
    });
  });
}

export function deleteEventAgendaMeeting(poll, answer, userId) {
  // events have been created only if answer is confirmed
  if (answer.confirmed) {
    const title = `${poll.title} (${answer.name})`;
    const slots = !Array.isArray(answer.meetingSlot) ? [answer.meetingSlot] : answer.meetingSlot;
    slots.forEach((slot) => {
      EventsAgenda.remove({
        title,
        start: slot,
        allDay: poll.allDay,
        userId,
      });
    });
  }
}

export function createEventAgenda(poll, date, userId) {
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
    userId,
  });
}
