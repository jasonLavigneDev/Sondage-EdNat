export const ROUTES = {
  ADMIN: '/admin',
  LOGIN: '/login',
  POLL: '/poll/*',
  NEW_POLL: '/new/*',
  NEW_POLL_ROOT: '/poll/new',
  NEW_POLL_RM: (page = 1) => `/poll/new/${page}`,
  EDIT_POLL: '/edit/:_id/*',
  EDIT_POLL_ROOT: '/poll/edit/:_id/*',
  EDIT_POLL_RM: (id, page = 1) => `/poll/edit/${id}/${page}`,
  ANSWER_POLL: '/answer/:_id',
  ANSWER_POLL_RM: (id) => `/poll/answer/${id}`,
  EDIT_ANSWER: '/pollanswer/edit/:pollId/:_id',
  EDIT_ANSWER_RM: (pollId, id) => `/pollanswer/edit/${pollId}/${id}`,
  CANCEL_ANSWER: '/pollanswer/cancel/:_id',
  CANCEL_ANSWER_RM: (id) => `/pollanswer/cancel/${id}`,
  POLLS: '/polls',
  LOGOUT: '/logout',
};

export const toastOptions = {
  duration: 4000, // duration of progress bar tween
  dismissable: true, // allow dismiss with close button
  initial: 1, // initial progress bar value
  progress: 0, // current progress
  reversed: false, // insert new toast to bottom of stack
  intro: { x: 256 }, // toast intro fly animation settings
  theme: {
    '--toastBackground': 'green',
    '--toastColor': 'white',
  },
};

export const toasts = {
  success: {
    ...toastOptions,
    theme: {
      '--toastBackground': 'green',
      '--toastColor': 'white',
    },
  },
  error: {
    ...toastOptions,
    theme: {
      '--toastBackground': 'red',
      '--toastColor': 'white',
    },
  },
};

export const POLLS_TYPES = {
  POLL: 'POLL',
  MEETING: 'MEETING',
};

export const DURATIONS = ['00:10', '00:15', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00'];
export const DURATIONS_TIME = {
  '00:10': 10,
  '00:15': 15,
  '00:30': 30,
  '01:00': 60,
  '01:30': 90,
  '02:00': 120,
  '02:30': 150,
  '03:00': 180,
  '03:30': 210,
  '04:00': 240,
};
