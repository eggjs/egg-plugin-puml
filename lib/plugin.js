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
  const EggLoader = findEggCore(baseDir).EggLoader;
  const loader = new EggLoader({
    baseDir,
    logger,
    app: Object.create(Application.prototype),
  });
  loader.loadPlugin();
  return loader.allPlugins;
};

function findEggCore({ baseDir }) {
  try {
    return require('egg-core');
  } catch (_) {
    const eggCorePath = path.join(baseDir, 'node_modules/egg-core');
    assert(fs.existsSync(eggCorePath), 'Dont find egg framework in node_modules');
    return require(eggCorePath);
  }
}

function noop() {}
