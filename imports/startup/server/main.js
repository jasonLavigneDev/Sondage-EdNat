// collections
import '/imports/api/polls/polls';
import '/imports/api/users/users';

// methods
import '/imports/api/polls/methods';

// publications
import '/imports/api/polls/server/publications';
import '/imports/api/users/server/publications';

// system
import './keycloack'
import './server-router'

if(!Meteor.users.findOne()){
    Accounts.createUser({ 
        email: "francois@aubeut.com", 
        password: "123" 
    })
}
