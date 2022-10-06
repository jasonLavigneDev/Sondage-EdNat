/* eslint-disable func-names */
import { assert } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';

import Groups from '../groups';
import './publications';
import './factories';
import '../../users/server/factories';

describe('groups', function () {
  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const user = Factory.create('user');
      const group = Factory.create('group');
      assert.typeOf(group, 'object');
      assert.typeOf(user, 'object');
    });
  });
  describe('publications', function () {
    describe('groups.memberOf', function () {
      let user;
      let anotherUser;
      beforeEach(function () {
        Groups.remove({});
        Meteor.users.remove({});
        user = Factory.create('user');
        anotherUser = Factory.create('user');
        Factory.create('group', { admins: [user._id], name: 'test1' });
        Factory.create('group', { admins: [anotherUser._id], name: 'test2' });
        Factory.create('group', { animators: [user._id], name: 'test3' });
        Factory.create('group', { animators: [anotherUser._id], name: 'test4' });
        Factory.create('group', { members: [user._id], name: 'test5' });
        Factory.create('group', { members: [anotherUser._id], name: 'test6' });
      });
      it('should return groups user', function (done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('groups.memberOf', {}, (collections) => {
          assert.equal(collections.groups.length, 3);
          assert.containsAllKeys(collections.groups[0], ['name', '_id']);
          done();
        });
      });
    });
  });
});
