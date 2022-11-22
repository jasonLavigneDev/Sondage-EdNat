import { Factory } from 'meteor/dburles:factory';

import AppSettings from '../appsettings';

Factory.define('appsettings', AppSettings, {
  maintenance: () => Random.choice([true, false]),
  textMaintenance: () => 'Text-Maintenance',
});
