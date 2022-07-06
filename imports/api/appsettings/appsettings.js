import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

const AppSettings = new Mongo.Collection('appsettings');

// Deny all client-side updates since we will be using methods to manage this collection
AppSettings.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

AppSettings.schema = new SimpleSchema(
  {
    maintenance: {
      type: Boolean,
      defaultValue: false,
      label: 'maintenance',
    },
    textMaintenance: {
      type: String,
      defaultValue: ' ',
      label: 'textMaintenance',
    },
  },
  { clean: { removeEmptyStrings: false }, tracker: Tracker },
);

AppSettings.publicFields = {
  maintenance: 1,
  textMaintenance: 1,
};

AppSettings.attachSchema(AppSettings.schema);

export default AppSettings;
