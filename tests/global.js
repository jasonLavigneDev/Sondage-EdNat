import assert from 'assert';

describe('sondage', function GlobalTest() {
  it('package.json has correct name', async function packageName() {
    const { name } = await import('../package.json');
    assert.strictEqual(name, 'sondage');
  });

  if (Meteor.isClient) {
    it('client is not server', function isClient() {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it('server is not client', function isServer() {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
