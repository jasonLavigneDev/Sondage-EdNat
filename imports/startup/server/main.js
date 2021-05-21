// collections
import '../../api/polls/polls';
import '../../api/users/users';
import '../../api/groups/groups';
import '../../api/polls_answers/polls_answers';

// methods
import '../../api/polls/methods';
import '../../api/polls/server/methods';
import '../../api/polls_answers/server/methods';

// publications
import '../../api/polls/server/publications';
import '../../api/users/server/publications';
import '../../api/groups/server/publications';
import '../../api/polls_answers/server/publications';

// system
import './keycloack';
import './server-router';

// libraries
import moment from 'moment';

moment.locale('fr');

const { url } = Meteor.settings.private.smtp;
process.env.MAIL_URL = url;
