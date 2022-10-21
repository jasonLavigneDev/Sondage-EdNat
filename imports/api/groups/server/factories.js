import { Factory } from 'meteor/dburles:factory';
import Groups from '../groups';

Factory.define('group', Groups, {
  admins: () => [],
  animators: () => [],
  members: () => [],
});
