// collections
import '/imports/api/polls/polls';
import '/imports/api/users/users';
import '/imports/api/groups/groups';
import '/imports/api/polls_answers/polls_answers';

// methods
import '/imports/api/polls/methods';
import '/imports/api/polls/server/methods';
import '/imports/api/polls_answers/server/methods';

// publications
import '/imports/api/polls/server/publications';
import '/imports/api/users/server/publications';
import '/imports/api/groups/server/publications';
import '/imports/api/polls_answers/server/publications';

// system
import './keycloack'
import './server-router'

// libraries
import moment from 'moment'

moment.locale('fr')

const { url } = Meteor.settings.private.smtp
process.env.MAIL_URL = url