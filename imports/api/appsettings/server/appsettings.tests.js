/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';

import AppSettings from '../appsettings';

import './publications';
import './factories';

describe('appsettings', function () {
  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const appsetting = Factory.create('appsettings');
      assert.typeOf(appsetting, 'object');
    });
  });
  describe('publications', function () {
    beforeEach(function () {
      AppSettings.remove({});
      Factory.create('appsettings', { _id: 'settings' });
    });
    describe('appsettings.all', function () {
      it('sends the only complet appsetting object', function (done) {
        const collector = new PublicationCollector({});
        collector.collect('appsettings.all', {}, (collections) => {
          assert.equal(collections.appsettings.length, 1);
          const resultAppSettings = collections.appsettings[0];
          assert.property(resultAppSettings, 'maintenance');
          assert.property(resultAppSettings, 'textMaintenance');
          done();
        });
      });
    });
  });
});
