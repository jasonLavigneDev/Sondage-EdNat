import { Meteor } from 'meteor/meteor';
import App from '../../ui/App.svelte';
// collections
import '../../api/polls/polls';
import '../../api/users/users';
import '../../api/groups/groups';
import '../../api/polls_answers/polls_answers';
// methods
import '../../api/polls/methods';

import '../accounts-config';
import '../../utils/theme/index.css';

Meteor.startup(() => {
  const app = new App({
    target: document.getElementById('app'),
  });
  return app;
});
