export const ROUTES = {
    ADMIN: "/admin",
    LOGIN: "/login",
    NEW_POLL: "/new-poll/*",
    NEW_POLL_ROOT: "/new-poll",
    NEW_POLL_1: "/new-poll/1",
    NEW_POLL_2: "/new-poll/2",
    NEW_POLL_3: "/new-poll/3",
    NEW_POLL_4: "/new-poll/4",
    POLL: "/polls/:_id",
    POLLS: "/polls",
}


export const toast_options = {
    duration: 4000, // duration of progress bar tween
    dismissable: true, // allow dismiss with close button
    initial: 1, // initial progress bar value
    progress: 0, // current progress
    reversed: false, // insert new toast to bottom of stack
    intro: { x: 256 }, // toast intro fly animation settings
    theme: {
        '--toastBackground': 'green',
        '--toastColor': 'white',
      }
  };

export const toasts = {
    success: {
        ...toast_options,
        theme: {
            '--toastBackground': 'green',
            '--toastColor': 'white',
          }
    },
    error: {
        ...toast_options,
        theme: {
            '--toastBackground': 'red',
            '--toastColor': 'white',
          }
    }
}