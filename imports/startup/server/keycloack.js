import { Meteor } from 'meteor/meteor';
// import { Accounts } from 'meteor/accounts-base';

import { ServiceConfiguration } from 'meteor/service-configuration';
import SimpleSchema from 'simpl-schema';

SimpleSchema.defineValidationErrorTransform((error) => {
  const ddpError = new Meteor.Error(error.message);
  ddpError.error = 'validation-error';
  ddpError.details = error.details;
  return ddpError;
});

Meteor.startup(() => {
  // code to run on server at startup (configure keycloak service)
  if (Meteor.settings.keycloak) {
    if (Meteor.settings.public.enableKeycloak) {
      // Accounts.config({
      //   forbidClientAccountCreation: true,
      // });
      ServiceConfiguration.configurations.upsert(
        { service: 'keycloak' },
        {
          $set: {
            loginStyle: 'redirect',
            serverUrl: Meteor.settings.public.keycloakUrl,
            realm: Meteor.settings.public.keycloakRealm,
            clientId: Meteor.settings.keycloak.client,
            realmPublicKey: Meteor.settings.keycloak.pubkey,
            bearerOnly: false,
          },
        },
      );
    }
    // Accounts.onCreateUser(() => {
    //   // FIXME : Users should not be created by sondage,
    //   //         Redirect user to laboite if not found
    //   throw new Meteor.Error('api.users.createUser', 'User creation is disabled in Date Polls');
    // });
  }
});
