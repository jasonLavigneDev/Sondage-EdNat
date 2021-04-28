import { Meteor } from 'meteor/meteor';
import App from '/imports/ui/App.svelte';
// collections
import '/imports/api/polls/polls';
import '/imports/api/users/users';
import '/imports/api/groups/groups';
import '/imports/api/polls_answers/polls_answers';

// methods
import '/imports/api/polls/methods';

import '/imports/startup/accounts-config.js';
import '/imports/utils/theme/index.css'

Meteor.startup(() => {
  new App({
    target: document.getElementById('app')
  });
});