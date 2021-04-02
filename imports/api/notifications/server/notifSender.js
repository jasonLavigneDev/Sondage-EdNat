import axios from "axios";


export const sendnotif = ({ groups, title }) => {
    axios.defaults.baseURL = Meteor.settings.public.laboiteHost;
    axios.defaults.headers.common['X-API-KEY'] = Meteor.settings.private.laboiteApiKey;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    groups.forEach(async groupId => {
        try {
            const result = await axios.post(`/api/notifications`, {
                groupId,
                content: `Le sondage ${title} a été créé pour votre groupe`,
                title: "Nouveau sondage"
              })
        } catch (error) {
            console.log(error);
        }
    })

}