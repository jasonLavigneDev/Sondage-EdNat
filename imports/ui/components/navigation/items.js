import { ROUTES } from '/imports/utils/enums'

export const items = [
  {
    text: "links.polls",
    path: ROUTES.POLLS,
  },
  {
    text: "links.home",
    path: ROUTES.ADMIN,
  },
  {
    text: "links.new_poll",
    path: ROUTES.NEW_POLL_1,
  },
];

export const footer = [
  {
    text: "links.legal",
    path: `${Meteor.settings.public.laboite_host}/legal/legalnotice`,
  },
  {
    text: "links.accessibility",
    path: `${Meteor.settings.public.laboite_host}/legal/accessibility`,
  },
  {
    text: "links.gcu",
    path: `${Meteor.settings.public.laboite_host}/legal/conditions`,
  },
  {
    text: "links.personalData",
    path: `${Meteor.settings.public.laboite_host}/legal/personal-data`,
  },
];
