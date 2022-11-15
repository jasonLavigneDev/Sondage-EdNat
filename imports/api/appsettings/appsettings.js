import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { _ } from 'svelte-i18n';

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

function getLabel(i18nLabel) {
  return () => _(i18nLabel);
}

const SettingsType = (type) =>
  new SimpleSchema({
    external: {
      type: Boolean,
      label: getLabel(`api.appsettings.labels.external_${type}`),
      optional: true,
    },
    link: {
      type: String,
      label: getLabel(`api.appsettings.labels.link_${type}`),
      optional: true,
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
    legal: {
      type: SettingsType('legal'),
      label: getLabel('api.appsettings.labels.legal'),
    },
    accessibility: {
      type: SettingsType('accessibility'),
      label: getLabel('api.appsettings.labels.accessibility'),
    },
    gcu: {
      type: SettingsType('gcu'),
      label: getLabel('api.appsettings.labels.gcu'),
    },
    personalData: {
      type: SettingsType('personal_data'),
      label: getLabel('api.appsettings.labels.personal_data'),
    },
  },
  { clean: { removeEmptyStrings: false }, tracker: Tracker },
);

AppSettings.publicFields = {
  maintenance: 1,
  textMaintenance: 1,
  legal: 1,
  accessibility: 1,
  gcu: 1,
  personalData: 1,
};

AppSettings.links = {
  'legal.link': 1,
  'legal.external': 1,
  'accessibility.link': 1,
  'accessibility.external': 1,
  'gcu.link': 1,
  'gcu.external': 1,
  'personalData.link': 1,
  'personalData.external': 1,
};

AppSettings.legal = {
  'legal.link': 1,
  'legal.external': 1,
  'legal.content': 1,
};
AppSettings.accessibility = {
  'accessibility.link': 1,
  'accessibility.external': 1,
  'accessibility.content': 1,
};
AppSettings.gcu = {
  'gcu.link': 1,
  'gcu.external': 1,
  'gcu.content': 1,
};
AppSettings.personalData = {
  'personalData.link': 1,
  'personalData.external': 1,
  'personalData.content': 1,
};

AppSettings.attachSchema(AppSettings.schema);

export default AppSettings;
