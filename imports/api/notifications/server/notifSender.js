import axios from 'axios';
import Groups from '../../groups/groups';
import { ROUTES } from '../../../utils/enums';

const sendnotif = ({ groups, title, pollId, content, internalLink }) => {
  if (Meteor.settings.private.laboiteApiKey) {
    axios.defaults.baseURL = Meteor.settings.public.laboiteHost;
    axios.defaults.headers.common['X-API-KEY'] = Meteor.settings.private.laboiteApiKey;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    let link = `${Meteor.absoluteUrl()}${ROUTES.ANSWER_POLL_RM(pollId).replace('/', '')}?autologin`;
    if (internalLink) {
      const groupSlug = Groups.findOne(groups[0]).slug; // Take the first groupId to make the link
      if (groupSlug) {
        link = `${Meteor.settings.public.laboiteHost}/groups/${groupSlug}/events`;
      }
    }
    axios
      .post('/api/notifications', {
        groupsId: groups,
        content,
        title,
        link,
      })
      .then(() => console.log(`Send multi groups notif ok for poll: ${pollId}`))
      .catch((err) => console.log(err));
  } else {
    console.log('Warning: API key is missing in settings (can not send notifications)');
  }
};

export default sendnotif;
