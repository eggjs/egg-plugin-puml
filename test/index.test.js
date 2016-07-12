'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const coffee = require('coffee');
const rimraf = require('rimraf');
const puml = require.resolve('../index');

describe('/test/index.test.js', () => {

  const expectPuml = path.join(__dirname, 'fixtures/expect.puml');

  afterEach(() => rimraf.sync(path.join(__dirname, 'tmp')));

  it('should generator plugins.puml', done => {
    const baseDir = path.join(__dirname, '../node_modules/@ali/egg');
    const destFile = path.join(baseDir, 'plugins.puml');
    rimraf.sync(destFile);
    coffee.fork(puml, [ baseDir ])
    .expect('stdout', new RegExp('Writed to ' + destFile))
    .end(err => {
      assert.ifError(err);
      assert.ok(fs.existsSync(destFile));
      assert.equal(
        fs.readFileSync(destFile).toString(), fs.readFileSync(expectPuml).toString());
      done();
    });
  });

  it('should generator plugins.puml with dest', done => {
    const baseDir = path.join(__dirname, '../node_modules/@ali/egg');
    const dest = path.join(__dirname, 'tmp');
    const destFile = path.join(dest, 'plugins.puml');
    rimraf.sync(destFile);
    coffee.fork(puml, [ baseDir, '--dest', dest ])
    .expect('stdout', new RegExp('Writed to ' + destFile))
    .end(err => {
      assert.ifError(err);
      assert.ok(fs.existsSync(destFile));
      assert.equal(
        fs.readFileSync(destFile).toString(), fs.readFileSync(expectPuml).toString());
      done();
    });
  });

});
