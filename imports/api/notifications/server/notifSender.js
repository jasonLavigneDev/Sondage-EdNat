import axios from 'axios';
import Groups from '../../groups/groups';
import { ROUTES } from '../../../utils/enums';

const sendnotif = ({ groups, title, pollId, content, internalLink }) => {
  if (Meteor.settings.private.laboiteApiKey) {
    axios.defaults.baseURL = Meteor.settings.public.laboiteHost;
    axios.defaults.headers.common['X-API-KEY'] = Meteor.settings.private.laboiteApiKey;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    groups.forEach(async (groupId) => {
      try {
        const group = Groups.findOne(groupId);
        await axios.post('/api/notifications', {
          groupId,
          content,
          title,
          link: internalLink
            ? `${Meteor.settings.public.laboiteHost}/groups/${group.slug}/events`
            : `${Meteor.absoluteUrl()}${ROUTES.ANSWER_POLL_RM(pollId).replace('/', '')}?autologin`,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    });
  } else {
    console.log('Warning: API key is missing in settings (can not send notifications)');
  }
};

export default sendnotif;
