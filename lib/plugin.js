'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

module.exports = ({ framework, baseDir }) => {
  const { Application } = require(framework);
  let EggLoader = require(findEggCore({ framework, baseDir })).EggLoader;

  const loader = new EggLoader({
    baseDir,
    logger,
    app: Object.create(Application.prototype),
  });
  loader.loadPlugin();

  return loader.allPlugins;
};

function noop() {}

function findEggCore({ framework, baseDir }) {
  const eggCorePath = path.join(baseDir, 'node_modules/egg-core');
  assert(fs.existsSync(eggCorePath), 'Dont find egg framework in node_modules');
  return eggCorePath;
}
